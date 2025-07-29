import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext();

const API_URL = 'http://localhost:3500/api/v1/auth'; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if a token exists and try to validate it or fetch user data
    const userProfile = localStorage.getItem('user');
    if (token && userProfile) {
      setUser(JSON.parse(userProfile));
    }
    setLoading(false);
  }, [token]);

  // --- Login Function ---
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        
        // Navigate to the dashboard
        navigate('/alerts');
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'An error occurred. Please try again.' };
    }
  };

  // --- Register Function ---
  const register = async (name, email, password, address) => {
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, address }),
        });

        const data = await response.json();

        if (data.success) {
            // Optionally, log the user in directly after registration
            // For now, we'll just redirect to the login page with a success message
            navigate('/login'); 
            return { success: true, message: 'Registration successful! Please log in.' };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        return { success: false, message: 'An error occurred during registration.' };
    }
  };


  // --- Logout Function ---
  const logout = () => {
    // Clear storage and state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const authContextValue = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;