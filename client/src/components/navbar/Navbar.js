import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { NavbarLogo } from './styled';

export default () => (
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#">
      <NavbarLogo
        alt="Flight Logger"
        src="/logo.svg"
        className="d-inline-block align-top"
      />
      Flight Logger
    </Navbar.Brand>
  </Navbar>
);
