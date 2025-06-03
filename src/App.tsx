import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import SelectTeams from './components/SelectTeams'
import './App.css'
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isLoading } = useAuth0();
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
      <Router>
        <div >
          <Navbar />
          <main className='main'>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/select-teams" element={<SelectTeams />} />
              
            </Routes>
          </main>
        </div>
      </Router>
  )
}

export default App
