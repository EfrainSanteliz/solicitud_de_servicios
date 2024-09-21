import React, { useEffect, useState } from "react";
import RequestTable from "./RequestTable";

import axios from "axios";function WelcomeSuperAdministrador() {
    const [requests, setRequests] = useState([]);

    return (
      <div className="container mt-5">
        <h2>Hola Super Adminstrador Tus Solicitudes</h2>
        <RequestTable></RequestTable>
      </div>
    );
}

export default WelcomeSuperAdministrador;
