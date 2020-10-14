import { number } from 'prop-types';
import React from 'react';
import DropdownItem from './DropdownItem';

const AirlineDropdownItem = ({ index, result }) => (
  <DropdownItem eventKey={index}>
    {`${result.iata}/${result.icao} - ${result.names[0].name}`}
  </DropdownItem>
);

const airlineResultShape = {};

AirlineDropdownItem.propTypes = {
  index: number.isRequired,
  result: airlineResultShape.isRequired,
};

export default AirlineDropdownItem;
