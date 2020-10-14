import { number } from 'prop-types';
import React from 'react';
import DropdownItem from './DropdownItem';

const CountryDropdownItem = ({ index, result }) => (
  <DropdownItem eventKey={index}>
    {`${result.iata}/${result.icao} - ${result.names[0].name}`}
  </DropdownItem>
);

const countryResultShape = {};

CountryDropdownItem.propTypes = {
  index: number.isRequired,
  result: countryResultShape.isRequired,
};

export default CountryDropdownItem;
