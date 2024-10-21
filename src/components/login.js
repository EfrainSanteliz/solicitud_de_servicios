import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken } from "./JwtHelper";


function Login() {
  // State variables for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Function to handle login
  const handleLogin = () => {
    const loginData = {
      email,
      password,
    };

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
      

      console.log("Navigating to the correct page...");
  
      if (response.data.user.userRole === "UsuarioNormal") {
        console.log("Navigating to /Welcome");
        navigate("/Welcome");
      } else if (response.data.user.userRole === "Administrador") {
        console.log("Navigating to /WelcomeAdministrador");
        navigate("/WelcomeAdministrador");
      } else if (response.data.user.userRole === "SuperAdministrador") {
        console.log("Navigating to /WelcomeSuperAdministrador");
        navigate("/WelcomeSuperAdministrador");
      }
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      alert("Login failed. Please check your credentials and try again.");
    });
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2><br></br>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Correo Electronico
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
          Contraseña
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
      <div className="mb-3">
        <label className="form-label">
          No tienes una cuenta?{" "}
          <a href="/NewUser" style={{label:"#217ABF"}}>Click aquí para registrarte </a>
        </label>
      </div>
      <button className="btn btn-primary" onClick={handleLogin} style={{backgroundColor:"#217ABF"}}>
        Login
      </button>
    </div>
  );
}

export default Login;
