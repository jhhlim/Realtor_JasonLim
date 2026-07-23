/**
 * Mortgage math: P&I, amortization, and all-in affordability estimates.
 */

export interface MonthlyPaymentInput {
  principal: number;
  annualRate: number;
  years: number;
}

export function calculateMonthlyPayment({
  principal,
  annualRate,
  years,
}: MonthlyPaymentInput): number {
  if (principal <= 0 || years <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const n = years * 12;
  if (monthlyRate === 0) return principal / n;
  const factor = Math.pow(1 + monthlyRate, n);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/** Alias used by listing teaser / utils parity. */
export const calculateMortgagePayment = calculateMonthlyPayment;

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  extra: number;
  balance: number;
}

export interface AmortizationResult {
  payment: number;
  totalInterest: number;
  totalPaid: number;
  months: number;
  schedule: AmortizationRow[];
}

export function amortizationSchedule({
  principal,
  annualRate,
  years,
  extraPayment = 0,
}: MonthlyPaymentInput & { extraPayment?: number }): AmortizationResult {
  const monthlyRate = annualRate / 100 / 12;
  const basePayment = calculateMonthlyPayment({ principal, annualRate, years });
  let balance = principal;
  const schedule: AmortizationRow[] = [];
  let totalInterest = 0;
  let month = 0;
  const maxMonths = years * 12 + 240;

  while (balance > 0.01 && month < maxMonths) {
    month += 1;
    const interest = balance * monthlyRate;
    let principalPaid = basePayment - interest + extraPayment;
    if (principalPaid > balance) principalPaid = balance;
    const scheduledPrincipal = Math.max(0, Math.min(principalPaid, basePayment - interest));
    const extraApplied = Math.max(0, principalPaid - Math.max(0, basePayment - interest));
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    schedule.push({
      month,
      payment: principalPaid + interest,
      principal: scheduledPrincipal,
      interest,
      extra: extraApplied,
      balance,
    });
  }

  const totalPaid = schedule.reduce((sum, row) => sum + row.payment, 0);

  return {
    payment: basePayment,
    totalInterest,
    totalPaid,
    months: schedule.length,
    schedule,
  };
}

/** Alias for older call sites. */
export function buildAmortizationSchedule(
  input: MonthlyPaymentInput & { extraPayment?: number },
): AmortizationResult & { payoffMonths: number } {
  const result = amortizationSchedule(input);
  return { ...result, payoffMonths: result.months };
}

export interface AffordabilityInput {
  homePrice: number;
  downPaymentPercent?: number;
  annualRate?: number;
  years?: number;
  /** Annual property tax dollars; overrides propertyTaxRate when set. */
  propertyTaxAnnual?: number;
  /** Annual tax as % of home price (e.g. 1.1 for California-ish). */
  propertyTaxRate?: number;
  /** Annual homeowners insurance; if omitted, estimated from home price. */
  insuranceAnnual?: number;
  /** Monthly insurance override. */
  insuranceMonthly?: number;
  hoaMonthly?: number;
  /** Monthly PMI override. */
  pmiMonthly?: number;
  /** LTV % above which PMI applies (default 80). */
  pmiLtvThreshold?: number;
  /** Annual PMI rate as % of loan when LTV above threshold (default 0.5). */
  pmiAnnualRate?: number;
  extraPaymentMonthly?: number;
  /** Annual income for DTI-style max price. */
  annualIncome?: number;
  monthlyDebts?: number;
  /** Target housing / DTI ratio (default 0.28 housing, or 0.36 when debts provided). */
  housingRatio?: number;
}

export interface AffordabilityEstimate {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  ltv: number;
  principalAndInterest: number;
  propertyTaxMonthly: number;
  insuranceMonthly: number;
  hoaMonthly: number;
  pmiMonthly: number;
  extraPaymentMonthly: number;
  totalMonthly: number;
  affordableHomePrice?: number;
  amortization: AmortizationResult;
}

function estimateAnnualInsurance(homePrice: number): number {
  return homePrice * 0.0035;
}

function resolveInsuranceMonthly(
  homePrice: number,
  input: AffordabilityInput,
): number {
  if (input.insuranceMonthly != null) return input.insuranceMonthly;
  if (input.insuranceAnnual != null) return input.insuranceAnnual / 12;
  return estimateAnnualInsurance(homePrice) / 12;
}

function resolveTaxMonthly(homePrice: number, input: AffordabilityInput): number {
  if (input.propertyTaxAnnual != null) return input.propertyTaxAnnual / 12;
  const rate = input.propertyTaxRate ?? 1.1;
  return (homePrice * rate) / 100 / 12;
}

function resolvePmiMonthly(
  loanAmount: number,
  homePrice: number,
  input: AffordabilityInput,
): number {
  if (input.pmiMonthly != null) return input.pmiMonthly;
  const ltv = homePrice > 0 ? (loanAmount / homePrice) * 100 : 0;
  const threshold = input.pmiLtvThreshold ?? 80;
  const rate = input.pmiAnnualRate ?? 0.5;
  if (ltv <= threshold || loanAmount <= 0) return 0;
  return (loanAmount * rate) / 100 / 12;
}

export function affordabilityEstimate(
  input: AffordabilityInput,
): AffordabilityEstimate {
  const {
    homePrice,
    downPaymentPercent = 20,
    annualRate = 6.5,
    years = 30,
    hoaMonthly = 0,
    extraPaymentMonthly = 0,
    annualIncome,
    monthlyDebts = 0,
    housingRatio,
  } = input;

  const downPayment = (homePrice * downPaymentPercent) / 100;
  const loanAmount = Math.max(homePrice - downPayment, 0);
  const ltv = homePrice > 0 ? (loanAmount / homePrice) * 100 : 0;
  const principalAndInterest = calculateMonthlyPayment({
    principal: loanAmount,
    annualRate,
    years,
  });

  const propertyTaxMonthly = resolveTaxMonthly(homePrice, input);
  const insuranceMonthly = resolveInsuranceMonthly(homePrice, input);
  const pmiMonthly = resolvePmiMonthly(loanAmount, homePrice, input);

  const amortization = amortizationSchedule({
    principal: loanAmount,
    annualRate,
    years,
    extraPayment: extraPaymentMonthly,
  });

  const totalMonthly =
    principalAndInterest +
    propertyTaxMonthly +
    insuranceMonthly +
    hoaMonthly +
    pmiMonthly +
    extraPaymentMonthly;

  let affordableHomePrice: number | undefined;
  if (annualIncome && annualIncome > 0) {
    const ratio = housingRatio ?? (monthlyDebts > 0 ? 0.36 : 0.28);
    const maxHousing = Math.max(0, (annualIncome * ratio) / 12 - monthlyDebts);
    let lo = 0;
    let hi = Math.max(homePrice * 3, annualIncome * 20);
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      const dp = (mid * downPaymentPercent) / 100;
      const loan = Math.max(mid - dp, 0);
      const pi = calculateMonthlyPayment({ principal: loan, annualRate, years });
      const tax = resolveTaxMonthly(mid, input);
      const ins = resolveInsuranceMonthly(mid, input);
      const pmi = resolvePmiMonthly(loan, mid, input);
      const total = pi + tax + ins + hoaMonthly + pmi + extraPaymentMonthly;
      if (total > maxHousing) hi = mid;
      else lo = mid;
    }
    affordableHomePrice = Math.round(lo);
  }

  return {
    homePrice,
    downPayment,
    loanAmount,
    ltv,
    principalAndInterest,
    propertyTaxMonthly,
    insuranceMonthly,
    hoaMonthly,
    pmiMonthly,
    extraPaymentMonthly,
    totalMonthly,
    affordableHomePrice,
    amortization,
  };
}

/** Convenience wrapper returning a flat housing payment breakdown. */
export function calculateHousingPayment(input: {
  homePrice: number;
  downPaymentPercent: number;
  annualRate: number;
  years: number;
  propertyTaxAnnual?: number;
  propertyTaxRate?: number;
  insuranceMonthly: number;
  hoaMonthly: number;
  pmiLtvThreshold?: number;
  pmiAnnualRate?: number;
  extraMonthlyPayment?: number;
}) {
  const estimate = affordabilityEstimate({
    ...input,
    insuranceMonthly: input.insuranceMonthly,
    extraPaymentMonthly: input.extraMonthlyPayment,
  });
  return {
    loanAmount: estimate.loanAmount,
    downPayment: estimate.downPayment,
    principalAndInterest: estimate.principalAndInterest,
    taxes: estimate.propertyTaxMonthly,
    insurance: estimate.insuranceMonthly,
    hoa: estimate.hoaMonthly,
    pmi: estimate.pmiMonthly,
    extra: estimate.extraPaymentMonthly,
    totalMonthly: estimate.totalMonthly,
    ltv: estimate.ltv,
  };
}

export function estimateAffordability(input: {
  annualIncome: number;
  monthlyDebts: number;
  annualRate: number;
  years?: number;
  downPaymentPercent?: number;
  dtiRatio?: number;
  propertyTaxRate?: number;
  insuranceMonthly?: number;
  hoaMonthly?: number;
}) {
  const result = affordabilityEstimate({
    homePrice: 1_500_000,
    annualIncome: input.annualIncome,
    monthlyDebts: input.monthlyDebts,
    annualRate: input.annualRate,
    years: input.years,
    downPaymentPercent: input.downPaymentPercent,
    housingRatio: input.dtiRatio,
    propertyTaxRate: input.propertyTaxRate,
    insuranceMonthly: input.insuranceMonthly,
    hoaMonthly: input.hoaMonthly,
  });
  const maxHomePrice = result.affordableHomePrice ?? 0;
  return {
    maxMonthlyHousing: Math.max(
      0,
      (input.annualIncome * (input.dtiRatio ?? 0.36)) / 12 - input.monthlyDebts,
    ),
    maxLoanAmount: Math.floor(
      maxHomePrice * (1 - (input.downPaymentPercent ?? 20) / 100),
    ),
    maxHomePrice,
  };
}

export function calculateRefinanceBreakEven(input: {
  closingCosts: number;
  currentMonthlyPayment: number;
  newMonthlyPayment: number;
}) {
  const monthlySavings = input.currentMonthlyPayment - input.newMonthlyPayment;
  const breakEvenMonths =
    monthlySavings > 0 ? Math.ceil(input.closingCosts / monthlySavings) : null;
  return { monthlySavings, breakEvenMonths };
}

export function calculateCapRate(input: { noi: number; purchasePrice: number }) {
  if (input.purchasePrice <= 0) return 0;
  return (input.noi / input.purchasePrice) * 100;
}

export function calculateCashOnCash(input: {
  annualCashFlow: number;
  cashInvested: number;
}) {
  if (input.cashInvested <= 0) return 0;
  return (input.annualCashFlow / input.cashInvested) * 100;
}

export interface LoanScenarioInput {
  label: string;
  homePrice: number;
  downPaymentPercent: number;
  annualRate: number;
  years: number;
  propertyTaxRate?: number;
  insuranceMonthly?: number;
  hoaMonthly?: number;
}

export interface LoanScenarioResult {
  label: string;
  loanAmount: number;
  downPayment: number;
  principalAndInterest: number;
  totalMonthly: number;
  totalInterest: number;
}

export function compareLoanScenarios(
  scenarios: LoanScenarioInput[],
): LoanScenarioResult[] {
  return scenarios.map((scenario) => {
    const estimate = affordabilityEstimate({
      homePrice: scenario.homePrice,
      downPaymentPercent: scenario.downPaymentPercent,
      annualRate: scenario.annualRate,
      years: scenario.years,
      propertyTaxRate: scenario.propertyTaxRate,
      insuranceMonthly: scenario.insuranceMonthly,
      hoaMonthly: scenario.hoaMonthly,
    });
    return {
      label: scenario.label,
      loanAmount: estimate.loanAmount,
      downPayment: estimate.downPayment,
      principalAndInterest: estimate.principalAndInterest,
      totalMonthly: estimate.totalMonthly,
      totalInterest: estimate.amortization.totalInterest,
    };
  });
}
