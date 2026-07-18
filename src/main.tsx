import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { verifyConnection } from './lib/supabase.ts'

// Verify Supabase connection on startup
verifyConnection().then(res => {
  if (res.connected) {
    console.log('✓ Supabase connection successfully verified.');
  } else {
    console.warn('✗ Supabase connection verification failed:', res.error);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
