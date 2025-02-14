import 'reflect-metadata';
import { Theme } from '@radix-ui/themes';
import './stakekit.css';
import '@radix-ui/themes/styles.css';

import { BrowserRouter, Route, Routes } from 'react-router';
import Providers from './Providers';
import { GettingStarted, Chat } from './screens';
import { AnimatedBackground } from './components/AnimatedBackground';
import './index.css';

function App() {
  return (
    <Providers>
      <Theme grayColor="gray" radius="large">
        <main className="w-full py-5 px-3 max-h-[100vh] overflow-hidden">
          <AnimatedBackground />
          <div className="flex justify-between w-full items-center px-10">
            <div className="mb-3 flex items-center gap-4">
              <img src="/logo.png" width={30} className="rounded-[5px]" />
              <h2 className="text-lg font-bold">Growly</h2>
            </div>
            <a
              className="font-bold hover:text-orange-500"
              href="https://github.com/growly-official/growly-monorepo">
              Github
            </a>
          </div>
          <div className="h-full relative flex flex-col items-center">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<GettingStarted />} />
                <Route path="chat/:agentId" element={<Chat />} />
              </Routes>
            </BrowserRouter>
          </div>
        </main>
      </Theme>
    </Providers>
  );
}

export default App;
