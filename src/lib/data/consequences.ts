/**
 * Consequence data for budget allocations.
 * Shows real-world impact of increasing or decreasing spending on each category.
 */

export interface ConsequenceData {
  slug: string;
  increase: string; // What happens if you significantly increase this
  decrease: string; // What happens if you significantly decrease this
  zero: string; // What happens if you set this to 0%
  double: string; // What happens if you roughly double this
  unit?: string; // What the money buys (for interpolation)
  unitCostBillions?: number; // Cost per unit in billions
}

export const CONSEQUENCES: ConsequenceData[] = [
  {
    slug: "seniors-oas-gis",
    increase: "More seniors lifted above the poverty line. Higher monthly OAS/GIS payments.",
    decrease: "Senior poverty rises. ~700,000 seniors currently kept above the poverty line by GIS would lose income.",
    zero: "6.9 million Canadian seniors lose their Old Age Security and GIS payments overnight. Senior poverty rate jumps from 5% to an estimated 30%+.",
    double: "Every senior gets roughly $1,200/month more. Canada would have the most generous public pension in the G7.",
    unit: "senior lifted above poverty line",
    unitCostBillions: 0.0001,
  },
  {
    slug: "government-operations",
    increase: "Federal departments get more staff, faster IT modernization, shorter wait times for government services.",
    decrease: "Service Canada wait times increase. Passport backlogs worsen. Federal departments cut staff.",
    zero: "The entire federal government ceases to function. No passports, no CRA, no federal services.",
    double: "Massive expansion of federal workforce. Could fund comprehensive digital government transformation.",
  },
  {
    slug: "healthcare-transfers",
    increase: "Provinces receive more for hospitals, reducing wait times. Average ER wait could drop from 4+ hours.",
    decrease: "Provincial healthcare budgets squeezed further. Wait times increase. More Canadians travel to the US for care.",
    zero: "Provinces lose $65.8B in healthcare funding. Most public hospitals would need to reduce services dramatically.",
    double: "Provinces receive ~$132B for healthcare. Could fund pharmacare, dental care expansion, and mental health services.",
    unit: "family doctor position funded",
    unitCostBillions: 0.0003,
  },
  {
    slug: "debt-interest",
    increase: "You can't choose to pay more interest — this is determined by debt level and interest rates.",
    decrease: "Reducing interest payments requires paying down the national debt, which means running surpluses.",
    zero: "Canada defaults on its debt. Credit rating collapses from AAA to junk. Borrowing costs skyrocket for all Canadians — mortgages, car loans, business loans all spike.",
    double: "This would mean interest rates doubled or debt doubled. Neither is a choice — it's a consequence.",
  },
  {
    slug: "indigenous-services",
    increase: "More funding for clean water on reserves, Indigenous housing, education, and health services. Faster progress on reconciliation.",
    decrease: "More boil water advisories. Overcrowded housing on reserves worsens. Indigenous health outcomes deteriorate further.",
    zero: "Over 100 boil water advisories return. Indigenous health, education, and housing programs collapse. Canada's international reputation on Indigenous rights severely damaged.",
    double: "Could fund clean water for every reserve, address the housing backlog, and significantly improve Indigenous health outcomes.",
  },
  {
    slug: "national-defence",
    increase: "Canada moves closer to NATO's 2% GDP target. More equipment, more personnel, stronger Arctic presence.",
    decrease: "Military equipment ages further without replacement. Canada fails to meet NATO commitments. Arctic sovereignty weakens.",
    zero: "Canada has no military. NATO membership effectively ends. Arctic sovereignty undefended. No capacity for peacekeeping or disaster response.",
    double: "Canada reaches ~2.6% of GDP on defence — above NATO target. Could fund new fighter jets, Arctic patrol ships, and cyber defence.",
    unit: "new fighter jet",
    unitCostBillions: 0.25,
  },
  {
    slug: "children-families",
    increase: "Higher monthly CCB payments per child, lifting more families above the poverty line.",
    decrease: "Child poverty increases. 300,000+ children currently kept out of poverty by CCB would lose benefits.",
    zero: "3.5 million families lose Canada Child Benefit payments. Child poverty rate could triple.",
    double: "Up to ~$15,000 per child under 6, tax-free. Child poverty effectively eliminated.",
  },
  {
    slug: "employment-insurance",
    increase: "More generous EI benefits, longer parental leave, expanded job training programs.",
    decrease: "Unemployed workers receive less support. Parental leave benefits reduced.",
    zero: "No employment insurance, no parental leave benefits. Workers who lose their jobs have no safety net.",
    double: "EI replacement rate could increase from 55% to 80%+ of earnings. Universal job retraining programs.",
  },
  {
    slug: "carbon-rebates",
    increase: "Larger quarterly rebate cheques for Canadian families. Most families in provinces with the federal carbon price already get back more than they pay.",
    decrease: "Smaller carbon rebate cheques, but carbon pricing revenue still collected.",
    zero: "No carbon rebates. Families in provinces with the federal carbon price keep paying but get nothing back.",
    double: "Rebate cheques nearly double. A family of four in Ontario could receive ~$1,900/year instead of ~$1,100.",
  },
  {
    slug: "housing-infrastructure",
    increase: "More affordable housing units built, transit expanded, infrastructure modernized.",
    decrease: "Housing crisis deepens. Infrastructure deficit grows. Roads and bridges deteriorate faster.",
    zero: "Federal housing programs end. Infrastructure crumbles. No federal transit funding.",
    double: "Could fund ~60,000 additional affordable housing units per year. Major transit expansion in every province.",
    unit: "affordable housing unit",
    unitCostBillions: 0.0003,
  },
  {
    slug: "foreign-affairs-aid",
    increase: "Canada moves closer to UN target of 0.7% of GNI on aid. Stronger diplomatic presence. More refugee support.",
    decrease: "Aid to developing nations cut. Embassies closed. Canada's diplomatic influence weakens.",
    zero: "All embassies close. No consular services for Canadians abroad. No foreign aid. No trade negotiations.",
    double: "Canada reaches ~0.7% of GNI on foreign aid — meeting the UN target for the first time. Major expansion of global health and education programs.",
  },
  {
    slug: "public-safety-justice",
    increase: "More RCMP officers, faster court processing, better border security, expanded corrections.",
    decrease: "RCMP stretched thinner. Court backlogs worsen. Some cases dismissed due to delays.",
    zero: "No federal policing, no border security, no federal courts, no correctional services. Federal prisoners released.",
    double: "Major expansion of RCMP capacity, cybercrime units, and national security infrastructure.",
  },
  {
    slug: "immigration",
    increase: "Faster processing of immigration applications. Better settlement services. Reduced backlogs.",
    decrease: "Immigration backlogs grow. Families wait longer for reunification. Refugee processing slows.",
    zero: "Immigration system shuts down. No new permanent residents. No refugee processing. Labour shortages in healthcare, agriculture, tech.",
    double: "Wait times halved. Comprehensive settlement support. Canada could process 1M+ applications per year efficiently.",
  },
  {
    slug: "environment-climate",
    increase: "More environmental monitoring, wildlife protection, climate science research, pollution enforcement.",
    decrease: "Less monitoring of pollution, water quality, and endangered species. Climate science capacity reduced.",
    zero: "No federal environmental protection. No pollution monitoring. No climate science. No endangered species protection.",
    double: "Comprehensive environmental monitoring nationwide. Major investment in biodiversity and conservation.",
  },
];

export function getConsequence(slug: string): ConsequenceData | undefined {
  return CONSEQUENCES.find((c) => c.slug === slug);
}

/**
 * Get relevant consequence text based on user's allocation vs government actual.
 */
export function getConsequenceForAllocation(
  slug: string,
  userPct: number,
  govPct: number
): string | null {
  const data = getConsequence(slug);
  if (!data) return null;

  if (userPct === 0) return data.zero;
  if (userPct >= govPct * 1.8) return data.double;
  if (userPct > govPct * 1.2) return data.increase;
  if (userPct < govPct * 0.5) return data.decrease;
  return null;
}
