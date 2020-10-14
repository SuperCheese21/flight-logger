import { node, number } from 'prop-types';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

const DropdownItem = ({ children, eventKey }) => (
  <Dropdown.Item className="search-dropdown-item" eventKey={eventKey}>
    {children}
  </Dropdown.Item>
);

DropdownItem.propTypes = {
  children: node.isRequired,
  eventKey: number.isRequired,
};

export default DropdownItem;
