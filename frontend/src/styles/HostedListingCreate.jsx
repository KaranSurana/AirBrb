import styled from 'styled-components';
// Parent Container Styling
export const FormContainer = styled.form`
  font-family: Arial, Helvetica, sans-serif;
  max-width: 50%;
  margin: 0 auto;
  margin-top: 1%;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #ededed;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 850px) {
    max-width: 90%;
  }
  @media screen and (max-width: 550px) {
    max-width: 90%;
    flex-direction: column;
  }
  
`;

export const InnerFormContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media screen and (max-width: 850px) {
    flex-direction: column;
  }
`;

// Left Form Styling
export const InnerFormLeft = styled.div`
  width: 47%;

  @media screen and (max-width: 850px) {
    width: 100%;
  }

  @media screen and (max-width: 550px) {
    width: 100%;
  }
`;
// Right Form Styling
export const InnerFormRight = styled.div`
  width: 47%;

  @media screen and (max-width: 850px) {
    width: 100%;
  }

  @media screen and (max-width: 550px) {
    width: 100%;
  }
`;
// Custom Label Styling
export const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  margin-left: 2px;
  color: #333; /* Placeholder text color */
`;

// Custom Label Styling
export const Label3 = styled.label`
  color: #ff385c;
  display: block;
  font-size: 0.9rem;
  margin-left: 2px;
`;
// Custom Input Styling
export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;

  &:not([type="file"]) {
    width: 100%;
    padding: 10px;
  }
`;

// Button Styling
export const Button = styled.button`
  width: 100%;
  background-color: #ff385c;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
`;

// Button Styling
export const Button3 = styled.button`
  width: 50%;
  background-color: #ff385c;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
`;

// Header Styling
export const ActualHeader = styled.div`
  text-align: center;
  padding-bottom: 12px;
  color: #ff385c;
`;

export const FlexAllImg = styled.div`
  display: flex;
`;

export const ImgDelete = styled.i`
  color: red;
  font-size: 0.5rem;
  font-weight: 900;
  cursor: pointer;
`;

export const ImgName = styled.span`
  font-size: 0.8rem;
`;

// Image Div Styling
export const FlexImg = styled.div`
  display: flex;
  width: 37%;
  justify-content: space-between;
  align-items: center;
  background-color: #ccc;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 5px;
`;

// Custom Label Styling
export const Label2 = styled.label`
  display: block;
  color: #FF385C;
  margin-bottom: 10px;
  margin-left: 2px;
`;

// Custom Input Styling
export const Input2 = styled.input`
  width: 100%;
  color: #FF385C;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;

  &:not([type="file"]) {
    width: 100%;
    padding: 10px;
  }
`;

export const Button2 = styled.button`
  width: 50%;
  background-color: #2c2c2c;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
`;
