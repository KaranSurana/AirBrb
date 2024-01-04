import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Booking } from '../components/bookings/Booking.jsx';

describe('Booking Component', () => {
  const mockHandleClose = jest.fn();
  const mockOnBookingSubmitted = jest.fn();

  beforeEach(() => {
    render(
      <BrowserRouter>
        <Booking pricePerNight={350} show={true} handleClose={mockHandleClose} onBookingSubmitted={mockOnBookingSubmitted} />
      </BrowserRouter>
    );
  });

  it('renders the booking modal', () => {
    expect(screen.getByTestId('check-in')).toBeInTheDocument();
    expect(screen.getByTestId('check-out')).toBeInTheDocument();
    expect(screen.getByTestId('book-submit')).toBeInTheDocument();
    expect(screen.getByTestId('total-nights')).toBeInTheDocument();
    expect(screen.getByTestId('total-price')).toBeInTheDocument();
  });

  it('updates total price and nights when dates are changed', async () => {
    const checkInInput = screen.getByTestId('check-input');
    const checkOutInput = screen.getByTestId('check-output');

    fireEvent.change(checkInInput, { target: { value: '2023-01-01' } });
    fireEvent.change(checkOutInput, { target: { value: '2023-01-05' } });
    fireEvent.click(screen.getByTestId('book-submit'))
    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('1400')).toBeInTheDocument();
    });
  });

  it('shows error message for invalid date range', async () => {
    const checkInInput = screen.getByTestId('check-input');
    const checkOutInput = screen.getByTestId('check-output');

    fireEvent.change(checkInInput, { target: { value: '2023-01-01' } });
    fireEvent.change(checkOutInput, { target: { value: '2023-01-01' } });
    fireEvent.click(screen.getByTestId('book-submit'))

    await waitFor(() => {
      expect(screen.getByText('Start date cannot be equal to the end date')).toBeInTheDocument();
    });
  });

  it('closes the modal on close button click', async () => {
    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    expect(mockHandleClose).toHaveBeenCalled();
  });
});
