import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WagmiProvider } from 'wagmi';
import { privyClientConfig, wagmiConfig } from './configs';

const queryClient = new QueryClient();

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider
          appId={import.meta.env.VITE_PRIVY_APP_ID as any}
          clientId={import.meta.env.VITE_PRIVY_CLIENT_ID as any}
          config={privyClientConfig}>
          {children}
        </PrivyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
