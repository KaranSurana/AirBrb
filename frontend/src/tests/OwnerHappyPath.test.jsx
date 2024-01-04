import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/admin/Login.jsx';
import SuccessPopup from '../components/admin/SearchPopup.jsx';
import ListingDetailsParent from '../components/ListingDetails/ListingDetailsParent.jsx';
import ManageHostingBooking from '../components/bookings/ManageHostingBookings.jsx';
import Review from '../components/reviews/Reviews.jsx';
import { AuthProvider } from '../utils/AuthContext.jsx';
import { BrowserRouter, useParams } from 'react-router-dom';
import '@testing-library/jest-dom';

// general mock
const mockedNavigate = jest.fn();
const mockUseLocation = jest.fn();
const mockHandleIconClick = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useParams: jest.fn(),
  useLocation: () => mockUseLocation(),
}));

const mockId = '56513315';

const MockLogin = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

const MockSearchPopup = () => {
  return (
    <BrowserRouter>
      <SuccessPopup handleIconClick={mockHandleIconClick} />
    </BrowserRouter>
  );
};

const MockListingDetail = () => {
  useParams.mockReturnValue({ id: mockId });
  return (
    <BrowserRouter>
      <ListingDetailsParent />
    </BrowserRouter>
  );
};

const MockManageBooking = () => {
  useParams.mockReturnValue({ id: mockId });
  return (
    <BrowserRouter>
      <ManageHostingBooking />
    </BrowserRouter>
  );
};

const MockReviewDetail = ({ handleClose, onReviewSubmitted }) => {
  useParams.mockReturnValue({ id: mockId });
  return (
    <BrowserRouter>
      <Review
        bookingId="56513315"
        show={true}
        handleClose={handleClose}
        onReviewSubmitted={onReviewSubmitted}
      />
    </BrowserRouter>
  );
};

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

const mockBook = {
  bookings: [
    {
      id: '1',
      status: 'pending',
      owner: 'testuser1@example.com',
      dateRange: {
        start: '2023-01-01',
        end: '2023-01-03'
      },
      totalPrice: '500',
      listingId: '56513315'
    }
  ]
}

const mockBooked = {
  bookings: [
    {
      id: '1',
      status: 'accepted',
      owner: 'testuser1@example.com',
      dateRange: {
        start: '2023-01-01',
        end: '2023-01-03'
      },
      totalPrice: '500',
      listingId: '56513315'
    }
  ]
}

describe('Admin Happy Path', () => {
  beforeEach(() => {
  });

  afterEach(() => {
    localStorage.clear();
    global.fetch.mockRestore();
  });

  it('step 1 user logs in and data is stored correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-token' }),
      })
    );

    Storage.prototype.setItem = jest.fn();

    render(<MockLogin />);
    // fill out form and submit
    userEvent.type(screen.getByPlaceholderText('Email:'), 'test@example.com');
    userEvent.type(screen.getByPlaceholderText('Password:'), 'password');
    fireEvent.submit(screen.getByRole('button', { name: 'LOGIN' }));

    // fetch
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // check if token is stored for successful login
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('userToken', 'fake-token');
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('userEmail', 'test@example.com');
  });

  it('Step 2 navigates with correct parameters on Search', () => {
    render(<MockSearchPopup />);
    fireEvent.change(screen.getByPlaceholderText('Search by title or by address'), { target: { value: 'Test Search' } });
    fireEvent.change(screen.getByPlaceholderText('Min Bedrooms'), { target: { value: '1' } });
    fireEvent.change(screen.getByPlaceholderText('Max Bedrooms'), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Start Date'), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('End Date'), { target: { value: '2023-01-03' } });
    fireEvent.change(screen.getByPlaceholderText('Min Price'), { target: { value: '0' } });
    fireEvent.change(screen.getByPlaceholderText('Max Price'), { target: { value: '0' } });
    fireEvent.change(screen.getByRole('combobox', { name: /Sort Ratings/i }), { target: { value: 'asc' } });

    fireEvent.click(screen.getByText('Search'));

    expect(mockedNavigate).toHaveBeenCalledWith('/?searchString=Test+Search&minBedroom=1&maxBedroom=2&startDate=2023-01-01&endDate=2023-01-03&minPrice=0&maxPrice=0&order=asc');
  });

  it('Step 3 renders price when clicking on listing details correctly with date parameters', async () => {
    global.fetch = jest.fn((url) => {
      if (url === 'http://localhost:5005/listings/56513315') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ listing: mockData.listing }),
        });
      }
    })
    localStorage.setItem('userEmail', 'test@example.com');
    localStorage.setItem('userToken', 'fake-token');
    mockUseLocation.mockReturnValue({ search: '?startDate=2023-01-01&endDate=2023-01-03' });
    render(<MockListingDetail />);
    expect(await screen.findByText(/2\s+123 Ocean Drive/)).toBeInTheDocument();
    expect(await screen.findByText('Villa')).toBeInTheDocument();
    expect(await screen.findByText('Property Type: house')).toBeInTheDocument();
    expect(await screen.findByText('Pricing:')).toBeInTheDocument();
    expect(await screen.getByTestId('booking-history')).toBeInTheDocument();
    expect(await screen.getByTestId('listing-reviews')).toBeInTheDocument();
    expect(await screen.findByText('Total Price for Stay: $700')).toBeInTheDocument();
  });

  it('Step 4 goes to check booking requests and accepts a booking request', async () => {
    localStorage.setItem('userToken', 'fake-token');
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBook)
      })
    );

    render(<MockManageBooking />);

    expect(screen.getByTestId('booking-request')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('booking-request'));
    await waitFor(() => expect(screen.getByText('ID: 1')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('accept-button'));

    global.fetch.mockImplementationOnce((url, options) => {
      if (options.method === 'PUT') {
        return Promise.resolve({ ok: true });
      }
      return Promise.error('Unknown fetch call');
    });

    fireEvent.click(screen.getByTestId('confirm-button'));
  });

  it('Step 5 checks booking history to verify booking confirmed', async () => {
    localStorage.setItem('userToken', 'fake-token');
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBooked)
      })
    );

    render(<MockManageBooking />);

    expect(screen.getByTestId('booking-history')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('booking-history'));
    await waitFor(() => {
      expect(screen.getByText('Current status: accepted')).toBeInTheDocument();
    });
  });

  it('Step 6 successfully leaves a review', async () => {
    const handleReviewSubmitted = jest.fn();
    const handleClose = jest.fn();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    const { getByPlaceholderText, getByText } = render(
      <MockReviewDetail
        handleClose={handleClose}
        onReviewSubmitted={handleReviewSubmitted}
      />
    );

    fireEvent.change(getByPlaceholderText('Score (1-5)'), { target: { value: '5' } });
    fireEvent.change(getByPlaceholderText('Leave your comment here...'), { target: { value: 'Great stay!' } });
    fireEvent.click(getByText('Submit Review'));

    await waitFor(() => {
      expect(handleReviewSubmitted).toHaveBeenCalled();
    });
  });
})
