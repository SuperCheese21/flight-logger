import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
import styled from 'styled-components';

import { DROPDOWN_ITEM_HEIGHTS, DROPDOWN_MENU_WIDTHS } from './constants';

export const StyledInputContainer = styled.div`
  ${({ width }) => width && `width: ${width}px;`}
`;

export const StyledFormControl = styled(Form.Control)`
  &:focus {
    box-shadow: none;
  }
  border-radius: 5px !important;
  padding-right: 30px !important;
`;

export const StyledDropdown = styled.div`
  position: fixed;
  width: ${({ size }) => `${DROPDOWN_MENU_WIDTHS[size]}px`};
`;

export const StyledDropdownMenu = styled(Dropdown.Menu)`
  width: 100%;
  opacity: 1 !important;
`;

export const StyledDropdownItem = styled(Dropdown.Item)`
  width: 100%;
  height: ${({ size }) => `${DROPDOWN_ITEM_HEIGHTS[size]}px`};
  background-color: white;
  pointer-events: auto;
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
