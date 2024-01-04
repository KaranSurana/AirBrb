import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext.jsx';
import NavigationBar from '../components/admin/Navbar.jsx';

const mockedNavigate = jest.fn();

// Mock navigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const MockNavigationBar = ({ isLoggedIn }) => {
  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ isLoggedIn }}>
        <NavigationBar />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('NavigationBar Component', () => {
  it('renders navbar', () => {
    render(<MockNavigationBar isLoggedIn={false} />);
    expect(screen.getByText('AirBrB')).toBeInTheDocument();
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      render(<MockNavigationBar isLoggedIn={true} />);
    });

    it('shows logout and listing options', () => {
      expect(screen.getByText('Hosted Listings')).toBeInTheDocument();
      expect(screen.getByText('Create Listing')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('navigates to hosted listings on click', () => {
      fireEvent.click(screen.getByText('Hosted Listings'));
      expect(mockedNavigate).toHaveBeenCalledWith('/hosted-listings');
    });

    it('navigates to create listings on click', () => {
      fireEvent.click(screen.getByText('Create Listing'));
      expect(mockedNavigate).toHaveBeenCalledWith('/new-listing');
    });

    it('shows the search icon', () => {
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    });

    it('shows the search icon', () => {
      fireEvent.click(screen.getByTestId('search-icon'));
    });
  });

  describe('when user is not logged in', () => {
    beforeEach(() => {
      render(<MockNavigationBar isLoggedIn={false} />);
    });

    it('shows login and register options', () => {
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('navigates to login on click', () => {
      fireEvent.click(screen.getByText('Login'));
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });

    it('navigates to register on click', () => {
      fireEvent.click(screen.getByText('Register'));
      expect(mockedNavigate).toHaveBeenCalledWith('/register');
    });
  });
});
