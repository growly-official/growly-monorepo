import {
  type IAgentRuntime,
  type ICacheManager,
  type Memory,
  type Provider,
  type State,
  elizaLogger,
} from '@elizaos/core';
import { DeriveKeyProvider, TEEMode } from '@elizaos/plugin-tee';
import NodeCache from 'node-cache';
import * as path from 'node:path';
import type { Address, PrivateKeyAccount } from 'viem';
import { formatUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import { alchemy } from 'chainsmith-sdk/src/rpc';
import { TChain, TChainName, TClient, TWalletClient } from 'chainsmith-sdk/src/types';
import { buildEvmChains, getChainByName } from 'chainsmith-sdk/src/utils';
import { createClient, createWalletClient } from 'chainsmith-sdk/src/wrapper';

export class WalletProvider {
  private cache: NodeCache;
  private cacheKey = 'evm/wallet';
  private CACHE_EXPIRY_SEC = 5;
  chains: TChain[];
  account: PrivateKeyAccount;

  constructor(
    accountOrPrivateKey: PrivateKeyAccount | `0x${string}`,
    private cacheManager: ICacheManager,
    chains: TChain[]
  ) {
    this.chains = chains;
    this.setAccount(accountOrPrivateKey);
    this.cache = new NodeCache({ stdTTL: this.CACHE_EXPIRY_SEC });
  }

  getAddress(): Address {
    return this.account.address;
  }

  getPublicClient(chainName: TChainName): TClient {
    const chain = getChainByName(chainName);
    return createClient({ chain });
  }

  async getENSName(): Promise<string> {
    const publicClient = this.getPublicClient('mainnet');
    const ensName = await publicClient.getEnsName({
      address: this.getAddress(),
    });

    return ensName;
  }

  getWalletClient(chainName: TChainName): TWalletClient {
    const chain = getChainByName(chainName);
    return createWalletClient({ chain, account: this.account as any }); // TODO: Debug why error?
  }

  async getChainWalletBalance(chainName: TChainName): Promise<string | null> {
    const cacheKey = `walletBalance_${chainName}`;
    const cachedData = await this.getCachedData<string>(cacheKey);
    if (cachedData) {
      elizaLogger.log(`Returning cached wallet balance for chain: ${chainName}`);
      return cachedData;
    }

    try {
      const client = this.getPublicClient(chainName);

      const balance = await client.getBalance({
        address: this.getAddress(),
      });

      const balanceFormatted = formatUnits(balance, 18);
      this.setCachedData<string>(cacheKey, balanceFormatted);
      elizaLogger.log('Wallet balance cached for chain: ', chainName);
      return balanceFormatted;
    } catch (error: any) {
      console.error('Error getting wallet balance:', error);
      return null;
    }
  }

  private async readFromCache<T>(key: string): Promise<T | null> {
    const cached = await this.cacheManager.get<T>(path.join(this.cacheKey, key));
    return cached;
  }

  private async writeToCache<T>(key: string, data: T): Promise<void> {
    await this.cacheManager.set(path.join(this.cacheKey, key), data, {
      expires: Date.now() + this.CACHE_EXPIRY_SEC * 1000,
    });
  }

  private async getCachedData<T>(key: string): Promise<T | null> {
    // Check in-memory cache first
    const cachedData = this.cache.get<T>(key);
    if (cachedData) {
      return cachedData;
    }

    // Check file-based cache
    const fileCachedData = await this.readFromCache<T>(key);
    if (fileCachedData) {
      // Populate in-memory cache
      this.cache.set(key, fileCachedData);
      return fileCachedData;
    }

    return null;
  }

  private async setCachedData<T>(cacheKey: string, data: T): Promise<void> {
    // Set in-memory cache
    this.cache.set(cacheKey, data);

    // Write to file-based cache
    await this.writeToCache(cacheKey, data);
  }

  private setAccount = (accountOrPrivateKey: PrivateKeyAccount | `0x${string}`) => {
    if (typeof accountOrPrivateKey === 'string') {
      this.account = privateKeyToAccount(accountOrPrivateKey);
    } else {
      this.account = accountOrPrivateKey;
    }
  };
}

export const initWalletProvider = async (runtime: IAgentRuntime) => {
  const teeMode = runtime.getSetting('TEE_MODE') || TEEMode.OFF;
  const chainNames = (runtime.character.settings.chains?.evm as TChainName[]) || ['mainnet'];
  const ALCHEMY_API_KEY = runtime.getSetting('ALCHEMY_API_KEY');

  const chains = buildEvmChains(chainNames, alchemy(ALCHEMY_API_KEY));

  if (teeMode !== TEEMode.OFF) {
    const walletSecretSalt = runtime.getSetting('WALLET_SECRET_SALT');
    if (!walletSecretSalt) {
      throw new Error('WALLET_SECRET_SALT required when TEE_MODE is enabled');
    }

    const deriveKeyProvider = new DeriveKeyProvider(teeMode);
    const deriveKeyResult = await deriveKeyProvider.deriveEcdsaKeypair(
      walletSecretSalt,
      'evm',
      runtime.agentId
    );
    return new WalletProvider(deriveKeyResult.keypair, runtime.cacheManager, chains);
  } else {
    const privateKey = runtime.getSetting('EVM_PRIVATE_KEY') as `0x${string}`;
    if (!privateKey) {
      throw new Error('EVM_PRIVATE_KEY is missing');
    }
    return new WalletProvider(privateKey, runtime.cacheManager, chains);
  }
};

export const evmWalletProvider: Provider = {
  async get(runtime: IAgentRuntime, _message: Memory, state?: State): Promise<string | null> {
    try {
      const currentChain = state?.currentChain as TChainName;
      const walletProvider = await initWalletProvider(runtime);
      const address = walletProvider.getAddress();
      const balance = walletProvider.getChainWalletBalance(currentChain);

      const chain = getChainByName(currentChain);

      const agentName = state?.agentName || 'The agent';
      return `${agentName}'s EVM Wallet Address: ${address}\nBalance: ${balance} ${chain.nativeCurrency.symbol}\nChain ID: ${chain.id}, Name: ${chain.name}`;
    } catch (error) {
      console.error('Error in EVM wallet provider:', error);
      return null;
    }
  },
};
