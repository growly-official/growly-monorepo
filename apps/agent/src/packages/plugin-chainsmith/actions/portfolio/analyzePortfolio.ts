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

import { evmPortfolioProvider } from '../../providers/portfolio.ts';
import { validateChainmsithConfig } from '../../environment.ts';
import { isAddress } from 'viem';
import { REVIEW_FREQUENCY, RISK_LEVEL, INVESTMENT_OBJECTIVE } from '../../types/index.ts';
import { processPortfolioInputTemplate, analyzePortfolioTemplate } from './templates.ts';

// Portfolio input schema
const PortfolioSchema = z.object({
  walletAddress: z.string().optional().nullable(),
  reviewFrequency: z.string().optional().nullable(),
  riskLevel: z.string().optional().nullable(),
  investmentObjective: z.string().optional().nullable(),
});

export interface PortfolioContent extends Content {
  walletAddress?: string;
  reviewFrequency?: string;
  riskLevel?: string;
  investmentObjective?: string;
}

const validatedSchema = z.object({
  walletAddress: z.string().refine(isAddress, { message: 'Invalid wallet address' }),
  reviewFrequency: z.enum(REVIEW_FREQUENCY),
  riskLevel: z.enum(RISK_LEVEL),
  investmentObjective: z.enum(INVESTMENT_OBJECTIVE),
});

// Analyze portfolio output schema
export interface PortfolioAnalysis extends Content {
  score?: number;
  summary?: string;
  successActions?: string[];
}

const PortfolioAnalysisSchema = z.object({
  score: z.number().optional().nullable(),
  summary: z.string().optional().nullable(),
  successActions: z.array(z.string().optional().nullable()),
});

export const analyzePortfolio: Action = {
  name: 'ANALYZE_PORTFOLIO',
  similes: ['EVALUATE_PORTFOLIO', 'GET_PORTFOLIO_EVALUATION'],
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

    // Compose portfolio context
    currentState.currentMessage = `${currentState.recentMessagesData[1].content.text}`;
    const portfolioContext = composeContext({
      state: currentState,
      template: processPortfolioInputTemplate,
    });

    // Generate portfolio content
    const portfolioContent = (
      await generateObject({
        runtime,
        context: portfolioContext,
        modelClass: ModelClass.SMALL,
        schema: PortfolioSchema,
      })
    ).object as PortfolioContent;

    try {
      const result = validatedSchema.safeParse({
        walletAddress: portfolioContent.walletAddress,
        reviewFrequency: portfolioContent.reviewFrequency,
        riskLevel: portfolioContent.riskLevel,
        investmentObjective: portfolioContent.investmentObjective,
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

      const walletAddress = portfolioContent.walletAddress;
      const reviewFrequency = portfolioContent.reviewFrequency;
      const riskLevel = portfolioContent.riskLevel;
      const investmentObjective = portfolioContent.investmentObjective;

      currentState.walletAddress = walletAddress;
      currentState.reviewFrequency = reviewFrequency;
      currentState.riskLevel = riskLevel;
      currentState.investmentObjective = investmentObjective;

      const portfolioReport = await evmPortfolioProvider.get(runtime, message, currentState);

      if (!portfolioReport) {
        elizaLogger.warn('PortfolioProvider did not return a result.');
      } else {
        elizaLogger.info('Get portfolioReport successfully!');
      }

      currentState.portfolioReport = portfolioReport;
      currentState = await runtime.updateRecentMessageState(currentState);

      elizaLogger.success(`Multichain-portfolio check completed for ${walletAddress}`);

      const portfolioAnalysisContext = composeContext({
        state: currentState,
        template: analyzePortfolioTemplate(
          portfolioReport,
          reviewFrequency,
          riskLevel,
          investmentObjective
        ),
      });

      // Generate portfolio analysis
      const portfolioAnalysis = (
        await generateObject({
          runtime,
          context: portfolioAnalysisContext,
          modelClass: ModelClass.LARGE,
          schema: PortfolioAnalysisSchema,
        })
      ).object as PortfolioAnalysis;

      elizaLogger.info('portfolioAnalysis', portfolioAnalysis);
      // Validate transfer content
      if (!portfolioAnalysis.score || !portfolioAnalysis.summary) {
        elizaLogger.error('Invalid output for ANALYZE_PORTFOLIO action.');
        if (callback) {
          callback({
            text: 'Unable to conduct portfolio analysis. Invalid content from LLM.',
            content: { error: 'Invalid portfolio content' },
          });
        }
        return false;
      }

      if (callback) {
        callback({
          text: `${portfolioAnalysis.summary}`,
          content: { portfolioAnalysis },
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
          text: 'Evaluate portfolio 0x6c34C667632dC1aAF04F362516e6F44D006A58fa with ',
        },
      },
      {
        user: '{{agent}}',
        content: {
          text: 'Evaluating portfolio 0x6c34C667632dC1aAF04F362516e6F44D006A58fa.',
          action: 'ANALYZE_PORTFOLIO',
        },
      },
      {
        user: '{{agent}}',
        content: {
          text: 'Portfolio of wallet 0x6c34C667632dC1aAF04F362516e6F44D006A58fa has a great mixture allocation between stablecoins and large cap like $ETH.',
          content: {
            score: 70,
            summary:
              'Portfolio of wallet 0x6c34C667632dC1aAF04F362516e6F44D006A58fa has a great mixture allocation between stablecoins and large cap like $ETH.',
            successActions: [
              'Swap more meme or lowcap coin but always less than 10% allocation',
              'Retain stablecoin allocation above 20%',
            ],
          } as PortfolioAnalysis,
        },
      },
    ],
  ] as ActionExample[][],
} as Action;
