import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import styled from 'styled-components';

export const StyledInputContainer = styled.div`
  width: 600px;
  margin-top: 10px;
`;

export const StyledFormControl = styled(FormControl)`
  &:focus {
    box-shadow: none;
  }
`;

export const StyledDropdown = styled(Dropdown)`
  position: fixed;
  width: 400px;
`;

export const StyledDropdownItem = styled(Dropdown.Item)`
  height: 50px;
  display: flex;
  background-color: white;
  justify-content: center;
  align-items: center;
`;
