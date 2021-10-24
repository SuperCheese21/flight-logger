import { arrayOf, func, object } from 'prop-types';
import React from 'react';

import {
  StyledDropdownItem,
  StyledImage,
  StyledImageContainer,
  StyledTextContainer,
} from './styled';

const DropdownItems = ({ getItemData, results }) => (
  <>
    {results.map(result => {
      const { key, image, text } = getItemData(result);
      return (
        <StyledDropdownItem key={key} eventKey={JSON.stringify(result)}>
          {image && (
            <StyledImageContainer>
              <StyledImage src={image} />
            </StyledImageContainer>
          )}
          <StyledTextContainer>{text}</StyledTextContainer>
        </StyledDropdownItem>
      );
    })}
  </>
);

DropdownItems.propTypes = {
  getItemData: func.isRequired,
  results: arrayOf(object.isRequired).isRequired,
};

export default DropdownItems;
