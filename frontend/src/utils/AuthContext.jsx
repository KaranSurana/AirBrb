/*
* Auth Context for Rendering navigation bar correctly
* creates contexts, handles success for login, register and log out
* stores token and email into local storage
*
*/
import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkToken = () => {
    const token = localStorage.getItem('userToken');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkToken();

    const handleStorageChange = () => {
      checkToken();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLoginSuccess = (token, email) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userEmail', email);
    setIsLoggedIn(true);
  };

  const handleLogoutSuccess = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
  };

  const handleRegisterSuccess = (token, email) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userEmail', email);
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, handleLoginSuccess, handleLogoutSuccess, handleRegisterSuccess }}>
    {children}
    </AuthContext.Provider>
  );
};
