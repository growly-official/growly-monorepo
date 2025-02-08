import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

import Providers from './Providers';
import { Dashboard } from './screens';

function App() {
  return (
    <Providers>
      <Theme accentColor={'white' as any}>
        <main className="container">
          <Dashboard />
        </main>
      </Theme>
    </Providers>
  );
}

export default App;
