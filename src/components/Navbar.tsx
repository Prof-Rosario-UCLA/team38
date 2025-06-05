import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const loginButton = <button onClick={() => loginWithRedirect()}>Log In</button>;
  const logoutButton = <button className="logout-button" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Log Out</button>;
  console.log(user?.email);

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-title">
            {isAuthenticated ? (
            `${user?.name}'s Team Tracker` ) : (
            "Team Tracker"
            )}
        </li>
        <li>
          <NavLink to="/" className="navbar-link" end>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/select-teams" className="navbar-link">
            Select Teams
          </NavLink>
        </li>
        <li>
            {isAuthenticated ? (
                logoutButton
            ) : (
              loginButton
            )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 