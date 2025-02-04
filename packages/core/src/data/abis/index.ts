export * from './erc20';
export * from './uniswapV2Pool';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import IUniswapV3FactoryABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json';

export const UniswapQuoterAbi = Quoter.abi;
export const UniswapV3PoolAbi = IUniswapV3PoolABI.abi;
export const UniswapV3FactoryAbi = IUniswapV3FactoryABI.abi;
