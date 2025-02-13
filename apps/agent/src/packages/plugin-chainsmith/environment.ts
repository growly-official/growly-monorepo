import type { IAgentRuntime } from '@elizaos/core';
import { z } from 'zod';

export const chainsmithEnvSchema = z
  .object({
    EVM_PRIVATE_KEY: z.string().optional(),
  })
  .and(
    z.object({
      ALCHEMY_API_KEY: z.string().min(1, 'Alchemy URL is required'),
      COINMARKETCAP_API_KEY: z.string().min(1, 'Coinmarketcap API key is required'),
      ETHERSCAN_API_KEY: z.string().min(1, 'Etherscan API key is required'),
      TAVILY_API_KEY: z.string().min(1, 'Tavily API key is required'),
    })
  );

export type ChainmsithConfig = z.infer<typeof chainsmithEnvSchema>;

export async function validateChainmsithConfig(runtime: IAgentRuntime): Promise<ChainmsithConfig> {
  try {
    const config = {
      EVM_PRIVATE_KEY: runtime.getSetting('EVM_PRIVATE_KEY') || process.env.EVM_PRIVATE_KEY,
      ALCHEMY_API_KEY: runtime.getSetting('ALCHEMY_API_KEY') || process.env.ALCHEMY_API_KEY,
      COINMARKETCAP_API_KEY:
        runtime.getSetting('COINMARKETCAP_API_KEY') || process.env.COINMARKETCAP_API_KEY,
      ETHERSCAN_API_KEY: runtime.getSetting('ETHERSCAN_API_KEY') || process.env.ETHERSCAN_API_KEY,
      TAVILY_API_KEY: runtime.getSetting('TAVILY_API_KEY') || process.env.TAVILY_API_KEY,
    };

    return chainsmithEnvSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      throw new Error(`Chainsmith configuration validation failed:\n${errorMessages}`);
    }
    throw error;
  }
}
