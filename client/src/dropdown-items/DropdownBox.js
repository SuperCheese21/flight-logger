import { arrayOf, number, oneOfType } from 'prop-types';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

import { getItemByKey } from '.';

import {
  aircraftShape,
  airlineShape,
  airportShape,
  countryShape,
  regionShape,
} from '../api';

const DropdownBox = ({ key, results }) => {
  const item = getItemByKey(key);
  const { component: DropdownComponent } = item;
  return (
    <Dropdown className="search-dropdown">
      {results.map((result, index) => (
        <DropdownComponent index={index} result={result} />
      ))}
    </Dropdown>
  );
};

DropdownBox.propTypes = {
  key: number.isRequired,
  results: arrayOf(
    oneOfType([
      aircraftShape,
      airlineShape,
      airportShape,
      countryShape,
      regionShape,
    ]),
  ).isRequired,
};

export default DropdownBox;
