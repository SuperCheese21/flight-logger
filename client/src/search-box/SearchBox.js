import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';

import {
  SearchBoxContainer,
  SearchCardBody,
  SearchCardHeader,
  SearchFormControl,
  SearchInputContainer,
} from './styled';
import dropdownItems from '../dropdown-items';
import ResultsDropdown from '../dropdown-items/ResultsDropdown';
import { DATA_TYPE_KEYS } from '../utils/constants';

// TODO: Move to API directory
const getSearchResults = async (collection, term) => {
  try {
    const res = await fetch(
      `http://localhost:3000/api/data/${collection}?q=${term}`,
    );
    const json = await res.json();
    return json.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const SearchBoxPage = () => {
  const { type } = useParams();
  const [results, setResults] = useState([]);

  const activeKey = DATA_TYPE_KEYS[type] || DATA_TYPE_KEYS.aircraft;

  const onChange = async ({ target: { value } }) => {
    if (!value) {
      return setResults([]);
    }
    const searchResults = await getSearchResults(activeKey, value);
    return setResults(searchResults);
  };

  return (
    <SearchBoxContainer>
      <Card>
        <SearchCardHeader>Data Search Tool</SearchCardHeader>
        <SearchCardBody>
          <Nav variant="tabs" defaultActiveKey={activeKey}>
            {Object.entries(dropdownItems).map(([key, { label }]) => (
              <Nav.Item>
                <LinkContainer to={`/data/${key}`}>
                  <Nav.Link eventKey={key}>{label}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
          <SearchInputContainer>
            <InputGroup size="lg">
              <SearchFormControl
                onChange={onChange}
                aria-label="Search"
                aria-describedby="inputGroup-sizing-sm"
              />
            </InputGroup>
            <ResultsDropdown results={results} activeKey={activeKey} />
          </SearchInputContainer>
        </SearchCardBody>
      </Card>
    </SearchBoxContainer>
  );
};

export default SearchBoxPage;
