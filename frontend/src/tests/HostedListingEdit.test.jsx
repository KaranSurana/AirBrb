import { React } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HostedListingEdit from '../components/HostedListingEdit/HostedListingEdit.jsx';
import { BrowserRouter } from 'react-router-dom';

const MockEditListing = () => {
  return (
    <BrowserRouter>
      <HostedListingEdit />
    </BrowserRouter>
  );
};

const mockData = {
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
  thumbnail: null,
  metadata: {
    propertyType: 'house',
    bedrooms: '2',
    beds: '2',
    bathrooms: '3',
    amenities: 'garden'
  },
};

describe('HostedListingEdit Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );
    fetch.mockClear();
  });

  it('updates the thumbnail and title of the listing successfully', async () => {
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
    // fetch twice to account for mounting in the component (useEffect)
    fireEvent.click(screen.getByRole('button', { name: /Save Details/i }));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    // mock fetch req
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });
});
