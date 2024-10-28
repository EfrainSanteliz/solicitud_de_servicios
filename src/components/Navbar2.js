import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { removeToken } from './JwtHelper';
import { useNavigate } from 'react-router-dom';

function Navbar2() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();  // Remove token on logout
    navigate("/");  // Redirect to home page
  };


  const handleWelcome  = () => {
    if (localStorage.getItem("UserRole") === "1") {
      navigate("/welcome");
    }
    if (localStorage.getItem("UserRole") === "2") {
      navigate("/welcomeAdministrador");
    }
    if (localStorage.getItem("UserRole") === "3") {
      navigate("/welcomeSubAdministrador");
    }
    if (localStorage.getItem("UserRole") === "4") {
      navigate("/welcomeSuperAdministrador");
    }

  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#960E53' }} variant="dark">
      <Container>
        <Navbar.Brand onClick={handleWelcome}>
          <img
            src="/logo.png"  // Ensure logo is in public folder
            alt="Logo"
            width="160"
            height="80"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        {/* Hamburger menu toggle for small screens */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={handleLogout}>Salir</Nav.Link>  {/* Logout link */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar2;