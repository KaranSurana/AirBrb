import React, { useState, useEffect } from 'react';
import IndividualListing from './IndividualListing';
import LoadingBar from 'react-top-loading-bar'
import { MainContainer } from '../../styles/AllListings';

// Component
const HostedListing = () => {
  // States defined here
  const [hostedListing, setHostedListing] = useState([]);
  const [progress, setProgress] = useState(0);

  // Fetching all listings the current user published and unpublished BOTH!
  async function fetchUnpublishedListings () {
    setProgress(30);
    try {
      const response = await fetch('http://localhost:5005/listings');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const allListings = [];
      setProgress(60);
      for (let index = 0; index < data.listings.length; index++) {
        const element = await data.listings[index];
        // Checking condition for current users listing
        if (element.owner === localStorage.getItem('userEmail')) {
          const response = await fetch('http://localhost:5005/listings/' + element.id);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const listingData = await response.json();
          listingData.id = element.id;
          allListings.push(listingData);
        }
      }
      setHostedListing(allListings);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(async () => {
    await fetchUnpublishedListings();
    setProgress(100);
  }, []);

  // removing current listing
  const removeListingFromState = (listingId) => {
    setHostedListing(hostedListing.filter(listing => listing.id !== listingId));
  };
  // Component Rendered here
  return (
    <MainContainer data-testid="main-container">
      {/* Loading bar setup here */}
      <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />
      {hostedListing.map((listing) => (
        <IndividualListing data-testid="individual-listing" type="button" data={listing} key={listing.id} id={listing.id} onRemove={removeListingFromState} />
      ))}
    </MainContainer>
  );
};

export default HostedListing;
