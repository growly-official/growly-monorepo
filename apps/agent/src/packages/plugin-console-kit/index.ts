import { Plugin } from '@elizaos/core';
import { sendAction } from './actions/send.ts';
import { bridgeAction } from './actions/bridge.ts';
import { swapAction } from './actions/swap.ts';
import { bridgeStatusAction } from './actions/status.ts';
import { ConsoleKitService } from './services/console.ts';

export const consoleKitPlugin: Plugin = {
  name: 'console-kit',
  description: 'Provides blockchain operations through ConsoleKit',
  actions: [sendAction, bridgeAction, swapAction, bridgeStatusAction],
  evaluators: [],
  providers: [],
  services: [new ConsoleKitService()],
};

export default consoleKitPlugin;
