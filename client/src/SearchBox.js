import React, { useState } from 'react';

import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const SearchBox = () => {
  const [results] = useState([]);
  return (
    <Card className="search-card-container">
      <Card.Header className="search-card-header">Data Search Tool</Card.Header>
      <Card.Body className="search-card-body">
        <Tabs defaultActiveKey="aircraft" id="data-type-selector">
          <Tab eventKey="aircraft" title="Aircraft" tabClassName="tab" />
          <Tab eventKey="airlines" title="Airlines" tabClassName="tab" />
          <Tab eventKey="airports" title="Airports" tabClassName="tab" />
          <Tab eventKey="countries" title="Countries" tabClassName="tab" />
          <Tab eventKey="regions" title="Regions" tabClassName="tab" />
        </Tabs>
        <div className="search-box-container">
          <InputGroup size="lg">
            <FormControl
              className="search-box"
              aria-label="Search"
              aria-describedby="inputGroup-sizing-sm"
            />
          </InputGroup>
          <Dropdown className="search-dropdown">
            {results.map((result, index) => (
              <Dropdown.Item className="search-dropdown-item" eventKey={index}>
                {result.name}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SearchBox;
