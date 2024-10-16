import React, { useEffect, useState } from "react";
import RequestTableSuperAdministrador from "./RequestTableSuperAdministrador";
import axios from "axios";

function WelcomeSuperAdministrador() {
    const [requests, setRequests] = useState([]);

    return (
      <div className="container mt-5">
        <h2>Hola Super Administrador Tus Solicitudes</h2>
        <RequestTableSuperAdministrador/>
      </div>
    );
}

export default WelcomeSuperAdministrador;
