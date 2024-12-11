import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { removeToken } from './JwtHelper';
import { useNavigate } from 'react-router-dom';
import ChangePassword from './ChangePassword';
function Navbar2() {
  const navigate = useNavigate();

  // Handle logout action
  const handleLogout = () => {
    removeToken(); // Clear token
    navigate("/"); // Redirect to home
  };

  // Role-based navigation
  const handleWelcome = () => {
    const role = localStorage.getItem("UserRole");
    const rolePaths = {
      "1": "/welcome",
      "2": "/welcomeAdministrador",
      "3": "/welcomeSubAdministrador",
      "4": "/welcomeSuperAdministrador"
    };

    if (rolePaths[role]) {
      navigate(rolePaths[role]);
    }
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#960E53' }} variant="dark">
      <Container>
        <Navbar.Brand onClick={handleWelcome} style={{ cursor: 'pointer' }}>
          <img
            src="/logo.png"  // Ensure logo is in public folder
            alt="Logo"
            width="160"
            height="80"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        
        {/* Toggle for small screens */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={handleLogout} style={{fontSize:"16px",color:"white"}}>Salir</Nav.Link>  {/* Logout link */}
            <ChangePassword></ChangePassword>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar2;