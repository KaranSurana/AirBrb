/*
* Manage Booking Requests styled components
*
*/
import styled from 'styled-components';
import { Card, Button } from 'react-bootstrap';

// bootstrap card styling
export const StyledCard = styled(Card)`
  min-height: 8vh;
  min-width: 35vw;
`;

// bootstrap button
export const AcceptButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #50C878;
  color: white;
  text-align: center;
  border: none;
  margin-bottom: 10%;
  margin-right: 15%;

  &:hover, &:focus, &:active {
    border-color: #097969;
    outline: none;
    background-color: #097969;
  }
`;

// bootstrap button
export const DeclineButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #D22B2B;
  color: white;
  text-align: center;
  border: none;
  margin-right: 15%;

  &:hover, &:focus, &:active {
    border-color: #C41E3A;
    outline: none;
    background-color: #C41E3A;
  }
`;

export const OverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
  background-color: white; // or any color you prefer
  padding: 1rem;
`;

export const RequestTitle = styled.h2`
  background-color: #FF385C;
  border-radius: 8px;
  padding: 10px 20px;
  display: inline-block;
  margin-bottom: 20px;
  color: white;
`;

export const RequestContainer = styled.div`
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  font-family: Arial;
  background-color: white;
`;

export const BookingCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #FF385C;
  margin-bottom: 3rem;
  height: auto;
  overflow: hidden;
  width: 60%;
  max-width: 60rem;
  margin: 0 auto;
  &:hover,
  &:hover * {
    border-color: #FF385C;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 15%;
  text-align: center;
`;

export const Column = styled.div`
  display: inline-block;
  vertical-align: top;
  font-size: medium;
  text-align: left;
  width: 33.3%;
  height: 100%;
`;

export const BookingInfo = styled.div`
  padding: .5rem;
  h3 {
    font: 300 2.4em/1, Arial;
    letter-spacing: -.020em;
    margin: 0 0 .120em;
  }
  p {
    line-height: 1;
  }
`;

export const StatusBadge = styled.span`
  padding: .20em .60em;
  background-color: #3498db;
  color: white;
  border-radius: 5px;
`;

export const HistoryContainer = styled(RequestContainer)`
`;

export const HistoryTitle = styled(RequestTitle)`
`;
