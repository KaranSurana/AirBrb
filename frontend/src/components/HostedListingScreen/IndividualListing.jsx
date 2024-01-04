import React, { useState } from 'react';
import RatingSVG from './RatingSVG';
import defaultImage from '../../resources/img.jpg';
import config from '../../config.json';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  HostedListingDelete,
  ImgDiv,
  ThumbnailImage,
  Container,
  HostedListingHeader,
  HostedListingTitle,
  HostedListingAddress,
  HostedListingInfo,
  HostedListingIcons,
  HostedListingIconText,
  PublishSection,
  PublishSectionEdit2,
  PublishSectionEdit,
  PublishSectionPublish
} from '../../styles/HostedListingScreen'
import ErrorPopup from '../error/Error.jsx';
import { Modal, Button } from 'react-bootstrap';

// Component
const IndividualListing = (props) => {
  const listingData = props.data.listing;
  const listingId = props.id;
  // States Defined here
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const userToken = localStorage.getItem('userToken');

  // check if user is the owner, then render the buttons
  const isOwner = userEmail === listingData.owner;

  // Handling edit button click
  const handleEditClick = () => {
    navigate('/edit/' + listingId);
  };

  const navigateToListingDetails = () => {
    if (props.startDate && props.endDate) {
      const queryParamsString = new URLSearchParams({
        startDate: props.startDate,
        endDate: props.endDate
      }).toString();
      navigate(`/listing-details/${listingId}?${queryParamsString}`);
    } else {
      navigate(`/listing-details/${listingId}`);
    }
  };

  // Handling publish button click
  const handlePublishClick = () => {
    alert('Please Add Your Availability!');
    navigate('/edit/' + listingId);
  };

  const handleCloseError = () => {
    setError('');
  };

  // delete modal
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // Deleting a listing
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:${config.BACKEND_PORT}/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      });

      if (response.ok) {
        props.onRemove(listingId);
        setShowDeleteModal(false);
        navigate('/hosted-listings');
      } else {
        // Handle error in deletion
        const data = await response.json();
        setError(data.error || 'Failed to delete listing');
      }
    } catch (err) {
      console.log(err);
      setError('Network error');
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleUnpublishClick = () => {
    setShowUnpublishModal(true);
  };

  // Unpublish request to backend via this function
  const handleUnpublishConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:${config.BACKEND_PORT}/listings/unpublish/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      });

      if (response.ok) {
        setShowUnpublishModal(false);
        navigate('/');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to unpublish listing');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleCloseUnpublishModal = () => {
    setShowUnpublishModal(false);
  };

  const handleManageBookings = () => {
    navigate('/manage-booking-requests/' + listingId);
  };

  // getting average rating from reviews
  const calculateAverageScore = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const totalScore = reviews.reduce((acc, review) => acc + review.score, 0);
    return parseFloat(totalScore) / parseFloat(reviews.length);
  };
  const averageScore = calculateAverageScore(listingData.reviews);
  let vId = '';
  if (listingData.metadata.youtube) {
    vId = (listingData.metadata.youtube.split('?v=')[1]).split('&')[0];
  }

  // Component Rendered
  return (
    <Card className="card">
      {(props.allListingBool === undefined || props.allListingBool === null) && isOwner && (
        <HostedListingDelete data-testid="delete-button" onClick={handleDeleteClick}>
          <i className="fa-regular fa-trash-can"></i>
        </HostedListingDelete>
      )}
      {/* Image Thumbnail or Youtube Thumbnail */}
      <ImgDiv className='img-div' onClick={navigateToListingDetails}>
        {listingData.metadata.youtube === '' || listingData.metadata.youtube === undefined
          ? (
              <ThumbnailImage
                src={(listingData.thumbnail !== null && listingData.thumbnail.length !== 0) ? listingData.thumbnail[0] : defaultImage}
                alt='Hosted Listing Thumbnail'
              />
            )
          : (
              <iframe id="youtube_listing" width="100%" height="100%" src={'https://www.youtube.com/embed/' + vId} allow="accelerometer; picture-in-picture;" allowFullScreen></iframe>
            )}
      </ImgDiv>
      {/* Listing Details */}
      <Container data-testid="detail-button" className="container" onClick={navigateToListingDetails}>
        <HostedListingHeader className='hostedListingHeader'>
          <HostedListingTitle className='hostedListingTitle'><b>{listingData.title}</b></HostedListingTitle>
          <RatingSVG reviewPoints={averageScore} />
        </HostedListingHeader>
        <HostedListingAddress className='hostedListingAddress'>{listingData.address.streetNumber + ' ' + listingData.address.city}</HostedListingAddress>
        <HostedListingInfo className='hostedListingInfo'>
          {!props.allListingBool && (
              <HostedListingIcons className='hostedListingIcons'>
                <i className="fa-solid fa-bed"></i>
                <HostedListingIconText>{listingData.metadata.bedrooms}</HostedListingIconText>
              </HostedListingIcons>
          )}

          {(props.allListingBool === undefined || props.allListingBool === null) && (
              <HostedListingIcons className='hostedListingIcons'>
                <i className="fa-solid fa-bed"></i>
                <HostedListingIconText>{listingData.metadata.beds}</HostedListingIconText>
              </HostedListingIcons>
          )}
          <HostedListingIcons data-testid="all-listing-icon" className='hostedListingIcons'>
            <i className="fa-solid fa-toilet"></i>
            <HostedListingIconText>{listingData.metadata.bathrooms}</HostedListingIconText>
          </HostedListingIcons>
          <HostedListingIcons data-testid="all-listing-icon" className='hostedListingIcons'>
            <i className="fa-regular fa-comment"></i>
            <HostedListingIconText data-testid="all-listing-icon">{listingData.reviews.length}</HostedListingIconText>
          </HostedListingIcons>
          <HostedListingIcons data-testid="all-listing-icon" className='hostedListingIcons'>
            <i className="fa-solid fa-dollar-sign"></i>
            <HostedListingIconText>{listingData.price}</HostedListingIconText>
          </HostedListingIcons>
        </HostedListingInfo>
      </Container>
      {/* If this listing is rendered on the root url dont show the publish/unpublish/edit buttons */}
      {(props.allListingBool === undefined || props.allListingBool === null)
        ? (
          <PublishSection data-testid="publish-section" className='publish-section'>
            {isOwner && (
              <>
                <PublishSectionEdit2 data-testid="edit-button" type="button" onClick={handleEditClick} value="Edit" />
                {!listingData.published && (
                  <PublishSectionPublish data-testid="publish-button" type="button" onClick={handlePublishClick} value="Publish" />
                )}
                {listingData.published && (
                  <PublishSectionPublish data-testid="unpublish-button" type="button" onClick={handleUnpublishClick} value="Unpublish" />
                )}
                <PublishSectionEdit data-testid="booking-request-button" type="button" onClick={handleManageBookings} value="Bookings" />
              </>
            )}
          </PublishSection>
          )
        : (
            null
          )}
    {/* Error popup */}
    {error && <ErrorPopup message={error} onClose={handleCloseError} />}
    {/* Bootstrap Modal - Delete Confirmation Modal */}
    <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this listing?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    {/* Bootstrap Modal - Unpublish Confirmation Modal */}
    <Modal show={showUnpublishModal} onHide={handleCloseUnpublishModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Unpublishing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to unpublish this listing?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseUnpublishModal}>
          Cancel
        </Button>
        <Button data-testid="unpublish-confirm-button" variant="danger" onClick={handleUnpublishConfirm}>
          Unpublish
        </Button>
      </Modal.Footer>
    </Modal>
  </Card>
  );
};

export default IndividualListing;
