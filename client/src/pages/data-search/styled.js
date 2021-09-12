import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import styled from 'styled-components';

export const StyledNavbar = styled(Nav)`
  padding-bottom: 10px;
`;

export const SearchBoxContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
