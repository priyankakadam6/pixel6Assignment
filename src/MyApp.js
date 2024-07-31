import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FormComponent from './FormComponent';
import CustomerList from './CustomerList';
import { Container, Nav, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Customer Management</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Add Customer</Nav.Link>
            <Nav.Link as={Link} to="/customers">Customer List</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<FormComponent />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/edit/:id" element={<FormComponent />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
