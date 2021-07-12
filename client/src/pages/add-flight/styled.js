import Card from 'react-bootstrap/Card';
import styled from 'styled-components';

export const AddFlightContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AddFlightTitle = styled.h1`
  margin: 25px 0px;
`;

export const StyledAddFlightCard = styled(Card)`
  width: 70vw;
  min-width: 500px;
  padding: 25px;
`;

export default AddFlightContainer;
