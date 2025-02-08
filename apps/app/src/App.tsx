import MultichainPortfolio from './Portfolio';
import { Wallets } from 'chainsmith/src/data';
import { buildEvmChains } from 'chainsmith/src/utils';
import { alchemy } from 'chainsmith/src/rpc';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

function App() {
  return (
    <main className="container">
      <Theme>
        <MultichainPortfolio
          address={Wallets.ETH_MAINNET_WALLET_VITALIK}
          chainList={
            // TODO: In production, chain type builder should not be used directly.
            buildEvmChains(['base', 'mainnet'], alchemy(''))
          }
        />
      </Theme>
    </main>
  );
}

export default App;
