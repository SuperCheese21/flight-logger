import { func, number, string } from 'prop-types';
import React, { useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';

import {
  StyledDropdown,
  StyledDropdownItem,
  StyledFormControl,
  StyledInputContainer,
} from './styled';
import useLiveSearch from './useLiveSearch';

const LiveSearchInput = ({
  debounceTime,
  getUrl,
  minQueryLength,
  textExtractor,
  transformData,
}) => {
  const [query, setQuery] = useState('');

  const handleChange = ({ target: { value } }) => setQuery(value);

  const results = useLiveSearch({
    debounceTime,
    getUrl,
    minQueryLength,
    transformData,
    query,
  });

  return (
    <StyledInputContainer>
      <InputGroup size="lg">
        <StyledFormControl
          onChange={handleChange}
          value={query}
          aria-label="Search"
          aria-describedby="inputGroup-sizing-sm"
        />
      </InputGroup>
      <StyledDropdown>
        {results.map(result => (
          <StyledDropdownItem
            key={result._id}
            href={result.wiki || result.names?.[0].wiki || '#'}
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
  debounceTime: number,
  getUrl: string.isRequired,
  minQueryLength: number,
  textExtractor: func.isRequired,
  transformData: func,
};

LiveSearchInput.defaultProps = {
  debounceTime: 250,
  minQueryLength: 1,
  transformData: _ => _,
};

export default LiveSearchInput;
