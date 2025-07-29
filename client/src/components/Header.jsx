import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import AuthContext from '../components/context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">

          <Link to={isAuthenticated ? "/alerts" : "/"} className="header-title-link">
            <h1 className="header-title">TravelRisk Monitor</h1>
          </Link>
          {isAuthenticated && (
            <nav className="header-nav">
              <NavLink to="/alerts" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Alerts Dashboard
              </NavLink>
              <NavLink
              to="/destinations"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Monitored Destinations
            </NavLink>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Profile & Preferences
              </NavLink>
            </nav>
          )}

        </div>
        <div className="header-right">
          {isAuthenticated && user ? (
            <>
              <span className="user-name">{user.name}</span>
              <button onClick={logout} className="btn btn-secondary">Logout</button>
            </>
          ) : (
            <div className="auth-actions">
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
