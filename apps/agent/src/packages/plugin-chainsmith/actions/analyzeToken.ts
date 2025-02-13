// import {
//   type ActionExample,
//   composeContext,
//   elizaLogger,
//   generateObjectDeprecated,
//   type HandlerCallback,
//   type IAgentRuntime,
//   type Memory,
//   ModelClass,
//   type State,
//   type Action,
// } from '@elizaos/core';

// import { tokenProvider } from '../providers/token';
// import { validateChainmsithConfig } from '../environment';

// const analyzeTokenTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

// Example response:
// \`\`\`json
// {
//     "tokenAddress": "<TOKEN_ADDRESS>",
//     "walletAddress": "<WALLET_ADDRESS>",
// }
// \`\`\`

// User message:
// "{{currentMessage}}"

// Given the message, extract the following information about the requested balance check:
// - Token contract address (optional, if not specified set to null)
// - Wallet address to check (optional, if not specified set to null)

// Respond with a JSON markdown block containing only the extracted values.`;

// export const priceCheck: Action = {
//   name: 'GET_PRICE',
//   similes: [
//     'CHECK_PRICE',
//     'PRICE_CHECK',
//     'GET_CRYPTO_PRICE',
//     'CRYPTO_PRICE',
//     'CHECK_CRYPTO_PRICE',
//     'PRICE_LOOKUP',
//     'CURRENT_PRICE',
//   ],
//   validate: async (runtime: IAgentRuntime, _message: Memory) => {
//     await validateChainmsithConfig(runtime);
//     return true;
//   },
//   description: 'Check token balance for a given address',
//   handler: async (
//     runtime: IAgentRuntime,
//     message: Memory,
//     state: State,
//     _options: Record<string, unknown>,
//     callback?: HandlerCallback
//   ): Promise<boolean> => {
//     try {
//       // Initialize or update state
//       let localState = state;
//       localState = !localState
//         ? await runtime.composeState(message)
//         : await runtime.updateRecentMessageState(localState);

//       const context = composeContext({
//         state: localState,
//         template: priceCheckTemplate,
//       });

//       const rawContent = await generateObjectDeprecated({
//         runtime,
//         context,
//         modelClass: ModelClass.SMALL,
//       });

//       if (!rawContent?.symbol) {
//         throw new Error('Could not determine which cryptocurrency to check');
//       }

//       // Ensure the content has the required shape
//       const content = {
//         symbol: rawContent.symbol.toString().toUpperCase().trim(),
//         quoteCurrency: (rawContent.quoteCurrency || 'USDT').toString().toUpperCase().trim(),
//       };

//       if (content.symbol.length < 2 || content.symbol.length > 10) {
//         throw new Error('Invalid cryptocurrency symbol');
//       }

//       const binanceService = new BinanceService();
//       const priceData = await binanceService.getPrice(content);

//       if (callback) {
//         callback({
//           text: `The current ${content.symbol} price is ${BinanceService.formatPrice(priceData.price)} ${content.quoteCurrency}`,
//           content: priceData,
//         });
//       }

//       return true;
//     } catch (error) {
//       elizaLogger.error('Error in price check:', error);
//       if (callback) {
//         const errorMessage = error.message.includes('Invalid API key')
//           ? 'Unable to connect to Binance API'
//           : error.message.includes('Invalid symbol')
//             ? 'Sorry, could not find price for the cryptocurrency symbol you provided'
//             : `Sorry, I encountered an error: ${error.message}`;

//         callback({
//           text: errorMessage,
//           content: { error: error.message },
//         });
//       }
//       return false;
//     }
//   },
//   examples: [
//     [
//       {
//         user: '{{user1}}',
//         content: {
//           text: "What's the current price of Bitcoin?",
//         },
//       },
//       {
//         user: '{{agent}}',
//         content: {
//           text: "I'll check the current Bitcoin price for you right away.",
//           action: 'GET_PRICE',
//         },
//       },
//       {
//         user: '{{agent}}',
//         content: {
//           text: 'The current BTC price is 42,150.25 USDT',
//         },
//       },
//     ],
//     [
//       {
//         user: '{{user1}}',
//         content: {
//           text: 'Can you check ETH price in EUR?',
//         },
//       },
//       {
//         user: '{{agent}}',
//         content: {
//           text: "I'll fetch the current Ethereum price in euros for you.",
//           action: 'GET_PRICE',
//         },
//       },
//       {
//         user: '{{agent}}',
//         content: {
//           text: 'The current ETH price is 2,245.80 EUR',
//         },
//       },
//     ],
//   ] as ActionExample[][],
// } as Action;
