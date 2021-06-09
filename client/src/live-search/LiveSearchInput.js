import { func, number, string } from 'prop-types';
import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import InputGroup from 'react-bootstrap/InputGroup';

import {
  StyledDropdown,
  StyledDropdownItem,
  StyledDropdownMenu,
  StyledFormControl,
  StyledImage,
  StyledImageContainer,
  StyledInputContainer,
  StyledSpinner,
  StyledSpinnerContainer,
  StyledTextContainer,
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

  const { results, isLoading } = useLiveSearch({
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
        <StyledSpinnerContainer opacity={isLoading ? 0.6 : 0}>
          <StyledSpinner animation="border" role="status" />
        </StyledSpinnerContainer>
      </InputGroup>
      <StyledDropdown>
        <StyledDropdownMenu show={query.length}>
          {query.length && query.length < minQueryLength && (
            <Dropdown.ItemText>{`Type at least ${minQueryLength} characters`}</Dropdown.ItemText>
          )}
          {isLoading && <Dropdown.ItemText>Loading...</Dropdown.ItemText>}
          {!isLoading &&
            query.length &&
            query.length >= minQueryLength &&
            !results.length && (
              <Dropdown.ItemText>No Results</Dropdown.ItemText>
            )}
          {results.map(result => (
            <StyledDropdownItem
              key={result._id}
              href={result.wiki || result.names?.[0].wiki || '#'}
              target="_blank"
              eventKey={result._id}
            >
              {result.logo && (
                <StyledImageContainer>
                  <StyledImage src={result.logo} />
                </StyledImageContainer>
              )}
              <StyledTextContainer>{textExtractor(result)}</StyledTextContainer>
            </StyledDropdownItem>
          ))}
        </StyledDropdownMenu>
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
  debounceTime: 300,
  minQueryLength: 1,
  transformData: _ => _,
};

export default LiveSearchInput;
