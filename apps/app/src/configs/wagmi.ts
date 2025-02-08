import { http, createConfig, Config } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export const wagmiConfig: Config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
