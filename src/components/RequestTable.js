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
  const [fecha,setFecha] = useState([]);

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

  const handleShow = async (requestID, nomEmpNombre, nomEmpPaterno, nomEmpMaterno) => {
  setShow(true);
  setNomEmpNombre(nomEmpNombre);
  setNomEmpPaterno(nomEmpPaterno);
  setNomEmpMaterno(nomEmpMaterno);
  SETREQUESTID(requestID); 

  try {
    const response = await axios.get(`https://localhost:7145/api/Request/${requestID}`);

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

  const handleAutorizar = async (e) => {
    e.preventDefault();

    const AutorizarRequestJefeDepartamento = {
      FirmaJefeDepartamento: FirmaJefeDepartamento,
    };

    const AutorizarRequestJefe = {
      FirmaJefe: FirmaJefe,
    };

    try {
      if (UserRole === "Administrador") {
        const response = await axios.put(
          `https://localhost:7145/api/Request/${REQUESTID}`,
          AutorizarRequestJefeDepartamento,
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );
        console.log("update Request Sucesfully", response);
        toast.success("Firmada Con exito");
      }

      if (UserRole === "SuperAdministrador") {
        const response = await axios.put(
          `https://localhost:7145/api/Request/${REQUESTID}`,
          AutorizarRequestJefe,
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );
        console.log("Request Update Sucessfully", response);
      }
    } catch (error) {
      console.error("Error updating the Request:", error);
    }
  };

  const [formData, setFormData] = useState({
    fecha: '',
    comentarios: '',
  });

    // Obtener la fecha en formato año-mes-día y hora-minuto en GMT-7
    useEffect(() => {
     
    }, []);

  const handleSubmitComentarios = async (e) => {

    e.preventDefault();
    
    const getCurrentDateInGMT7 = () => {
      // Obtener la fecha en GMT-7 con el formato correcto
      const dateInGMT7 = DateTime.now().setZone("America/Hermosillo");

      // Verifica si la fecha es válida
      if (dateInGMT7.isValid) {
        // Devuelve la fecha en el formato requerido
        return dateInGMT7.toFormat("yyyy-MM-dd'T'HH:mm");
      } else {
        // Manejar error si la fecha no es válida
        console.error(
          "Fecha inválida obtenida:",
          dateInGMT7.invalidExplanation
        );
        return null;
      }
    };

    setFecha(getCurrentDateInGMT7());
  
    const {
       comentarios
    } = formData

    const data = new FormData();

    data.append("fecha",fecha);
    data.append("comentarios",comentarios);
    data.append("RequestID",REQUESTID);
  
    console.log('fecha',fecha);
    console.log('comentarios',comentarios);
    console.log('RequestID',REQUESTID);


    try {
      const response = await axios.post(
        "https://localhost:7145/api/Historial/",data,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      console.log("Historial fech succesfully");

      try {
        const response = await axios.get(`https://localhost:7145/api/Request/${REQUESTID}`);
    
        console.log("The show request get successfully");
        setShowRequest(response.data);
        setHistorials(response.data.historials);
        setLoading2(true); // Assuming setLoading2 is used to indicate loading state
      } catch (error) {
        console.error("Error updating the Request:", error);
      }
    } catch (error) {
      console.error("error al enviar el formulario");
    }
  };

  useEffect(() => {
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
  }, []);

  const handleChange = (e) => {
    const {name, value } = e.target;

    setFormData({
        ...formData,
        [name]: value,
    });

  };

  return (
    <Form onSubmit={handleSubmitComentarios}>

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
                    >
                      Ver Detalles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      )}

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
            <Button variant="secondary" onClick={handleClose}>
              {" "}
              Close{" "}
            </Button>
            <Button
              variant="success"
              onClick={(e) => {
                handleAutorizar(e);
              }}
            >
              {" "}
              Autorizar{" "}
            </Button>
            <Button
              variant="primary"
              onClick={(e) => {
                handleHistory(e);
              }}
            >
              Comentar
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>

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
            
           <br/><br/>
          <Form.Label>Agrega comentarios aqui</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="comentarios"
            placeholder="Escribe los comentarios aqui"
            
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
          </Modal.Body>
        </Modal>
    </div>
    </Form>

  );
}

export default RequestTable;
