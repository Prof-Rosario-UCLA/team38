import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react';


if ('serviceWorker' in navigator) {
 window.addEventListener('load', () => {
   navigator.serviceWorker.register('/sw.js').then(registration => {
     console.log('Service Worker registered:', registration);
   }).catch(error => {
     console.error('Service Worker registration failed:', error);
   });
 });
}


createRoot(document.getElementById('root')!).render(
<Auth0Provider
    domain="dev-xpnf7yfmpc5q8gzq.us.auth0.com"
    clientId="G4TWgnBoaSffimSQbw3HEbVZA3cfMgqu"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
)
