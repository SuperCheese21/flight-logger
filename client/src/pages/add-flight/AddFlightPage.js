import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

import {
  AddFlightContainer,
  AddFlightTitle,
  StyledAddFlightCard,
} from './styled';

export default () => {
  const [showValidation, setShowValidation] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    console.log(e.target);
    setShowValidation(true);
  };

  return (
    <AddFlightContainer>
      <AddFlightTitle>Add Flight</AddFlightTitle>
      <StyledAddFlightCard>
        <Form noValidate validated={showValidation} onSubmit={handleSubmit}>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Departure Airport *</Form.Label>
              <Form.Control
                name="departureAirport"
                required
                type="text"
                placeholder="Search Airports..."
              />
              <Form.Control.Feedback type="invalid">
                Please choose a departure airport.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Arrival Airport *</Form.Label>
              <Form.Control
                name="arrivalAirport"
                required
                type="text"
                placeholder="Search Airports..."
              />
              <Form.Control.Feedback type="invalid">
                Please choose an arrival airport
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Departure Date/Time (UTC) *</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  required
                  type="date"
                  name="departureDate"
                  min="1910-01-01"
                  max="2100-01-01"
                />
                <Form.Control required type="time" name="departureTime" />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid departure time
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Arrival Date/Time (UTC) *</Form.Label>
              <InputGroup hasValidation>
                <Form.Control required type="date" name="arrivalDate" />
                <Form.Control required type="time" name="arrivalTime" />
                <Form.Control.Feedback type="invalid">
                  Please enter a valid arrival time
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <br />
          <Row>
            <Form.Group as={Col} md={6}>
              <Form.Label>Airline</Form.Label>
              <Form.Control name="airline" placeholder="Search Airlines..." />
            </Form.Group>
            <Form.Group as={Col} md={2}>
              <Form.Label>Flight #</Form.Label>
              <Form.Control
                name="flightNumber"
                type="number"
                min={1}
                maxLength={4}
                placeholder="Ex. 516"
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Aircraft</Form.Label>
              <Form.Control name="aircraft" placeholder="Search Aircraft..." />
            </Form.Group>
          </Row>
          <br />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </StyledAddFlightCard>
    </AddFlightContainer>
  );
};
