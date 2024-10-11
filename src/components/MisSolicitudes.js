import React from "react";
import axios from "axios";
import { Table, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormSolicitudTable from "./FormSolicitudTable";
import "./styles.css";
import HistoryComments from "./HistoryComments";
import jsPDF from "jspdf";
import DownloadPdf from "./DownloadPdf";

function MisSolicitudes() {
  const [Request, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRequest, setShowRequests] = useState([]);
  const [show, setShow] = useState(false);
  const [showModalHistoryComments, setShowModalHistoryComments] =
    useState(false);
  const [history, setHistory] = useState([]);
  const [option, setOption] = useState(false);
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

  const handleShow1 = (id) => {
    axios
      .get(`https://localhost:7145/api/Request/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setShowRequests(response.data);
        console.log("Show Request get sucessfully1", response.data);
        setLoading(true);
      })
      .catch((error) => {
        console.log("dont show request", error);
      });
  };

  const handleShow2 = (id) => {
    axios
      .get(`https://localhost:7145/api/Request/${id}`) // Replace with your actual API endpoint
      .then((response) => {
        setHistorials(response.data.historials); // Update state with the historials array
      })
      .catch((error) => {
        console.error("Error fetching historials:", error);
      });
  };

  

  return (
    <div className="container mt-4">
      <h2>Tus Solicitudes</h2>
      <Table striped bordered hover style={{ tableLayout: 'fixed', width: '100%' }}>
      <thead>
          <tr>
            <th style={{width:"170px"}}>Servicio Solicitado</th>
            <th
              style={{
                width: "200px",
                //whiteSpace: "nowrap",
                overflow: "hidden",
                //textOverflow: "ellipsis",
              }}
            >
              Descripcion
            </th>{" "}
            <th style={{width:"100px"}}>Fecha</th>
            <th style={{width:"80px"}}>Estatus</th>
            <th style={{ textAlign: "center" }}>Acciones</th>
            <th style={{ textAlign: "center" }}>Historial</th>
          </tr>
        </thead>
        <tbody>
          {Request.map((Reques, index) => (
            <tr key={Reques.id}>
              <td width={"150px"}>{Reques.servicioSolicitado}</td>
              <td
                style={{
                  width: "300px",
                 // whiteSpace: "nowrap",
                  overflow: "hidden",
                  //textOverflow: "ellipsis",
                  fontWeight: 'normal' // Quita las negritas

                }}
              >
                {Reques.descripcion}
              </td>
              <td width={"150px"}>
                {new Date(Reques.fechaSolicitada).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td width={"100px"}>{Reques.status}</td>

              <td style={{ textAlign: "center" }}>
                <Button
                  onClick={() => {
                    handleShow1(Reques.id);
                    setShow(true);
                  }}
                  variant="primary"
                  style={{ backgroundColor: "#217ABF" }}
                >
                  <FontAwesomeIcon icon={faEye} />
                </Button>{" "}
              </td>

              <td style={{ textAlign: "center" }}>
                <Button
                  onClick={() => {
                    handleShow2(Reques.id);
                    setShowModalHistoryComments(true);
                  }}
                  style={{ backgroundColor: "#217ABF" }}
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

          <Modal.Footer>
          <DownloadPdf showRequest={showRequest}></DownloadPdf>
          </Modal.Footer>
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
