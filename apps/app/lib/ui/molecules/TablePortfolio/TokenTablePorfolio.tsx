import { formatNumberUSD } from '@/core';
import { Table } from '@radix-ui/themes';
import { IMultichain, TChainTokenData } from 'chainsmith/src/types';
import React from 'react';

type Props = {
  multichainTokenData: IMultichain<TChainTokenData>;
};

const TokenPortfolioTable = ({ multichainTokenData }: Props) => {
  return (
    <Table.Root className="shadow-xl rounded-xl border border-palette-line/20">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Token</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>USD Value</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Chain</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Market Price</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Total Balance</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {Object.entries(multichainTokenData).map(([chainName, { tokens }]) => (
          <React.Fragment>
            {tokens.map(token => (
              <Table.Row key={token.symbol}>
                <Table.Cell>
                  <img
                    src={token.logoURI}
                    alt={`${token.name} logo`}
                    className="mr-1 inline-block h-6 w-6 rounded-full"
                  />
                  {token.name}
                </Table.Cell>
                <Table.Cell>{formatNumberUSD(token.usdValue)}</Table.Cell>
                <Table.Cell>{chainName}</Table.Cell>
                <Table.Cell>{formatNumberUSD(token.marketPrice)}</Table.Cell>
                <Table.Cell>{token.balance.toFixed(Math.min(token.decimals, 5))}</Table.Cell>
              </Table.Row>
            ))}
          </React.Fragment>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default TokenPortfolioTable;
