import { number } from 'prop-types';
import React from 'react';

import DropdownItem from './DropdownItem';

import { airlineShape } from '../api';

const AirlineDropdownItem = ({ index, result }) => (
  <DropdownItem eventKey={index}>
    {`${result.iata}/${result.icao} - ${result.name}`}
  </DropdownItem>
);

AirlineDropdownItem.propTypes = {
  index: number.isRequired,
  result: airlineShape.isRequired,
};

export default AirlineDropdownItem;
