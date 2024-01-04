/*
* Styled components for login screen
*
*/
import styled from 'styled-components';

export const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
`;

export const LoginHeading = styled.h1`
  color: #000000;
  text-align: center;
  margin-bottom: 20px;
  margin-left: -20px;
`;

export const LoginFormHolder = styled.div`
  position: relative;
  min-height: 600px;
  width: 100%;
  max-width: 360px;
  margin: auto;
  box-shadow: 0px 0px 24px #FF385C;
`;

export const LoginFormContent = styled.div`
  z-index: 1;
  position: relative;
  height: 100%;
`;

export const LoginForm = styled.form`
  width: 100%;
  padding: 30px;
  padding-top: 60px;
  margin: auto;
  background: white;
`;

export const LoginField = styled.div`
  padding: 20px 0px;
  position: relative;
`;

export const LoginInput = styled.input`
  border: none;
  border-bottom: 2px solid #d1d1d4bd;
  background: none;
  padding: 10px;
  font-weight: bolder;
  width: 95%;
  transition: .2s;

  &:focus {
    outline: none;
    border-bottom-color: #FF385C;
  }
`;

export const LoginButton = styled.button`
  background: #fff;
  font-size: 16px;
  text-align: center;
  margin-top: 30px;
  padding: 14px 16px;
  border-radius: 30px;
  border: 1px solid #D4D3E8;
  font-weight: bolder;
  display: flex;
  align-items: center;
  width: 95%;
  color: #9b0823;
  box-shadow: 0px 4px 4px #FF385C;
  cursor: pointer;
  transition: .2s;

  &:hover, &:focus, &:active {
    border-color: #FF385C;
    outline: none;
  }
`;

export const Icon = styled.i`
  font-size: 24px;
  margin-left: auto;
  color: #FF385C;
`;

export const PasswordToggleIcon = styled.span`
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #6c757d;
  z-index: 2;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 20px;

  &:hover {
    color: red;
  }
`;
