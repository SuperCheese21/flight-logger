import React from 'react';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';

import { DATA_TYPE_KEYS } from './constants';
import dropdownItems from './dropdownItems';
import {
  SearchBoxContainer,
  SearchCardBody,
  SearchCardHeader,
  StyledNavbar,
} from './styled';
import LiveSearchInput from '../../common/live-search/LiveSearchInput';

const SearchBoxPage = () => {
  const { type } = useParams();
  const activeKey = DATA_TYPE_KEYS[type] || DATA_TYPE_KEYS.aircraft;

  const { getItemData, getHref } = dropdownItems[activeKey];

  return (
    <SearchBoxContainer>
      <Card>
        <SearchCardHeader>Data Search Tool</SearchCardHeader>
        <SearchCardBody>
          <StyledNavbar variant="tabs" defaultActiveKey={activeKey}>
            {Object.entries(dropdownItems).map(([key, { label }]) => (
              <Nav.Item key={key}>
                <LinkContainer to={`/data/${key}`}>
                  <Nav.Link eventKey={key}>{label}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </StyledNavbar>
          <LiveSearchInput
            getUrl={`http://localhost:8080/api/data/${activeKey}`}
            maxItems={5}
            minQueryLength={2}
            transformData={({ results }) => results}
            getItemData={getItemData}
            onItemSelect={result => {
              const href = getHref(result);
              if (href) window.open(href);
            }}
            width={600}
          />
        </SearchCardBody>
      </Card>
    </SearchBoxContainer>
  );
};

export default SearchBoxPage;
