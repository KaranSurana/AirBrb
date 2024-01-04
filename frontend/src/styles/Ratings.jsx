import styled from 'styled-components';

// ratings styling
export const StarContainer = styled.div`
  font-size: 28px;
  margin-top: -10px
`;

// Star styling
export const Star = styled.span`
  cursor: default;
  color: ${(props) => (props.active ? 'gold' : 'gray')};
`;
