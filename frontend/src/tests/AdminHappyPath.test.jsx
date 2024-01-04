import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../components/admin/Register';
import HostedListingCreate from '../components/HostedListingCreate/HostedListingCreate.jsx';
import HostedListingEdit from '../components/HostedListingEdit/HostedListingEdit.jsx';
import IndividualListing from '../components/HostedListingScreen/IndividualListing.jsx';
import ListingDetailsParent from '../components/ListingDetails/ListingDetailsParent.jsx';
import NavigationBar from '../components/admin/Navbar.jsx';
import LogoutModal from '../components/admin/Logout.jsx';
import Login from '../components/admin/Login.jsx';
import { Booking } from '../components/bookings/Booking.jsx';
import { AuthProvider, AuthContext } from '../utils/AuthContext.jsx';
import { BrowserRouter, useParams } from 'react-router-dom';
import '@testing-library/jest-dom';

// general mock
const mockedNavigate = jest.fn();
const mockUseLocation = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useParams: jest.fn(),
  useLocation: () => mockUseLocation(),
}));

const mockId = '56513315';

const MockRegister = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </BrowserRouter>
  );
};

const MockCreateListing = () => {
  return (
    <BrowserRouter>
      <HostedListingCreate />
    </BrowserRouter>
  );
};

const MockEditListing = () => {
  useParams.mockReturnValue({ id: mockId });
  return (
    <BrowserRouter>
      <HostedListingEdit />
    </BrowserRouter>
  );
};

const MockUnPublishedIndividualListing = () => {
  return (
    <BrowserRouter>
      <IndividualListing data={mockPublishData} key={mockPublishData.listing.id} id={mockPublishData.listing.id}/>
    </BrowserRouter>
  );
};

const MockPublishedIndividualListing = () => {
  return (
    <BrowserRouter>
      <IndividualListing data={mockunPublishData} key={mockunPublishData.listing.id} id={mockunPublishData.listing.id}/>
    </BrowserRouter>
  );
};

const mockHandleClose = jest.fn();
const mockOnBookingSubmitted = jest.fn();

const MockBooking = () => {
  useParams.mockReturnValue({ id: mockId });
  return (
    <BrowserRouter>
      <Booking pricePerNight={350} show={true} handleClose={mockHandleClose} onBookingSubmitted={mockOnBookingSubmitted} />
    </BrowserRouter>
  )
}

const MockListingDetail = () => {
  useParams.mockReturnValue({ id: mockId });
  return (
    <BrowserRouter>
      <ListingDetailsParent />
    </BrowserRouter>
  );
};
const mockHandleLogoutSuccess = jest.fn();

const MockNavigationBarWithModal = ({ isLoggedIn }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ isLoggedIn, handleLogoutSuccess: mockHandleLogoutSuccess }}>
        <NavigationBar />
        <LogoutModal show={showModal} onHide={() => setShowModal(false)} />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

const MockLogin = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

const mockCreateData = {
  id: 56513315,
  title: 'Villa',
  owner: 'john@example.com',
  address: {
    buildingNumber: '2',
    streetNumber: '123 Ocean Drive',
    city: 'Sydney',
    state: 'NSW',
    zipcode: '2076'
  },
  thumbnail: [],
  price: 350,
  metadata: {
    propertyType: 'house',
    bedrooms: '2',
    beds: '2',
    bathrooms: '3',
    amenities: 'garden'
  },
};

const mockPublishData = {
  listing: {
    id: 56513315,
    title: 'Villa',
    owner: 'john@example.com',
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
    availability: []
  }
};

const mockunPublishData = {
  listing: {
    id: 56513315,
    title: 'Villa',
    owner: 'john@example.com',
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

describe('Admin Happy Path', () => {
  beforeEach(() => {
  });

  afterEach(() => {
    localStorage.clear();
    global.fetch.mockRestore();
  });

  it('step 1 successful registration', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-token' }),
      })
    );

    render(<MockRegister />);
    // fill and submit form
    userEvent.type(screen.getByPlaceholderText('Name:'), 'John Doe');
    userEvent.type(screen.getByPlaceholderText('Email:'), 'john@example.com');
    userEvent.type(screen.getByPlaceholderText('Password:'), 'password');
    userEvent.type(screen.getByPlaceholderText('Confirm Password:'), 'password');
    fireEvent.submit(screen.getByRole('button', { name: 'SIGN UP' }));

    // wait for it to be called 1ce
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    localStorage.setItem('userToken', 'fake-token');
    localStorage.setItem('userEmail', 'john@example.com');

    expect(localStorage.getItem('userEmail')).toBe('john@example.com');
  });

  it('step 2 creates a new listing successfully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ listingId: 1234 }),
      })
    );

    render(<MockCreateListing />);
    // fill out form
    userEvent.type(screen.getByPlaceholderText('Listing Title'), 'Villa');
    userEvent.type(screen.getByPlaceholderText('Building Number'), '2');
    userEvent.type(screen.getByPlaceholderText('Street Number & Name'), '123 Ocean Drive');
    userEvent.type(screen.getByPlaceholderText('City'), 'Sydney');
    userEvent.type(screen.getByPlaceholderText('State'), 'NSW');
    userEvent.type(screen.getByPlaceholderText('ZipCode'), '2076');
    userEvent.type(screen.getByPlaceholderText('Country'), 'Australia');
    userEvent.type(screen.getByPlaceholderText('Price (Per Night)'), '350');
    userEvent.type(screen.getByPlaceholderText('Property Type'), 'House');
    userEvent.type(screen.getByPlaceholderText('Number of Bathrooms'), '2');
    userEvent.type(screen.getByPlaceholderText('Property Bedrooms'), '3');
    userEvent.type(screen.getByPlaceholderText('Total Property Beds'), '4');
    userEvent.type(screen.getByPlaceholderText('Property Amenities (Separated By a Comma)'), 'Wifi, Pool, Air Conditioning');

    // submit form
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText('Your Listing Has Been Hosted!')).toBeInTheDocument();
    });
  });

  it('step 3 updates the thumbnail and title of the listing successfully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCreateData),
      })
    );

    render(<MockEditListing />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    // update title
    const titleInput = screen.getByPlaceholderText('Listing Title');
    fireEvent.change(titleInput, { target: { value: 'Updated Villa' } });

    // update thumnail
    const fileInput = screen.getByLabelText(/Listing Thumbnail/i);
    const newFile = new File(['(⌐□_□)'], 'new-thumbnail.png', { type: 'image/png' });
    userEvent.upload(fileInput, newFile);

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Save Details/i }));

    // mock fetch req
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });

  it('step 4 part 1 displays individual unpublished listings correctly and navigates to publish', async () => {
    localStorage.setItem('userToken', 'fake-token');
    localStorage.setItem('userEmail', 'john@example.com');

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPublishData),
      })
    );

    render(<MockUnPublishedIndividualListing />);
    // display correctly with publish button
    await waitFor(() => {
      expect(screen.getByText('Villa')).toBeInTheDocument();
      expect(screen.getByText('350')).toBeInTheDocument();
      expect(screen.getByTestId('edit-button')).toBeInTheDocument();
      expect(screen.getByTestId('delete-button')).toBeInTheDocument();
      expect(screen.getByTestId('publish-button')).toBeInTheDocument();
    });

    const publishLink = screen.getByTestId('publish-button');
    fireEvent.click(publishLink);

    expect(mockedNavigate).toHaveBeenCalledWith(`/edit/${mockPublishData.listing.id}`);
  });

  it('step 4 part 2 user adds avaliability and publishes', async () => {
    localStorage.setItem('userToken', 'fake-token');
    localStorage.setItem('userEmail', 'john@example.com');

    // mock use params
    useParams.mockReturnValue({ id: '56513315' });

    // mock fetch
    global.fetch = jest.fn((url, options) => {
      if (url.endsWith(`/listings/${'56513315'}`)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCreateData),
        });
      }
      if (url.includes('/listings/publish/') && options.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    render(<MockEditListing />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // fill in dates
    const checkInInput = screen.getByTestId('check-input');
    const checkOutInput = screen.getByTestId('check-output');

    fireEvent.change(checkInInput, { target: { value: '2023-01-01' } });
    fireEvent.change(checkOutInput, { target: { value: '2023-01-05' } });

    // submit
    const publishButton = screen.getByRole('button', { name: /Publish/i });
    fireEvent.click(publishButton);

    // publish api call
    await waitFor(() => expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/listings/publish/'), expect.anything()));
  });

  it('step 5 displays individual published listings and user unpublishes', async () => {
    localStorage.setItem('userToken', 'fake-token');
    localStorage.setItem('userEmail', 'john@example.com');

    global.fetch = jest.fn((url, options) => {
      if (url.includes('/listings/unpublish/') && options.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    render(<MockPublishedIndividualListing />);

    // load component
    await waitFor(() => expect(screen.getByTestId('unpublish-button')).toBeInTheDocument());

    const unpublishButton = screen.getByTestId('unpublish-button');
    fireEvent.click(unpublishButton);

    const unpublishConfirmButton = screen.getByTestId('unpublish-confirm-button');
    fireEvent.click(unpublishConfirmButton);

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/listings/unpublish/56513315'), expect.anything()));
  });

  it('step 5 part 2 verifying that it displays "Book Now" button for non owner user', async () => {
    mockUseLocation.mockReturnValue({ search: '' });

    localStorage.setItem('userEmail', 'test@example.com');
    localStorage.setItem('userToken', 'fake-token');

    global.fetch = jest.fn((url) => {
      if (url === 'http://localhost:5005/listings/56513315') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ listing: mockPublishData.listing }),
        });
      }
    })

    render(<MockListingDetail />);
    await waitFor(async () => {
      expect(await screen.getByTestId('book-now-button')).toBeInTheDocument();
    });
  });

  it('step 6 part 2 submits a successful booking', async () => {
    localStorage.setItem('userEmail', 'john@example.com');
    localStorage.setItem('userToken', 'fake-token');

    const mockListingData = {
      listing: {
        availability: ['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04', '2023-01-05']
      }
    };

    global.fetch = jest.fn((url) => {
      if (url.includes('/listings/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockListingData)
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ bookingId: 78204786 })
      });
    });

    render(<MockBooking />);

    const checkInInput = screen.getByTestId('check-input');
    const checkOutInput = screen.getByTestId('check-output');
    const bookButton = screen.getByTestId('book-submit');

    fireEvent.change(checkInInput, { target: { value: '2023-01-01' } });
    fireEvent.change(checkOutInput, { target: { value: '2023-01-05' } });

    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(mockOnBookingSubmitted).toHaveBeenCalled();
    });
  });

  it('step 7 opens and interacts with logout modal to log out', () => {
    localStorage.setItem('userToken', 'fake-token');

    const mockLogout = jest.fn(() => {
      localStorage.removeItem('userToken');
    });

    render(<MockNavigationBarWithModal isLoggedIn={true} />);

    // click on logout
    fireEvent.click(screen.getByTestId('logout-button'));

    // check modal appears
    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();

    // log out
    fireEvent.click(screen.getByText('Confirm Logout'));

    mockLogout();

    // there should be no user token stored after logout
    expect(localStorage.getItem('userToken')).toBeNull();
  });

  it('step 8 can submit login form successfully and stores data correctly after call', async () => {
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
})
