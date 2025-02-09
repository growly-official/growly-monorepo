import axios from 'axios';
import { TAddress, TChainName, TTokenPortfolio } from 'chainsmith/src/types';

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
}
