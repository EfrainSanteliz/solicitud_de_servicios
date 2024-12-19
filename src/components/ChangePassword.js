import { useState,useContext } from "react";
import { Button, Form, Modal, Nav } from "react-bootstrap";
import axios from "axios";
import { PasswordIsNotTheSame } from "./AlertService";
import { longitudPasswordError } from "./AlertService";
import { PasswordErrorPattern } from "./AlertService";
import { UserContext} from "./UserContext";

function ChangePassword() {
  const [modal, setModal] = useState(false);
  const [passwordErrorLongitud, setPasswordErrorLongitud] = useState(false);
  const [passwordErrorPattern,setPasswordErrorPattern] = useState(false);

  const { email } = useContext(UserContext);

  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, password2 } = formData;

    if (password !== password2) {
      PasswordIsNotTheSame();
      return;
    };
    if (passwordErrorLongitud) {
        longitudPasswordError();
        return;
    };

    if(passwordErrorPattern) {
        PasswordErrorPattern();
        return;
    };

    const Data = {
      password: password,
    };

    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL + `User/changeByEmail/${email}`,
        Data
      );
      console.log("Password changed successfully:", response.data);
      console.log("password ",password);
      setModal(false); // Close the modal on success
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleClose = () => {
    setModal(false);
  };

  const handleValidation = (e) => {
    const { name, value } = e.target;

    handleChange(e);

    if (name === "password" || name === "password2") {
      if (value.length < 8) {
        setPasswordErrorLongitud(true);
      } else {
        setPasswordErrorLongitud(false);
      }

      const letterMatch = value.match(/[a-zA-Z]/g) || [];
      const numberMatch = value.match(/[0-9]/g) || [];
      if (letterMatch.length < 2 || numberMatch.length < 2) {
           setPasswordErrorPattern(true);
      }else {
        setPasswordErrorPattern(false);
      }
    }
  };

  return (
    <div>
      <Nav.Link
        style={{ fontSize: "16px", color: "white" }}
        onClick={() => setModal(true)}
      >
        Cambiar contraseña
      </Nav.Link>
      <Modal show={modal} onHide={handleClose} animation={false} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Cambiar contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Escriba su Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Nueva contraseña"
                value={formData.password}
                onChange={(e) => handleValidation(e)}
                required
              />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Vuelva a escribir su nueva contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password2"
                placeholder="Repetir contraseña"
                value={formData.password2}
                onChange={(e) => handleValidation(e)}
                required
              />
            </Form.Group>
            <br />
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
              <Button variant="primary" type="submit">
                Guardar cambios
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ChangePassword;