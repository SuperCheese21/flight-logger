import { number } from 'prop-types';
import React from 'react';

import DropdownItem from './DropdownItem';

import { airportShape } from '../api/shapes';

const AirportDropdownItem = ({ index, result }) => (
  <DropdownItem eventKey={index}>
    {`${result.codes.iata || result.codes.local}/${result.codes.ident} - ${
      result.name
    }`}
  </DropdownItem>
);

AirportDropdownItem.propTypes = {
  index: number.isRequired,
  result: airportShape.isRequired,
};

export default AirportDropdownItem;
