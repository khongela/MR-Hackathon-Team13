import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext();

// Define the backend URLs
const AUTH_API_URL = 'http://localhost:3500/api/v1/auth'; 
const USER_API_URL = 'http://localhost:3500/api/v1/users'; // URL for user operations

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
      const response = await fetch(`${AUTH_API_URL}/login`, {
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
        const response = await fetch(`${AUTH_API_URL}/signup`, { // Corrected endpoint from your backend code
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, address }),
        });

        const data = await response.json();

        if (data.success) {
            navigate('/login'); 
            return { success: true, message: 'Registration successful! Please log in.' };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        return { success: false, message: 'An error occurred during registration.' };
    }
  };
  
  // --- NEW: Update User Function ---
  const updateUser = async (profileData) => {
    if (!user || !token) {
        return { success: false, message: 'Not authenticated.' };
    }
    try {
        // Assuming the endpoint is something like /users/ and uses PUT
        const response = await fetch(`${USER_API_URL}/put-user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Send the token for authentication
            },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();

        if (data.success) {
            // Update the user in the context and localStorage with the returned data
            const updatedUser = data.data;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return { success: true, user: updatedUser };
        } else {
            return { success: false, message: data.message || 'Failed to update profile.' };
        }

    } catch (error) {
        return { success: false, message: 'An error occurred while updating the profile.' };
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
    updateUser, // <-- Expose the new function
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;