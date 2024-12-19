import { useState, useEffect, useDeferredValue } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import {
  longitudPasswordError,
  PasswordIsNotTheSame,
  codeOfVerificationIsNotTheSame,
  Error,
} from "./AlertService";
import { use } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { PasswordErrorPattern } from "./AlertService";


const RECAPTCHA_SITE_KEY = "6Ld83pcqAAAAAB-bXzjW6-Vodl1IOpLCh_my7JCp";

function ChangePassword() {
  const [message, setMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [submitStatus, setSubmitStatus] = useState("");
  const [passwordErrorPattern,setPasswordErrorPattern] = useState(false);


  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);
  const randomTenDigitNumber = Math.floor(
    1000000000 + Math.random() * 9000000000
  );

  const [codigoVerificacion, setCodigoVerificacion] =
    useState(randomTenDigitNumber);

  const [passwordErrorLongitud, setPasswordErrorLongitud] = useState(false);

  const StoreCode = async (e) => {
    e.preventDefault();

    const { email } = formData;

    if (timer == 0) {
      try {
        const response = await axios.put(
          process.env.REACT_APP_API_URL + `User/changeByEmailCode/${email}`
        );
        setCodigoVerificacion(response.data);
        console.log("codigo: ",response.data);

      } catch (error) {}
      setTimer(30);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      setSubmitStatus("primero completa el reCAPTCHA.");
      return;
    }

    // Send data along with the captcha token to the backend
    /*  try {
      const response = await fetch('https://localhost:7247/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message, captchaToken }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSubmitStatus('Form submitted successfully!');
        } else {
          setSubmitStatus('reCAPTCHA verification failed. Please try again.');
        }
      } else {
        setSubmitStatus('Server error occurred.');
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus('Network error occurred.');
    } */

    const { email, password, password2, codigo } = formData;

    const Data = {
      password,
    };

    if (passwordErrorPattern) {
      PasswordErrorPattern();
      return;
    }

    if (!passwordErrorLongitud) {
      if (password == password2) {
        if (codigo == codigoVerificacion) {
          try {
            const response = await axios.put(
              process.env.REACT_APP_API_URL + `User/changeByEmail/${email}/${codigo}`,
              Data
            );
            const response2 = await axios.put(
              process.env.REACT_APP_API_URL + `User/dropEmailCode/${email}`
            );
            navigate("/");
          } catch (error) {
            Error();

          }
        } else {
          codeOfVerificationIsNotTheSame();
        }
      } else {
        PasswordIsNotTheSame();
      }
    } else {
      longitudPasswordError();
    }
  }; //

  const onRecaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    codigo: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    <div style={{ padding: "2%", fontSize:"18px"}}>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Form.Label>Escribe tu correo institucional </Form.Label>
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
          type="password"
          onChange={(e) => handleValidation(e)}
          name="password"
          required
        ></Form.Control>
        <br />
        <Form.Label>Repite la Nueva contraseña</Form.Label>
        <br />
        <Form.Control
          type="password"
          onChange={(e) => handleValidation(e)}
          name="password2"
          required
        ></Form.Control>
        <br />
        <div style={{ marginBottom: "1rem" }}>
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={onRecaptchaChange}
          />
        </div>
        <br />
        <Form.Label>
          Nota. Si el reCAPTCHA no aparece recarge la pagina o borre la cache
          del sitio.
        </Form.Label>
        <br />
        <br />
        <Button
          variant="primary"
          onClick={(e) => StoreCode(e)}
          disabled={timer > 0 || !captchaToken} // Disable button during countdown
        >
          {timer > 0
            ? `Espere ${timer} segundos para reenviar otro codigo de verificacion` // Update text dynamically
            : "Click Aquí para enviar código de verificación a su correo. Primero complete el reCAPTCHA"}
        </Button>
        <br />
        <br />
        <Form.Control
          type="text"
          name="codigo"
          onChange={(e) => handleChange(e)}
          placeholder="escriba su codigo de verificacion"
          disabled={!captchaToken}
          required
        ></Form.Control>
        <br />
        <br />
        <Form.Label>
          Si no recibió su código de verificación revise su bandeja de spam
        </Form.Label>
        <br />
        <br />
        <Button
          type="submit"
          variant="primary"
          onClick={(e) => handleSubmit(e)}
          disabled={!captchaToken}

        >
          Confirmar
        </Button >
        {submitStatus && <p>{submitStatus}</p>}
      </Form>
    </div>
  );
}

export default ChangePassword;
