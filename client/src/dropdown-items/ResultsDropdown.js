import { arrayOf, object, string } from 'prop-types';
import React from 'react';
import dropdownItems from '.';
import { StyledDropdown, StyledDropdownItem } from './styled';

const ResultsDropdown = ({ results, activeKey }) => {
  const { textExtractor } = dropdownItems[activeKey];
  return (
    <StyledDropdown>
      {results.map(result => (
        <StyledDropdownItem
          key={result._id}
          href={result.wiki || result.names[0].wiki || '#'}
          target="_blank"
          eventKey={result._id}
        >
          {textExtractor(result)}
        </StyledDropdownItem>
      ))}
    </StyledDropdown>
  );
};

ResultsDropdown.propTypes = {
  activeKey: string.isRequired,
  results: arrayOf(object), // eslint-disable-line react/forbid-prop-types
};

ResultsDropdown.defaultProps = {
  results: [],
};

export default ResultsDropdown;
