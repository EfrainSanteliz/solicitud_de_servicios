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
import SearchBar from "./SearchBar";
import UpdateStatus from "./UpdateStatus";
import DownloadPdf from "./DownloadPdf";

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
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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
  const[requestID, setRequestID] = useState(null);

  
  useEffect(() => {
    if (requestID) {
      handleShow(requestID, nomEmpNombre, nomEmpPaterno, nomEmpMaterno);
    }
  }, [requestID, nomEmpNombre, nomEmpPaterno, nomEmpMaterno]); // Add dependencies to trigger only when these values change


  const showRequest2 =  async (requestID) => {
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
  }

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

    showRequest2(requestID);
  };

  const handleHistory = () => {
    setShowHistoryModal(true);
  };

  const [formData, setFormData] = useState({
    fecha: "",
    comentarios: "",
    prioridad: 0,
    status: "Activo",
  });

  const handleAutorizar = async (e) => {
    // const { prioridad } = formData;
    e.preventDefault();

    const data = new FormData();

    const { prioridad } = formData;

    try {
      if (UserRole === "Administrador") {
        if (prioridad === 0) {
          toast.error("Elija un nivel de prioridad antes de firmar");
        } else {
          data.append("firmaJefeDepartamento", FirmaJefeDepartamento);
          data.append("prioridad", prioridad);

          console.log("firmaJefeDepartamento", FirmaJefeDepartamento);
          console.log("prioridad", prioridad);

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
          toast.success("Firmada Con exito");
          showRequest2(REQUESTID);

        }
      }

      if (UserRole === "SuperAdministrador") {
        if (prioridad === 0) {
          data.append("firmaJefe", FirmaJefeDepartamento);
          data.append("prioridad", showRequest.prioridad);

          //console.log("firmaJefe", FirmaJefeDepartamento);
          // console.log("prioridad", showRequest.prioridad);
        } else {
          data.append("firmaJefeDepartamento", FirmaJefeDepartamento);
          data.append("prioridad", prioridad);

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
        showRequest2(REQUESTID);

        
      }
    } catch (error) {
      console.error("Error updating the Request:", error);
    }
  };

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
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.log("error to get the request", error);
        setError("El servidor no puede obtener las solicitudes");
        setLoading(false);
      });
  };

  useEffect(() => {
    // Filter data based on search term
    const filtered = requests.filter(
      (item) =>
        item.firmaEmpleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.servicioSolicitado
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.solicitudDeServicioARealizar
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.fechaSolicitada.toString().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, requests]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdatePrioridad = async (e) => {
    e.preventDefault();

    const { prioridad } = formData;

    const data = new FormData();

    data.append("prioridad", prioridad);

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
      <br />
      <SearchBar setSearchTerm={setSearchTerm} /> <br />
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
              {filteredData.map((request) =>
                request.firmaJefeDepartamento !== "0" ? (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.firmaEmpleado}</td>
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
                    <td>
                      {
                        <Button style={{ width: "120px" }}>
                          {" "}
                          {request.prioridad}{" "}
                        </Button>
                      }{" "}
                    </td>{" "}
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
              {filteredData.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.firmaEmpleado}</td>
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

                  <td>
                    {
                      <Button style={{ width: "120px" }}>
                        {" "}
                        {request.prioridad}{" "}
                      </Button>
                    }{" "}
                  </td>

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
                    showRequest.prioridad === "Baja" ||
                    showRequest.prioridad === "Alta" ||
                    showRequest.prioridad === "Media"
                  } // Disable if prioridad is 1, 2, or 3
                  defaultValue={showRequest.prioridad}
                >
                  <option value="Prioridad">Prioridad</option>
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
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
                  <option value="Prioridad">Prioridad</option>
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </Form.Select>
              )}
              {UserRole === "SuperAdministrador" && (
                <UpdateStatus
                  handleChange={handleChange}
                  showRequest={showRequest}
                  formData={formData}
                ></UpdateStatus>
              )}

              <DownloadPdf showRequest={showRequest}></DownloadPdf>
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
