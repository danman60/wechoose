// Detailed category descriptions for educational tooltips
// Sources: Annual Financial Report 2023-24, Public Accounts 2024 Vol II Table 2
// All figures are audited actuals for fiscal year 2023-2024

export interface CategoryDetail {
  slug: string;
  subtitle: string;
  details: string[];
  departments: string[];
  source: string;
}

export const CATEGORY_DETAILS: Record<string, CategoryDetail> = {
  "seniors-oas-gis": {
    slug: "seniors-oas-gis",
    subtitle: "The single largest federal expense",
    details: [
      "Old Age Security (OAS) pension: $56.2B paid to 7.1 million seniors aged 65+, with a 10% increase for those 75+",
      "Guaranteed Income Supplement (GIS): $16.4B in income-tested top-ups for low-income seniors",
      "Allowances: $0.8B for low-income Canadians aged 60–64 who are spouses or survivors of OAS recipients",
      "Benefits grew 9.6% ($6.6B) year-over-year due to more recipients and full CPI indexation",
    ],
    departments: ["Employment and Social Development Canada"],
    source: "Annual Financial Report 2023-24, Table 6",
  },
  "government-operations": {
    slug: "government-operations",
    subtitle: "Running the federal government itself",
    details: [
      "Operating expenses across 135 federal departments, agencies, and Crown corporations",
      "Personnel costs cover ~368,000 federal employees (salaries, pensions, benefits)",
      "Includes CRA ($6.6B operating), Public Services and Procurement, Treasury Board, and all other departments",
      "Grew 8.0% ($10.4B) year-over-year, largely from higher personnel costs",
    ],
    departments: ["All 135 federal departments, agencies, and Crown corporations"],
    source: "Annual Financial Report 2023-24, Table 6 — Operating expenses: $140,014M",
  },
  "healthcare-transfers": {
    slug: "healthcare-transfers",
    subtitle: "Federal funding for provincial healthcare",
    details: [
      "Canada Health Transfer (CHT): $51.4B — the main transfer supporting provincial healthcare, growing at a guaranteed minimum 5%/year",
      "Canada Social Transfer (CST): $16.4B — supports post-secondary education, social assistance, and children's programs",
      "Bilateral health agreements: $4.3B — tailored deals with provinces for shared health priorities (announced Feb 2023)",
      "Equalization payments: $21.7B — unconditional transfers to address fiscal disparities among provinces",
    ],
    departments: ["Department of Finance Canada"],
    source: "Annual Financial Report 2023-24, Table 3 and Table 6",
  },
  "debt-interest": {
    slug: "debt-interest",
    subtitle: "Paying for past borrowing — not services",
    details: [
      "Gross public debt charges: $47.3B on total interest-bearing debt of $1,745.5B",
      "Interest ratio: 10.3% of revenues — 10 cents of every dollar collected goes to debt service",
      "Increased 35.2% ($12.3B) from prior year — the single largest year-over-year expense increase",
      "Driven by Bank of Canada rate hikes (policy rate hit 5.0% by July 2023)",
    ],
    departments: ["Department of Finance Canada"],
    source: "Annual Financial Report 2023-24, Table 2 and Table 6",
  },
  "indigenous-services": {
    slug: "indigenous-services",
    subtitle: "Two ministries serving First Nations, Inuit, and Métis",
    details: [
      "Indigenous Services Canada (ISC): health, education, child welfare, infrastructure, and clean water for First Nations communities",
      "Crown-Indigenous Relations (CIRNAC): land claims settlements, treaty obligations, and Northern affairs",
      "$16.4B recorded for Indigenous contingent liabilities including First Nations Child and Family Services ($23.3B) and Robinson-Huron Treaty ($5.0B)",
      "Since 2016, over $60B has been provided to resolve Indigenous claims",
    ],
    departments: ["Indigenous Services Canada", "Crown-Indigenous Relations and Northern Affairs Canada"],
    source: "Public Accounts 2024, Vol II Table 2; Annual Financial Report contingent liabilities notes",
  },
  "national-defence": {
    slug: "national-defence",
    subtitle: "Canadian Armed Forces and security",
    details: [
      "Canadian Armed Forces: 68,000 Regular Force and 27,000 Reserve members — personnel, equipment, and operations",
      "Communications Security Establishment (CSE): $1.0B — Canada's signals intelligence and cyber security agency",
      "Total ministry: $34.5B per Public Accounts, approximately 1.3% of GDP",
      "NATO's target is 2% of GDP — Canada's gap is roughly $20 billion per year",
    ],
    departments: ["Department of National Defence", "Communications Security Establishment"],
    source: "Public Accounts 2024, Vol II Table 2 — National Defence ministry: $34,494M",
  },
  "children-families": {
    slug: "children-families",
    subtitle: "Tax-free support for Canadian families",
    details: [
      "Canada Child Benefit (CCB): tax-free monthly payments to ~3.5 million families with children under 18",
      "Maximum CCB: $7,437/year per child under 6, $6,275/year per child aged 6–17 (indexed to inflation)",
      "Income-tested: phases out for higher-income families, targeting support to those who need it most",
      "Grew 7.3% ($1.8B) year-over-year from indexation and more eligible children",
    ],
    departments: ["Employment and Social Development Canada", "Canada Revenue Agency"],
    source: "Annual Financial Report 2023-24, Table 6 — Children's benefits: $26,339M",
  },
  "employment-insurance": {
    slug: "employment-insurance",
    subtitle: "Income support for workers between jobs",
    details: [
      "Regular benefits for workers who lose their jobs through no fault of their own",
      "Special benefits: maternity (15 weeks), parental (up to 61 weeks extended), sickness (26 weeks), caregiving, and fishing",
      "EI premium revenue collected: $29.6B — exceeding benefits paid, with the surplus flowing to general revenue",
      "Unemployment averaged 5.4% in 2023, rising from multi-decade lows of ~5% in 2022",
    ],
    departments: ["Employment and Social Development Canada", "Service Canada"],
    source: "Annual Financial Report 2023-24, Table 6 — EI and support measures: $23,130M",
  },
  "carbon-rebates": {
    slug: "carbon-rebates",
    subtitle: "Carbon pricing proceeds returned to households",
    details: [
      "Canada Carbon Rebate: quarterly payments to households in 8 provinces where the federal fuel charge applies",
      "Over 90% of fuel charge proceeds returned directly — 8 out of 10 households get more back than they pay",
      "Carbon price was $65/tonne in 2023-24 (up from $50), driving a 40.9% increase in proceeds returned",
      "Remaining proceeds go to farmers, small businesses, and Indigenous governments via refundable credits",
    ],
    departments: ["Department of Finance Canada", "Canada Revenue Agency", "Environment and Climate Change Canada"],
    source: "Annual Financial Report 2023-24, Table 4 and Table 6 — Proceeds returned: $9,858M; Collected: $10,503M",
  },
  "housing-infrastructure": {
    slug: "housing-infrastructure",
    subtitle: "Federal investment in housing and public works",
    details: [
      "Canada Community-Building Fund: $2.4B — permanent funding to municipalities for local infrastructure",
      "CMHC housing programs: National Housing Strategy, Rapid Housing Initiative, and Housing Accelerator Fund",
      "Windsor-Detroit Bridge Authority: $1.3B — construction of the Gordie Howe International Bridge",
      "Despite a housing crisis, federal housing and infrastructure spending is less than 2% of the total budget",
    ],
    departments: ["Office of Infrastructure of Canada", "Canada Mortgage and Housing Corporation"],
    source: "Public Accounts 2024, Vol II Table 2 — Infrastructure and Communities ministry: $14,496M",
  },
  "foreign-affairs-aid": {
    slug: "foreign-affairs-aid",
    subtitle: "Diplomacy, aid, and trade",
    details: [
      "International development assistance: ~$5.8B in transfers to developing countries and multilateral organizations",
      "Embassy and consulate operations: $2.6B — running 178 offices in 110 countries",
      "Canada's Official Development Assistance (ODA): approximately 0.37% of GNI, below the UN target of 0.7%",
      "International Development Research Centre: $165M — supports research in developing countries",
    ],
    departments: ["Global Affairs Canada", "International Development Research Centre"],
    source: "Public Accounts 2024, Vol II Table 2 — DFATD: $8,458M",
  },
  "public-safety-justice": {
    slug: "public-safety-justice",
    subtitle: "Policing, courts, borders, and corrections",
    details: [
      "RCMP: the largest component — federal policing plus contract policing for provinces and municipalities",
      "Canada Border Services Agency (CBSA): customs, immigration enforcement, and trade compliance at all ports of entry",
      "Correctional Service of Canada: federal penitentiaries for offenders serving sentences of 2+ years",
      "Justice ministry: $2.4B — Department of Justice, courts, prosecutors, and judicial affairs",
    ],
    departments: ["Public Safety Canada", "RCMP", "CBSA", "Correctional Service of Canada", "Department of Justice"],
    source: "Public Accounts 2024, Vol II Table 2 — Justice ministry: $2,447M; Public Safety: Section 27",
  },
  "immigration": {
    slug: "immigration",
    subtitle: "Processing newcomers and refugee claims",
    details: [
      "Processing applications: permanent residency, citizenship, work permits, study permits, and visitor visas",
      "Settlement services: language training, employment assistance, and community connections for newcomers",
      "Immigration and Refugee Board: $341M — independent tribunal deciding immigration and refugee claims",
      "Canada processed approximately 471,000 new permanent residents in 2023",
    ],
    departments: ["Immigration, Refugees and Citizenship Canada", "Immigration and Refugee Board"],
    source: "Public Accounts 2024, Vol II Table 2 — IRCC ministry: $6,336M",
  },
  "environment-climate": {
    slug: "environment-climate",
    subtitle: "Monitoring, parks, and environmental protection",
    details: [
      "Department of the Environment: $2.4B — pollution monitoring, weather forecasting, wildlife protection, climate science",
      "Parks Canada: $1.5B — manages 48 national parks, 171 national historic sites, and 6 national marine conservation areas",
      "Impact Assessment Agency: $98M — conducts environmental assessments of major projects",
      "Does NOT include carbon rebates ($9.9B separate) or climate spending embedded in other departments",
    ],
    departments: ["Environment and Climate Change Canada", "Parks Canada", "Impact Assessment Agency"],
    source: "Public Accounts 2024, Vol II Table 2 — Environment ministry: $3,912M",
  },
};
