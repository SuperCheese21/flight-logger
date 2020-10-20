import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';

import dropdownItems from './dropdown-items';
import ResultsDropdown from './ResultsDropdown';

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

const SearchBoxContainer = () => {
  const { type } = useParams();
  const [results, setResults] = useState([]);

  const dropdownEntries = Object.entries(dropdownItems);
  const activeKey = type || dropdownEntries[0][0];

  const onChange = async ({ target: { value } }) => {
    if (!value) {
      return setResults([]);
    }
    const searchResults = await getSearchResults(activeKey, value);
    return setResults(searchResults);
  };

  return (
    <div className="data-search-page">
      <Card className="search-card-container">
        <Card.Header className="search-card-header">
          Data Search Tool
        </Card.Header>
        <Card.Body className="search-card-body">
          <Nav variant="tabs" defaultActiveKey={activeKey}>
            {dropdownEntries.map(([name, { label }]) => (
              <Nav.Item>
                <LinkContainer to={`/data/${name}`}>
                  <Nav.Link eventKey={name}>{label}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
          <div className="search-box-container">
            <InputGroup size="lg">
              <FormControl
                onChange={onChange}
                className="search-box"
                aria-label="Search"
                aria-describedby="inputGroup-sizing-sm"
              />
            </InputGroup>
            <ResultsDropdown results={results} type={activeKey} />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SearchBoxContainer;
