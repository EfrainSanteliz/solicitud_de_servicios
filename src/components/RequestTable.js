import { useState, useEffect } from "react";
import axios from "axios";
import { table, Spinner, Alert, Table, Button, Modal } from "react-bootstrap";

function RequestTable() {
  const [requests, setRequests] = useState([]);
  const [showRequest, setShowRequest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState(null);
  const [nomEmpNombre, setNomEmpNombre] = useState('');
  const [nomEmpPaterno, setNomEmpPaterno] = useState('');
  const [nomEmpMaterno, setNomEmpMaterno] = useState('');
  const [fullName,setFullName] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    

  };
  const handleShow = (requestID,nomEmpNombre,nomEmpPaterno,nomEmpMaterno) => {
    setShow(true);
    setNomEmpNombre(nomEmpNombre);
    setNomEmpPaterno(nomEmpPaterno);
    setNomEmpMaterno(nomEmpMaterno);

    axios
    .get(`https://localhost:7145/api/Request/${requestID}`)
    .then((response) => {
        console.log("the show request get successfully");
        setShowRequest(response.data);
        setLoading2(true);
       
    })
    .catch((error) =>{
        console.log('no se pudieron cargar al usuario')
        alert('no se pudo cargar al usuario error en el servidor',error)
    });
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

  return (
    <div className="container mt-4">
      <h2>Lista de solicitudes </h2>

      {loading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Cargando..</span>
        </Spinner>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover>
          <table className="table table-bordered">
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
                  </td>{" "}
                  {/* Nombre del empleado corregido */}
                  <td>{request.descripcion}</td>
                  <td>
                    {new Date(request.fechaSolicitada).toLocaleDateString()}
                  </td>
                  <td>{request.status}</td>
                  <td>
                    <Button variant="success">Autorizar</Button>{" "}
                    <Button variant="secondary">Descargar Documento</Button>{" "}
                    <Button variant="primary" onClick={() => handleShow(request.id,request.nomEmpleados.nomEmpNombre,request.nomEmpleados.nomEmpPaterno,request.nomEmpleados.nomEmpMaterno)}>
                      Ver Detalles
                    </Button>{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      )}

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Solicitud del usuario: {nomEmpNombre+' '+nomEmpPaterno + ' '+ nomEmpMaterno}</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        {loading2 && !error && (
        <Table striped bordered hover>
            <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripcion</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Comentarios</th>
                  <th>Imagen</th>
                  <th>Acciones</th>

                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{showRequest.nomEmpleados.nomEmpNombre + ' ' + showRequest.nomEmpleados.nomEmpPaterno + ' ' + showRequest.nomEmpleados.nomEmpMaterno}</td>
                
                
                </tr>
              
                {/* Add more fields based on the request data */}
              </tbody>
        </Table>
      )}
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {" "}
              Close{" "}
            </Button>
            <Button variant="primary" onClick={handleClose}>
              {" "}
              Autorizar{" "}
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default RequestTable;
