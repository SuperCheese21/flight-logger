import { arrayOf, object, string } from 'prop-types';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import dropdownItems from './dropdown-items';

const ResultsDropdown = ({ results, type }) => {
  const DropdownComponent = dropdownItems[type].component;
  return (
    <Dropdown className="search-dropdown">
      {results.map(result => (
        <DropdownComponent result={result} type={type} />
      ))}
    </Dropdown>
  );
};

ResultsDropdown.propTypes = {
  results: arrayOf(object), // eslint-disable-line react/forbid-prop-types
  type: string.isRequired,
};

ResultsDropdown.defaultProps = {
  results: [],
};

export default ResultsDropdown;
