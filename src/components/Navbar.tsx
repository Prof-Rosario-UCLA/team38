import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-title">
            My Team Tracker
        </li>
        <li>
          <Link to="/" className="navbar-link">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/select-teams" className="navbar-link">
            Select Teams
          </Link>
        </li>
        <li>
            <Link to="/sign-in" className="navbar-link">
                Sign In
            </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 