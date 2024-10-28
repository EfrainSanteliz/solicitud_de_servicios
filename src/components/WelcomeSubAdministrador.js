import React, { useEffect, useState } from "react";
import RequestTableSubAdministrador from "./RequestTableSubAdministrador";
import axios from "axios";

function WelcomeSubAdministrador() {
    const [requests, setRequests] = useState([]);

    return (
      <div className="container mt-5">
        <h4>Hola Sub Administrador Tus Solicitudes</h4>
        <RequestTableSubAdministrador/>
      </div>
    );
}

export default WelcomeSubAdministrador;
