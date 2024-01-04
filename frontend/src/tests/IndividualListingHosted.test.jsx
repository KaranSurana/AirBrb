import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

const MockIndividualListing = () => {
  return (
    <BrowserRouter>
      <IndividualListing data={mockData} key={mockData.listing.id} id={mockData.listing.id}/>
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

  it('renders listing data correctly', async () => {
    render(<MockIndividualListing />);
    await waitFor(() => {
      expect(screen.getByText('Villa')).toBeInTheDocument();
      expect(screen.getByText('350')).toBeInTheDocument();
    });
  });

  it('navigates correctly when edit button is clicked', async () => {
    render(<MockIndividualListing />);
    fireEvent.click(screen.getByTestId('edit-button'));
    expect(mockedNavigate).toHaveBeenCalledWith('/edit/56513315');
  });

  it('navigates correctly when booking request button is clicked', async () => {
    render(<MockIndividualListing />);
    fireEvent.click(screen.getByTestId('booking-request-button'));
    expect(mockedNavigate).toHaveBeenCalledWith('/manage-booking-requests/56513315');
  });

  it('navigates correctly when delete button is clicked', async () => {
    render(<MockIndividualListing />);
    fireEvent.click(screen.getByTestId('delete-button'));
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toHaveTextContent('Confirm Deletion');
    });
  });

  it('displays control buttons for listing owner', async () => {
    render(<MockIndividualListing />);
    await waitFor(() => {
      expect(screen.getByTestId('edit-button')).toBeInTheDocument();
      expect(screen.getByTestId('delete-button')).toBeInTheDocument();
      expect(screen.getByTestId('booking-request-button')).toBeInTheDocument();
      expect(screen.getByTestId('unpublish-button')).toBeInTheDocument();
    });
  });

  it('navigates to listing details without parameters', async () => {
    render(<MockIndividualListing />);

    const detailLink = screen.getByTestId('detail-button');
    fireEvent.click(detailLink);

    expect(mockedNavigate).toHaveBeenCalledWith(`/listing-details/${mockData.listing.id}`);
  });
})
