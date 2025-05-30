import { Link } from 'react-router-dom';
import './Navbar.css';
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const loginButton = <button onClick={() => loginWithRedirect()}>Log In</button>;
  const logoutButton = <button className="logout-button" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log Out</button>;

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
        <li className="user-menu-container">
            {isAuthenticated ? (
              <>
                <span>{user?.name}</span>
                {logoutButton}
              </>
            ) : (
              loginButton
            )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 