import { number } from 'prop-types';
import React from 'react';
import DropdownItem from './DropdownItem';

const AircraftDropdownItem = ({ index, result }) => (
  <DropdownItem eventKey={index}>
    {`${result.iata}/${result.icao} - ${result.names[0].name}`}
  </DropdownItem>
);

const aircraftResultShape = {};

AircraftDropdownItem.propTypes = {
  index: number.isRequired,
  result: aircraftResultShape.isRequired,
};

export default AircraftDropdownItem;
