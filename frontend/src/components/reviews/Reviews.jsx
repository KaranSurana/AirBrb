/*
* Review Component
*
* Similar to booking request component using bootstrap modal, but allows a user to leave a review for their previous booking
* Review includes a score and a comment
*
*/
import React, { useState } from 'react';
import config from '../../config.json';
import ErrorPopup from '../error/Error.jsx';
import { useParams } from 'react-router-dom';
import {
  StyledForm,
  TextArea,
  ScoreInput,
  Subtitle
} from '../../styles/ReviewStyles.jsx';
import { Modal, Button } from 'react-bootstrap';
import { SuccessReview } from './SuccessReview.jsx';

export const Review = ({ bookingId, show, handleClose, onReviewSubmitted }) => {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [successPopup, setSuccessPopup] = useState(false);
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userToken = localStorage.getItem('userToken');
    const userEmail = localStorage.getItem('userEmail');
    const reviewData = { score, comment, email: userEmail };
    const backendUrl = `http://localhost:${config.BACKEND_PORT}/listings/${id}/review/${bookingId}`;

    // fetch request for review
    try {
      const response = await fetch(backendUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ review: reviewData }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to submit review');
      } else {
        onReviewSubmitted();
        setSuccessPopup(true);
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  const closePopup = (value) => {
    setSuccessPopup(value);
  };

  // for user validation as they enter
  const handleScoreChange = (e) => {
    const newScore = parseInt(e.target.value, 10);
    if (isNaN(newScore) || newScore < 1 || newScore > 5) {
      setError('Score must be between 1 and 5');
    } else {
      setError('');
      setScore(newScore);
    }
  };

  return (
  /* Bootstrap Modal */
  <Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Leave a Review</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <StyledForm onSubmit={handleSubmit}>
      <Subtitle> Let us know about your experience! </Subtitle>
        <Subtitle> Rate your stay out of 5 </Subtitle>
        <ScoreInput
          type="number"
          placeholder="Score (1-5)"
          min="1"
          max="5"
          value={score}
          onChange={handleScoreChange}
        />
        <TextArea
          rows="4"
          placeholder="Leave your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </StyledForm>
      {error && <ErrorPopup message={error} onClose={handleCloseError} />}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit Review
        </Button>
      </Modal.Footer>
      {successPopup ? <SuccessReview closePopup={closePopup} /> : null}
    </Modal>
  );
};

export default Review;
