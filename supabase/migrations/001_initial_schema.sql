-- WeChoose Initial Schema
-- All timestamps use timestamptz (NEVER timestamp)

-- Budget categories (seeded with actual government data)
CREATE TABLE budget_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  actual_amount_billions numeric(10,2) NOT NULL,
  actual_percentage numeric(5,2) NOT NULL,
  display_order integer NOT NULL,
  icon text,
  fun_fact text,
  country_code text NOT NULL DEFAULT 'CA',
  fiscal_year text NOT NULL DEFAULT '2023-2024',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Revenue sources (seeded with actual government data)
CREATE TABLE revenue_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  amount_billions numeric(10,2) NOT NULL,
  percentage_of_total numeric(5,2) NOT NULL,
  description text NOT NULL,
  country_code text NOT NULL DEFAULT 'CA',
  fiscal_year text NOT NULL DEFAULT '2023-2024',
  display_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tax brackets
CREATE TABLE tax_brackets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL DEFAULT 'CA',
  province text, -- NULL = federal
  bracket_min integer NOT NULL,
  bracket_max integer, -- NULL = no cap
  rate numeric(5,4) NOT NULL,
  tax_type text NOT NULL, -- 'income', 'cpp', 'ei', 'gst', 'carbon'
  fiscal_year text NOT NULL DEFAULT '2023-2024',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User allocations (anonymous, IP-hashed)
CREATE TABLE allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  postal_code text,
  province text,
  riding text,
  country_code text NOT NULL DEFAULT 'CA',
  income integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- One allocation per IP per country
  UNIQUE(ip_hash, country_code)
);

-- Individual category allocations within a submission
CREATE TABLE allocation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  allocation_id uuid NOT NULL REFERENCES allocations(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES budget_categories(id),
  percentage numeric(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Pre-computed aggregate results (updated on new allocation)
CREATE TABLE aggregate_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES budget_categories(id),
  country_code text NOT NULL DEFAULT 'CA',
  province text, -- NULL = national aggregate
  total_allocations integer NOT NULL DEFAULT 0,
  average_percentage numeric(5,2) NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- One aggregate per category per country per province
  UNIQUE(category_id, country_code, province)
);

-- Indexes
CREATE INDEX idx_allocations_ip_hash ON allocations(ip_hash);
CREATE INDEX idx_allocations_country ON allocations(country_code);
CREATE INDEX idx_allocations_province ON allocations(province);
CREATE INDEX idx_allocation_items_allocation ON allocation_items(allocation_id);
CREATE INDEX idx_allocation_items_category ON allocation_items(category_id);
CREATE INDEX idx_aggregate_cache_country ON aggregate_cache(country_code);
CREATE INDEX idx_aggregate_cache_province ON aggregate_cache(province);
CREATE INDEX idx_budget_categories_country ON budget_categories(country_code, fiscal_year);
CREATE INDEX idx_revenue_sources_country ON revenue_sources(country_code, fiscal_year);

-- RLS Policies
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_brackets ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE aggregate_cache ENABLE ROW LEVEL SECURITY;

-- Public read access for reference data
CREATE POLICY "Public can read budget categories"
  ON budget_categories FOR SELECT
  USING (true);

CREATE POLICY "Public can read revenue sources"
  ON revenue_sources FOR SELECT
  USING (true);

CREATE POLICY "Public can read tax brackets"
  ON tax_brackets FOR SELECT
  USING (true);

-- Allocations: anyone can insert/update (anonymous users)
CREATE POLICY "Anyone can insert allocations"
  ON allocations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update own allocations"
  ON allocations FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can read allocations for aggregation"
  ON allocations FOR SELECT
  USING (true);

-- Allocation items: anyone can insert/delete (for updates)
CREATE POLICY "Anyone can insert allocation items"
  ON allocation_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete allocation items"
  ON allocation_items FOR DELETE
  USING (true);

CREATE POLICY "Anyone can read allocation items"
  ON allocation_items FOR SELECT
  USING (true);

-- Aggregate cache: public read, service role write
CREATE POLICY "Public can read aggregates"
  ON aggregate_cache FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert aggregates"
  ON aggregate_cache FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update aggregates"
  ON aggregate_cache FOR UPDATE
  USING (true);

-- Function to recalculate aggregates after allocation
CREATE OR REPLACE FUNCTION recalculate_aggregates()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate national aggregates for all categories
  INSERT INTO aggregate_cache (category_id, country_code, province, total_allocations, average_percentage, updated_at)
  SELECT
    ai.category_id,
    a.country_code,
    NULL as province,
    COUNT(DISTINCT a.id) as total_allocations,
    ROUND(AVG(ai.percentage)::numeric, 2) as average_percentage,
    now() as updated_at
  FROM allocation_items ai
  JOIN allocations a ON a.id = ai.allocation_id
  WHERE a.country_code = (SELECT country_code FROM allocations WHERE id = NEW.allocation_id)
  GROUP BY ai.category_id, a.country_code
  ON CONFLICT (category_id, country_code, province)
  DO UPDATE SET
    total_allocations = EXCLUDED.total_allocations,
    average_percentage = EXCLUDED.average_percentage,
    updated_at = now();

  -- Recalculate provincial aggregates if province is set
  IF EXISTS (SELECT 1 FROM allocations WHERE id = NEW.allocation_id AND province IS NOT NULL) THEN
    INSERT INTO aggregate_cache (category_id, country_code, province, total_allocations, average_percentage, updated_at)
    SELECT
      ai.category_id,
      a.country_code,
      a.province,
      COUNT(DISTINCT a.id) as total_allocations,
      ROUND(AVG(ai.percentage)::numeric, 2) as average_percentage,
      now() as updated_at
    FROM allocation_items ai
    JOIN allocations a ON a.id = ai.allocation_id
    WHERE a.province IS NOT NULL
      AND a.country_code = (SELECT country_code FROM allocations WHERE id = NEW.allocation_id)
    GROUP BY ai.category_id, a.country_code, a.province
    ON CONFLICT (category_id, country_code, province)
    DO UPDATE SET
      total_allocations = EXCLUDED.total_allocations,
      average_percentage = EXCLUDED.average_percentage,
      updated_at = now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to recalculate on new allocation items
CREATE TRIGGER trigger_recalculate_aggregates
  AFTER INSERT ON allocation_items
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_aggregates();
