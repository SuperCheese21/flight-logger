import Card from 'react-bootstrap/Card';
import FormControl from 'react-bootstrap/FormControl';
import styled from 'styled-components';

export const SearchBoxContainer = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const SearchInputContainer = styled.div`
  width: 600px;
  margin-top: 10px;
`;

export const SearchCardHeader = styled(Card.Header)`
  text-align: center;
  font-weight: bold;
  font-size: 28px;
`;

export const SearchCardBody = styled(Card.Body)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 800px;
  height: 300px;
  padding-bottom: 70px;
`;

export const SearchFormControl = styled(FormControl)`
  &:focus {
    box-shadow: none;
  }
`;
