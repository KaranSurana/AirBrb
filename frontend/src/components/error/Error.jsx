/*
* Error Pop up
*
* General error pop up across pages using bootstrap modal popup
*
*/
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ErrorPopup = ({ message, onClose }) => {
  return (
    /* Bootstrap Modal */
    <Modal show={!!message} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorPopup;
