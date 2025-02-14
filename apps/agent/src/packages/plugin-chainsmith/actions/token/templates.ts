import { RISK_DEFINITION, OBJECTIVE_DEFINITION } from '../../types/index.ts';

export const processTokenInputTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "symbol": "ETH"
    "walletAddress": "0x6c34C667632dC1aAF04F362516e6F44D006A58fa",
    "reviewFrequency": "DAILY",
    "riskLevel": "VERY AGGRESSIVE",
    "investmentObjective": "GROWTH",
}
\`\`\`

User message:
"{{currentMessage}}"

Given the message, extract the following information about the requested balance check:
- Token symbol: capitalized, begin with '$' (Examples: $ETH, $BTC,...)
- Wallet address to check (should begin with '0x')
- Review frequency. Value should be 'DAILY', 'WEEKLY', 'BI-WEEKLY, 'MONTHLY' only.
- Risk level. Value should be 'CONSERVATIVE', 'MODERATE', 'AGGRESSIVE', 'VERY AGGRESSIVE' only.
- Investment objective. Value should be 'GROWTH', 'VALUE', 'VALUE' only.

Respond with a JSON markdown block containing only the extracted values.`;

export const recommendTokenActionTemplate = (
  tokenReport: string,
  reviewFrequency: string,
  riskLevel: string,
  investmentObjective: string
) => `
Given the following background of an investor:
  - Check the portfolio on ${reviewFrequency} basis
  - ${riskLevel} risk appetite that willing to accept ${RISK_DEFINITION[riskLevel]}
  - ${investmentObjective} Investment objective: ${OBJECTIVE_DEFINITION[investmentObjective]}

Analyze the following token report and provide a recommended action below. 
  - action: suggest only 2 values: REBALANCE (sell to by another token), or HOLD (seeking for earning opportunities)
  - reason: A string contains 2-3 sentences summarize and evaluate the token, and why it has the recommended. 
    - Token symbol (ETH, BTC, SOL, USDC...)
    - If the action is REBALANCE, MUST mention with target token in portfolio to swap, AND the  allocated (in %) balance to sell.
  - actionPayload: Return null if action is HOLD. If action is REBALANCE, MUST return an object with 2 field: tokenIn and amountOutPercentage
    - tokenIn: symbol string of other token in the portfolio. 
    - amountOutPercentage: the allocated (in %) balance to sell.

Return the response as a JSON object with the following structure:

For recommending REBALANCE
  {
    "action": 'REBALANCE',
    "reason" string,
    "actionPayload": {
      tokenIn: string,
      amountOutPercentage: number (<1)
    }
  }

For recommending HOLD
  {
    "action": 'HOLD',
    "reason" string,
    "actionPayload": null
  }

Token report: ${tokenReport}`;
