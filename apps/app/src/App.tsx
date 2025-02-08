import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

import Providers from './Providers';
import { Dashboard } from './screens';

function App() {
  return (
    <Providers>
      <Theme accentColor="teal" grayColor="gray" radius="large" scaling="95%">
        <main className="container">
          <Dashboard />
        </main>
      </Theme>
    </Providers>
  );
}

export default App;
