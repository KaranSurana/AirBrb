import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/admin/Login.jsx';
import '@testing-library/jest-dom';
import { AuthProvider } from '../utils/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom';

// mock navigating across pages
const mockedNavigate = jest.fn();

// mock navigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// setting local storage for test
Storage.prototype.setItem = jest.fn();

const MockLogin = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-token' }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form and buttons', () => {
    render(<MockLogin />);
    expect(screen.getByPlaceholderText('Email:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'LOGIN' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SIGN UP' })).toBeInTheDocument();
  });

  it('checks if user can input email and password', () => {
    render(<MockLogin />);
    userEvent.type(screen.getByPlaceholderText('Email:'), 'test@example.com');
    userEvent.type(screen.getByPlaceholderText('Password:'), 'password');
    expect(screen.getByPlaceholderText('Email:')).toHaveValue('test@example.com');
    expect(screen.getByPlaceholderText('Password:')).toHaveValue('password');
  });

  it('can submit form successfully and stores data correctly after call', async () => {
    render(<MockLogin />);
    // fill out form and submit
    userEvent.type(screen.getByPlaceholderText('Email:'), 'test@example.com');
    userEvent.type(screen.getByPlaceholderText('Password:'), 'password');
    fireEvent.submit(screen.getByRole('button', { name: 'LOGIN' }));

    // fetch
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // check if token is stored for successful login
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('userToken', 'fake-token');
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('userEmail', 'test@example.com');
  });

  it('displays an error message when login fails', async () => {
    // get the error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to login' }),
      })
    );

    render(<MockLogin />);

    // fill and submit form
    userEvent.type(screen.getByPlaceholderText('Email:'), 'test@example.com');
    userEvent.type(screen.getByPlaceholderText('Password:'), 'incorrect-password');
    fireEvent.submit(screen.getByRole('button', { name: 'LOGIN' }));

    // check for error message
    const errorMessage = await screen.findByText('Failed to login');
    expect(errorMessage).toBeInTheDocument();
  });

  // if email is not provided, should display error message
  it('email is not provided', async () => {
    // get the error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Must provide an email for user login' }),
      })
    );

    render(<MockLogin />);

    userEvent.type(screen.getByPlaceholderText('Password:'), 'password');
    fireEvent.submit(screen.getByRole('button', { name: 'LOGIN' }));

    const errorMessage = await screen.findByText('Must provide an email for user login');
    expect(errorMessage).toBeInTheDocument();
  });

  // if password is not provided, should display error message
  it('password is not provided', async () => {
    // get the error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Must provide a password for user login' }),
      })
    );

    render(<MockLogin />);

    userEvent.type(screen.getByPlaceholderText('Email:'), 'test@example.com');
    fireEvent.submit(screen.getByRole('button', { name: 'LOGIN' }));

    const errorMessage = await screen.findByText('Must provide a password for user login');
    expect(errorMessage).toBeInTheDocument();
  });

  it('navigates to the register page when the SIGN UP button is clicked', () => {
    render(<MockLogin />);
    fireEvent.click(screen.getByRole('button', { name: 'SIGN UP' }));
    expect(mockedNavigate).toHaveBeenCalledWith('/register');
  });
});
