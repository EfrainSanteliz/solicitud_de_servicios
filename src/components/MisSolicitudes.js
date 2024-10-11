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
  }

  const handleDowloadPdf = async () => {
    try {

      const descripcion2 = showRequest.nomEmpleados.direccionesICEES.descripcion;
      const fechaSolicitada = new Date(showRequest.fechaSolicitada).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      
      const {
        servicioSolicitado,
        solicitudDeServicioARealizar,
        descripcion,
        firmaEmpleado,
        firmaJefeDepartamento,
        firmaJefe,
        file,
        
      } = showRequest;

      const doc = new jsPDF();

      // Add content to the PDF
      doc.setFont( "bold"); // Use helvetica bold instead
      doc.setFontSize(14);
      doc.text(
        "SOLICITUD DE SERVICIOS SUBDIRECCION DE INFRAESTRUCTURA ",
        20,
        20
      );
      doc.text(" Y TECNOLOGIAS DE LA INFORMACION", 50, 30);

      doc.setFontSize(12);
      // Add the specific data from the response
      doc.text(`Servicio solicitado: ${servicioSolicitado}`, 20, 40);
      doc.text(`Fecha: ${fechaSolicitada}`, 20, 50);
      doc.text(
        `Solicitud de servicio a realizar: ${solicitudDeServicioARealizar}`,
        20,
        60
      );
      doc.text(`Area Administrativa requirente: ${descripcion2}`, 20, 70);
      doc.text(`Solicitante: ${firmaEmpleado}`, 20, 80);
      doc.text(`Descripcion: ${descripcion}`, 20, 90);

      // Check if there is an image file
      if (file) {
        const baseURL = "https://localhost:7145"; // Replace this with your actual server URL
        const fullImageUrl = `${baseURL}${file}`;

        const img = new Image();
        img.src = fullImageUrl;

        await new Promise((resolve, reject) => {
          img.onload = function () {
            // Add the image to the PDF
            doc.addImage(img, "JPEG", 20, 100, 140, 140); // Adjust the dimensions and position
            resolve();
          };

          img.onerror = function (err) {
            console.error("Failed to load image:", err, fullImageUrl);
            reject(err); // Reject the promise on error
          };
        });

        
      } else {
        doc.text("No image provided", 20, 100);
      }
      
      doc.setFontSize(10);

      
      doc.text(`solicitante:`,20,260);
      doc.text(`${firmaEmpleado}`,20,280);
      doc.text(`Aurizo `,80,260);
      doc.text(`Unidad adm solicitante`,80,270); 
      doc.text(`${firmaJefeDepartamento}`,80,280);
      doc.text(`Acepta insfreastructura y`,140,260);
      doc.text(`Tecnologia de la Informacion`,140,270);
      doc.text(`${firmaJefe}`,140,280)

      // Save the PDF after the image has loaded
      doc.save(`Solicitud ${showRequest.nomEmpleados.nomEmpClave}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
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
                {new Date(Reques.fechaSolicitada).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td>{Reques.status}</td>

              <td style={{ textAlign: "center" }}>
                <Button
                  onClick={() => {
                    handleShow1(Reques.id);
                    setShow(true);
                  }}
                  variant="primary"
                  style={{backgroundColor:'#217ABF'}}
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
                  style={{backgroundColor:'#217ABF'}}

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
            <Button variant="primary" onClick={handleDowloadPdf}>
              Dercargar documento
            </Button>
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
