import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IndividualListing from '../components/HostedListingScreen/IndividualListing.jsx';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

// mock navigate
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const mockData = {
  listing: {
    id: 56513315,
    title: 'Villa',
    owner: 'testuser@example.com',
    address: {
      buildingNumber: '2',
      streetNumber: '123 Ocean Drive',
      city: 'Sydney',
      state: 'NSW',
      zipcode: '2076'
    },
    thumbnail: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='],
    price: 350,
    reviews: [
      {
        email: 'jane@example.com',
        score: 4,
        comment: 'Great view and location!'
      }
    ],
    metadata: {
      propertyType: 'house',
      bedrooms: '2',
      beds: '2',
      bathrooms: '3',
      amenities: 'garden'
    },
    published: true,
    postedOn: '2023-11-15T12:19:04.743Z',
    availability: []
  }
};

const startDate = '2023-01-01';
const endDate = '2023-01-02';

const MockIndividualListing = () => {
  return (
    <BrowserRouter>
      <IndividualListing data={mockData} key={mockData.listing.id} id={mockData.listing.id} allListingBool={true} startDate={startDate} endDate={endDate}/>
    </BrowserRouter>
  );
};

describe('IndividualListing Hosted Screens Component', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('userEmail', 'testuser@example.com');
    localStorage.setItem('userToken', 'fake-token');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('hides buttons in the publish section and all listing icons should exist', async () => {
    render(<MockIndividualListing />);
    expect(screen.queryByTestId('publish-section')).toBeNull();
    const listingIcons = screen.queryAllByTestId('all-listing-icon');
    expect(listingIcons.length).toBe(4);
  });

  it('navigates to listing details with date parameters', async () => {
    render(<MockIndividualListing />);

    const detailLink = screen.getByTestId('detail-button');
    fireEvent.click(detailLink);

    expect(mockedNavigate).toHaveBeenCalledWith(`/listing-details/${mockData.listing.id}?startDate=${startDate}&endDate=${endDate}`);
  });
})
