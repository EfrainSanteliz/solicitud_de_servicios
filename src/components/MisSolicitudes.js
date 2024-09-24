import React from "react";
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import { useState, useEffect } from "react";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MisSolicitudes() {

  const [Request, setRequests]= useState([]);
  const [loading, setLoading] = useState([]);
  const [showRequest, setShowRequests] = useState([]);

  const userId = localStorage.getItem('userid');

  useEffect(() => {
    axios.get(`https://localhost:7145/api/Request/byNomEmpleadoId/${userId}`) // Replace with your API endpoint
      .then(response => {
        setRequests(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });

  }, [userId]);

  const view = (id) => {

    axios.get(`https://localhost:7145/api/Request/${id}`)
    .then((response) => {
      setShowRequests(response.data)

    })
    .catch((error) => {
        console.log("dont show request",error)
    });

  };


  return (

    <div className="container mt-4">
      <h2>Tus Solicitudes</h2>
      <Table striped bordered hover>

        <thead>
          <tr>
            <th>Servicio Solicitado</th>
            <th>Descripcion</th>
            <th>Fecha</th>
            <th>Estatus</th>
            <th>Acciones</th>


          </tr>
        </thead>
        <tbody>
          {Request.map((Reques, index) => (
            <tr key={Reques.id}>

              <td>{Reques.servicioSolicitado}</td>
              <td>{Reques.descripcion}</td>
              <td>{Reques.fechaSolicitada}</td>
              <td>{Reques.status}</td>
              <td><Button onClick={view(Reques.id)} variant="primary">

                <FontAwesomeIcon icon={faEye} />

              </Button></td>

            </tr>
          ))}

        </tbody>
      </Table>

    </div>

  );

}
export default MisSolicitudes;
