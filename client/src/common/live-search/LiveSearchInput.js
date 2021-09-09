import { func, number, string } from 'prop-types';
import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import InputGroup from 'react-bootstrap/InputGroup';

import { INPUT_SIZES } from './constants';
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
  getItemData,
  getUrl,
  maxItems,
  minQueryLength,
  onSelect,
  size,
  transformData,
  width,
}) => {
  const [query, setQuery] = useState('');

  const handleChange = ({ target: { value } }) => setQuery(value);

  const { results, isLoading } = useLiveSearch({
    debounceTime,
    getUrl,
    maxItems,
    minQueryLength,
    transformData,
    query,
  });

  useEffect(() => {
    setQuery('');
  }, [getUrl]);

  return (
    <StyledInputContainer width={width}>
      <InputGroup size={size}>
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
          {results.map(result => {
            const { key, image, text } = getItemData(result);
            return (
              <StyledDropdownItem
                key={key}
                eventKey={JSON.stringify(result)}
                onSelect={(eventKey, event) =>
                  onSelect(JSON.parse(eventKey), event)
                }
              >
                {image && (
                  <StyledImageContainer>
                    <StyledImage src={image} />
                  </StyledImageContainer>
                )}
                <StyledTextContainer>{text}</StyledTextContainer>
              </StyledDropdownItem>
            );
          })}
        </StyledDropdownMenu>
      </StyledDropdown>
    </StyledInputContainer>
  );
};

LiveSearchInput.propTypes = {
  debounceTime: number,
  getItemData: func.isRequired,
  getUrl: string.isRequired,
  maxItems: number,
  minQueryLength: number,
  onSelect: func,
  size: string,
  transformData: func,
  width: number,
};

LiveSearchInput.defaultProps = {
  debounceTime: 300,
  maxItems: 10,
  minQueryLength: 1,
  onSelect: () => {},
  size: INPUT_SIZES.lg,
  transformData: _ => _,
  width: null,
};

export default LiveSearchInput;
