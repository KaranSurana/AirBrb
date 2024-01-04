import React, { useState, useEffect } from 'react';
import IndividualListing from '../HostedListingScreen/IndividualListing';
import { useLocation } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar'
import { MainContainer } from '../../styles/AllListings';

// Getting Current Users' All Bookings
const getBookedListingOfUser = async () => {
  try {
    const response = await fetch('http://localhost:5005/bookings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('userToken')
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Component
const AllListingScreen = () => {
  // All States Defined Here
  const [progress, setProgress] = useState(0)
  const [Listing, setListing] = useState([]);
  const location = useLocation();
  // Getting Search Params Here
  const queryParams = new URLSearchParams(location.search);
  const startDate = queryParams.get('startDate');
  const endDate = queryParams.get('endDate');
  // Fetching All Published Listings
  async function fetchPublishedListings () {
    try {
      const response = await fetch('http://localhost:5005/listings');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      let allListings = [];
      setProgress(60);
      for (let index = 0; index < data.listings.length; index++) {
        const element = await data.listings[index];
        const response = await fetch('http://localhost:5005/listings/' + element.id);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const listingData = await response.json();
        listingData.id = element.id;
        if (listingData.listing.published) {
          allListings.push(listingData);
        }
      }
      // Sorting All Listings by alphabetical order
      allListings = allListings.sort((a, b) => {
        const firstListingName = a.listing.title.toString().toLowerCase();
        const secondListingName = b.listing.title.toString().toLowerCase();
        return firstListingName.localeCompare(secondListingName);
      });
      const currentUsersBooking = [];
      // First Arr Here means whatever listing current user has booked will be stored here to render first
      const firstArr = [];
      if (localStorage.getItem('userToken')) {
        let bookings = [];
        bookings = await getBookedListingOfUser();
        for (let i = 0; i < bookings.length; i++) {
          const element = bookings[i];
          if (element.owner === localStorage.getItem('userEmail')) {
            currentUsersBooking.push(element);
          }
        }

        for (let index = 0; index < allListings.length; index++) {
          const listing = allListings[index];
          for (let j = 0; j < bookings.length; j++) {
            const booking = bookings[j];
            if (listing.id === booking.listingId) {
              firstArr.push(listing);
              allListings.filter(item => item.id !== booking.listingId);
            }
          }
        }
      }
      // Bool value to check if there is a search constraint or just to show all listings alphabetically
      let showAllorSearchedListings = false;
      const queryParams = new URLSearchParams(location.search);
      for (const [, value] of queryParams) {
        if (value !== '') {
          showAllorSearchedListings = true;
          break;
        }
      }
      if (showAllorSearchedListings) {
        let searchedArr = []
        const searchParams = {
          searchString: '',
          minBedroom: '',
          maxBedroom: '',
          startDate: '',
          endDate: '',
          minPrice: '',
          maxPrice: '',
          order: '',
        };
        for (const [key, value] of queryParams) {
          searchParams[key] = value;
        }
        // Custom Filter function to get searched results
        const filterFunction = listing => {
          const actualListing = listing.listing;
          const combOfTitleAndAddress = actualListing.title.toLowerCase() + actualListing.address.streetNumber.toLowerCase() + actualListing.address.city.toLowerCase() + actualListing.address.state.toLowerCase() + actualListing.address.country.toLowerCase() + actualListing.address.zipcode.toLowerCase();
          if (searchParams.searchString && !combOfTitleAndAddress.includes(searchParams.searchString.toLowerCase().replace('+', ' '))) {
            return false;
          }
          if (searchParams.minBedroom) {
            const bedrooms = actualListing.metadata.bedrooms;
            if (parseInt(bedrooms) < parseInt(searchParams.minBedroom)) {
              return false;
            }
          }
          if (searchParams.maxBedroom) {
            const bedrooms = actualListing.metadata.bedrooms;
            if (parseInt(bedrooms) >= parseInt(searchParams.maxBedroom)) {
              return false;
            }
          }
          if (searchParams.minPrice) {
            const price = actualListing.price;
            if (parseFloat(price) <= parseFloat(searchParams.minPrice)) {
              return false;
            }
          }
          if (searchParams.maxPrice) {
            const price = actualListing.price;
            if (parseFloat(price) >= parseFloat(searchParams.minPrice)) {
              return false;
            }
          }
          if (searchParams.startDate && searchParams.endDate) {
            const currentDate = new Date(searchParams.startDate);
            const lastDate = new Date(searchParams.endDate);
            /* eslint-disable no-unmodified-loop-condition */
            let boolAvailable = true;
            while (currentDate <= lastDate) {
              if (!actualListing.availability.includes(currentDate.toISOString().split('T')[0])) {
                boolAvailable = false;
              }
              currentDate.setDate(currentDate.getDate() + 1);
            }
            return boolAvailable;
            /* eslint-enable no-unmodified-loop-condition */
          }
          return true;
        };
        searchedArr = allListings.filter(filterFunction)
        // Ordering By Asc/Desc Review Ratings
        if (searchParams.order === 'asc') {
          searchedArr.sort((a, b) => {
            const firstListingReview = a.listing.reviews.length;
            const secondListingReview = b.listing.reviews.length;
            return parseInt(firstListingReview) - parseInt(secondListingReview);
          });
        } else {
          searchedArr.sort((a, b) => {
            const firstListingReview = a.listing.reviews.length;
            const secondListingReview = b.listing.reviews.length;
            return parseInt(firstListingReview) - parseInt(secondListingReview);
          }).reverse();
        }
        setListing([...searchedArr]);
      } else {
        setListing([...firstArr, ...allListings]);
      }
      setProgress(100);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setProgress(30);
      await fetchPublishedListings();
    };

    fetchData();
  }, [location.search]);
  // Rendering Component
  return (
    <MainContainer>
      {/* Loading Bar Setup */}
      <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />
      {Listing.map((list) => (
        // Looping through the list and passing props to another component
        <IndividualListing data={list} key={list.id} id={list.id} allListingBool={false} startDate={startDate} endDate={endDate} />
      ))}
    </MainContainer>
  );
};

export default AllListingScreen;
