import { RISK_DEFINITION, OBJECTIVE_DEFINITION } from '../../types/index.ts';

export const processPortfolioInputTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
  "reviewFrequency": "DAILY",
  "riskLevel": "VERY AGGRESSIVE",
  "investmentObjective": "GROWTH",
  "walletAddress": "0x6c34C667632dC1aAF04F362516e6F44D006A58fa",
}
\`\`\`

User message:
"{{currentMessage}}"

Given the message, extract the following information about the requested balance check:
- Review frequency. Value should be 'DAILY', 'WEEKLY', 'BI-WEEKLY, 'MONTHLY' only.
- Risk level. Value should be 'CONSERVATIVE', 'MODERATE', 'AGGRESSIVE', 'VERY AGGRESSIVE' only.
- Investment objective. Value should be 'GROWTH', 'VALUE', 'VALUE' only.
- Wallet address to check (should begin with '0x')

Respond with a JSON markdown block containing only the extracted values.`;

export const analyzePortfolioTemplate = (
  portfolioReport: string,
  reviewFrequency: string,
  riskLevel: string,
  investmentObjective: string
) => `
Given the following background of an investor:
  - Check the portfolio on ${reviewFrequency} basis
  - ${riskLevel} risk appetite that willing to accept ${RISK_DEFINITION[riskLevel]}
  - ${investmentObjective} Investment objective: ${OBJECTIVE_DEFINITION[investmentObjective]}

Analyze the following portfolio report and provide an evaluation below. 
  - score: in scale of 100 if the allocation matched the risk level and investment objective.
  - summary: A string contains 2-3 sentences summarize and evaluate the current allocation, and why it has the above score. Any mentioned token symbol MUST be added with '$' at the beginning ($ETH, $BTC, $SOL, $USDC...)
  - successActions: a list of recommended actions (string only) that contains description and % of allocation that investor should consider. Any mentioned token symbol MUST be added with '$' at the beginning ($ETH, $BTC, $SOL, $USDC...)
      - Recommended tokens don't need to be user's holdings. 
      - Higher risk, more allocations in altcoins (lowcap). Moderate risk is blue chips (mid to high cap).
      - Example: 'Increase $MORPHO allocation by 10% to balance growth and risk'.
Return the response as a JSON object with the following structure:
  {
    "score": number (0-100),
    "summary" string,
    "successActions": string[]
  }
  
Portfolio report: ${portfolioReport}`;
