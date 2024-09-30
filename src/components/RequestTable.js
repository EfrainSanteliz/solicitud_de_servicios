import { useState, useEffect } from "react";
import axios from "axios";
import { table, Spinner, Alert, Table, Button, Modal } from "react-bootstrap";
import FormSolicitudTable from "./FormSolicitudTable";

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

  const FirmaJefeDepartamento = localStorage.getItem("nomEmpNombre") +  ' ' +   localStorage.getItem('nomEmpPaterno') +  ' ' +    localStorage.getItem('nomEmpMaterno');

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);


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
        setLoading2(true);

      })
      .catch((error) => {
        console.log('no se pudieron cargar al usuario')
        alert('no se pudo cargar al usuario error en el servidor', error)
      });
  };

  const handleAutorizar = async (e) => {
    e.preventDefault();

    const AutorizarRequest = {
       FirmaJefeDepartamento:FirmaJefeDepartamento,
    };

    try {

      const response = await axios.put(`https://localhost:7145/api/Request/${REQUESTID}`,
        AutorizarRequest,
        {
          headers:{
            'content-type':'application/json'
          }
        }
      );
      console.log('User Updated',response.data)
    }catch (error) {
      console.error('Error updating the user:',error)
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
             </td>
             <td>{request.descripcion}</td>
             <td>
               {new Date(request.fechaSolicitada).toLocaleDateString('es-ES', {
                 day: '2-digit',
                 month: '2-digit',
                 year: 'numeric',
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
         ))}
       </tbody>
     </Table>
      )}

      <Modal show={show} onHide={handleClose} animation={false}
      dialogClassName="modal-80"
      >
        <Modal.Header closeButton>
          <Modal.Title>Solicitud del usuario: {nomEmpNombre + ' ' + nomEmpPaterno + ' ' + nomEmpMaterno}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {loading2 && (<FormSolicitudTable showRequest={showRequest}/>)}

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {" "}
              Close{" "}
            </Button>
            <Button variant="primary" onClick={(e)=> {handleAutorizar(e);}}>
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
