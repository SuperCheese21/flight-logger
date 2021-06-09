import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
import styled from 'styled-components';

export const StyledInputContainer = styled.div`
  width: 600px;
  margin-top: 10px;
`;

export const StyledFormControl = styled(FormControl)`
  &:focus {
    box-shadow: none;
  }
  border-radius: 5px !important;
  padding-right: 30px !important;
`;

export const StyledDropdown = styled.div`
  position: fixed;
  width: 400px;
`;

export const StyledDropdownMenu = styled(Dropdown.Menu)`
  width: 100%;
  opacity: 1 !important;
`;

export const StyledDropdownItem = styled(Dropdown.Item)`
  width: 100%;
  height: 50px;
  background-color: white;
  display: flex;
  align-items: center;
`;

export const StyledImageContainer = styled.div`
  width: 100px;
  height: 100%;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

export const StyledImage = styled(Image)`
  max-height: 100%;
  max-width: 100%;
`;

export const StyledTextContainer = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const StyledSpinnerContainer = styled.div`
  opacity: ${({ opacity }) => opacity};
  z-index: 3;
  height: 100%;
  position: absolute;
  right: 5px;
  display: flex;
  align-items: center;
`;

export const StyledSpinner = styled(Spinner)`
  width: 25px;
  height: 25px;
`;
