import 'reflect-metadata';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

import { BrowserRouter, Route, Routes } from 'react-router';
import Providers from './Providers';
import { Dashboard, Chat } from './screens';
import { AnimatedBackground } from './components/AnimatedBackground';
import './index.css';

function App() {
  return (
    <Providers>
      <Theme grayColor="gray" radius="large">
        <main className="w-full py-5 px-3 max-h-[100vh] overflow-hidden">
          <AnimatedBackground />
          <div className="h-full relative flex flex-col items-center">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Dashboard />} />
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
