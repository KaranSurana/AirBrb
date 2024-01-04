/*
* Success Popup for Confirmed Booking
*
* Component to act as a temporary validation/confirmation for the user
* to confirm that their booking request has gone through
* Modelled off the success pop up component
*
*/
import React from 'react';
import { PopupWrapper, PopupContent, SuccessSymbol, StyledButton, StyledLink } from '../../styles/SuccessPopup';

export const SuccessBooking = (props) => {
  return (
    <PopupWrapper>
      <PopupContent>
        <SuccessSymbol className='fa-solid fa-circle-check'></SuccessSymbol>
        <h2>Success</h2>
        <p>Booking request successful! Please wait for confirmation from the owner.!</p>
        <StyledButton onClick={() => { props.closePopup(false) }}>
          <StyledLink>Close</StyledLink>
        </StyledButton>
      </PopupContent>
    </PopupWrapper>
  );
};

export default SuccessBooking;
