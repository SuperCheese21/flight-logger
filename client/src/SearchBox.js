import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';

import tabs from './tabs';

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

  const keys = Object.keys(tabs);
  const defaultActiveKey = keys.includes(type) ? type : keys[0];

  const onChange = async ({ target: { value } }) => {
    if (!value) {
      return setResults([]);
    }
    const searchResults = await getSearchResults(defaultActiveKey, value);
    return setResults(searchResults);
  };

  return (
    <div className="data-search-page">
      <Card className="search-card-container">
        <Card.Header className="search-card-header">
          Data Search Tool
        </Card.Header>
        <Card.Body className="search-card-body">
          <Nav variant="tabs" defaultActiveKey={defaultActiveKey}>
            {Object.entries(tabs).map(([key, value]) => (
              <Nav.Item>
                <LinkContainer to={`/data/${key}`}>
                  <Nav.Link eventKey={key}>{value}</Nav.Link>
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
              {results.map((result, index) => (
                <Dropdown.Item
                  className="search-dropdown-item"
                  eventKey={index}
                >
                  {`${result.iata}/${result.icao} - ${result.names[0].name}`}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SearchBoxContainer;
