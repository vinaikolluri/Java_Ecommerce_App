import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, clearToken } from '../utils/JWT_Token'; // Ensure clearToken is imported

// Create AuthContext
export const AuthContext = createContext();

// Create useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [buyer, setBuyer] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = getToken(); // Use getToken to retrieve the token

      if (token) {
        const buyerDetails = JSON.parse(localStorage.getItem('buyer'));
        const adminDetails = JSON.parse(localStorage.getItem('admin'));

        setBuyer(buyerDetails);
        setAdmin(adminDetails);
        setIsAuthenticated(true);
      } else {
        setBuyer(null);
        setAdmin(null);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  const logout = () => {
    localStorage.clear();
    clearToken();
    setBuyer(null);
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const loginBuyer = buyerDetails => {
    localStorage.setItem('buyer', JSON.stringify(buyerDetails));
    setBuyer(buyerDetails);
    setAdmin(null);
  };

  const loginAdmin = adminDetails => {
    if (adminDetails.role === 'Admin') {
      localStorage.setItem('admin', JSON.stringify(adminDetails));
      setAdmin(adminDetails);
      setBuyer(null);
    }
  };
  

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        buyer,
        admin,
        loginBuyer,
        loginAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
