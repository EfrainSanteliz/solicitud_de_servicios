import { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, Alert, Table, Button, Modal, Form } from "react-bootstrap";
import FormSolicitudTable from "./FormSolicitudTable";
import HistoryComments from "./HistoryComments";
import { DateTime } from "luxon";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBar from "./SearchBar";
import UpdateStatus from "./UpdateStatus";
import DownloadPdfAsp from "./DownloadPdfAsp";
import {
  showLoadingAlertAutorizar,
  showSueccesAlertAutorizar,
  showErrorAlerAutorizar,
} from "./AlertService";
import UpdateForm from "./UpdateForm";
import HistorialStatus from "./HistorialStatusPrioridad";

function RequestTableSuperAdministrador() {
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
  const [selectedDepartamento, setselectedDepartamento] = useState("");
  const [selectedService, setSelectedServicio] = useState("");
  const [SelectedStatus, setSelectedStatus] = useState("");
  const [SelectPrioridad, setSelectPrioridad] = useState("");
  const [DateSystem, setDateSystem] = useState("");
  const [RangeComparationDate, setRangeComparationDate] = useState("");

  const FirmaJefeDepartamento =
    localStorage.getItem("nomEmpNombre") +
    " " +
    localStorage.getItem("nomEmpPaterno") +
    " " +
    localStorage.getItem("nomEmpMaterno");
  const UserRole = localStorage.getItem("UserRole");

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setLoading2(false);
  };

  const handleClose2 = () => {
    setShowHistoryModal(false);
  };

  const showRequest2 = async (requestID) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `Request/${requestID}`
      );

      console.log("The show request get successfully");
      setShowRequest(response.data);
      setHistorials(response.data.historialComentarios);
      setLoading2(true);
    } catch (error) {
      console.error("Error updating the Request:", error);
    }
  };
  const [firmaEmpleado, setFirmaEmpleado] = useState("");
  const handleShow = async (requestID, firmaEmpleado) => {
    setShow(true);
    setFirmaEmpleado(firmaEmpleado);
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
    revisadoSub: "revisadoSub",
  });

  const handleAutorizar = async (e) => {
    // const { prioridad } = formData;
    e.preventDefault();

    const data = new FormData();

    const { prioridad } = formData;

    try {
      showLoadingAlertAutorizar();

      if (prioridad === 0) {
        data.append("firmaJefe", FirmaJefeDepartamento);
        data.append("prioridad", showRequest.prioridad);

        //console.log("firmaJefe", FirmaJefeDepartamento);
        // console.log("prioridad", showRequest.prioridad);
      } else {
        data.append("firmaJefe", FirmaJefeDepartamento);
        data.append("prioridad", prioridad);

        //console.log("firmaJefeDepartamento", FirmaJefeDepartamento);
        //  console.log("prioridad", prioridad);
      }

      const response = await axios.put(
        process.env.REACT_APP_API_URL + `Request/${REQUESTID}`,
        data,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      ); //

      const email = showRequest?.nomEmpleados?.usuario?.email;
      if (!email) {
        throw new Error("Email is not available for the user.");
      }

      const response2 = await axios.post(
        process.env.REACT_APP_API_URL +
          `email/FirmaSuperAdministradorEmail/${encodeURIComponent(email)}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Ensure REQUESTID is defined and valid
      if (!REQUESTID) {
        throw new Error("REQUESTID is not defined.");
      }

      showRequest2(REQUESTID); // Update UI or state as necessary
      showSueccesAlertAutorizar(); // Show success alert
    } catch (error) {
      console.error("Error updating the request:", error);
      showErrorAlerAutorizar(); // Show error alert to the user
    } finally {
      // Optional: Any cleanup or final actions can be placed here
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
      SS_SolicitudId: REQUESTID,
    };

    try {
      // Send the POST request to save the historial
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `Historial/`,
        data,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );

      // Refresh the request after successfully posting the comment
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + `Request/${REQUESTID}`
        );
        setShowRequest(response.data);
        setHistorials(response.data.historialComentarios);
        setLoading2(true);
      } catch (error) {
        console.error("Error actualizando la solicitud:", error);
      }
    } catch (error) {
      console.error("Error al enviar el historial:", error);
    }

    // Send email notification after submitting the comment

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL +
          `email/EmailComentario/${encodeURIComponent(
            showRequest.nomEmpleados.usuario.email
          )}/`,
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
      .get(process.env.REACT_APP_API_URL + `Request/`)
      .then((response) => {
        setLoading(false);

        const data = response.data;

        const statusid = {
          1: "Activo",
          2: "Inactivo",
          3: "Revertido",
          4: "Finalizado",
          5: "cancelado",
        };

        const prioridad = {
          1: "Baja",
          2: "Media",
          3: "Alta",
          0: "Sin prioridad",
        };

        const ultimoStatus = {
          3: "SubAdministrador",
          4: "SuperAdministrador",
        };

        const mappedItems = data.map((item) => ({
          id: item.sS_SolicitudId,
          name: item.firmaEmpleado,
          servicioSolicitado:
            item.sS_Servicio_Solicitados.descripcionServicio_Solicitado,
          descripcion: item.descripcion,
          fechaSolicitada: item.fechaSolicitada,
          revisadoSub: item.revisadoSub,
          status: statusid[item.status] || "Sin Estatus", // Handle unmapped values
          prioridad: prioridad[item.prioridad] || "Sin Prioridad",
          departamento: item.nomEmpleados.direccionesICEES.descripcion,
          ultimoStatus: ultimoStatus[item.ultimoStatus] || "",
        }));

        setRequests(mappedItems);

        setFilteredData(response.data);
      })
      .catch((error) => {
        setError("El servidor no puede obtener las solicitudes");
        setLoading(false);
      });
  };

  const dateMath = true;

  useEffect(() => {
    // Filter data based on search term and other filters
    const filterData = () => {
      const now = DateTime.now(); // Current date

      const filtered = requests.filter((item) => {
        // Parse the server date in ISO format (yyyy-MM-dd'T'HH:mm:ss)
        const requestDate = DateTime.fromISO(item.fechaSolicitada);

        // Date filtering logic
        let dateMatch = true;
        if (RangeComparationDate === "Este año") {
          dateMatch = requestDate.year === now.year;
        } else if (RangeComparationDate === "Este mes") {
          dateMatch =
            requestDate.year === now.year && requestDate.month === now.month;
        } else if (RangeComparationDate === "Este dia") {
          dateMatch = requestDate.day === now.day;
        } else if (RangeComparationDate === "Esta semana") {
          dateMatch = requestDate.hasSame(now, "week");
        }

        // Other filters (departamento, status, prioridad, search term)
        const departmentMatch =
          selectedDepartamento === "" ||
          item.departamento === selectedDepartamento;
        const serviceMatch =
          selectedService === "" || item.servicioSolicitado === selectedService;
        const statusMatch =
          SelectedStatus === "" || item.status === SelectedStatus;
        const priorityMatch =
          SelectPrioridad === "" || item.prioridad === SelectPrioridad;
        const searchTermMatch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.servicioSolicitado
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.prioridad.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.ultimoStatus.toLowerCase().includes(searchTerm.toLowerCase());

        // Return true only if all conditions match
        return (
          dateMatch &&
          departmentMatch &&
          statusMatch &&
          priorityMatch &&
          searchTermMatch &&
          serviceMatch
        );
      });

      setFilteredData(filtered);
    };

    filterData();
  }, [
    searchTerm,
    requests,
    selectedDepartamento,
    SelectedStatus,
    SelectPrioridad,
    RangeComparationDate,
    selectedService,
  ]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdatePrioridad = async (prioridad) => {
    //const { prioridad } = formData;

    //const data = new FormData();

    // data.append("prioridad", prioridad);

    const data = {
      prioridad: prioridad,
    };

    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL + `Request/${REQUESTID}`,
        data,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      ); //

      UpdateTableRequest();
    } catch (error) {}


    const fechaPrioridad = DateTime.now();


    const data2 = {
      quien:FirmaJefeDepartamento,
      prioridad:prioridad,
      fechaPrioridad:fechaPrioridad,
      sS_SolicitudId:REQUESTID,
    };

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + `HistorialPrioridad/`,
        data2,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
    } catch (error) {}
  };

  /* const statusid = {
    1: "Activo",
    2: "Inactivo",
    3: "Revertido",
    4: "Finalizado",
    5: "cancelado",
  };

  const prioridad = {
    1: "Baja",
    2: "Media",
    3: "Alta",
  };

  const ultimoStatus = {
    3: "SubAdministrador",
    4: "SuperAdministrador",
  };*/

  const [showModal, setShowModal] = useState(false);
  const [requestId, setRequestId] = useState(null);

  const handleShowModal = (id) => {
    setRequestId(id);
    setShowModal(true);
  };

  return (
    <div>
      <UpdateForm></UpdateForm>

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
          <div>
            <br></br>
            <SearchBar
              setSearchTerm={setSearchTerm}
              setselectedDepartamento={setselectedDepartamento}
              setSelectedServicio={setSelectedServicio}
              selectedDepartamento={selectedDepartamento}
              setSelectedStatus={setSelectedStatus}
              SelectedStatus={SelectedStatus}
              setSelectPrioridad={setSelectPrioridad}
              setDateSystem={setDateSystem}
              DateSystem={DateSystem}
              setRangeComparationDate={setRangeComparationDate}
              RangeComparationDate={RangeComparationDate}
            />{" "}
            <br />
            <Table
              striped
              bordered
              hover
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>id</th>
                  <th style={{ width: "150px" }}>Nombre del empleado</th>
                  <th style={{ width: "150px" }}>Servicio</th>

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
                  <th style={{ width: "80px" }}> Revisado sub</th>
                  <th style={{ width: "120px" }}>Estatus</th>
                  <th style={{ width: "200px" }}>Ultimo Estatus</th>

                  <th style={{ width: "160px" }}>Prioridad</th>
                  <th style={{ width: "150px" }}>Departamento</th>
                  <th style={{ width: "150px", textAlign: "center" }}>
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((request, index) => (
                  //request.firmaJefeDepartamento !== "0" ? (
                  <tr key={index}>
                    <td>{request.id}</td>
                    <td style={{ width: "150px" }}>{request.name}</td>
                    <td>{request.servicioSolicitado}</td>

                    <td
                      style={{
                        width: "300px",
                        whiteSpace: "nowrap", // Evita que el texto haga wrap
                        overflow: "hidden", // Oculta el texto que no cabe
                        textOverflow: "ellipsis", // Añade puntos suspensivos
                        fontWeight: "normal",
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
                    <td>
                      {request.revisadoSub ? (
                        <Button
                          variant=""
                          style={{
                            backgroundColor: "#217ABF",
                            color: "white",
                          }}
                        >
                          {" "}
                          Si{" "}
                        </Button>
                      ) : (
                        <div></div>
                        /* <Button
                            variant=""
                            style={{
                              backgroundColor: "#DC7F37",
                              color: "white",
                            }}
                          >
                            {" "}
                            No{" "}
                          </Button>*/
                      )}
                    </td>

                    <td>
                      <Button
                        variant=""
                        style={{
                          color: "white",
                          width: "100px",
                          backgroundColor:
                            request.status === "Activo"
                              ? "#217ABF"
                              : request.status === "Cancelado"
                              ? "#DC7F37"
                              : request.status === "Inactivo"
                              ? "#999999"
                              : request.status === "Finalizado"
                              ? "#237469"
                              : request.status === "Revertido"
                              ? "#DC7F37"
                              : "",
                        }}
                      >
                        {request.status}
                      </Button>
                    </td>

                    <td>
                      {request.ultimoStatus && (
                        <Button
                          variant=""
                          style={{
                            color: "white",
                            width: "180px",
                            backgroundColor:
                              request.ultimoStatus === "SubAdministrador"
                                ? "#3794DC"
                                : request.ultimoStatus === "SuperAdministrador"
                                ? "#2F9B8C"
                                : "",
                          }}
                        >
                          {request.ultimoStatus}
                        </Button>
                      )}
                    </td>

                    <td style={{ width: "100px" }}>
                      <Button
                        variant=""
                        style={{
                          color: "white",
                          width: "120px",
                          backgroundColor:
                            request.prioridad === "Alta"
                              ? "#C5126D" // If "Alta", set background to #C5126D
                              : request.prioridad === "Media"
                              ? "#DC7F37"
                              : request.prioridad === "Baja"
                              ? "#217ABF"
                              : request.prioridad === "Sin prioridad"
                              ? "#999999" // If "Media", set background to #808080
                              : "", // Default (empty) if not "Alta" or "Media"
                        }}
                      >
                        {request.prioridad}
                      </Button>
                    </td>

                    <td>{request.departamento}</td>
                    <td
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <Button
                        variant=""
                        onClick={() =>
                          handleShow(request.id, request.firmaEmpleado)
                        }
                        style={{
                          backgroundColor: "#C5126D",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                          style={{ color: "white" }}
                        />
                      </Button> {" "}

                      <Button
                        variant=""
                        onClick={() => handleShowModal(request.id)}
                        style={{
                          backgroundColor: "#C5126D",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                          style={{ color: "white" }}
                        />
                      </Button>

                      {showModal && (
                        <HistorialStatus
                          RequestID={requestId}
                          show={showModal}
                          onHide={() => setShowModal(false)}
                        />
                      )}
                    </td>
                   
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )
      )}
      {loading2 && (
        <Modal show={show} onHide={handleClose} animation={false} size="xl">
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
                variant=""
                onClick={handleClose}
                style={{ backgroundColor: "#666666", color: "white" }}
              >
                {" "}
                Close{" "}
              </Button>

              <Button
                variant=""
                onClick={(e) => {
                  handleHistory(e);
                }}
                style={{ backgroundColor: "#C5126D", color: "white" }}
              >
                Comentar
              </Button>

              <Button
                variant=""
                onClick={(e) => {
                  handleAutorizar(e);
                }}
                style={{ backgroundColor: "#237469", color: "white" }}
              >
                {" "}
                Autorizar{" "}
              </Button>

              <Form.Select
                aria-label="Default select example"
                style={{
                  width: "150px",
                  backgroundColor: "#DC7F37",
                  color: "white",
                }}
                onChange={(e) => {
                  handleUpdatePrioridad(e.target.value);
                }}
                name="prioridad"
                defaultValue={showRequest.prioridad}
              >
                <option value="0">Sin Asignar</option>
                <option value="1">Baja</option>
                <option value="2">Media</option>
                <option value="3">Alta</option>
              </Form.Select>

              <UpdateStatus
                handleChange={handleChange}
                UpdateTableRequest={UpdateTableRequest}
                showRequest={showRequest}
                formData={formData}
              ></UpdateStatus>

              <DownloadPdfAsp showRequest={showRequest}> </DownloadPdfAsp>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      )}
      <Modal
        show={showHistoryModal}
        onHide={handleClose2}
        animation={false}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Agregar comentarios a la solicitud de : {firmaEmpleado}
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

export default RequestTableSuperAdministrador;
