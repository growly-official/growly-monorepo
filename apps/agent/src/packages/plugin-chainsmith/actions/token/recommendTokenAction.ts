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

import { evmTokenProvider } from '../../providers/token.ts';
import { validateChainmsithConfig } from '../../environment.ts';
import { isAddress } from 'viem';
import { REVIEW_FREQUENCY, RISK_LEVEL, INVESTMENT_OBJECTIVE } from '../../types/index.ts';
import { processTokenInputTemplate, recommendTokenActionTemplate } from './templates.ts';

// Token input schema
const TokenSchema = z.object({
  symbol: z.string().optional().nullable(),
  walletAddress: z.string().optional().nullable(),
  reviewFrequency: z.string().optional().nullable(),
  riskLevel: z.string().optional().nullable(),
  investmentObjective: z.string().optional().nullable(),
});

export interface TokenContent extends Content {
  symbol?: string;
  walletAddress?: string;
  reviewFrequency?: string;
  riskLevel?: string;
  investmentObjective?: string;
}

const validatedSchema = z.object({
  symbol: z
    .string()
    .refine(symbol => symbol.startsWith('$'), { message: 'Invalid symbol. Must begin with $' }),
  walletAddress: z.string().refine(isAddress, { message: 'Invalid wallet address' }),
  reviewFrequency: z.enum(REVIEW_FREQUENCY),
  riskLevel: z.enum(RISK_LEVEL),
  investmentObjective: z.enum(INVESTMENT_OBJECTIVE),
});

// Analyze token output schema
export interface TokenAnalysis extends Content {
  action?: string;
  reason?: string;
  actionPayload?: {
    tokenIn: string;
    amountOutPercentage: number;
  } | null;
}

const TokenAnalysisSchema = z.object({
  action: z.string().optional().nullable(),
  reason: z.string().optional().nullable(),
  actionPayload: z
    .object({
      tokenIn: z.string().optional().nullable(),
      amountOutPercentage: z.number().optional().nullable(),
    })
    .nullable(),
});

export const recommendTokenAction: Action = {
  name: 'RECOMMEND_TOKEN_ACTION',
  similes: ['RECOMMEND_ACTION', 'SUGGEST_TOKEN_ACTION'],
  validate: async (runtime: IAgentRuntime, _message: Memory) => {
    await validateChainmsithConfig(runtime);
    return true;
  },
  description: 'Get recommended action of a ticker (starting with $)',
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: Record<string, unknown>,
    callback?: HandlerCallback
  ): Promise<boolean> => {
    elizaLogger.log('Starting RECOMMEND_TOKEN_ACTION handler...');

    // Initialize or update state
    let currentState = state;
    if (!currentState) {
      currentState = (await runtime.composeState(message)) as State;
    } else {
      currentState = await runtime.updateRecentMessageState(currentState);
    }

    // Compose token context
    currentState.currentMessage = `${currentState.recentMessagesData[1].content.text}`;
    const tokenContext = composeContext({
      state: currentState,
      template: processTokenInputTemplate,
    });

    // Generate token content
    const tokenContent = (
      await generateObject({
        runtime,
        context: tokenContext,
        modelClass: ModelClass.SMALL,
        schema: TokenSchema,
      })
    ).object as TokenContent;

    try {
      const result = validatedSchema.safeParse({
        symbol: tokenContent.symbol,
        walletAddress: tokenContent.walletAddress,
        reviewFrequency: tokenContent.reviewFrequency,
        riskLevel: tokenContent.riskLevel,
        investmentObjective: tokenContent.investmentObjective,
      });

      // Validate transfer content
      if (!result.success) {
        elizaLogger.error('Invalid content for RECOMMEND_TOKEN_ACTION action.');
        if (callback) {
          callback({
            text: 'Unable to process token request. Invalid content provided.',
            content: { error: 'Invalid token content' },
          });
        }
        return false;
      }

      const symbol = tokenContent.symbol.slice(1); // Extract the symbol
      const walletAddress = tokenContent.walletAddress;
      const reviewFrequency = tokenContent.reviewFrequency;
      const riskLevel = tokenContent.riskLevel;
      const investmentObjective = tokenContent.investmentObjective;

      currentState.symbol = symbol;
      currentState.walletAddress = walletAddress;
      currentState.reviewFrequency = reviewFrequency;
      currentState.riskLevel = riskLevel;
      currentState.investmentObjective = investmentObjective;

      const tokenReport = await evmTokenProvider.get(runtime, message, currentState);

      if (!tokenReport) {
        elizaLogger.warn('TokenProvider did not return a result.');
      } else {
        elizaLogger.info('Get TokenReport successfully!');
      }

      currentState.tokenReport = tokenReport;
      currentState = await runtime.updateRecentMessageState(currentState);

      elizaLogger.success(`Token ${symbol} check completed for ${walletAddress}`);

      const tokenAnalysisContext = composeContext({
        state: currentState,
        template: recommendTokenActionTemplate(
          tokenReport,
          reviewFrequency,
          riskLevel,
          investmentObjective
        ),
      });

      // Generate token analysis
      const tokenAnalysis = (
        await generateObject({
          runtime,
          context: tokenAnalysisContext,
          modelClass: ModelClass.LARGE,
          schema: TokenAnalysisSchema,
        })
      ).object as TokenAnalysis;

      // Validate transfer content
      if (!tokenAnalysis.action || !tokenAnalysis.reason) {
        elizaLogger.error('Invalid output for RECOMMEND_TOKEN_ACTION action.');
        if (callback) {
          callback({
            text: 'Unable to conduct token trade analysis. Invalid content from LLM.',
            content: { error: 'Invalid token trade content' },
          });
        }
        return false;
      }

      if (callback) {
        callback({
          text: `${tokenAnalysis.reason}`,
          content: { tokenAnalysis },
        });
      }

      return true;
    } catch (error) {
      elizaLogger.error('Error getting token:', error);
      if (callback) {
        callback({
          text: `Error checking token: ${error.message}`,
          content: { error: error.message },
        });
      }
      return false;
    }
  },

  examples: [
    [
      {
        user: '{{user}}',
        content: {
          text: 'RECOMMEND ACTION for TOKEN $ETH for wallet address 0x6c34C667632dC1aAF04F362516e6F44D006A58fa with WEEKLY check frequency, AGGRESSIVE risk, and GROWTH investment objective',
        },
      },
      {
        user: '{{agent}}',
        content: {
          text: 'Analyzing $ETH for 0x6c34C667632dC1aAF04F362516e6F44D006A58fa.',
          action: 'RECOMMEND_TOKEN_ACTION',
        },
      },
      {
        user: '{{agent}}',
        content: {
          text: 'Portfolio of wallet 0x6c34C667632dC1aAF04F362516e6F44D006A58fa has a great mixture allocation between stablecoins and large cap like $ETH.',
          content: {
            action: 'REBALANCE',
            reason:
              '$ETH has been under-performed for the last 1 weeks and is on it way to be down more.',
            actionPayload: {
              tokenIn: '$USDC',
              amountOutPercentage: 100,
            },
          } as TokenAnalysis,
        },
      },
    ],
    [
      {
        user: '{{user}}',
        content: {
          text: 'RECOMMEND ACTION for TOKEN $MORPHO for wallet address 0x6c34C667632dC1aAF04F362516e6F44D006A58fa with WEEKLY check frequency, AGGRESSIVE risk, and GROWTH investment objective',
        },
      },
      {
        user: '{{agent}}',
        content: {
          text: 'Analyzing $MORPHO for 0x6c34C667632dC1aAF04F362516e6F44D006A58fa.',
          action: 'RECOMMEND_TOKEN_ACTION',
        },
      },
      {
        user: '{{agent}}',
        content: {
          text: '$MORPHO has been under-performed for the last 1 weeks, but still have strong long-term potential. Keep holding it.',
          content: {
            action: 'HOLD',
            reason:
              '$MORPHO has been under-performed for the last 1 weeks, but still have strong long-term potential. Keep holding it.',
            actionPayload: null,
          } as TokenAnalysis,
        },
      },
    ],
  ] as ActionExample[][],
} as Action;
