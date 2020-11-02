import { number } from 'prop-types';
import React from 'react';

import DropdownItem from './DropdownItem';

import { regionShape } from '../api/shapes';

const RegionDropdownItem = ({ index, result }) => (
  <DropdownItem eventKey={index}>
    {`${result._id} - ${result.name}, ${result.country}`}
  </DropdownItem>
);

RegionDropdownItem.propTypes = {
  index: number.isRequired,
  result: regionShape.isRequired,
};

export default RegionDropdownItem;
