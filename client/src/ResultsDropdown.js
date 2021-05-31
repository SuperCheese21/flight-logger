import { arrayOf, object, string } from 'prop-types';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import styled from 'styled-components';
import dropdownItems from './dropdown-items';
import StyledDropdownItem from './dropdown-items/StyledDropdownItem';

const ResultsDropdown = ({ results, activeKey }) => {
  const { textExtractor } = dropdownItems[activeKey];
  return (
    <Dropdown>
      {results.map(result => (
        <StyledDropdownItem key={result._id} eventKey={result._id}>
          {textExtractor(result)}
        </StyledDropdownItem>
      ))}
    </Dropdown>
  );
};

ResultsDropdown.propTypes = {
  activeKey: string.isRequired,
  results: arrayOf(object), // eslint-disable-line react/forbid-prop-types
};

ResultsDropdown.defaultProps = {
  results: [],
};

export default styled(ResultsDropdown)`
  position: fixed;
  width: 400px;
`;
