import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken } from "./JwtHelper";
import { Button } from "react-bootstrap";
import { Form, Container, Row, Col, Alert } from "react-bootstrap";


function Login() {
  // State variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle login
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form submission that reloads the page
    setLoading(true);   // Set loading state

    
    const loginData = {
      email,
      password,
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     // Check if the input is a valid email
     if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    console.log("login",loginData);

    axios
    .post("https://localhost:7145/api/User/login/", loginData)
    .then((response) => {
      console.log("Login successful:", response.data);
      alert("Login successful!");
  
      localStorage.setItem("userid", response.data.user.nomEmpleados.empleadoID);
      localStorage.setItem("nomEmpNombre",response.data.user.nomEmpleados.nomEmpNombre);
      localStorage.setItem("nomEmpPaterno",response.data.user.nomEmpleados.nomEmpPaterno);
      localStorage.setItem("nomEmpMaterno",response.data.user.nomEmpleados.nomEmpMaterno);
      localStorage.setItem("UserRole",response.data.user.userRole);

      


      setToken("token",response.data.token);


      localStorage.setItem("AreaAdministrativa", response.data.user.nomEmpleados.direccionesICEES.descripcion);

  
      console.log("UserRole:", response.data.user.userRole);
      console.log("id2:", response.data.user.nomEmpleados.empleadoID);

      
      setLoading(false);

      console.log("Navigating to the correct page...");
  
      if (response.data.user.userRole === 1) {
        console.log("Navigating to /Welcome");
        navigate("/Welcome");
      } else if (response.data.user.userRole === 2) {
        console.log("Navigating to /WelcomeAdministrador");
        navigate("/WelcomeAdministrador");
      } else if (response.data.user.userRole === 3) {
        console.log("Navigating to /WelcomeSubAdministrador");
        navigate("/WelcomeSubAdministrador");
      
      } else if (response.data.user.userRole === 4) {
        console.log("Navigating to /WelcomeSuperAdministrador");
        navigate("/WelcomeSuperAdministrador");
      }
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      alert("Login failed. Please check your credentials and try again.");
      setError("Invalid email or password");
      setLoading(false);
    });
  };

  return (
    <Container className="mt-5">
    <Row className="justify-content-md-center">
      <Col md={6} sm={12}>
        <h2 className="text-center">Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label style={{fontSize:"20px"}}>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Form.Text className="text-muted">
              Please use your registered email to log in.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mt-3">
            <Form.Label style={{fontSize:"20px"}}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant=""
            style={{backgroundColor: "#C5126D", color:"white "}}
            type="submit"
            className="mt-4 w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>
      </Col>
    </Row>
  </Container>
  );
}

export default Login;
