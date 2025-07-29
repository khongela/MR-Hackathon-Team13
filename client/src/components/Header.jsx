import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="header-title">TravelRisk Monitor</h1>
          <nav className="header-nav">
            <NavLink
              to="/alerts"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Alerts Dashboard
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Profile & Preferences
            </NavLink>
          </nav>
        </div>
        <div className="header-right">
          <span className="user-name">Tumelo Mogano</span>
          <div className="user-avatar">TM</div>
        </div>
      </div>
    </header>
  );
};

export default Header;