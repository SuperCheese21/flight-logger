import { func, number, string } from 'prop-types';
import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import InputGroup from 'react-bootstrap/InputGroup';
import { ThemeProvider } from 'styled-components';

import { DROPDOWN_THEMES, INPUT_SIZES } from './constants';
import DropdownItems from './DropdownItems';
import {
  StyledDropdown,
  StyledDropdownMenu,
  StyledFormControl,
  StyledInputContainer,
  StyledSpinner,
  StyledSpinnerContainer,
} from './styled';
import useLiveSearch from './useLiveSearch';

const LiveSearchInput = ({
  debounceTime,
  getItemData,
  getUrl,
  maxItems,
  minQueryLength,
  onItemSelect,
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
    <ThemeProvider theme={DROPDOWN_THEMES[size]}>
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
        <StyledDropdown
          onSelect={(eventKey, event) =>
            onItemSelect(JSON.parse(eventKey), event)
          }
        >
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
            <DropdownItems getItemData={getItemData} results={results} />
          </StyledDropdownMenu>
        </StyledDropdown>
      </StyledInputContainer>
    </ThemeProvider>
  );
};

LiveSearchInput.propTypes = {
  debounceTime: number,
  getItemData: func.isRequired,
  getUrl: string.isRequired,
  maxItems: number,
  minQueryLength: number,
  onItemSelect: func,
  size: string,
  transformData: func,
  width: number,
};

LiveSearchInput.defaultProps = {
  debounceTime: 300,
  maxItems: 10,
  minQueryLength: 1,
  onItemSelect: () => {},
  size: INPUT_SIZES.lg,
  transformData: _ => _,
  width: null,
};

export default LiveSearchInput;
