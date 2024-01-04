import { React } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HostedListingCreate from '../components/HostedListingCreate/HostedListingCreate.jsx';
import { BrowserRouter } from 'react-router-dom';

const MockCreateListing = () => {
  return (
    <BrowserRouter>
      <HostedListingCreate />
    </BrowserRouter>
  );
};

describe('HostedListingCreate Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ listingId: 56513315 }),
      })
    );
    fetch.mockClear();
  });

  it('creates a new listing successfully', async () => {
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

    // upload image
    const fileInput = screen.getByTestId('thumbnail-upload');
    const file = new File(['(⌐□_□)'], 'thumbnail.png', { type: 'image/png' });
    userEvent.upload(fileInput, file);

    // submit form
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText('Your Listing Has Been Hosted!')).toBeInTheDocument();
    });
  });
});
