// import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { QueryClient} from "@tanstack/react-query"
import { ReactQueryDevtools} from "@tanstack/react-query-devtools"
import './index.css'
import '/animated-grid.css'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

// 1. the query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

// 2. the persister
const persister = createSyncStoragePersister({
  storage: window.localStorage,
  throttleTime: 10,

})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister }}
    >
      <App />
      <ReactQueryDevtools />
    </PersistQueryClientProvider>

  </StrictMode>
)
  