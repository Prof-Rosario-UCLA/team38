import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import SelectTeams from './components/SelectTeams'
import SignIn from './components/SignIn'
import './App.css'

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <main className='main'>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/select-teams" element={<SelectTeams />} />
            <Route path="/sign-in" element={<SignIn />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
