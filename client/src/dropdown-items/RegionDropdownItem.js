import { number } from 'prop-types';
import React from 'react';
import DropdownItem from './DropdownItem';

const RegionDropdownItem = ({ index, result }) => (
  <DropdownItem eventKey={index}>
    {`${result.iata}/${result.icao} - ${result.names[0].name}`}
  </DropdownItem>
);

const regionResultShape = {};

RegionDropdownItem.propTypes = {
  index: number.isRequired,
  result: regionResultShape.isRequired,
};

export default RegionDropdownItem;
