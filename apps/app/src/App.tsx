import 'reflect-metadata';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

import Providers from './Providers';
import { Dashboard } from './screens';
import { AnimatedBackground } from './components/AnimatedBackground';
import './index.css';

function App() {
  return (
    <Providers>
      <Theme grayColor="gray" radius="large">
        <main className="w-full py-5 px-3 max-h-[100vh] overflow-hidden">
          <AnimatedBackground />
          <div className="h-full relative flex flex-col items-center">
            <Dashboard />
          </div>
        </main>
      </Theme>
    </Providers>
  );
}

export default App;
