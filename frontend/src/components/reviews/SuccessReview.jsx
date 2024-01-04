import React from 'react';
import { PopupWrapper, PopupContent, SuccessSymbol, StyledButton, StyledLink } from '../../styles/SuccessPopup';

export const SuccessReview = (props) => {
  return (
    <PopupWrapper>
      <PopupContent>
        <SuccessSymbol className='fa-solid fa-circle-check'></SuccessSymbol>
        <h2>Success</h2>
        <p>Your review has been posted!</p>
        <StyledButton onClick={() => { props.closePopup(false) }}>
          <StyledLink>Close</StyledLink>
        </StyledButton>
      </PopupContent>
    </PopupWrapper>
  );
};

export default SuccessReview;
