import { PrivyClientConfig } from '@privy-io/react-auth';

export const privyClientConfig: PrivyClientConfig = {
  loginMethods: ['email', 'wallet'],
  appearance: {
    theme: 'light',
    accentColor: '#676FFF',
    logo: 'your-logo-url',
  },
  embeddedWallets: {
    createOnLogin: 'all-users',
    showWalletUIs: true,
  },
};
