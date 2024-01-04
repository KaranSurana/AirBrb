/*
* Manage Booking Requests & History Component
*
* Handles listing owners accepting booking requests, viewing their booking history
* and a statistical overview of their listing profits and days booked
*
*/
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import config from '../../config.json';
import ErrorPopup from '../error/Error.jsx';
import { Card, Row, Col, Modal, Button } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import {
  StyledCard,
  RequestContainer,
  OverviewContainer,
  BookingCard,
  Column,
  BookingInfo,
  StatusBadge,
  ButtonContainer,
  AcceptButton,
  DeclineButton,
  HistoryContainer
} from '../../styles/ManageHostingBookingsStyles.jsx';
import LoadingBar from 'react-top-loading-bar'

const ManageHostingBooking = () => {
  const { id } = useParams();
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState([]);
  const [totalDaysBooked, setTotalDaysBooked] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const userToken = localStorage.getItem('userToken');
  const [progress, setProgress] = useState(0);

  async function fetchBookings () {
    setProgress(30);
    try {
      const bookingsResponse = await fetch(`http://localhost:${config.BACKEND_PORT}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });
      const bookingsData = await bookingsResponse.json();
      if (bookingsResponse.ok) {
        const filteredBookings = bookingsData.bookings.filter(booking => booking.listingId === id);
        setBookings(filteredBookings);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (error) {
      setError(error.message);
    }
    setProgress(100);
  }

  useEffect(async () => {
    await fetchBookings();
    setProgress(100);
  }, [id]);

  // format date for modal display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // handle accept booking request
  const handleAcceptClick = (booking) => {
    const formattedBooking = {
      ...booking,
      dateRange: {
        ...booking.dateRange,
        start: formatDate(booking.dateRange.start),
        end: formatDate(booking.dateRange.end)
      }
    };
    setSelectedBooking(formattedBooking);
    setShowAcceptModal(true);
  };

  // handle accepting a booking
  const handleAcceptConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:${config.BACKEND_PORT}/bookings/accept/${selectedBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });

      // if successful, we close the modal and refetch the bookings to update the booking history
      if (response.ok) {
        setShowAcceptModal(false);
        fetchBookings();
      } else {
        setError('Failed to accept booking!')
      }
    } catch (error) {
      setError('Network error')
    }
  };

  const handleCloseModal = () => {
    setShowAcceptModal(false);
  };

  // handle decline booking
  const handleOpenDeclineModal = (booking) => {
    const formattedBooking = {
      ...booking,
      dateRange: {
        ...booking.dateRange,
        start: formatDate(booking.dateRange.start),
        end: formatDate(booking.dateRange.end)
      }
    };
    setSelectedBooking(formattedBooking);
    setShowDeclineModal(true);
  };

  // fetch request to decline a booking request
  const handleConfirmDecline = async () => {
    try {
      const response = await fetch(`http://localhost:${config.BACKEND_PORT}/bookings/decline/${selectedBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        setShowDeclineModal(false);
        fetchBookings();
      } else {
        setError('Failed to decline booking!')
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseDeclineModal = () => {
    setShowDeclineModal(false);
  };

  // to filter for profit + numbr of days booked
  useEffect(() => {
    if (bookings.length > 0) {
      const currentYear = new Date().getFullYear();
      let daysBooked = 0;
      let profit = 0;

      bookings.forEach(booking => {
        if (new Date(booking.dateRange.start).getFullYear() === currentYear &&
            new Date(booking.dateRange.end).getFullYear() === currentYear &&
            booking.status === 'accepted') {
          const startDate = new Date(booking.dateRange.start);
          const endDate = new Date(booking.dateRange.end);
          const diffTime = Math.abs(endDate - startDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          daysBooked += diffDays;
          profit += booking.totalPrice;
        }
      });

      setTotalDaysBooked(daysBooked);
      setTotalProfit(profit);
    }
  }, [bookings]);

  const handleCloseError = () => {
    setError('');
  };

  return (
    <>
    <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />
    <OverviewContainer>
      {/* Bootstrap Cards, Col and Row to display stats */}
      <h2 className="text-center mb-4">Your Listing Overview for This Year</h2>
      <Row className="mb-3">
        <Col md={6}>
          <StyledCard>
            <Card.Body>
            <Card.Title>📅 Days Booked</Card.Title>
              <Card.Text>
                {totalDaysBooked} days
              </Card.Text>
            </Card.Body>
          </StyledCard>
        </Col>
        <Col md={6}>
          <StyledCard>
            <Card.Body>
            <Card.Title>💰 Booking Profit</Card.Title>
              <Card.Text>
                ${totalProfit}
              </Card.Text>
            </Card.Body>
          </StyledCard>
        </Col>
      </Row>
    </OverviewContainer>

    { /* Bootstrap Accordion for Booking Requests and Booking History */ }
    <Accordion data-testid="accordion" defaultActiveKey={0}>
      <Accordion.Item data-testid="booking-request" eventKey='0'>
        <Accordion.Header> Active Booking Requests </Accordion.Header>
        <Accordion.Body>
          <RequestContainer>
            {bookings.filter(booking => booking.status === 'pending').map((booking) => (
              <BookingCard key={booking.id}>
                <Column>
                  <BookingInfo>
                    <h5>ID: {booking.id}</h5>
                    <p>Booking Requested By: {booking.owner}</p>
                    <StatusBadge>Current status: {booking.status}</StatusBadge>
                  </BookingInfo>
                </Column>
                <Column>
                  <BookingInfo>
                    <h5><strong>From:</strong> {formatDate(booking.dateRange.start)}</h5>
                    <h5><strong>To:</strong> {formatDate(booking.dateRange.end)}</h5>
                  </BookingInfo>
                </Column>
                <ButtonContainer>
                  <AcceptButton data-testid="accept-button" onClick={() => handleAcceptClick(booking)}>Accept</AcceptButton>
                  <DeclineButton onClick={() => handleOpenDeclineModal(booking)}>Decline</DeclineButton>
                </ButtonContainer>
              </BookingCard>
            ))}
          </RequestContainer>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item data-testid="booking-history" eventKey='1'>
        <Accordion.Header> Booking History </Accordion.Header>
        <Accordion.Body>
          <HistoryContainer>
            {bookings.filter(booking => booking.status === 'accepted' || booking.status === 'declined').map((booking) => (
              <BookingCard key={booking.id}>
                <Column>
                  <BookingInfo>
                    <h5>ID: {booking.id}</h5>
                    <p>Booking Requested By: {booking.owner}</p>
                    <StatusBadge data-testid="confirm-status">Current status: {booking.status}</StatusBadge>
                  </BookingInfo>
                </Column>
                <Column>
                  <BookingInfo>
                    <h5><strong>From:</strong> {formatDate(booking.dateRange.start)}</h5>
                    <h5><strong>To:</strong> {formatDate(booking.dateRange.end)}</h5>
                  </BookingInfo>
                </Column>
              </BookingCard>
            ))}
          </HistoryContainer>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>

    {error && <ErrorPopup message={error} onClose={handleCloseError} />}

    { /* Bootstrap Modal */ }
    <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Booking Overview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Booking Id:</strong> {selectedBooking?.id}</p>
        <p><strong>Booked By:</strong> {selectedBooking?.owner}</p>
        <p><strong>Booked from:</strong> {selectedBooking?.dateRange.start}</p>
        <p><strong>Booked to:</strong> {selectedBooking?.dateRange.end}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button data-testid="confirm-button" variant="primary" onClick={handleAcceptConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>

    { /* Bootstrap Modal */ }
    <Modal show={showDeclineModal} onHide={() => setShowDeclineModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Decline Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to decline the booking request?
        <p><strong>Booking Id:</strong> {selectedBooking?.id}</p>
        <p><strong>Booked By:</strong> {selectedBooking?.owner}</p>
        <p><strong>Booked from:</strong> {selectedBooking?.dateRange.start}</p>
        <p><strong>Booked to:</strong> {selectedBooking?.dateRange.end}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseDeclineModal}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirmDecline}>
          Decline
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  )
};

export default ManageHostingBooking;
