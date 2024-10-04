import { useState, useEffect } from "react";
import axios from "axios";
import { table, Spinner, Alert, Table, Button, Modal, Form } from "react-bootstrap";
import FormSolicitudTable from "./FormSolicitudTable";
import HistoryComments from "./HistoryComments";
import { Toast } from "react-bootstrap";
import { toast } from "react-toastify";

function RequestTable() {
  const [requests, setRequests] = useState([]);
  const [showRequest, setShowRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState(null);
  const [nomEmpNombre, setNomEmpNombre] = useState('');
  const [nomEmpPaterno, setNomEmpPaterno] = useState('');
  const [nomEmpMaterno, setNomEmpMaterno] = useState('');
  const [fullName, setFullName] = useState("");
  const [REQUESTID, SETREQUESTID] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [Historials, setHistorials] = useState([]);

  const FirmaJefeDepartamento = localStorage.getItem("nomEmpNombre") + ' ' + localStorage.getItem('nomEmpPaterno') + ' ' + localStorage.getItem('nomEmpMaterno');
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
  const handleShow = (requestID, nomEmpNombre, nomEmpPaterno, nomEmpMaterno) => {
    setShow(true);
    setNomEmpNombre(nomEmpNombre);
    setNomEmpPaterno(nomEmpPaterno);
    setNomEmpMaterno(nomEmpMaterno);
    SETREQUESTID(requestID)

    axios
      .get(`https://localhost:7145/api/Request/${requestID}`)
      .then((response) => {
        console.log("the show request get successfully");
        setShowRequest(response.data);
        setHistorials(response.data.historials);
        setLoading2(true);

      })
      .catch((error) => {
        console.log('no se pudieron cargar al usuario')
        alert('no se pudo cargar al usuario error en el servidor', error)
      });
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

        const response = await axios.put(`https://localhost:7145/api/Request/${REQUESTID}`,
          AutorizarRequestJefeDepartamento,
          {
            headers: {
              'content-type': 'application/json'
            },
          }
        );
        console.log('update Request Sucesfully', response);
        toast.success("Firmada Con exito");
      }

      if (UserRole === "SuperAdministrador") {

        const response = await axios.put(`https://localhost:7145/api/Request/${REQUESTID}`,
          AutorizarRequestJefe,
          {
            headers: {
              'content-type': 'application/json'
            },
          }
        );
        console.log('Request Update Sucessfully', response);
      }
    } catch (error) {
      console.error('Error updating the Request:', error)
    }

  };

  const handleSubmitComentarios = () => {

    //const response = await axios.post(`ht`)


  }

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

  return (
    <div className="container mt-4">
      <h2>Lista de solicitudes { } </h2>

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
                      {new Date(request.fechaSolicitada).toLocaleDateString('es-ES', {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
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
                    {new Date(request.fechaSolicitada).toLocaleDateString('es-ES', {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
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
              )
              )}
            </tbody>
          )}

        </Table>
      )}

      <Modal show={show} onHide={handleClose} animation={false}
        dialogClassName="modal-80"
      >
        <Modal.Header closeButton>
          <Modal.Title>Solicitud del usuario: {nomEmpNombre + ' ' + nomEmpPaterno + ' ' + nomEmpMaterno}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading2 && (<FormSolicitudTable showRequest={showRequest} />)}

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {" "}
              Close{" "}
            </Button>
            <Button variant="success" onClick={(e) => { handleAutorizar(e); }}>
              {" "}
              Autorizar{" "}
            </Button>
            <Button variant="primary" onClick={(e) => { handleHistory(e); }}>
              Comentar
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>

      <Form onSubmit={handleSubmitComentarios}> 
        <Modal show={showHistoryModal} onHide={handleClose2} animation={false}
          dialogClassName="modal-80"
        >
          <Modal.Header closeButton>
            <Modal.Title>Agregar comentarios a la solicitud de  : {nomEmpNombre + ' ' + nomEmpPaterno + ' ' + nomEmpMaterno}</Modal.Title>

          </Modal.Header>

          <Modal.Body>
            <HistoryComments Historials={Historials} />

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose2}>cerrar</Button>
              <Button variant="success" onClick={handleSubmitComentarios}>Enviar Comentario</Button>

            </Modal.Footer>

          </Modal.Body>
        </Modal>
      </Form>
    </div>
  );
}

export default RequestTable;
