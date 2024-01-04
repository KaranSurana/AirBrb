/*
* Register Component
*
* Handles user registration/sign up to the site
* Checks if user email exists, if passwords match and ensures that all fields are entered in the form
*
*/
import React, { useState, useContext } from 'react';
import config from '../../config.json';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../error/Error.jsx';
import { AuthContext } from '../../utils/AuthContext.jsx';
import {
  RegisterContainer,
  RegisterHeading,
  RegisterFormHolder,
  RegisterFormContent,
  RegisterForm,
  RegisterField,
  RegisterInput,
  RegisterSubmit,
  SignUpButton,
  Icon,
  PasswordToggleIcon,
  CloseButton
} from '../../styles/RegisterStyles.jsx';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { handleRegisterSuccess } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:${config.BACKEND_PORT}/user/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      // if successful, store email and token into localstorage
      if (response.ok) {
        handleRegisterSuccess(data.token, email);
        navigate('/');
      } else {
        setError(data.error || 'Failed to register');
      }
    } catch (err) {
      console.log(err);
      setError('Network error');
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  // toggle visibility options for entering password and confirming password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <RegisterContainer>
      <RegisterFormHolder>
        <RegisterFormContent>
          <CloseButton onClick={() => navigate('/')}>X</CloseButton>
          <RegisterForm onSubmit={handleSubmit}>
            <RegisterHeading>Create Account</RegisterHeading>
            <RegisterField>
              <RegisterInput
                type="text"
                placeholder="Name:"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </RegisterField>
            <RegisterField>
              <RegisterInput
                type="text"
                placeholder="Email:"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </RegisterField>
            <RegisterField>
              <RegisterInput
                type={showPassword ? 'text' : 'password'}
                placeholder="Password:"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordToggleIcon
                onClick={togglePasswordVisibility}
                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              />
            </RegisterField>
            <RegisterField>
              <RegisterInput
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password:"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <PasswordToggleIcon
                onClick={toggleConfirmPasswordVisibility}
                className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              />
            </RegisterField>
            <RegisterSubmit type="submit">
              SIGN UP
              <Icon className='fas fa-chevron-right'></Icon>
            </RegisterSubmit>
            <SignUpButton type="button" onClick={() => navigate('/login')}>
              GO BACK
              <Icon className='fas fa-chevron-right'></Icon>
            </SignUpButton>
          </RegisterForm>
        </RegisterFormContent>
      </RegisterFormHolder>
      {error && <ErrorPopup message={error} onClose={handleCloseError} />}
    </RegisterContainer>
  );
};

export default Register;
