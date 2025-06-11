import './Navbar.css';

const OfflineNavbar = () => {

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-title">
            {"Team Tracker"
            }
        </li>
        <li>
           <span className="navbar-link">Dashboard</span>

        </li>
        <li>
            <span className="navbar-link ">Select Teams</span>
        </li>
        <li>
            <button>Log In</button>
        </li>
      </ul>
    </nav>
  );
};

export default OfflineNavbar; 