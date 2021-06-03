import { func, string } from 'prop-types';
import React, { useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import {
  StyledDropdown,
  StyledDropdownItem,
  StyledFormControl,
  StyledInputContainer,
} from './styled';

import dropdownItems from '../search-box/dropdownItems';

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
    <StyledInputContainer>
      <InputGroup size="lg">
        <StyledFormControl
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
    </StyledInputContainer>
  );
};

LiveSearchInput.propTypes = {
  activeKey: string.isRequired,
  getFn: func.isRequired,
};

export default LiveSearchInput;
