/*
* Logout Component
*
* Handles log out for user and navigates back to root page
* Removes the user token and email from storage
*
*/
import React, { useState, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import config from '../../config.json';
import ErrorPopup from '../error/Error.jsx';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext.jsx';

export const LogoutModal = ({ show, onHide }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { handleLogoutSuccess } = useContext(AuthContext);

  // logout request
  const handleLogout = async () => {
    const userToken = localStorage.getItem('userToken');
    try {
      const response = await fetch(`http://localhost:${config.BACKEND_PORT}/user/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });
      // if successful, remove token from storage and navigate back to home page
      if (response.ok) {
        onHide();
        handleLogoutSuccess();
        navigate('/');
      } else {
        const errorBody = await response.json();
        console.error('Logout error:', errorBody);
        setError('Failed to logout!');
      }
    } catch (error) {
      setError('Network error!');
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  return (
    /* Bootstrap Modal */
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to log out?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </Modal.Footer>
      {error && <ErrorPopup message={error} onClose={handleCloseError} />}
    </Modal>
  );
};

export default LogoutModal;
