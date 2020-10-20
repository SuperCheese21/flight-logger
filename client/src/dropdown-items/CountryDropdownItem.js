import { number } from 'prop-types';
import React from 'react';

import DropdownItem from './DropdownItem';

import { countryShape } from '../api';

const CountryDropdownItem = ({ index, result }) => (
  <DropdownItem eventKey={index}>
    {`${result._id} - ${result.name}`}
  </DropdownItem>
);

CountryDropdownItem.propTypes = {
  index: number.isRequired,
  result: countryShape.isRequired,
};

export default CountryDropdownItem;
