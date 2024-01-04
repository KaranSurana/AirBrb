import { React, useState } from 'react';
import styled from 'styled-components';
import { PopupWrapper } from '../../styles/SuccessPopup';
import { Button } from '../../styles/HostedListingCreate';
import { useNavigate } from 'react-router-dom';

export const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 40%;
  height: 75%;
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
`;

export const Input = styled.input`
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const Div = styled.div`
  width: 80%;
  display : flex;
  justify-content: space-between;
  align-items: baseline;
`;

export const Div2 = styled.div`
  width: 80%;
  display : flex;
  justify-content: center;
  align-items: baseline;
`;

export const Select = styled.select`
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SuccessPopup = (props) => {
  const [searchString, setSearchString] = useState('');
  const [minBedroom, setMinBedroom] = useState();
  const [maxBedroom, setMaxBedroom] = useState();
  const [startDate, setstartDate] = useState('');
  const [endDate, setendDate] = useState('');
  const [minPrice, setminPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [order, setorder] = useState('desc');
  const navigate = useNavigate();

  const handleClose = () => {
    props.handleIconClick(false);
  };

  const navigateToAllListing = () => {
    props.handleIconClick(false);
    const queryParams = new URLSearchParams({
      searchString,
      minBedroom: minBedroom || '',
      maxBedroom: maxBedroom || '',
      startDate,
      endDate,
      minPrice: minPrice || '',
      maxPrice: maxPrice || '',
      order,
    });

    navigate(`/?${queryParams.toString()}`);
  };

  return (
    <PopupWrapper>
      <PopupContent>
        <Input type="text" placeholder='Search by title or by address' value={searchString} onChange={(e) => { setSearchString(e.target.value) }}/>
        <Div>
          <Input type="number" placeholder='Min Bedrooms' value={minBedroom} onChange={(e) => { setMinBedroom(e.target.value) }}/>
          <Input type="number" placeholder='Max Bedrooms' value={maxBedroom} onChange={(e) => { setMaxBedroom(e.target.value) }}/>
        </Div>
        <Div>
          <Input type="date" placeholder='Start Date' value={startDate} onChange={(e) => { setstartDate(e.target.value) }}/>
          <Input type="date" placeholder='End Date' value={endDate} onChange={(e) => { setendDate(e.target.value) }}/>
        </Div>
        <Div>
          <Input type="number" placeholder='Min Price' value={minPrice} onChange={ (e) => { setminPrice(e.target.value) }}/>
          <Input type="number" placeholder='Max Price' value={maxPrice} onChange={ (e) => { setMaxPrice(e.target.value) }}/>
        </Div>
        <Div2>
          <Div2><label htmlFor="sortRatings">Sort Ratings</label></Div2>
          <Select id="sortRatings" name="SortRatings" value={order} onChange={ (e) => { setorder(e.target.value) }}>
            <option value="desc">Highest to Lowest</option>
            <option value="asc">Lowest to Highest</option>
          </Select>
        </Div2>
        <Button type="button" onClick={navigateToAllListing}>Search</Button>
        <Button type="button" onClick={handleClose}>Close</Button>
      </PopupContent>
    </PopupWrapper>
  );
};

export default SuccessPopup;
