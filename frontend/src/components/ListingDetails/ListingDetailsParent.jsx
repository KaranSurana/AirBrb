/*
* Listing Details Component
*
* Component to display individual listing details also enables users (who are not owners of the listing)
* to book or to leave a review if they have an accepted booking
* After making a booking request or leaving a review it should automatically update on this screen
* Users can also view the property details, an image carousel
*
* Uses bootstrap accordion for expandable sections
*
*/
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import config from '../../config.json';
import ErrorPopup from '../error/Error.jsx';
import {
  Title,
  DisplayText,
  Container,
  Div,
  Div2,
  Div3,
  Div4,
  Div5,
  Div6,
  Card,
  Card2,
  AddressText,
  Button,
  MetaInfo,
  BookingReviewCard,
  ButtonContainer
} from '../../styles/ListingDetailsStyles.jsx';
import { ImageGallery } from '../../utils/ImageCarousel.jsx';
import { Booking } from '../bookings/Booking.jsx';
import { Review } from '../reviews/Reviews.jsx';
import Accordion from 'react-bootstrap/Accordion';
import defaultImage from '../../resources/img.jpg';
import LoadingBar from 'react-top-loading-bar'

const ListingDetailsParent = () => {
  const { id } = useParams();
  const [error, setError] = useState('');
  const [listing, setListing] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const userEmail = localStorage.getItem('userEmail');
  const [progress, setProgress] = useState(0);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const startDate = queryParams.get('startDate');
  const endDate = queryParams.get('endDate');

  async function fetchListingAndBookings () {
    try {
      const userToken = localStorage.getItem('userToken');
      const userEmail = localStorage.getItem('userEmail');
      // Fetch listing details
      const listingResponse = await fetch(`http://localhost:${config.BACKEND_PORT}/listings/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });
      const listingData = await listingResponse.json();
      if (listingResponse.ok) {
        setListing(listingData.listing);
      } else {
        setError(listingData.error || 'Failed to fetch listing details');
      }

      // Fetch bookings for listing
      const bookingsResponse = await fetch(`http://localhost:${config.BACKEND_PORT}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });
      const bookingsData = await bookingsResponse.json();
      // filter the responses for those where booking owner is the user logged in so they can check their booking history
      if (bookingsResponse.ok) {
        const filteredBookings = bookingsData.bookings.filter(booking =>
          booking.listingId === id && booking.owner === userEmail);
        setBookings(filteredBookings);
      } else {
        setError(bookingsData.error || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.log(err);
      setError('Network error');
    }
  }

  useEffect(() => {
    setProgress(30);
    fetchListingAndBookings();
  }, [id]);

  const handleCloseError = () => {
    setError('');
  };

  // find if there are accepted bookings
  const acceptedBookings = bookings.filter(booking => booking.status === 'accepted');
  const hasAcceptedBooking = acceptedBookings.length > 0;
  // get id of first one
  const acceptedBookingId = hasAcceptedBooking ? acceptedBookings[0].id : null;

  // load images
  let images = [];
  if (listing && listing.thumbnail) {
    images = listing.thumbnail.map(imgSrc => ({
      src: imgSrc,
      alt: listing.title // using title as alt text for acccessibiility
    }));
  }

  if (images.length === 0) {
    images = [{
      src: defaultImage,
      alt: 'Default Image'
    }]
  }
  const handleBookingNavigation = () => {
    setShowBookingModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
  };

  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCloseReviewModal = () => setShowReviewModal(false);

  // calculate total price (price per night x number of nights)
  const calculateTotalPrice = (startDate, endDate, pricePerNight) => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays * pricePerNight;
  };

  const refetchListingData = async () => {
    setProgress(60);
    fetchListingAndBookings();
    setProgress(100);
  };

  // delete a booking
  const deleteBooking = async (bookingId) => {
    try {
      const userToken = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:${config.BACKEND_PORT}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        },
      });

      if (!response.ok) {
        // Handle response error
        const errorData = await response.json();
        setError(errorData.error || 'Error deleting booking');
      } else {
        refetchListingData();
      }
    } catch (error) {
      setError('Network error');
    }
  };
  useEffect(() => {
    setProgress(100);
  }, []);
  return (
    <Container>
    <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />
    {listing
      ? (
      <>
        <Title>{listing.title}</Title>
        <Div3>
          <ImageGallery images={images} />
          <Card>
            {listing.metadata && (
              <Div5>
                <Div>
                  <MetaInfo><span>🏠</span> Property Type: {listing.metadata.propertyType}</MetaInfo>
                  <MetaInfo><span>🛏️</span> Bedrooms: {listing.metadata.bedrooms}</MetaInfo>
                  <MetaInfo><span>🛌</span> Beds: {listing.metadata.beds}</MetaInfo>
                  <MetaInfo><span>🛁</span> Bathrooms: {listing.metadata.bathrooms}</MetaInfo>
                  <MetaInfo><span>🎉</span> Amenities: {listing.metadata.amenities}</MetaInfo>
                </Div>
                <Div4>
                  <DisplayText>Pricing:</DisplayText>
                    {startDate && endDate
                      ? (
                        <>
                        <p>Price Per Night: ${listing.price} </p>
                        <p>Total Price for Stay: ${calculateTotalPrice(startDate, endDate, listing.price)}</p>
                        </>
                        )
                      : (
                        <p>Price Per Night: ${listing.price} </p>
                        )
                    }
                </Div4>
              </Div5>
            )}
            <Div2>
              <ButtonContainer>
                  {userEmail !== listing.owner && (
                    <Button onClick={handleBookingNavigation} data-testid="book-now-button">Book Now</Button>
                  )}
                  {hasAcceptedBooking && userEmail !== listing.owner && (
                    <Button onClick={handleOpenReviewModal} data-testid="leave-review-button">Leave Review</Button>
                  )}
              </ButtonContainer>
            </Div2>
          </Card>
        </Div3>
        <Div6>
          {listing.address && (
            <AddressText>
              {listing.address.buildingNumber} {listing.address.streetNumber}, {listing.address.city}, {listing.address.state}, {listing.address.country}, {listing.address.zipcode}
            </AddressText>
          )}
        </Div6>
        <Accordion defaultActiveKey={0}>
          <Accordion.Item eventKey='0'>
            <Accordion.Header data-testid="listing-reviews">
              Listing Reviews:
            </Accordion.Header>
            <Accordion.Body>
              <Card2>
              {listing.reviews && listing.reviews.length > 0
                ? (
                    listing.reviews.map((review, index) => (
                      <BookingReviewCard key={index}>
                        <span>
                          <p>Rating/5: {review.score}</p>
                          <p>Comment: {review.comment}</p>
                          <p>Reviewed By: {review.email}</p>
                        </span>
                      </BookingReviewCard>
                    ))
                  )
                : (
                    <p>No reviews yet for this listing.</p>
                  )
              }
              </Card2>
              <Review
                  show={showReviewModal}
                  handleClose={handleCloseReviewModal}
                  bookingId={acceptedBookingId}
                  onReviewSubmitted={refetchListingData}
              />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey='1'>
            <Accordion.Header data-testid="booking-history">
                Your Bookings for this listing:
            </Accordion.Header>
            <Accordion.Body>
              <Card2>
              {bookings && bookings.length > 0
                ? (
                    bookings.map((booking, index) => (
                      <BookingReviewCard key={index}> <span>
                        <p>Booking ID: {booking.id}</p>
                        <p>Dates: {formatDate(booking.dateRange.start)} to {formatDate(booking.dateRange.end)}</p>
                        <p>Total Price: {booking.totalPrice}</p>
                        <p>Status: {booking.status}</p>
                        {booking.status === 'pending' && (
                          <Button data-testid="delete-booking-button" variant="danger" onClick={() => deleteBooking(booking.id)}>
                            Delete Booking
                          </Button>
                        )}
                      </span> </BookingReviewCard>
                    ))
                  )
                : (
                <p>No bookings made for this listing yet.</p>
                  )
              }
            </Card2>
            <Booking
              show={showBookingModal}
              handleClose={handleCloseBookingModal}
              pricePerNight={listing.price}
              onBookingSubmitted={refetchListingData}
            />
          </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </>
        )
      : (
        <p>Loading...</p>
        )
    }
    {error && <ErrorPopup message={error} onClose={handleCloseError} />}
    </Container>
  );
};

export default ListingDetailsParent;
