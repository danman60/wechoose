// Types matching Supabase schema exactly

export interface BudgetCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  actual_amount_billions: number;
  actual_percentage: number;
  display_order: number;
  icon: string | null;
  fun_fact: string | null;
  country_code: string;
  fiscal_year: string;
  created_at: string;
}

export interface Allocation {
  id: string;
  ip_hash: string;
  postal_code: string | null;
  province: string | null;
  riding: string | null;
  country_code: string;
  income: number | null;
  created_at: string;
  updated_at: string;
}

export interface AllocationItem {
  id: string;
  allocation_id: string;
  category_id: string;
  percentage: number;
  created_at: string;
}

export interface TaxBracket {
  id: string;
  country_code: string;
  province: string | null;
  bracket_min: number;
  bracket_max: number | null;
  rate: number;
  tax_type: string;
  fiscal_year: string;
  created_at: string;
}

export interface RevenueSource {
  id: string;
  name: string;
  slug: string;
  amount_billions: number;
  percentage_of_total: number;
  description: string;
  country_code: string;
  fiscal_year: string;
  display_order: number;
  created_at: string;
}

export interface AggregateCache {
  id: string;
  category_id: string;
  country_code: string;
  province: string | null;
  total_allocations: number;
  average_percentage: number;
  updated_at: string;
}

// Input types (for creating/updating)
export interface AllocationInput {
  postal_code?: string;
  province?: string;
  income?: number;
  items: AllocationItemInput[];
}

export interface AllocationItemInput {
  category_id: string;
  percentage: number;
}

// Tax calculator types
export interface TaxCalculationResult {
  gross_income: number;
  federal_income_tax: number;
  provincial_income_tax: number;
  cpp_contribution: number;
  ei_contribution: number;
  estimated_gst_hst: number;
  estimated_carbon_levy: number;
  total_tax: number;
  effective_rate: number;
  per_category_dollars: CategoryDollarAllocation[];
}

export interface CategoryDollarAllocation {
  category_id: string;
  category_name: string;
  government_percentage: number;
  government_dollars: number;
  user_percentage?: number;
  user_dollars?: number;
}

// Results display types
export interface ComparisonData {
  category: BudgetCategory;
  government_percentage: number;
  people_percentage: number;
  user_percentage: number | null;
  differential: number; // people - government
}
