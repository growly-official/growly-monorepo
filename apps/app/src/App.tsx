import MultichainPortfolio from './Portfolio';
import { Wallets, EvmChainList } from 'chainsmith/src/data';
import { ChainTypeBuilder } from 'chainsmith/src/wrapper';

const { mainnet, base } = EvmChainList;

function App() {
  return (
    <main className="container">
      <MultichainPortfolio
        address={Wallets.ETH_MAINNET_WALLET_VITALIK}
        chainList={[
          // TODO: In production, chain type builder should not be used directly.
          new ChainTypeBuilder(mainnet).withEcosystem('evm').build(),
          new ChainTypeBuilder(base).withEcosystem('evm').build(),
        ]}
      />
    </main>
  );
}

export default App;
