import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Popup parent wrapper styling
export const PopupWrapper = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
`;

// Inner popup details styling
export const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 50%;
  height: 40%;
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
`;

export const SuccessSymbol = styled.i`
  font-size: 4rem;
  color: #FF385C;
`;

export const StyledButton = styled.button`
  background: #FF385C;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 5px;
`;

export const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
`;
