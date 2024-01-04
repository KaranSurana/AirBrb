/*
* Booking Component
*
* Handles booking requests, submits and checks for constraints
* Errors if booked outside of availability range, no user interaction with dates, if end date = start date and end date < start date
*
*/
import React, { useState } from 'react';
import config from '../../config.json';
import ErrorPopup from '../error/Error.jsx';
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import {
  Subtitle,
  StyledInput,
  TotalPriceContainer,
  PriceValue,
  StyledForm,
  PriceCondition
} from '../../styles/BookingStyles.jsx';
import { SuccessBooking } from './SuccessBooking.jsx';

export const Booking = ({ pricePerNight, show, handleClose, onBookingSubmitted }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState('');
  const [successPopup, setSuccessPopup] = useState(false);
  const [totalNights, setTotalNights] = useState(0);
  const [startDateChanged, setStartDateChanged] = useState(false);
  const [endDateChanged, setEndDateChanged] = useState(false);
  const { id } = useParams();

  const userEmail = localStorage.getItem('userEmail');
  const userToken = localStorage.getItem('userToken');

  // calculate total price and number of nights and perform check if end date entered is less than start date
  // useEffect(() => {
  //   if (startDateChanged || endDateChanged) {

  //   }
  // }, [startDate, endDate, pricePerNight, startDateChanged, endDateChanged]);

  // calculate total price and number of nights

  // submitting booking form
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (endDate < startDate) {
      setError('End date cannot be before the start date');
      setTotalPrice(0);
      setTotalNights(0);
      return;
    } else if (endDate.getTime() === startDate.getTime()) {
      setError('Start date cannot be equal to the end date');
      setTotalPrice(0);
      setTotalNights(0);
      return;
    } else {
      setError('');
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalNights(diffDays);
      setTotalPrice(diffDays * pricePerNight);
    }
    const dateRange = {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    };

    // if no user interaction, display error and return
    if (!startDateChanged || !endDateChanged) {
      setError('Please enter or change the check-in and check-out dates');
      return;
    }

    // Check if end date is before start date or if they are equal
    if (endDate < startDate) {
      setError('End date cannot be before the start date');
      return;
    } else if (endDate === startDate) {
      setError('Start date cannot be equal to the end date');
      return;
    }
    const availabilityArr = []
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    /* eslint-disable no-unmodified-loop-condition */
    while (currentDate <= lastDate) {
      availabilityArr.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    /* eslint-enable no-unmodified-loop-condition */
    const listingResponse = await fetch(`http://localhost:${config.BACKEND_PORT}/listings/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    // get the listing availability
    const listingData = await listingResponse.json();
    let isError = false;
    if (listingResponse.ok) {
      availabilityArr.forEach(element => {
        if (!listingData.listing.availability.includes(element)) {
          isError = true;
        }
      });
    } else {
      setError(listingData.error || 'Failed to fetch listing details');
    }
    if (isError) {
      setError('The Property is not available for that range!');
      return;
    }
    // create a new booking request
    const backendUrl = `http://localhost:${config.BACKEND_PORT}/bookings/new/${id}`;
    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ dateRange, totalPrice, owner: userEmail }),
      });

      const data = await response.json();
      // if successful show pop up for user confirmation
      if (response.ok) {
        onBookingSubmitted();
        setSuccessPopup(true);
      } else {
        setError(data.error || 'Failed to make booking');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleCloseError = () => {
    setError('');
    handleClose();
  };

  const closePopup = (value) => {
    setSuccessPopup(value);
    handleClose();
  };

  return (
    <>
    {/* Bootstrap Modal */}
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Make a Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <StyledForm onSubmit={handleSubmit}>
        <Subtitle data-testid="check-in">Check In: </Subtitle>
        <StyledInput data-testid="check-input"
          type="date"
          value={startDate.toISOString().substring(0, 10)}
          onChange={(e) => {
            setStartDate(new Date(e.target.value));
            setStartDateChanged(true);
          }}
        />
        <Subtitle data-testid="check-out">Check Out:</Subtitle>
        <StyledInput data-testid="check-output"
          type="date"
          value={endDate.toISOString().substring(0, 10)}
          onChange={(e) => {
            setEndDate(new Date(e.target.value));
            setEndDateChanged(true);
          }}
          min={startDate.toISOString().substring(0, 10)}
        />
        <TotalPriceContainer>
        <Subtitle data-testid="total-nights">Total Number of Nights:</Subtitle>
        <PriceValue >{totalNights}</PriceValue>
        <Subtitle data-testid="total-price" >Total Price* ($):</Subtitle>
        <PriceValue>{totalPrice}</PriceValue>
        <PriceCondition>*Calculated based on number of nights</PriceCondition>
        </TotalPriceContainer>
        </StyledForm>
      </Modal.Body>
      <Modal.Footer>
        <Button data-testid="close-button" variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button data-testid="book-submit" variant="primary" onClick={handleSubmit}>
          Book Now
        </Button>
      </Modal.Footer>
      {successPopup ? <SuccessBooking closePopup={closePopup} /> : null}
    </Modal>
    {error && <ErrorPopup message={error} onClose={handleCloseError} />}
  </>
  );
};

export default Booking;
