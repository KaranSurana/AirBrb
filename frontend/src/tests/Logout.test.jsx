import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext.jsx';
import NavigationBar from '../components/admin/Navbar.jsx';
import LogoutModal from '../components/admin/Logout.jsx';

// Mock navigating across pages
const mockedNavigate = jest.fn();
const mockHandleLogoutSuccess = jest.fn();

// Mock navigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const MockNavigationBarWithModal = ({ isLoggedIn }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ isLoggedIn, handleLogoutSuccess: mockHandleLogoutSuccess }}>
        <NavigationBar />
        <LogoutModal show={showModal} onHide={() => setShowModal(false)} />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('LogoutModal Component', () => {
  it('opens and interacts with logout modal', () => {
    render(<MockNavigationBarWithModal isLoggedIn={true} />);

    // click on logout
    fireEvent.click(screen.getByTestId('logout-button'));

    // check modal appears
    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();

    // log out
    fireEvent.click(screen.getByText('Confirm Logout'));

    // there should be no user token stored after logout
    expect(localStorage.getItem('userToken')).toBeNull();
  });
});
