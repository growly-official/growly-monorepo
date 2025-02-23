import { TAddress } from 'chainsmith-sdk/src/types';
import { sepolia } from 'viem/chains';
import { createWalletClient, custom } from 'viem';
import { createSmartAccountClient } from 'permissionless';
import { toSafeSmartAccount } from 'permissionless/accounts';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { createPublicClient, http } from 'viem';
import { entryPoint07Address } from 'viem/account-abstraction';
import { ConnectedWallet } from '@privy-io/react-auth';

const PIMILIC_API_URL = `https://api.pimlico.io/v2/sepolia/rpc?apikey=<PIMLICO_API_KEY>`;

export async function initSafeSmartAccount(
  wallets: ConnectedWallet[],
  preExistingSafeAccount?: TAddress
) {
  const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy');
  if (!embeddedWallet) return;
  const eip1193provider = await embeddedWallet.getEthereumProvider();

  // Create a viem WalletClient from the embedded wallet's EIP1193 provider
  // This will be used as the signer for the user's smart account
  const privyClient = createWalletClient({
    account: embeddedWallet.address as TAddress,
    chain: sepolia,
    transport: custom(eip1193provider),
  });

  // Create a viem public client for RPC calls
  const publicClient = createPublicClient({
    chain: sepolia, // Replace this with the chain of your app
    transport: http(),
  });

  // Create the Paymaster for gas sponsorship using the API key from your Pimlico dashboard
  const paymasterClient = createPimlicoClient({
    transport: http(PIMILIC_API_URL),
    entryPoint: {
      address: entryPoint07Address,
      version: '0.7',
    },
  });

  // Initialize the smart account for the user
  const safeSmartAccount = await toSafeSmartAccount({
    client: publicClient,
    entryPoint: {
      address: entryPoint07Address,
      version: '0.7',
    },
    owners: [privyClient.account],
    saltNonce: 0n, // optional
    version: '1.4.1',
    // optional, only if you are using an already created account
    address: preExistingSafeAccount,
  });

  // Create the SmartAccountClient for requesting signatures and transactions (RPCs)
  const smartAccountClient = createSmartAccountClient({
    account: safeSmartAccount,
    chain: sepolia,
    paymaster: paymasterClient,
    bundlerTransport: http(PIMILIC_API_URL),
    userOperation: {
      estimateFeesPerGas: async () => (await paymasterClient.getUserOperationGasPrice()).fast,
    },
  });

  return {
    privyClient,
    smartAccountClient,
  } as any;
}
