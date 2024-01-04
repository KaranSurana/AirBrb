import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ListingDetailsParent from '../components/ListingDetails/ListingDetailsParent.jsx';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

// mock navigate
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const mockUseLocation = jest.fn();

// general mock
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '56513315' }),
  useLocation: () => mockUseLocation(),
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
    availability: ['2023-01-01', '2023-01-02']
  }
};

const MockListingDetail = () => {
  return (
    <BrowserRouter>
      <ListingDetailsParent />
    </BrowserRouter>
  );
};

describe('ListingDetailsParent Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url === 'http://localhost:5005/listings/56513315') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ listing: mockData.listing }),
        });
      }
    })
    localStorage.clear();
    localStorage.setItem('userEmail', 'test@example.com');
    localStorage.setItem('userToken', 'fake-token');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it('renders information correctly', async () => {
    mockUseLocation.mockReturnValue({ search: '' });
    render(<MockListingDetail />);
    expect(await screen.findByText(/2\s+123 Ocean Drive/)).toBeInTheDocument();
    expect(await screen.findByText('Villa')).toBeInTheDocument();
    expect(await screen.findByText('Property Type: house')).toBeInTheDocument();
    expect(await screen.findByText('Pricing:')).toBeInTheDocument();
    expect(await screen.getByTestId('booking-history')).toBeInTheDocument();
    expect(await screen.getByTestId('listing-reviews')).toBeInTheDocument();
  });

  it('renders price correctly without date parameters', async () => {
    mockUseLocation.mockReturnValue({ search: '' });
    render(<MockListingDetail />);
    expect(await screen.findByText('Price Per Night: $350')).toBeInTheDocument();
  });

  it('renders correctly with date parameters', async () => {
    mockUseLocation.mockReturnValue({ search: '?startDate=2023-01-01&endDate=2023-01-02' });

    render(<MockListingDetail />);

    expect(await screen.findByText('Total Price for Stay: $350')).toBeInTheDocument();
  });

  it('displays "Book Now" button for non owner user', async () => {
    mockUseLocation.mockReturnValue({ search: '' });
    render(<ListingDetailsParent />);
    await waitFor(async () => {
      expect(await screen.getByTestId('book-now-button')).toBeInTheDocument();
    });
  });

  it('displays booking modal when "Book Now" button is clicked', async () => {
    mockUseLocation.mockReturnValue({ search: '' });

    render(<MockListingDetail />);

    const bookNowButton = await screen.getByTestId('book-now-button');

    fireEvent.click(bookNowButton);

    await waitFor(() => {
      expect(screen.getByText('Make a Booking')).toBeInTheDocument();
    });
  });
});
