import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
//import { removeToken } from './JwtHelper';
import { useNavigate } from 'react-router-dom';
import ChangePassword from './ChangePassword';
import { UserContext } from './UserContext';
import { getToken } from './JwtHelper';

function Navbar2() {
  const navigate = useNavigate();
  const {userRole} = useContext(UserContext);
  const {setRemoveToke} = useContext(UserContext);
  const {token} = useContext(UserContext);
  

  // Handle logout action
  const handleLogout = () => {
   // removeToken(); // Clear token
    const { token } = "";
    setRemoveToke(token);
    navigate("/"); // Redirect to home
  };

  // Role-based navigation
  const handleWelcome = () => {
    const rolePaths = {
      "1": "/welcome",
      "2": "/welcomeAdministrador",
      "3": "/welcomeSubAdministrador",
      "4": "/welcomeSuperAdministrador"
    };

    if (rolePaths[userRole]) {
      navigate(rolePaths[userRole]);
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
            {token && <ChangePassword />}
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar2;