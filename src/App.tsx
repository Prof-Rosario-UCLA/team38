import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import SelectTeams from './components/SelectTeams'
import './App.css'
import { useAuth0 } from "@auth0/auth0-react";
import { useServiceWorker } from './customHooks/useServiceWorker'
import { OfflineIndicator } from './components/OfflineIndicator'
import {InstallPrompt} from './components/InstallPrompt'
import {UpdatePrompt} from './components/UpdatePrompt'


function App() {
  const { isLoading } = useAuth0();

  useServiceWorker();
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
      <Router>
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Navbar />
          <main className='main' style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/select-teams" element={<SelectTeams />} />
              
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
