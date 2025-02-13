import axios from 'axios';
import {
  TAddress,
  TChainMetadataListResponse,
  TChainName,
  TMultichain,
  TTokenPortfolio,
  TTokenTransferActivity,
} from 'chainsmith/src/types';

const BACKEND_SERVER_URL = 'http://localhost:3000';

export class ChainsmithApiService {
  async getWalletTokenPortfolio(
    walletAddress: TAddress,
    chainNames: TChainName[]
  ): Promise<TTokenPortfolio> {
    try {
      const response = await axios.post<TTokenPortfolio>(`${BACKEND_SERVER_URL}/portfolio`, {
        walletAddress,
        chainNames,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async listMultichainTokenTransferActivities(
    walletAddress: TAddress,
    chainNames: TChainName[]
  ): Promise<TMultichain<TTokenTransferActivity[]>> {
    try {
      const response = await axios.post<TMultichain<TTokenTransferActivity[]>>(
        `${BACKEND_SERVER_URL}/activity`,
        {
          walletAddress,
          chainNames,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getChainMetadataById(chainId: number): Promise<TChainMetadataListResponse> {
    try {
      const response = await axios.get<TChainMetadataListResponse>(
        `${BACKEND_SERVER_URL}/chainlist/${chainId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
