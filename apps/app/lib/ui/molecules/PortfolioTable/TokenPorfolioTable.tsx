import { formatNumberUSD } from '@/core';
import { Table } from '@radix-ui/themes';
import { TMultichain, TMarketTokenList, TChainName } from 'chainsmith/src/types';
import React from 'react';
import ChainIcon from '../ChainIcon/ChainIcon';
import TokenRisktBadge from '../TokenRiskBadge/TokenRisktBadge';
import { getChainByName, getChainIdByName } from 'chainsmith/src/utils';
import Countup from 'react-countup';
import { Button, TooltipContainer } from '../../atoms';
import { ScanSearchIcon } from 'lucide-react';
import SwapButton from '../SwapButton/SwapButton';

type Props = {
  multichainTokenData: TMultichain<TMarketTokenList>;
};

const TokenPortfolioTable = ({ multichainTokenData }: Props) => {
  return (
    <React.Fragment>
      {Object.entries(multichainTokenData).map(([chainName, { tokens, totalUsdValue }]) => (
        <div className="mb-10">
          <div className="flex gap-2 justify-center items-center border border-slate-200 w-fit rounded-xl py-1 px-3 shadow-md">
            <ChainIcon size={20} chainName={chainName as TChainName} />
            <h3 className="font-bold">{getChainByName(chainName as TChainName).name}</h3>
            <h3 className="text-sm ml-4">
              <Countup end={totalUsdValue} duration={4} formattingFn={formatNumberUSD} />
            </h3>
          </div>
          <Table.Root className="rounded-xl mt-3">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Token</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Risk</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>USD Value</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Market Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Total Balance</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tokens.map(token => (
                <Table.Row key={token.symbol}>
                  <Table.Cell>
                    <img
                      src={token.logoURI}
                      alt={`${token.name} logo`}
                      className="mr-3 inline-block h-8 w-8 rounded-full"
                    />
                    {token.name}
                  </Table.Cell>
                  <Table.Cell>
                    <TokenRisktBadge risk={token.marketRank || 0} />
                  </Table.Cell>
                  <Table.Cell>
                    <Countup end={token.usdValue} duration={4} formattingFn={formatNumberUSD} />
                  </Table.Cell>
                  <Table.Cell>{formatNumberUSD(token.marketPrice)}</Table.Cell>
                  <Table.Cell>{token.balance.toFixed(Math.min(token.decimals, 5))}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <SwapButton
                        token={token}
                        supportedChains={Object.keys(multichainTokenData).map(chainName =>
                          getChainIdByName(chainName as any)
                        )}
                      />
                      <TooltipContainer
                        tooltipId={`${token.chainId}-${token.name}-analyze`}
                        tooltipContent={'Analyze'}>
                        <Button size={'2'} color="teal">
                          <ScanSearchIcon size={10} />
                        </Button>
                      </TooltipContainer>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
      ))}
    </React.Fragment>
  );
};

export default TokenPortfolioTable;
