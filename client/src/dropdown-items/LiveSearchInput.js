import { func, string } from 'prop-types';
import React, { useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import { SearchFormControl, SearchInputContainer } from '../search-box/styled';
import { StyledDropdown, StyledDropdownItem } from './styled';
import dropdownItems from '.';

const LiveSearchInput = ({ activeKey, getFn }) => {
  const [results, setResults] = useState([]);
  const { textExtractor } = dropdownItems[activeKey];

  const onChange = async ({ target: { value } }) => {
    if (!value) {
      return setResults([]);
    }
    const newResults = await getFn(value);
    return setResults(newResults);
  };

  return (
    <SearchInputContainer>
      <InputGroup size="lg">
        <SearchFormControl
          onChange={onChange}
          aria-label="Search"
          aria-describedby="inputGroup-sizing-sm"
        />
      </InputGroup>
      <StyledDropdown>
        {results.map(result => (
          <StyledDropdownItem
            key={result._id}
            href={result.wiki || result.name || result.names[0].wiki || '#'}
            target="_blank"
            eventKey={result._id}
          >
            {textExtractor(result)}
          </StyledDropdownItem>
        ))}
      </StyledDropdown>
    </SearchInputContainer>
  );
};

LiveSearchInput.propTypes = {
  activeKey: string.isRequired,
  getFn: func.isRequired,
};

export default LiveSearchInput;
