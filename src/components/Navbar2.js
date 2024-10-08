import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Navbar2() {

    return (
        <Navbar expand="lg"  style={{backgroundColor: '#960E53'}}>
        <Container>
          {/* Update the image path and fixed typo in className */}
          <Navbar.Brand href="#home">
            <img 
              src="/logo.png" // Ensure the logo is placed in the public folder
              alt=""
              width="160"
              height="80"
              className="d-inline-block align-top" // Corrected "align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Salir</Nav.Link>
            
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
    
};

export default Navbar2;