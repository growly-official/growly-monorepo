import {
  type Action,
  type ActionExample,
  type Content,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  ModelClass,
  type State,
  elizaLogger,
  composeContext,
  generateObject,
} from '@elizaos/core';
import { z } from 'zod';

import { evmPortfolioProvider } from '../providers/portfolio.ts';
import { validateChainmsithConfig } from '../environment.ts';
import { isAddress } from 'viem';

const PortfolioSchema = z.object({
  walletAddress: z.string().optional().nullable(),
  chain: z.string().optional().nullable(),
});

export interface PortfolioContent extends Content {
  walletAddress?: string;
  chain?: string;
}

const validatedSchema = z.object({
  walletAddress: z.string().refine(isAddress, { message: 'Invalid token address' }),
});

const analyzePortfolioTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "walletAddress": "<TOKEN_ADDRESS>",
    "chain": "<CHAIN>"
}
\`\`\`

User message:
"{{currentMessage}}"

Given the message, extract the following information about the requested balance check:
- Wallet address to check (optional, if not specified set to null)
- Chain as blockchain (usually 'mainnet', 'base',...)

Respond with a JSON markdown block containing only the extracted values.`;

export const analyzePortfolio: Action = {
  name: 'ANALYZE_PORTFOLIO',
  similes: [
    'CHECK_PORTFOLIO',
    'PORTFOLIO_CHECK',
    'GET_CRYPTO_PORTFOLIO',
    'CRYPTO_PORTFOLIO',
    'CHECK_CRYPTO_PORTFOLIO',
    'PORTFOLIO_LOOKUP',
    'CURRENT_PORTFOLIO',
  ],
  validate: async (runtime: IAgentRuntime, _message: Memory) => {
    await validateChainmsithConfig(runtime);
    return true;
  },
  description: 'Get portfolio report of a given wallet address',
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: Record<string, unknown>,
    callback?: HandlerCallback
  ): Promise<boolean> => {
    elizaLogger.log('Starting ANALYZE_PORTFOLIO handler...');

    // Initialize or update state
    let currentState = state;
    if (!currentState) {
      currentState = (await runtime.composeState(message)) as State;
    } else {
      currentState = await runtime.updateRecentMessageState(currentState);
    }

    // Compose balance context
    currentState.currentMessage = `${currentState.recentMessagesData[1].content.text}`;
    const portfolioContext = composeContext({
      state: currentState,
      template: analyzePortfolioTemplate,
    });

    // Generate balance content
    const content = (
      await generateObject({
        runtime,
        context: portfolioContext,
        modelClass: ModelClass.SMALL,
        schema: PortfolioSchema,
      })
    ).object as PortfolioContent;

    try {
      const addressToCheck = content.walletAddress || '0x6c34C667632dC1aAF04F362516e6F44D006A58fa';

      const result = validatedSchema.safeParse({
        walletAddress: addressToCheck,
      });

      // Validate transfer content
      if (!result.success) {
        elizaLogger.error('Invalid content for ANALYZE_PORTFOLIO action.');
        if (callback) {
          callback({
            text: 'Unable to process portfolio request. Invalid content provided.',
            content: { error: 'Invalid portfolio content' },
          });
        }
        return false;
      }

      state.walletAddress = addressToCheck;

      const portfolioInfo = await evmPortfolioProvider.get(runtime, message, state);
      state.portfolioInfo = portfolioInfo;

      if (!portfolioInfo) {
        elizaLogger.warn('PortfolioProvider did not return a result.');
      } else {
        elizaLogger.info('PortfolioProvider result:', portfolioInfo);
      }

      elizaLogger.success(`Multichain-portfolio check completed for ${addressToCheck}`);
      if (callback) {
        callback({
          text: `${portfolioInfo}`,
          content: { portfolioInfo },
        });
      }

      return true;
    } catch (error) {
      elizaLogger.error('Error getting portfolio:', error);
      if (callback) {
        callback({
          text: `Error checking portfolio: ${error.message}`,
          content: { error: error.message },
        });
      }
      return false;
    }
  },

  examples: [
    [
      {
        user: '{{user1}}',
        content: {
          text: 'Evaluate my wallet portfolio 0x6c34C667632dC1aAF04F362516e6F44D006A58fa',
        },
      },
      {
        user: '{{agent}}',
        content: {
          text: 'Let me check multichain portfolio with wallet 0x6c34C667632dC1aAF04F362516e6F44D006A58fa.',
          action: 'ANALYZE_PORTFOLIO',
        },
      },
      {
        user: '{{agent}}',
        content: {
          text: 'Wallet Address: 0x6c34C667632dC1aAF04F362516e6F44D006A58fa\nTotal Value: $1,219.21\nToken value distribution:\nETH\n- Holding balance:       $592.12\n- Portfolio allocation:  48.57%\n...',
        },
      },
    ],
    [
      {
        user: '{{user1}}',
        content: {
          text: 'Evaluate my wallet portfolio',
        },
      },
      {
        user: '{{agent}}',
        content: {
          text: 'Please provide me your the wallet address',
        },
      },
      {
        user: '{{user1}}',
        content: {
          text: '0x6c34C667632dC1aAF04F362516e6F44D006A58fa',
        },
      },
      {
        user: '{{agent}}',
        content: {
          text: 'Let me check multichain portfolio with wallet 0x6c34C667632dC1aAF04F362516e6F44D006A58fa.',
          action: 'ANALYZE_PORTFOLIO',
        },
      },
      {
        user: '{{agent}}',
        content: {
          text: 'Wallet Address: 0x6c34C667632dC1aAF04F362516e6F44D006A58fa\nTotal Value: $1,219.21\nToken value distribution:\nETH\n- Holding balance:       $592.12\n- Portfolio allocation:  48.57%\n...',
        },
      },
    ],
  ] as ActionExample[][],
} as Action;
