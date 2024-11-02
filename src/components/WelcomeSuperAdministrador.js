import React, { useEffect, useState } from "react";
import RequestTableSuperAdministrador from "./RequestTableSuperAdministrador";
import axios from "axios";

function WelcomeSuperAdministrador() {
    const [requests, setRequests] = useState([]);

    return (
      
      <div id="" style={{marginRight:"10%",marginLeft:"10%"}}>
        <h4>Hola Super Administrador Tus Solicitudes</h4>
        <RequestTableSuperAdministrador/>
      </div>
    );
}

export default WelcomeSuperAdministrador;
