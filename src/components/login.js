import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken } from "./JwtHelper";
import { Button } from "react-bootstrap";
import { Form, Container, Row, Col, Alert } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import ReCAPTCHA from "react-google-recaptcha";
import { UserContext } from "./UserContext";

const RECAPTCHA_SITE_KEY = "6Ld83pcqAAAAAB-bXzjW6-Vodl1IOpLCh_my7JCp";

function Login() {
  // State variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [submitStatus, setSubmitStatus] = useState("");
  const [Contador, setContador] = useState(0);
  const { setUserRoleFromServer } = useContext(UserContext);

  const onRecaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  // Function to handle login
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form submission that reloads the page
    if (Contador > 3) {
      if (!captchaToken) {
        setSubmitStatus("Primero completa el reCAPTCHA.");
        return;
      }
    }

    setLoading(true); // Set loading state

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

    axios
      .post(process.env.REACT_APP_API_URL + "User/login/", loginData)
      .then((response) => {
        const { userRole } = response.data.user;
        const { empleadoID } = response.data.user;
        const { nomEmpNombre } = response.data.user;
        const { nomEmpPaterno } = response.data.user;
        const { nomEmpMaterno } = response.data.user;
        const { email } = response.data.user;
        const { direccionesDescripcion } = response.data.user;
        const { token } = response.data;

        setUserRoleFromServer(
          userRole,
          empleadoID,
          nomEmpNombre,
          nomEmpPaterno,
          nomEmpMaterno,
          email,
          direccionesDescripcion,
          token
        );

        /*  localStorage.setItem("userid", response.data.user.empleadoID);
        localStorage.setItem("nomEmpNombre", response.data.user.nomEmpNombre);
        localStorage.setItem("nomEmpPaterno", response.data.user.nomEmpPaterno);
        localStorage.setItem("nomEmpMaterno", response.data.user.nomEmpMaterno);
        localStorage.setItem("UserRole", response.data.user.userRole);
        localStorage.setItem("email",response.data.user.email);

     
        localStorage.setItem(
          "name_secondname",
          response.data.user.nomEmpNombre +
            " " +
            response.data.user.nomEmpPaterno +
            " " +
            response.data.user.nomEmpMaterno
        );

        setToken("jwtToken", response.data.token);
        localStorage.setItem("jwtToken2", response.data.token);

        localStorage.setItem(
          "AreaAdministrativa",
          response.data.user.direccionesDescripcion
        );
        */
       //setToken("jwtToken", response.data.token);

        setLoading(false);

        const type = response.data.user.userRole;

        switch (type) {
          case 1:
            navigate("/Welcome");
            break;
          case 2:
            navigate("/WelcomeAdministrador");
            break;
          case 3:
            navigate("/WelcomeSubAdministrador");
            break;
          case 4:
            navigate("/WelcomeSuperAdministrador");
            break;
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setError("Invalid email or password");
        setLoading(false);
        setContador((Contador) => Contador + 1);
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
              <Form.Label style={{ fontSize: "20px" }}>Email</Form.Label>
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
              <Form.Label style={{ fontSize: "20px" }}>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <br />
            {Contador > 3 && (
              <div style={{ marginBottom: "1rem" }}>
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={onRecaptchaChange}
                />

                <br />
                {submitStatus && <p>{submitStatus}</p>}
              </div>
            )}

            <Button
              variant=""
              style={{ backgroundColor: "#C5126D", color: "white " }}
              type="submit"
              className="mt-4 w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="mb-3">
              <label className="form-label">
                {" "}
                <a href="/ChangePassword">
                  {" "}
                  No recuerdas tu contraseña haz click aqui para cambiarla{" "}
                </a>
              </label>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
