import React from 'react';
import { PopupWrapper, PopupContent, SuccessSymbol, StyledButton, StyledLink } from '../../styles/SuccessPopup';

// Success Popup here
export const SuccessPopup = (props) => {
  return (
    <PopupWrapper>
      <PopupContent>
        <SuccessSymbol className='fa-solid fa-circle-check'></SuccessSymbol>
        <h2>Success</h2>
        <p>Your Listing Has Been Hosted!</p>
        {/* Close Button */}
        <StyledButton onClick={() => { props.closePopup(false) }}>
          <StyledLink to='/hosted-listings'>Close</StyledLink>
        </StyledButton>
      </PopupContent>
    </PopupWrapper>
  );
};

export default SuccessPopup;
