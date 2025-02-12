import type { Plugin } from '@elizaos/core';
import { analyzePortfolio } from './actions/analyzePortfolio.ts';

// Export the plugin configuration
export const chainsmithPlugin: Plugin = {
  name: 'chainsmith',
  description: 'Chainsmith Plugin for Eliza',
  actions: [analyzePortfolio],
  evaluators: [],
  providers: [],
};

export default chainsmithPlugin;
