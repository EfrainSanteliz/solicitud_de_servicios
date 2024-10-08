import { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function NewUser() {
// State variables for email and password
   const [email,setEmail] = useState("");
   const [password,setPassword] = useState("");
   const [nomEmpRFC,setNomEmpRFC] = useState("");
   const navigate = useNavigate();

  const handleRegister = () => {
      const RegisterDate = {
        email,
        password,
      } 


      axios.put(`https://localhost:7142/api/user/${nomEmpRFC}`,RegisterDate)
      .then((response) => {
          console.log("Register successful");
          alert("Registro Exitoso")
          localStorage.setItem("userid",response.data.EmpleadoId);
          navigate("/login", { state: {userId: response.data.EmpleadoId}});
      })
      .catch((error) => {
         console.log("error al registrar usuario");
         alert("Fallo al registrarse intentalo de nuevo mas tarde");
      });
  };


    return(

        <div className="container mt-5">
        <h2>Registrarse</h2>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Ingrese su rfc
          </label>
          <input
            type="email"
            className="form-control"
            id="nomEmpClave"
            placeholder="Ingrese su rfc"
            value={nomEmpRFC}
            onChange={(e) => setNomEmpRFC(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Ingrese su email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Ingrese su contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
     
        <button className="btn btn-primary" onClick={handleRegister} style={{label:"#217ABF"}}>
          Registrarse
        </button>
      </div>
    );
}

export default NewUser;