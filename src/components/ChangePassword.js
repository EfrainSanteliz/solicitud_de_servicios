import { useState, useEffect, useDeferredValue } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
//
function ChangePassword() {
  useEffect(() => {}, []);

  const getCode = () => {};

  const StoreCode = async (e) => {
    const { email } = formData;

    e.preventDefault();
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `User/${email}`
      );
    } catch (error) {
      console.log("so se pudo guardar el codigo", error);
    }
  };

  const PutUser = () => {};

  const [responseCodigo, setResponseCodigo] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const Data = new FormData();

    const { email, password, password2, codigo } = formData;

    Data.append("password", password);

    try {
      const response = axios.get(
        process.env.REACT_APP_API_URL + `User/${email}`
      );
      setResponseCodigo(response.data.codigo);
    } catch (error) {
      console.log("no se pudo obtener el codigo", error);
    }

    if (password == password2) {
      if (codigo == responseCodigo) {
        try {
          const axios = axios.put(
            process.env.REACT_APP_API_URL + `User/${email}`,
            Data
          );
        } catch (error) {
          console.log("error", error);
        }
      }
    }
  }; //

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    codigo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div style={{ padding: "2%" }}>
      <Form onSubmit={(e) => handleSubmit(e)}>
      <Form.Label>Escribe tu correo </Form.Label>
      <br />
      <Form.Control
        type="text"
        onChange={(e) => handleChange(e)}
        name="email"
        required
      ></Form.Control>{" "}
      <br />
      <Form.Label>Escribe tu Nueva contraseña</Form.Label>
      <br />
      <Form.Control
        type="text"
        onChange={(e) => handleChange(e)}
        name="password"
        required
      ></Form.Control>
      <br />
      <Form.Label>Repite la Nueva contraseña</Form.Label>
      <br />
      <Form.Control
        type="text"
        onChange={(e) => handleChange(e)}
        name="password2"
        required
      ></Form.Control>
      <br />
      <Button variant="primary" onClick={(e) => StoreCode(e)}>
        Click Aqui Para enviar codigo de verificacion a su correo{" "}
      </Button>
      <br />
      <br />
      <Form.Control
        type="text"
        name="codigo"
        placeholder="escriba su codigo de verificacion"
        required
      ></Form.Control>
      <br />
      <br />
      <Form.Label>
        Si no recibió su código de verificación revise su bandeja de spam
      </Form.Label>
      <br />
      <br />
      <Button type="submit" variant="primary">
        Confirmar
      </Button>
      </Form>
    </div>
  );
}

export default ChangePassword;
