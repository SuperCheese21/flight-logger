import { node, number, string } from 'prop-types';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import styled from 'styled-components';

const DropdownItem = ({ children, className, eventKey }) => (
  <Dropdown.Item className={className} eventKey={eventKey}>
    {children}
  </Dropdown.Item>
);

DropdownItem.propTypes = {
  children: node.isRequired,
  className: string.isRequired,
  eventKey: number.isRequired,
};

export default styled(DropdownItem)`
  height: 50px;
  display: flex;
  background-color: white;
  justify-content: center;
  align-items: center;
`;
