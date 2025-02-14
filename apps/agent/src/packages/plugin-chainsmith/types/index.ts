export const REVIEW_FREQUENCY = ['DAILY', 'WEEKLY', 'BI-WEEKLY', 'MONTHLY'] as const;
export const RISK_LEVEL = ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE', 'VERY AGGRESSIVE'] as const;
export const INVESTMENT_OBJECTIVE = ['GROWTH', 'VALUE', 'MIXED'] as const;

export const RISK_DEFINITION = {
  CONSERVATIVE: '~10% loss in downturn',
  MODERATE: '20-30% loss in downturn',
  AGGRESSIVE: '40% loss in downturn',
  'VERY AGGRESSIVE': '50% loss in downturn',
} as const;

export const OBJECTIVE_DEFINITION = {
  GROWTH: 'Focus on the return',
  VALUE: 'Ensure the passive income',
  MIXED: 'Balance growth & value',
} as const;
