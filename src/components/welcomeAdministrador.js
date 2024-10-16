import React, { useEffect, useState } from "react";
import axios from "axios";
import RequestTableAdministrador  from "./RequestTableAdministrador";

function WelcomeAdministrador() {
  const [requests, setRequests] = useState([]);

// El array vacío asegura que esto solo ocurra una vez al montar el componente

  return (
    <div className="container mt-5">
      <h2>hola Administrador Tus Solicitudes</h2>
      <RequestTableAdministrador/>

    </div>
  );
}

export default WelcomeAdministrador;