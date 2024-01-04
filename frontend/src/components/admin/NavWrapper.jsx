/*
* Navbar Wrapper
*
* Navbar wrapper to implement in JSX so navbar is only displayed if user is not on the login or register page
*
*/
import React from 'react';
import { useLocation } from 'react-router-dom';
import NavigationBar from './Navbar';

export const NavigationWrapper = ({ children }) => {
  const location = useLocation();
  const showNavBar = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <>
      {showNavBar && <NavigationBar />}
      {children}
    </>
  );
};

export default NavigationWrapper;
