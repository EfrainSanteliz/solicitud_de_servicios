import React from "react";
import axios from "axios";
import { Table, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormSolicitudTable from "./FormSolicitudTable";
import "./styles.css";
import HistoryComments from "./HistoryComments";

function MisSolicitudes() {
  const [Request, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRequest, setShowRequests] = useState([]);
  const [show, setShow] = useState(false);
  const [showModalHistoryComments, setShowModalHistoryComments] = useState(false);
  const [history, setHistory] = useState([]);
  const [option, setOption] = useState(true);
  const [Historials, setHistorials] = useState([]);

  const userId = localStorage.getItem("userid");

  useEffect(() => {
    axios
      .get(`https://localhost:7145/api/Request/byNomEmpleadoId/${userId}`)
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [userId]);


  const handleClose = () => {
    setShow(false);
    setShowModalHistoryComments(false);
  };



  const handleShow = (id) => {

    if (option === true) {
      axios
        .get(`https://localhost:7145/api/Request/${id}`)
        .then((response) => {
          setShowRequests(response.data);
          console.log("Show Request get sucessfully1", response.data);
          setLoading(true);
        })
        .catch((error) => {
          console.log("dont show request", error);
        });
    }

    if (option === false) {
      axios.get(`https://localhost:7145/api/Request/${id}`) // Replace with your actual API endpoint
        .then((response) => {
          setHistorials(response.data.historials); // Update state with the historials array
        })
        .catch((error) => {
          console.error('Error fetching historials:', error);
        });
    }
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
            <th style={{ textAlign: "center" }}>Acciones</th>
            <th style={{ textAlign: "center" }}>Historial</th>
          </tr>
        </thead>
        <tbody>
          {Request.map((Reques, index) => (
            <tr key={Reques.id}>
              <td>{Reques.servicioSolicitado}</td>
              <td>{Reques.descripcion}</td>
              <td>
                {new Date(Reques.fechaSolicitada).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </td>
              {Reques.status === 1 && <td>{"En revision"}</td>}

              <td style={{ textAlign: "center" }}>
                <Button
                  onClick={() => {
                    handleShow(Reques.id);
                    setShow(true);
                    setOption(true);
                  }}
                  variant="primary"
                >
                  <FontAwesomeIcon icon={faEye} />
                </Button>{" "}
                <Button variant="success">
                  <i className="fas fa-download"></i> Descargar
                </Button>{" "}
              </td>

              <td style={{ textAlign: "center" }}>
                <Button
                  onClick={() => {
                    setOption(false);
                    handleShow(Reques.id);
                    setShowModalHistoryComments(true);
                  }}
                >
                  <FontAwesomeIcon icon={faEye} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-80"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Tu Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <FormSolicitudTable showRequest={showRequest} />}
        </Modal.Body>

      </Modal>

      <Modal
        show={showModalHistoryComments}
        onHide={handleClose}
        dialogClassName="modal-80"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Historial de comentarios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HistoryComments Historials={Historials} />

        </Modal.Body>

      </Modal>
    </div>
  );
}
export default MisSolicitudes;
