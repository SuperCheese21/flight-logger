import React from 'react';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';

import dropdownItems from './dropdownItems';
import { SearchBoxContainer, SearchCardBody, SearchCardHeader } from './styled';
import { DATA_TYPE_KEYS } from '../constants';
import { LiveSearchInput } from '../live-search';

const SearchBoxPage = () => {
  const { type } = useParams();
  const activeKey = DATA_TYPE_KEYS[type] || DATA_TYPE_KEYS.aircraft;

  const { textExtractor } = dropdownItems[activeKey];

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
          <LiveSearchInput
            getUrl={`http://localhost:3000/api/data/${activeKey}`}
            minQueryLength={2}
            transformData={json => json?.results}
            textExtractor={textExtractor}
          />
        </SearchCardBody>
      </Card>
    </SearchBoxContainer>
  );
};

export default SearchBoxPage;
