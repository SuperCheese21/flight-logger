import { number } from 'prop-types';
import React from 'react';
import DropdownItem from './DropdownItem';

const AirportDropdownItem = ({ index, result }) => (
  <DropdownItem eventKey={index}>
    {`${result.iata}/${result.icao} - ${result.names[0].name}`}
  </DropdownItem>
);

const airportResultShape = {};

AirportDropdownItem.propTypes = {
  index: number.isRequired,
  result: airportResultShape.isRequired,
};

export default AirportDropdownItem;
