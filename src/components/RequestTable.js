import { useState, useEffect } from "react";
import axios from "axios";
import {
  table,
  Spinner,
  Alert,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import FormSolicitudTable from "./FormSolicitudTable";
import HistoryComments from "./HistoryComments";
import { Toast } from "react-bootstrap";
import { toast } from "react-toastify";
import { DataTime, DateTime } from "luxon";
import { useFetcher } from "react-router-dom";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jsPDF from "jspdf";

function RequestTable() {
  const [requests, setRequests] = useState([]);
  const [showRequest, setShowRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState(null);
  const [nomEmpNombre, setNomEmpNombre] = useState("");
  const [nomEmpPaterno, setNomEmpPaterno] = useState("");
  const [nomEmpMaterno, setNomEmpMaterno] = useState("");
  const [fullName, setFullName] = useState("");
  const [REQUESTID, SETREQUESTID] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [Historials, setHistorials] = useState([]);
  const [fecha, setFecha] = useState([]);
  const [prioridad, setPrioridad] = useState(null);

  const FirmaJefeDepartamento =
    localStorage.getItem("nomEmpNombre") +
    " " +
    localStorage.getItem("nomEmpPaterno") +
    " " +
    localStorage.getItem("nomEmpMaterno");
  const FirmaJefe = FirmaJefeDepartamento;
  const UserRole = localStorage.getItem("UserRole");
  console.log("userRole", UserRole);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleClose2 = () => {
    setShowHistoryModal(false);
  };

  const handleShow = async (
    requestID,
    nomEmpNombre,
    nomEmpPaterno,
    nomEmpMaterno
  ) => {
    setShow(true);
    setNomEmpNombre(nomEmpNombre);
    setNomEmpPaterno(nomEmpPaterno);
    setNomEmpMaterno(nomEmpMaterno);
    SETREQUESTID(requestID);

    try {
      const response = await axios.get(
        `https://localhost:7145/api/Request/${requestID}`
      );

      console.log("The show request get successfully");
      setShowRequest(response.data);
      setHistorials(response.data.historials);
      setLoading2(true); // Assuming setLoading2 is used to indicate loading state
    } catch (error) {
      console.error("Error updating the Request:", error);
    }
  };

  const handleHistory = () => {
    setShowHistoryModal(true);
  };

  const [formData, setFormData] = useState({
    fecha: "",
    comentarios: "",
    prioridad: 0,
  });

  const handleAutorizar = async (e) => {
   // const { prioridad } = formData;

    const data = new FormData();

    try {
      if (UserRole === "Administrador") {
        if (prioridad === 0) {
          toast.error("eliga un nivel de prioridad antes de firmar");
        } else {
          data.append("firmaJefeDepartamento", FirmaJefeDepartamento);
          //data.append("prioridad", prioridad);

          //console.log("firmaJefeDepartamento", FirmaJefeDepartamento);
         // console.log("prioridad", prioridad);

          const response = await axios.put(
            `https://localhost:7145/api/Request/${REQUESTID}`,
            data,
            {
              headers: {
                "content-type": "application/json",
              },
            }
          );
          console.log("update Request Sucesfully", response);

          toast.success("Firmada Con exito");
          console.log("Request Update Sucessfully", response);
          const encabezado =
            "tu solicitud ha sido firmada por tu jede de departamento";
          const cuerpo =
            "Inicia sesion para ver el estado de tu solicitud `becas.com`";
          const response2 = await axios.post(
            `https://localhost:7145/api/email/send-test-email/${encodeURIComponent(
              showRequest.nomEmpleados.email
            )}/${encodeURIComponent(encabezado)}/${encodeURIComponent(cuerpo)}`,
            {},
            {
              headers: {
                "content-type": "application/json",
              },
            }
          );
          window.location.reload();
        }
      }

      if (UserRole === "SuperAdministrador") {
        if (prioridad === 0) {
          data.append("firmaJefe", FirmaJefeDepartamento);
         // data.append("prioridad", showRequest.prioridad);

          //console.log("firmaJefe", FirmaJefeDepartamento);
         // console.log("prioridad", showRequest.prioridad);
        } else {
          data.append("firmaJefeDepartamento", FirmaJefeDepartamento);
         // data.append("prioridad", prioridad);

          //console.log("firmaJefeDepartamento", FirmaJefeDepartamento);
        //  console.log("prioridad", prioridad);
        }

        const response = await axios.put(
          `https://localhost:7145/api/Request/${REQUESTID}`,
          data,
          {
            headers: {
              "content-type": "application/json",
            },
          }
        ); //
        toast.success("Firmada Con exito");

        console.log("Request Update Sucessfully", response);
        const encabezado =
          "tu solicitud ha sido firmada por el jefe de sistemas";
        const cuerpo = "inicia sesion para ver el estado de tu solicitud";
        const response2 = await axios.post(
          `https://localhost:7145/api/email/send-test-email/${encodeURIComponent(
            showRequest.nomEmpleados.email
          )}/${encodeURIComponent(encabezado)}/${encodeURIComponent(cuerpo)}`,
          {},
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating the Request:", error);
    }
  };

  // Obtener la fecha en formato año-mes-día y hora-minuto en GMT-7
  useEffect(() => {}, []);

  const handleSubmitComentarios = async (e) => {
    e.preventDefault();

    // Get the current date in GMT-7
    const getCurrentDateInGMT7 = () => {
      const dateInGMT7 = DateTime.now().setZone("America/Hermosillo");

      if (dateInGMT7.isValid) {
        return dateInGMT7.toFormat("yyyy-MM-dd'T'HH:mm");
      } else {
        console.error(
          "Fecha inválida obtenida:",
          dateInGMT7.invalidExplanation
        );
        return null;
      }
    };

    // Set the fecha to the current date in GMT-7
    const currentFecha = getCurrentDateInGMT7();

    // Ensure that the fecha is valid before continuing
    if (!currentFecha) {
      console.error("Fecha inválida, no se puede enviar el formulario");
      return;
    }

    const { comentarios } = formData;

    if (!comentarios || comentarios.trim() === "") {
      console.error("Los comentarios no pueden estar vacíos.");
      return;
    }

    // Prepare the form data to send
    const data = {
      fecha: currentFecha,
      comentarios: comentarios.trim(),
      RequestID: REQUESTID,
    };

    try {
      // Send the POST request to save the historial
      const response = await axios.post(
        "https://localhost:7145/api/Historial/",
        data,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );

      console.log("Historial enviado con éxito");

      // Refresh the request after successfully posting the comment
      try {
        const response = await axios.get(
          `https://localhost:7145/api/Request/${REQUESTID}`
        );
        setShowRequest(response.data);
        setHistorials(response.data.historials);
        setLoading2(true);
      } catch (error) {
        console.error("Error actualizando la solicitud:", error);
      }
    } catch (error) {
      console.error("Error al enviar el historial:", error);
    }

    // Send email notification after submitting the comment
    const encabezado = "Tienes Nuevos Comentarios en Tu solicitud";
    const cuerpo =
      "Inicia sesión en la página para ver tus comentarios: becas.com";
    try {
      const response = await axios.post(
        `https://localhost:7145/api/email/send-test-email/${encodeURIComponent(
          showRequest.nomEmpleados.email
        )}/${encodeURIComponent(encabezado)}/${encodeURIComponent(cuerpo)}`,
        {},
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
    } catch (emailError) {
      console.error("Error al enviar el correo electrónico:", emailError);
    }
  };

  useEffect(() => {
    UpdateTableRequest();
  }, []);

  const UpdateTableRequest = () => {
    axios
    .get(`https://localhost:7145/api/Request/`)
    .then((response) => {
      console.log("the request get sucessfully", response);
      setRequests(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.log("error to get the request", error);
      setError("El servidor no puede obtener las solicitudes");
      setLoading(false);
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDowloadPdf = async () => {
    try {
      console.log("requestId", showRequest.id);

      const descripcion2 =
        showRequest.nomEmpleados.direccionesICEES.descripcion;
      const fechaSolicitada = new Date(
        showRequest.fechaSolicitada
      ).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

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
      doc.setFont("bold"); // Use helvetica bold instead
      doc.setFontSize(14);
      doc.text(
        "SOLICITUD DE SERVICIOS SUBDIRECCION DE INFRAESTRUCTURA ",
        20,
        20
      );
      doc.text(" Y TECNOLOGIAS DE LA INFORMACION", 50, 30);

      doc.setFontSize(16);
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

      doc.text(`solicitante:`, 20, 260);
      doc.text(`${firmaEmpleado}`, 20, 280);
      doc.text(`Aurizo `, 80, 260);
      doc.text(`Unidad adm solicitante`, 80, 270);
      doc.text(`${firmaJefeDepartamento}`, 80, 280);
      doc.text(`Acepta insfreastructura y`, 140, 260);
      doc.text(`Tecnologia de la Informacion`, 140, 270);
      doc.text(`${firmaJefe}`, 140, 280);

      // Save the PDF after the image has loaded
      doc.save(`Solicitud ${showRequest.nomEmpleados.nomEmpClave}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleUpdatePrioridad = async (e) => {
    e.preventDefault();
   
    const { prioridad } = formData;

    const data = new FormData();

    data.append("prioridad",prioridad);

    try {
      const response = await axios.put(
        `https://localhost:7145/api/Request/${REQUESTID}`,
        data,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      ); //

      UpdateTableRequest();

    } catch (error) {
      console.log("0");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de solicitudes {} </h2>

      {loading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Cargando..</span>
        </Spinner>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del empleado</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Acciones</th>
            </tr>
          </thead>

          {UserRole === "SuperAdministrador" && (
            <tbody>
              {requests.map((request) =>
                request.firmaJefeDepartamento !== "0" ? (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>
                      {request.nomEmpleados.nomEmpNombre +
                        " " +
                        request.nomEmpleados.nomEmpPaterno +
                        " " +
                        request.nomEmpleados.nomEmpMaterno}
                    </td>
                    <td>{request.descripcion}</td>
                    <td>
                      {new Date(request.fechaSolicitada).toLocaleDateString(
                        "es-ES",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td>{request.status}</td>
                    {request.prioridad === 0 && (
                      <td>
                        {
                          <Button style={{ width: "120px" }}>
                            {" "}
                            Sin Asignar{" "}
                          </Button>
                        }{" "}
                      </td>
                    )}
                    {request.prioridad === 1 && (
                      <td>
                        {<Button style={{ width: "70px" }}> Baja </Button>}{" "}
                      </td>
                    )}
                    {request.prioridad === 2 && (
                      <td>
                        {<Button style={{ width: "70px" }}> Media </Button>}{" "}
                      </td>
                    )}
                    {request.prioridad === 3 && (
                      <td>
                        {<Button style={{ width: "70px" }}> Alta </Button>}{" "}
                      </td>
                    )}{" "}
                    <td>
                      <Button variant="success">Autorizar</Button>{" "}
                      <Button variant="secondary">Descargar Documento</Button>{" "}
                      <Button
                        variant="primary"
                        onClick={() =>
                          handleShow(
                            request.id,
                            request.nomEmpleados.nomEmpNombre,
                            request.nomEmpleados.nomEmpPaterno,
                            request.nomEmpleados.nomEmpMaterno
                          )
                        }
                        style={{ backgroundColor: "#217ABF" }}
                      >
                        Ver Detalles
                      </Button>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          )}

          {UserRole === "Administrador" && (
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>
                    {request.nomEmpleados.nomEmpNombre +
                      " " +
                      request.nomEmpleados.nomEmpPaterno +
                      " " +
                      request.nomEmpleados.nomEmpMaterno}
                  </td>
                  <td>{request.descripcion}</td>
                  <td>
                    {new Date(request.fechaSolicitada).toLocaleDateString(
                      "es-ES",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </td>
                  <td>{request.status}</td>

                  {request.prioridad === 0 && (
                    <td>
                      {
                        <Button style={{ width: "120px" }}>
                          {" "}
                          Sin Asignar{" "}
                        </Button>
                      }{" "}
                    </td>
                  )}

                  {request.prioridad === 1 && (
                    <td>
                      {<Button style={{ width: "70px" }}> Baja </Button>}{" "}
                    </td>
                  )}
                  {request.prioridad === 2 && (
                    <td>
                      {<Button style={{ width: "70px" }}> Media </Button>}{" "}
                    </td>
                  )}
                  {request.prioridad === 3 && (
                    <td>
                      {<Button style={{ width: "70px" }}> Alta </Button>}{" "}
                    </td>
                  )}

                  <td>
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleShow(
                          request.id,
                          request.nomEmpleados.nomEmpNombre,
                          request.nomEmpleados.nomEmpPaterno,
                          request.nomEmpleados.nomEmpMaterno
                        )
                      }
                      style={{ backgroundColor: "#217ABF" }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      )}

      {loading2 && (
        <Modal
          show={show}
          onHide={handleClose}
          animation={false}
          dialogClassName="modal-80"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Solicitud del usuario:{" "}
              {nomEmpNombre + " " + nomEmpPaterno + " " + nomEmpMaterno}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading2 && <FormSolicitudTable showRequest={showRequest} />}

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleClose}
                style={{ backgroundColor: "#666666" }}
              >
                {" "}
                Close{" "}
              </Button>

              <Button
                variant="primary"
                onClick={(e) => {
                  handleHistory(e);
                }}
                style={{ backgroundColor: "#217ABF" }}
              >
                Comentar
              </Button>

              <Button
                variant="success"
                onClick={handleAutorizar}
                style={{ backgroundColor: "#237469" }}
              >
                {" "}
                Autorizar{" "}
              </Button>

              {UserRole === "Administrador" && (
                <Form.Select
                  aria-label="Default select example"
                  style={{ width: "120px", backgroundColor: "#DC7F37" }}
                  onChange={handleChange}
                  name="prioridad"
                  disabled={
                    showRequest.prioridad === 1 ||
                    showRequest.prioridad === 2 ||
                    showRequest.prioridad === 3
                  } // Disable if prioridad is 1, 2, or 3
                  defaultValue={showRequest.prioridad}
                >
                  <option value="0">Prioridad</option>
                  <option value="1">Baja</option>
                  <option value="2">Media</option>
                  <option value="3">Alta</option>
                </Form.Select>
              )}

              {UserRole === "SuperAdministrador" && (
                <Form.Select
                  aria-label="Default select example"
                  style={{ width: "120px", backgroundColor: "#DC7F37" }}
                  onChange={handleChange}
                  onClick={(e) => {
                    handleUpdatePrioridad(e);
                  }}
                  name="prioridad"
                  defaultValue={showRequest.prioridad}
                >
                  <option value="0">Prioridad</option>
                  <option value="1">Baja</option>
                  <option value="2">Media</option>
                  <option value="3">Alta</option>
                  <option value="3">hola</option>
                </Form.Select>
              )}

              <Button
                variant="primary"
                onClick={(e) => {
                  handleDowloadPdf(e);
                }}
                style={{ backgroundColor: "#217ABF" }}
              >
                Descargar
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      )}

      <Modal
        show={showHistoryModal}
        onHide={handleClose2}
        animation={false}
        dialogClassName="modal-80"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Agregar comentarios a la solicitud de :{" "}
            {nomEmpNombre + " " + nomEmpPaterno + " " + nomEmpMaterno}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <HistoryComments Historials={Historials} />

          <br />
          <br />
          <Form onSubmit={handleSubmitComentarios}>
            <Form.Label>AGREGA LOS COMENTARIOS AQUI</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="comentarios"
              placeholder="agrega los comentarios aqui"
              value={formData.comentarios}
              onChange={handleChange}
              required
            />

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose2}>
                cerrar
              </Button>

              <Button variant="success" onClick={handleSubmitComentarios}>
                Enviar Comentario
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default RequestTable;
