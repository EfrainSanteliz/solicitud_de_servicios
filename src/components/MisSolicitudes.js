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
import DownloadPdfAsp from "./DownloadPdfAsp";

function MisSolicitudes() {
  const [Request, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
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
    listRequest();
  }, [userId]);

  const listRequest = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7145/api/Request/byNomEmpleadoId/${userId}`
      );
      setRequests(response.data);
      setLoadingRequest(true);
      console.log("id", response.data);
    } catch (error) {
      console.error("get request failed", error);
    }
  };

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

  const statusid = {
    1: "Activo",
    2: "Inactivo",
    3: "Revertido",
    4: "Finalizado",
    5: "cancelado",
  };

  return (
    <div className="fontSize" style={{ fontSize: "16px", fontFamily: "Roboto, sans-serif" }}>
      <div className="container mt-4">
        <h2>Tus Solicitudes</h2>

        {loadingRequest ? (
          <Table striped bordered hover style={{ tableLayout: "fixed", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ width: "170px" }}>Servicio Solicitado</th>
                <th style={{ width: "200px", overflow: "hidden" }}>Descripcion</th>
                <th style={{ width: "100px" }}>Fecha</th>
                <th style={{ width: "80px" }}>Estatus</th>
                <th style={{ width: "80px", textAlign: "center" }}>Acciones</th>
                <th style={{ width: "80px", textAlign: "center" }}>Historial</th>
              </tr>
            </thead>
            <tbody>
              {Request.map((Reques) => (
                <tr key={Reques.id}>
                  <td width="150px">
                    {Reques.servicio_Solicitado.descripcionServicio_Solicitado}
                  </td>
                  <td
                      style={{
                        width: "300px",
                        whiteSpace: "nowrap", // Evita que el texto haga wrap
                        overflow: "hidden", // Oculta el texto que no cabe
                        textOverflow: "ellipsis", // Añade puntos suspensivos
                        fontWeight: "normal",
                      }}
                    >
                      {Reques.descripcion}
                    </td>
                  <td width="150px">
                    {new Date(Reques.fechaSolicitada).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </td>
                  <td>{statusid[Reques.status] || "Unknown"}</td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                      variant=""
                      onClick={() => {
                        handleShow1(Reques.id);
                        setShow(true);
                      }}
                      style={{ backgroundColor: "#C5126D" }}
                    >
                      <FontAwesomeIcon icon={faEye} style={{ color: "white" }} />
                    </Button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Button
                    variant=""
                      onClick={() => {
                        handleShow2(Reques.id);
                        setShowModalHistoryComments(true);
                      }}
                      style={{ backgroundColor: "#C5126D" }}
                    >
                      <FontAwesomeIcon icon={faEye} style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div>Cargando...</div>
        )}


        <Modal
          show={show}
          onHide={handleClose}
          animation={false}
          size="xl" // Use "lg" for large or "xl" for extra-large
        >
          <Modal.Header closeButton>
            <Modal.Title>Tu Solicitud</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading && <FormSolicitudTable showRequest={showRequest} />}

            <Modal.Footer>
              <DownloadPdfAsp showRequest={showRequest}></DownloadPdfAsp>
            </Modal.Footer>
          </Modal.Body>
        </Modal>

        <Modal
          show={showModalHistoryComments}
          onHide={handleClose}
          animation={false}
          size="xl" // Use "lg" for large or "xl" for extra-large
        >
          <Modal.Header closeButton>
            <Modal.Title>Historial de comentarios</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <HistoryComments Historials={Historials} />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
export default MisSolicitudes;
