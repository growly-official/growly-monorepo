import type { Meta, StoryObj } from '@storybook/react';

import ChainListItem from './ChainListItem';
import { EvmChainList } from 'chainsmith-data';
import { ChainTypeBuilder } from 'chainsmith-core';

const meta: Meta<typeof ChainListItem> = {
  component: ChainListItem,
};

export default meta;

type Story = StoryObj<typeof ChainListItem>;

export const Default: Story = {
  args: {
    chain: new ChainTypeBuilder(EvmChainList.mainnet).withEcosystem('evm').build(),
  },
};
