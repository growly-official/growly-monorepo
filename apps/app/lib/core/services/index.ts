import axios from 'axios';
import {
  TAddress,
  TChainName,
  TMultichain,
  TTokenPortfolio,
  TTokenTransferActivity,
} from 'chainsmith/src/types';

const BACKEND_SERVER_URL = 'http://localhost:3000';

export class PortfolioApiService {
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
}
