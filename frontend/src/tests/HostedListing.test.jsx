import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HostedListing from '../components/HostedListingScreen/HostedListing.jsx';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

// mock local storage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mocking fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      listings: [
        {
          id: 56513315,
          title: 'Villa',
          owner: 'test@unsw.edu.au',
          address: {
            buildingNumber: '2',
            streetNumber: '123 Ocean Drive',
            city: 'Sydney',
            state: 'NSW',
            country: 'Australia',
            zipcode: '2076'
          },
          thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
          price: 350,
          reviews: [
            {
              email: 'jane@example.com',
              score: 4,
              comment: 'Great view and location!'
            }
          ],
          metadata: [
            {
              propertyType: 'house',
              bedrooms: '2',
              beds: '2',
              bathrooms: '3',
              amenities: 'garden'
            }
          ]
        },
        {
          id: 56473829,
          title: 'Mountain Retreat',
          owner: 'testuser@example.com',
          address: {
            buildingNumber: '15',
            streetNumber: '123 River Drive',
            city: 'Sydney',
            state: 'NSW',
            zipcode: '2076'
          },
          thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
          price: 500,
          reviews: [
            {
              user: 'mark@example.com',
              rating: 5,
              comment: 'Fantastic.'
            }
          ],
          metadata: [
            {
              propertyType: 'house',
              bedrooms: '2',
              beds: '2',
              bathrooms: '3',
              amenities: 'garden'
            }
          ]
        },
      ]
    }),
  })
);

// example user email
window.localStorage.setItem('userEmail', 'testuser@example.com');

const MockHostedListing = () => {
  return (
    <BrowserRouter>
      <HostedListing />
    </BrowserRouter>
  );
};

describe('HostedListing Component', () => {
  it('renders successfully', async () => {
    render(<MockHostedListing />);
    await waitFor(() => expect(screen.getByTestId('main-container')).toBeInTheDocument());
  });
});
