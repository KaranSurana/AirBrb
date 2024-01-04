import React from 'react'

async function getAllListings () {
  const usersListings = [];
  const response = await fetch('http://localhost:5005/listings/');
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const listingData = await response.json();
  for (let i = 0; i < listingData.length; i++) {
    if (listingData[i].owner === localStorage.getItem('userEmail')) {
      usersListings.push(listingData[i]);
    }
  }
  const currentDate = new Date();
  let count = 0;
  const lastThirtyDays = [];
  const lastThirtyDaysProfits = [];
  while (count !== 30) {
    lastThirtyDaysProfits.push(0);
    lastThirtyDays.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() - 1);
    count++;
  }

  const backendUrl = 'http://localhost:5005/bookings';
  let bookingData = [];
  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      }
    });

    const data = await response.json();
    if (response.ok) {
      bookingData = data.bookings;
    }
  } catch (err) {
    console.log(err);
  }
  console.log(bookingData);
  console.log(lastThirtyDays);

  bookingData.forEach(element => {
    if (usersListings.includes(element.listingId)) {
      let endDate = element.dateRange.end;
      let startDate = element.dateRange.start;
      let count = 0;
      while (endDate.getDate() !== startDate.getDate()) {
        count++;
        endDate.setDate(currentDate.getDate() - 1);
      }
      count++;
      endDate = element.dateRange.end;
      startDate = element.dateRange.start;
      while (endDate.getDate() !== startDate.getDate()) {
        if (lastThirtyDays.includes(endDate)) {
          lastThirtyDaysProfits[lastThirtyDays.indexOf(endDate)] += ((element.totalPrice) / count);
          endDate.setDate(currentDate.getDate() - 1);
        }
      }
      console.log(lastThirtyDaysProfits);
    }
  });
}

getAllListings();

const ListingsProfits = () => {
  return (
    <div>listings-profits</div>
  )
}

export default ListingsProfits;
