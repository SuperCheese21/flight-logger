import { arrayOf, func, object } from 'prop-types';
import React from 'react';

import {
  StyledDropdownItem,
  StyledImage,
  StyledImageContainer,
  StyledTextContainer,
} from './styled';

const DropdownItems = ({ getItemData, onItemSelect, results }) =>
  results.map(result => {
    const { key, image, text } = getItemData(result);
    return (
      <StyledDropdownItem
        key={key}
        eventKey={JSON.stringify(result)}
        onSelect={(eventKey, event) =>
          onItemSelect(JSON.parse(eventKey), event)
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
  });

DropdownItems.propTypes = {
  getItemData: func.isRequired,
  onItemSelect: func.isRequired,
  results: arrayOf(object.isRequired).isRequired,
};

export default DropdownItems;
