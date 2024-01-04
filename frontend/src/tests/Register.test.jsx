import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../components/admin/Register';
import { AuthProvider } from '../utils/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// mock navigating across pages
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// setting local storage for test
Storage.prototype.setItem = jest.fn();

const MockRegister = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Register Component', () => {
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

  it('check registration inputs and buttons displays properly', () => {
    render(<MockRegister />);
    expect(screen.getByPlaceholderText('Name:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SIGN UP' })).toBeInTheDocument();
  });

  it('check if user can type in name, email, password, and confirm password', () => {
    render(<MockRegister />);
    userEvent.type(screen.getByPlaceholderText('Name:'), 'John Doe');
    userEvent.type(screen.getByPlaceholderText('Email:'), 'john@example.com');
    userEvent.type(screen.getByPlaceholderText('Password:'), 'password');
    userEvent.type(screen.getByPlaceholderText('Confirm Password:'), 'password');
    expect(screen.getByPlaceholderText('Name:')).toHaveValue('John Doe');
    expect(screen.getByPlaceholderText('Email:')).toHaveValue('john@example.com');
    expect(screen.getByPlaceholderText('Password:')).toHaveValue('password');
    expect(screen.getByPlaceholderText('Confirm Password:')).toHaveValue('password');
  });

  it('shows an error message if passwords do not match', () => {
    render(<MockRegister />);
    userEvent.type(screen.getByPlaceholderText('Password:'), 'password');
    userEvent.type(screen.getByPlaceholderText('Confirm Password:'), 'different');
    fireEvent.click(screen.getByRole('button', { name: 'SIGN UP' }));
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });

  it('stores information correctly upon successful registration', async () => {
    render(<MockRegister />);
    // fill and submit form
    userEvent.type(screen.getByPlaceholderText('Name:'), 'John Doe');
    userEvent.type(screen.getByPlaceholderText('Email:'), 'john@example.com');
    userEvent.type(screen.getByPlaceholderText('Password:'), 'password');
    userEvent.type(screen.getByPlaceholderText('Confirm Password:'), 'password');
    fireEvent.submit(screen.getByRole('button', { name: 'SIGN UP' }));

    // wait for it to be called 1ce
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // check if token is stored so test is successful
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('userToken', 'fake-token');
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('userEmail', 'john@example.com');
  });

  it('displays an error message when registration fails', async () => {
    // return error message
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to register' }),
      })
    );

    render(<MockRegister />);

    // fill and submit form
    userEvent.type(screen.getByPlaceholderText('Name:'), 'John Doe');
    userEvent.type(screen.getByPlaceholderText('Email:'), 'john@example.com');
    userEvent.type(screen.getByPlaceholderText('Password:'), 'password');
    userEvent.type(screen.getByPlaceholderText('Confirm Password:'), 'password');
    fireEvent.submit(screen.getByRole('button', { name: 'SIGN UP' }));

    // check for error msg
    const errorMessage = await screen.findByText('Failed to register');
    expect(errorMessage).toBeInTheDocument();
  });

  // if name is not provided, should display error message
  it('name is not provided', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Must provide a name for registration' }),
      })
    );

    render(<MockRegister />);

    userEvent.type(screen.getByPlaceholderText('Email:'), 'john@example.com');
    userEvent.type(screen.getByPlaceholderText('Password:'), 'password');
    userEvent.type(screen.getByPlaceholderText('Confirm Password:'), 'password');
    fireEvent.submit(screen.getByRole('button', { name: 'SIGN UP' }));

    const errorMessage = await screen.findByText('Must provide a name for registration');
    expect(errorMessage).toBeInTheDocument();
  });

  // if email is not provided, should display error message
  it('email is not provided', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Must provide an email for registration' }),
      })
    );

    render(<MockRegister />);

    userEvent.type(screen.getByPlaceholderText('Name:'), 'John Doe');
    userEvent.type(screen.getByPlaceholderText('Password:'), 'password');
    userEvent.type(screen.getByPlaceholderText('Confirm Password:'), 'password');
    fireEvent.submit(screen.getByRole('button', { name: 'SIGN UP' }));

    // Check for error message
    const errorMessage = await screen.findByText('Must provide an email for registration');
    expect(errorMessage).toBeInTheDocument();
  });

  it('password is not provided', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Must provide a password for registration' }),
      })
    );

    render(<MockRegister />);

    userEvent.type(screen.getByPlaceholderText('Name:'), 'John Doe');
    userEvent.type(screen.getByPlaceholderText('Email:'), 'john@example.com');
    fireEvent.submit(screen.getByRole('button', { name: 'SIGN UP' }));

    const errorMessage = await screen.findByText('Must provide a password for registration');
    expect(errorMessage).toBeInTheDocument();
  });

  // if email is already registered, should display error message
  it('email already registered', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Email address already registered' }),
      })
    );

    render(<MockRegister />);

    userEvent.type(screen.getByPlaceholderText('Name:'), 'John Doe');
    userEvent.type(screen.getByPlaceholderText('Email:'), 'john@example.com');
    userEvent.type(screen.getByPlaceholderText('Password:'), 'password');
    userEvent.type(screen.getByPlaceholderText('Confirm Password:'), 'password');
    fireEvent.submit(screen.getByRole('button', { name: 'SIGN UP' }));

    const errorMessage = await screen.findByText('Email address already registered');
    expect(errorMessage).toBeInTheDocument();
  });

  it('navigates to the login page when the GO BACK button is clicked', () => {
    render(<MockRegister />);
    fireEvent.click(screen.getByRole('button', { name: 'GO BACK' }));
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });
});
