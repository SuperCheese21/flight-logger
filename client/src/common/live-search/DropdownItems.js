import { arrayOf, func, object, oneOf } from 'prop-types';
import React from 'react';

import { INPUT_SIZES } from './constants';
import {
  StyledDropdownItem,
  StyledImage,
  StyledImageContainer,
  StyledTextContainer,
} from './styled';

const DropdownItems = ({ getItemData, onItemSelect, results, size }) =>
  results.map(result => {
    const { key, image, text } = getItemData(result);
    return (
      <StyledDropdownItem
        key={key}
        eventKey={JSON.stringify(result)}
        onSelect={(eventKey, event) =>
          onItemSelect(JSON.parse(eventKey), event)
        }
        size={size}
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
  size: oneOf(Object.values(INPUT_SIZES)),
};

export default DropdownItems;
