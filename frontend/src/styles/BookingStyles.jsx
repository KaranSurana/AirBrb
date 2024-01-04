/*
* Booking request form styled components
*
*/
import styled from 'styled-components';
import DatePicker from 'react-datepicker';

export const BookingContainer = styled.div`
  background-color: #062f3c;
  padding: 30px;
  margin-top: 40px;
  border-radius: 10px;
  color: white;
`;

export const Heading = styled.h1`
  text-align: center;
  color: black;
  font: bolder;
`;

export const Subtitle = styled.p`
  color: #FFFFFF;
  font-size: 25px;
  text-align: center;
`;

export const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: none;
  align: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: none;
  margin-bottom: 10px;
`;

export const TotalPriceContainer = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
`;

export const PriceLabel = styled.label`
  display: block;
  font-size: 1.1em;
  color: #FFFFFF;
`;

export const PriceValue = styled.p`
  font-size: 1.5em;
  color: #FFFFFF;
  text-align: center;
`;

export const PriceCondition = styled.p`
  font-size: 1.2em;
  color: #FFFFFF;
  text-align: center;
`;

export const StyledForm = styled.form`
  background-color: #FF385C;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const StyledInput = styled.input`
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;
