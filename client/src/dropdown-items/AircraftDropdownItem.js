import { number } from 'prop-types';
import React from 'react';

import DropdownItem from './DropdownItem';

import { aircraftShape } from '../api';

const AircraftDropdownItem = ({ index, result }) => (
  <DropdownItem eventKey={index}>
    {`${result.iata}/${result.icao} - ${result.names[0].name}`}
  </DropdownItem>
);

AircraftDropdownItem.propTypes = {
  index: number.isRequired,
  result: aircraftShape.isRequired,
};

export default AircraftDropdownItem;
