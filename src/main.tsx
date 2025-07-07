import React from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';

import { initResponsive } from './lib/responsive.ts';
import AppRouter from './AppRouter.tsx';
import './index.css';
import { AppKitProvider } from './AppkitProvider.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

initResponsive();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';
// if (!PUBLISHABLE_KEY) {
// throw new Error('Add your Clerk Publishable Key to the .env file')
// }

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppKitProvider>
      <Provider store={store}>  

      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <AppRouter />
      </ClerkProvider>
      </Provider>
    </AppKitProvider>
  </React.StrictMode>
);
