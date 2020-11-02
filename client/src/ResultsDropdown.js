import { arrayOf, object, string } from 'prop-types';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import styled from 'styled-components';
import dropdownItems from './dropdown-items';

const ResultsDropdown = ({ className, results, type }) => {
  const DropdownComponent = dropdownItems[type].component;
  return (
    <Dropdown className={className}>
      {results.map(result => (
        <DropdownComponent result={result} type={type} />
      ))}
    </Dropdown>
  );
};

ResultsDropdown.propTypes = {
  className: string.isRequired,
  results: arrayOf(object), // eslint-disable-line react/forbid-prop-types
  type: string.isRequired,
};

ResultsDropdown.defaultProps = {
  results: [],
};

export default styled(ResultsDropdown)`
  position: fixed;
  width: 400px;
`;
