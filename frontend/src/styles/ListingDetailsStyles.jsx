/*
* Styled components for Listing Details
*
*/
import styled from 'styled-components';
import {
  Container as ReactBootstrapContainer,
  Card as ReactBootstrapCard,
  Button as ReactBootstrapButton
} from 'react-bootstrap';

export const Title = styled.h1`
  text-align: left;
  font-size: 2em;
  margin-bottom: 0.5em;
  margin-top: 2rem;
`;

export const Div = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;

export const Div2 = styled.div`
  display: flex;
  justify-content: flex-start;
  font-weight: 600;
  font-size: 1.2rem;
  padding-left: 5.5rem;
  @media screen and (max-width: 1290px) {
    padding-left: 4rem;
  }
  @media screen and (max-width: 1200px) {
    padding-left: 3rem;
  }
  @media screen and (max-width: 850px) {
    padding-left: 6.5rem;
  }
  @media screen and (max-width: 768px) {
    padding-left: 4rem;
  }
`;

export const Div6 = styled.div`
  display: flex;
  justify-content: flex-start;
  font-weight: 600;
  font-size: 1.2rem;
  margin-top: 1rem;
`;

export const Div3 = styled.div`
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 850px) {
    flex-direction: column;
  }
`;

export const Div4 = styled.div`
  text-align: left;
`;

export const Div5 = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const AddressText = styled.p`
  text-align: center;
  margin-bottom: 1em;
  font-style: bold;
`;

export const DisplayText = styled.p`
  text-align: left;
  margin-bottom: 1em;
  font-style: italic;
`;

// bootstrap container
export const Container = styled(ReactBootstrapContainer)`
    margin-top: 3%;
`;

// bootstrap button
export const Button = styled(ReactBootstrapButton)`
    background-color: #FF385C;
    color: white;
    text-align: center;
    border: none;

    &:hover, &:focus, &:active {
      border-color: #ad0e2a;
      outline: none;
      background-color: #e86880;
    }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

export const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  span {
    margin-right: 5px;
    font-size: 1.2em;
  }
`;

// bootstrap card
export const Card = styled(ReactBootstrapCard)`
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-left: 1%;
    width: 50%;
    height: 370px;
    border: none;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 18px;

    @media screen and (max-width: 850px) {
      width: 100%;
      margin-top: 1rem;
    }
`;

export const Card2 = styled(ReactBootstrapCard)`
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-left: 1%;
    width: 100%;
    height: auto;
    padding: 1.1rem;
    border: none;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 18px;
`;

export const BookingReviewCard = styled.div`
  border: 1px solid #e0e0e0; // Light grey border
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #f9f9f9; // Light background
`;
