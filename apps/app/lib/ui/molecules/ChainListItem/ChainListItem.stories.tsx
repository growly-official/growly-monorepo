import type { Meta, StoryObj } from '@storybook/react';

import ChainListItem from './ChainListItem';
import { EvmChainList } from 'chainsmith-sdk/src/data';
import { ChainTypeBuilder } from 'chainsmith-sdk/src/wrapper';

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
