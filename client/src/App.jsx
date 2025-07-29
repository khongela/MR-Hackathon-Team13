import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthContext from './components/context/AuthContext';

// Import Components and Stylesheets...
import Header from './components/Header.jsx';
import AlertsDashboard from './components/AlertsDashboard.jsx';
import UserProfile from './components/UserProfile.jsx';
import LandingPage from './components/auth/LandingPage.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import RegisterPage from './components/auth/RegisterPage.jsx';
import ProtectedRoute from './components/context/ProtectedRoute.jsx'; // <-- Import ProtectedRoute

// Import Stylesheets...
import './components/Header.css';
import './components/AlertsDashboard.css';
import './components/UserProfile.css';
import './components/auth/LandingPage.css';
import './components/auth/Auth.css';


function App() {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} user={user} />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/alerts" element={<AlertsDashboard />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;