import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaMoon, FaSun } from 'react-icons/fa';
import resumeData from '../data/resume.json';
import { useTheme } from '../hooks/useTheme';

function Header() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Navbar bg={isDarkMode ? 'dark' : 'light'} variant={isDarkMode ? 'dark' : 'light'} expand="lg" fixed="top" className="shadow-sm">
      <Container>
        <Navbar.Brand href="#home">{resumeData.personal.name}</Navbar.Brand>
        <div className="d-flex align-items-center">
          <Button 
            variant={isDarkMode ? 'outline-light' : 'outline-dark'} 
            size="sm" 
            className="me-3 theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </Button>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </div>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#experience">Experience</Nav.Link>
            <Nav.Link href="#education">Education</Nav.Link>
            <Nav.Link href="#skills">Skills</Nav.Link>
            <Nav.Link href="#certificates">Certificates</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
