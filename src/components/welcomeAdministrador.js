import React, { useEffect, useState } from "react";
import axios from "axios";

function WelcomeAdministrador() {
  const [requests, setRequests] = useState([]);

  // Usamos useEffect para cargar los datos al montar el componente
  useEffect(() => {
    axios
      .get("https://localhost:7145/api/Request")  // Ajusta esta URL a la de tu API
      .then((response) => {
        setRequests(response.data);  // Guardamos los datos en el estado
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);  // El array vacío asegura que esto solo ocurra una vez al montar el componente

  return (
    <div className="container mt-5">
      <h2>hola Administrador Tus Solicitudes</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del empleado</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.nomEmpleados.nomEmpNombre + " "+ request.nomEmpleados.nomEmpPaterno + " " +request.nomEmpleados.nomEmpMaterno}</td> {/* Nombre del empleado corregido */}
              <td>{request.descripcion}</td>
              <td>{new Date(request.fechaSolicitada).toLocaleDateString()}</td>
              <td>{request.status}</td>
              <td><button>Autorizar</button><button>Descargar Documento</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WelcomeAdministrador;