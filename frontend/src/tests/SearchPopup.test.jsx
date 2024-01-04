import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuccessPopup from '../components/admin/SearchPopup';

// Mock navigate
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('SuccessPopup Component', () => {
  const mockHandleIconClick = jest.fn();

  beforeEach(() => {
    render(<SuccessPopup handleIconClick={mockHandleIconClick} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders successfully', () => {
    expect(screen.getByPlaceholderText('Search by title or by address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min Bedrooms')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max Bedrooms')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Start Date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('End Date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min Price')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max Price')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Sort Ratings/i })).toBeInTheDocument();
  });

  // user interaction
  it('allows input interaction', () => {
    const searchInput = screen.getByPlaceholderText('Search by title or by address');
    fireEvent.change(searchInput, { target: { value: 'Test Search' } });
    expect(searchInput.value).toBe('Test Search');

    const minBedroomInput = screen.getByPlaceholderText('Min Bedrooms');
    fireEvent.change(minBedroomInput, { target: { value: '1' } });
    expect(minBedroomInput.value).toBe('1');

    const maxBedroomInput = screen.getByPlaceholderText('Max Bedrooms');
    fireEvent.change(maxBedroomInput, { target: { value: '2' } });
    expect(maxBedroomInput.value).toBe('2');

    const startDateInput = screen.getByPlaceholderText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '2022-02-12' } });
    expect(startDateInput.value).toBe('2022-02-12');

    const endDateInput = screen.getByPlaceholderText('End Date');
    fireEvent.change(endDateInput, { target: { value: '2024-02-12' } });
    expect(endDateInput.value).toBe('2024-02-12');

    const minPriceInput = screen.getByPlaceholderText('Min Price');
    fireEvent.change(minPriceInput, { target: { value: '12' } });
    expect(minPriceInput.value).toBe('12');

    const maxPriceInput = screen.getByPlaceholderText('Max Price');
    fireEvent.change(maxPriceInput, { target: { value: '15' } });
    expect(maxPriceInput.value).toBe('15');
  });

  it('changes value when a rating option is selected', () => {
    const sortDropdown = screen.getByRole('combobox', { name: /Sort Ratings/i });
    fireEvent.change(sortDropdown, { target: { value: 'asc' } });
    expect(sortDropdown.value).toBe('asc');
  });

  it('closes when Close button is clicked', () => {
    fireEvent.click(screen.getByText('Close'));
    expect(mockHandleIconClick).toHaveBeenCalledWith(false);
  });

  it('navigates with correct parameters on Search', () => {
    fireEvent.change(screen.getByPlaceholderText('Search by title or by address'), { target: { value: 'Test Search' } });
    fireEvent.change(screen.getByPlaceholderText('Min Bedrooms'), { target: { value: '1' } });
    fireEvent.change(screen.getByPlaceholderText('Max Bedrooms'), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Start Date'), { target: { value: '2022-02-12' } });
    fireEvent.change(screen.getByPlaceholderText('End Date'), { target: { value: '2023-02-12' } });
    fireEvent.change(screen.getByPlaceholderText('Min Price'), { target: { value: '12' } });
    fireEvent.change(screen.getByPlaceholderText('Max Price'), { target: { value: '15' } });
    fireEvent.change(screen.getByRole('combobox', { name: /Sort Ratings/i }), { target: { value: 'asc' } });

    fireEvent.click(screen.getByText('Search'));

    expect(mockedNavigate).toHaveBeenCalledWith('/?searchString=Test+Search&minBedroom=1&maxBedroom=2&startDate=2022-02-12&endDate=2023-02-12&minPrice=12&maxPrice=15&order=asc');
  });
});
