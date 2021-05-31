import Dropdown from 'react-bootstrap/Dropdown';
import styled from 'styled-components';

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
