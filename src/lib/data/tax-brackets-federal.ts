// 2023 Canadian federal tax brackets and deduction rates
// Source: Canada Revenue Agency

export const FEDERAL_TAX_BRACKETS = [
  { bracket_min: 0, bracket_max: 55867, rate: 0.15 },
  { bracket_min: 55867, bracket_max: 111733, rate: 0.205 },
  { bracket_min: 111733, bracket_max: 154906, rate: 0.26 },
  { bracket_min: 154906, bracket_max: 220000, rate: 0.29 },
  { bracket_min: 220000, bracket_max: null, rate: 0.33 },
] as const;

export const BASIC_PERSONAL_AMOUNT = 15000;
export const CPP_RATE = 0.0595;
export const CPP_EXEMPTION = 3500;
export const CPP_MAX_PENSIONABLE = 66600;
export const CPP_MAX_CONTRIBUTION = 3754.45;
export const EI_RATE = 0.0163;
export const EI_MAX_INSURABLE = 61500;
export const EI_MAX_CONTRIBUTION = 1002.45;

// Provincial tax brackets (simplified — largest provinces)
export const PROVINCIAL_TAX_BRACKETS: Record<
  string,
  { bracket_min: number; bracket_max: number | null; rate: number }[]
> = {
  ON: [
    { bracket_min: 0, bracket_max: 51446, rate: 0.0505 },
    { bracket_min: 51446, bracket_max: 102894, rate: 0.0915 },
    { bracket_min: 102894, bracket_max: 150000, rate: 0.1116 },
    { bracket_min: 150000, bracket_max: 220000, rate: 0.1216 },
    { bracket_min: 220000, bracket_max: null, rate: 0.1316 },
  ],
  BC: [
    { bracket_min: 0, bracket_max: 45654, rate: 0.0506 },
    { bracket_min: 45654, bracket_max: 91310, rate: 0.077 },
    { bracket_min: 91310, bracket_max: 104835, rate: 0.105 },
    { bracket_min: 104835, bracket_max: 127299, rate: 0.1229 },
    { bracket_min: 127299, bracket_max: 172602, rate: 0.147 },
    { bracket_min: 172602, bracket_max: 240716, rate: 0.168 },
    { bracket_min: 240716, bracket_max: null, rate: 0.205 },
  ],
  AB: [
    { bracket_min: 0, bracket_max: 142292, rate: 0.10 },
    { bracket_min: 142292, bracket_max: 170751, rate: 0.12 },
    { bracket_min: 170751, bracket_max: 227668, rate: 0.13 },
    { bracket_min: 227668, bracket_max: 341502, rate: 0.14 },
    { bracket_min: 341502, bracket_max: null, rate: 0.15 },
  ],
  QC: [
    { bracket_min: 0, bracket_max: 49275, rate: 0.14 },
    { bracket_min: 49275, bracket_max: 98540, rate: 0.19 },
    { bracket_min: 98540, bracket_max: 119910, rate: 0.24 },
    { bracket_min: 119910, bracket_max: null, rate: 0.2575 },
  ],
  SK: [
    { bracket_min: 0, bracket_max: 49720, rate: 0.105 },
    { bracket_min: 49720, bracket_max: 142058, rate: 0.125 },
    { bracket_min: 142058, bracket_max: null, rate: 0.145 },
  ],
  MB: [
    { bracket_min: 0, bracket_max: 36842, rate: 0.108 },
    { bracket_min: 36842, bracket_max: 79625, rate: 0.1275 },
    { bracket_min: 79625, bracket_max: null, rate: 0.174 },
  ],
  NB: [
    { bracket_min: 0, bracket_max: 47715, rate: 0.094 },
    { bracket_min: 47715, bracket_max: 95431, rate: 0.14 },
    { bracket_min: 95431, bracket_max: 176756, rate: 0.16 },
    { bracket_min: 176756, bracket_max: null, rate: 0.195 },
  ],
  NS: [
    { bracket_min: 0, bracket_max: 29590, rate: 0.0879 },
    { bracket_min: 29590, bracket_max: 59180, rate: 0.1495 },
    { bracket_min: 59180, bracket_max: 93000, rate: 0.1667 },
    { bracket_min: 93000, bracket_max: 150000, rate: 0.175 },
    { bracket_min: 150000, bracket_max: null, rate: 0.21 },
  ],
  PE: [
    { bracket_min: 0, bracket_max: 31984, rate: 0.098 },
    { bracket_min: 31984, bracket_max: 63969, rate: 0.138 },
    { bracket_min: 63969, bracket_max: null, rate: 0.167 },
  ],
  NL: [
    { bracket_min: 0, bracket_max: 41457, rate: 0.087 },
    { bracket_min: 41457, bracket_max: 82913, rate: 0.145 },
    { bracket_min: 82913, bracket_max: 148027, rate: 0.158 },
    { bracket_min: 148027, bracket_max: 207239, rate: 0.178 },
    { bracket_min: 207239, bracket_max: 264750, rate: 0.198 },
    { bracket_min: 264750, bracket_max: 529500, rate: 0.208 },
    { bracket_min: 529500, bracket_max: 1059000, rate: 0.213 },
    { bracket_min: 1059000, bracket_max: null, rate: 0.218 },
  ],
  NT: [
    { bracket_min: 0, bracket_max: 48326, rate: 0.059 },
    { bracket_min: 48326, bracket_max: 96655, rate: 0.086 },
    { bracket_min: 96655, bracket_max: 157139, rate: 0.122 },
    { bracket_min: 157139, bracket_max: null, rate: 0.1405 },
  ],
  NU: [
    { bracket_min: 0, bracket_max: 50877, rate: 0.04 },
    { bracket_min: 50877, bracket_max: 101754, rate: 0.07 },
    { bracket_min: 101754, bracket_max: 165429, rate: 0.09 },
    { bracket_min: 165429, bracket_max: null, rate: 0.115 },
  ],
  YT: [
    { bracket_min: 0, bracket_max: 55867, rate: 0.064 },
    { bracket_min: 55867, bracket_max: 111733, rate: 0.09 },
    { bracket_min: 111733, bracket_max: 154906, rate: 0.109 },
    { bracket_min: 154906, bracket_max: 500000, rate: 0.128 },
    { bracket_min: 500000, bracket_max: null, rate: 0.15 },
  ],
};

// GST/HST rates by province
export const GST_HST_RATES: Record<string, number> = {
  AB: 0.05,
  BC: 0.12,
  SK: 0.11,
  MB: 0.12,
  ON: 0.13,
  QC: 0.14975, // 5% GST + 9.975% QST
  NB: 0.15,
  NS: 0.15,
  PE: 0.15,
  NL: 0.15,
  NT: 0.05,
  NU: 0.05,
  YT: 0.05,
};

// Estimated percentage of after-tax income subject to sales tax
export const ESTIMATED_TAXABLE_SPENDING_RATIO = 0.6;
