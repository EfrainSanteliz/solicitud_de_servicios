import { useState, useEffect } from "react";
import axios from "axios";
import {
  Spinner,
  Alert,
  Table,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import FormSolicitudTable from "./FormSolicitudTable";
import HistoryComments from "./HistoryComments";
import { toast } from "react-toastify";
import { DataTime, DateTime } from "luxon";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBar from "./SearchBar";
import DownloadPdfAsp from "./DownloadPdfAsp";
import {
  showLoadingAlertAutorizar,
  showSueccesAlertAutorizar,
  showErrorAlerAutorizar,
} from "./AlertService";

function RequestTable() {
  const [requests, setRequests] = useState([]);
  const [showRequest, setShowRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState(null);
  const [nomEmpNombre, setNomEmpNombre] = useState("");
  const [nomEmpPaterno, setNomEmpPaterno] = useState("");
  const [nomEmpMaterno, setNomEmpMaterno] = useState("");
  const [REQUESTID, SETREQUESTID] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [Historials, setHistorials] = useState([]);
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
    loading2(false);
  };

  const handleClose2 = () => {
    setShowHistoryModal(false);
  };

  useEffect(() => {
    handleShow();
    showRequest2();
  }, []); // Add dependencies to trigger only when these values change

  const showRequest2 = async (requestID) => {
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
      if (showRequest.firmaJefeDepartamento === FirmaJefeDepartamento) {
        toast.error("Formulario ya firmado");
      }

      else if (prioridad === 0) {
        toast.error("Elija un nivel de prioridad antes de firmar");
      } else {
        showLoadingAlertAutorizar();

        data.append("firmaJefeDepartamento", FirmaJefeDepartamento);
        data.append("prioridad", prioridad);

       
        const response = await axios.put(
          `https://localhost:7145/api/Request/${REQUESTID}`,
          data,
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );
        //console.log("update Request Sucesfully", response);

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
        showSueccesAlertAutorizar();
        showRequest2(REQUESTID);
      }
    } catch (error) {
      //console.error("Error updating the Request:", error);
      showErrorAlerAutorizar();
    } finally {
    }
  };
  const AreaAdministrativa = localStorage.getItem("AreaAdministrativa");
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
      remitente: AreaAdministrativa,
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
        setLoading(false);

        
          const filteredRequest = response.data.filter(
            (request) =>
              request.nomEmpleados.direccionesICEES.descripcion ===
              AreaAdministrativa
          );
          setRequests(filteredRequest);
          setFilteredData(filteredRequest);
      
      })
      .catch((error) => {
        //console.log("error to get the request", error);
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
      {requests.length === 0 ? (
        <p>Aún no tienes Solicitudes </p>
      ) : (
        !loading &&
        !error && (
          <Table
            striped
            bordered
            hover
            style={{ tableLayout: "fixed", width: "100%" }}
          >
            <thead>
              <tr>
                <th style={{ width: "150px" }}>Nombre del empleado</th>
                <th
                  style={{
                    width: "200px",
                    whiteSpace: "nowrap", // Evita que el texto haga wrap a otra línea
                    overflow: "hidden", // Oculta el texto que no cabe
                    textOverflow: "ellipsis", // Añade los puntos suspensivos (...)
                  }}
                >
                  Descripción
                </th>
                <th style={{ width: "100px" }}>Fecha</th>
                <th style={{ width: "80px" }}>Estatus</th>
                <th style={{ width: "80px" }}>Prioridad</th>
                <th style={{ width: "100px", textAlign: "center" }}>
                  Acciones
                </th>
              </tr>
            </thead>

          
              <tbody>
                {filteredData.map((request) => (
                  <tr key={request.id}>
                    <td>{request.firmaEmpleado}</td>
                    <td
                      style={{
                        width: "250px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {request.descripcion}
                    </td>
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
                      <Button style={{ backgroundColor: "#217ABF" }}>
                        {request.prioridad}
                      </Button>
                    </td>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
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
                        style={{
                          backgroundColor: "#217ABF",
                          margin: "0 auto",
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
          
          </Table>
        )
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
              

          

              <DownloadPdfAsp showRequest={showRequest}> </DownloadPdfAsp>
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
              onChange={handleChange}
              required
            />
          </Form>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose2}>
              cerrar
            </Button>

            <Button variant="success" onClick={handleSubmitComentarios}>
              Enviar Comentario
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default RequestTable;
