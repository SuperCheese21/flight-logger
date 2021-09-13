import React from 'react';
import Card from 'react-bootstrap/Card';
import styled from 'styled-components';

import dropdownItems from './data-search/dropdownItems';
import { INPUT_SIZES } from '../common/live-search/constants';
import LiveSearchInput from '../common/live-search/LiveSearchInput';

const LiveSearchTestContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const LiveSearchSelectionContainer = styled.div`
  width: 600px;
`;

const LiveSearchTestPage = () => {
  const { getHref, getItemData } = dropdownItems.airlines;
  return (
    <LiveSearchTestContainer>
      <Card>Test lmao</Card>
      <LiveSearchSelectionContainer>
        <LiveSearchInput
          getUrl="http://localhost:3000/api/data/airlines"
          maxItems={5}
          minQueryLength={2}
          transformData={({ results }) => results}
          getItemData={getItemData}
          onItemSelect={result => {
            const href = getHref(result);
            if (href) window.open(href);
          }}
          size={INPUT_SIZES.md}
        />
      </LiveSearchSelectionContainer>
    </LiveSearchTestContainer>
  );
};

export default LiveSearchTestPage;
