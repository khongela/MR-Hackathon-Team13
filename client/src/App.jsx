import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Component Stylesheets
import './components/Header.css';
import './components/AlertsDashboard.css';
import './components/UserProfile.css';

// Import Components
import Header from './components/Header.jsx';
import AlertsDashboard from './components/AlertsDashboard.jsx';
import UserProfile from './components/UserProfile.jsx';

function App() {
  return (
    <div>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<AlertsDashboard />} />
          <Route path="/alerts" element={<AlertsDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;