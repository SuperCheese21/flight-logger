import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';

import dropdownItems from './dropdown-items';

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
  const [results, setResults] = useState([]);
  const { type } = useParams();

  const activeKey = type || dropdownItems[0].name;

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
            {dropdownItems.map(({ name, label }) => (
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
            <Dropdown className="search-dropdown">
              {results.map(result => null)}
            </Dropdown>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SearchBoxContainer;
