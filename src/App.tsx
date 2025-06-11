import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import OfflineNavbar from './components/OfflineNavbar'
import Dashboard from './components/Dashboard'
import SelectTeams from './components/SelectTeams'
import './App.css'
import { useAuth0 } from "@auth0/auth0-react";
import { useServiceWorker } from './customHooks/useServiceWorker'
import { OfflineIndicator } from './components/OfflineIndicator'
import {InstallPrompt} from './components/InstallPrompt'
import {UpdatePrompt} from './components/UpdatePrompt'
import { useEffect, useState } from 'react';

const OfflineFallback = () => (
  <div style={{ 
    padding: '2rem', 
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh'
  }}>
    <h2>You're Currently Offline</h2>
    <p>You are offline and not authenticated. Some features may not work.</p>
    <p>Please check your connection and try again.</p>
  </div>
);

function App() {
  const { isLoading, isAuthenticated } = useAuth0();
  const [isOnline, setIsOnline] = useState(navigator.onLine); 

  useServiceWorker();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  if (isLoading && isOnline) {
    return <div>Loading...</div>;
  }

  if (!isOnline && !isAuthenticated) {
    return (
      <div>
        <div>
          <OfflineIndicator />
          <div>
            <OfflineNavbar />
          </div>
        </div>
        <div>
          <OfflineIndicator />

        </div>
      </div>
    );
  }
  return (
    <Router>
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main className='main' style={{ flex: 1 }}>
          <Routes>
            <Route 
              path="/" 
              element={
                !isOnline && !isAuthenticated ? 
                <OfflineFallback /> : 
                <Dashboard />
              } 
            />
            <Route 
              path="/select-teams" 
              element={
                !isOnline && !isAuthenticated ? 
                <OfflineFallback /> : 
                <SelectTeams />
              } 
            />
          </Routes>
        </main>
        <OfflineIndicator />
        <InstallPrompt />
        <UpdatePrompt />
      </div>
    </Router>
  )
}

export default App
