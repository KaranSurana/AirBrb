/*
* Login Component
*
* Handles login behaviour and redirects user to the main page after logging in
* Checks for no email or password input, incorrect email or password and displays error pop up
*
*/
import React, { useState, useContext } from 'react';
import config from '../../config.json';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../error/Error.jsx';
import { AuthContext } from '../../utils/AuthContext.jsx';
import {
  LoginContainer,
  LoginHeading,
  LoginFormHolder,
  LoginFormContent,
  LoginForm,
  LoginField,
  LoginInput,
  LoginButton,
  Icon,
  PasswordToggleIcon,
  CloseButton
} from '../../styles/LoginStyles.jsx';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { handleLoginSuccess } = useContext(AuthContext);

  // call the login request
  const handleSubmit = async (event) => {
    event.preventDefault();
    const backendUrl = `http://localhost:${config.BACKEND_PORT}/user/auth/login`;
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      // if successful login, store the data into local storage and navigate to the main page
      if (response.ok) {
        handleLoginSuccess(data.token, email);
        navigate('/');
      } else {
        setError(data.error || 'Failed to login');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoginContainer>
      <LoginFormHolder>
        <LoginFormContent>
          <CloseButton onClick={() => navigate('/')}>X</CloseButton>
          <LoginForm onSubmit={handleSubmit}>
            <LoginHeading>Welcome Back!</LoginHeading>
            <LoginField>
              <LoginInput
                type="text"
                placeholder="Email:"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </LoginField>
            <LoginField>
              <LoginInput
                type={showPassword ? 'text' : 'password'}
                placeholder="Password:"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordToggleIcon
                onClick={togglePasswordVisibility}
                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              />
            </LoginField>
            <LoginButton type="submit">
              LOGIN
              <Icon className="fas fa-chevron-right"></Icon>
            </LoginButton>
            <LoginButton type="button" onClick={() => navigate('/register')}>
              SIGN UP
              <Icon className="fas fa-chevron-right"></Icon>
            </LoginButton>
          </LoginForm>
        </LoginFormContent>
      </LoginFormHolder>
      {error && <ErrorPopup message={error} onClose={handleCloseError} />}
    </LoginContainer>
  );
};

export default Login;
