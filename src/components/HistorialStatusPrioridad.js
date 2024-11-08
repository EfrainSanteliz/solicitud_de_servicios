import { useState, useEffect } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import axios from "axios";

function HistorialStatus({ RequestID, show, onHide }) {
  const [historialStatus, setHistorialsStatus] = useState([]);
  const [HistorialPrioridad, setHistorialPrioridad] = useState([]);


  console.log("RequestID:", RequestID);

  useEffect(() => {
    if (RequestID) {
      axios
        .get(`${process.env.REACT_APP_API_URL}HistorialStatus/${RequestID}`)
        .then((response) => {
          // Confirm the response data is an array before setting it
          if (Array.isArray(response.data)) {
            setHistorialsStatus(response.data);
            console.log("hola",response.data);
          } else {
            console.error("Unexpected response format:", response.data);
            setHistorialsStatus([]); // Reset to an empty array on unexpected format
          }
        })
        .catch((error) => {
          console.error("Error fetching historials:", error);
          setHistorialsStatus([]); // Reset to empty array on error
        });
    }
  }, [RequestID]);


  useEffect(() => {
    if (RequestID) {
      axios
        .get(`${process.env.REACT_APP_API_URL}HistorialPrioridad/${RequestID}`)
        .then((response) => {
          // Confirm the response data is an array before setting it
          if (Array.isArray(response.data)) {
            setHistorialPrioridad(response.data);
            console.log("hola",response.data);
          } else {
            console.error("Unexpected response format:", response.data);
            setHistorialPrioridad([]); // Reset to an empty array on unexpected format
          }
        })
        .catch((error) => {
          console.error("Error fetching historials:", error);
          setHistorialPrioridad([]); // Reset to empty array on error
        });
    }
  }, [RequestID]);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Historial Estatus y Prioridad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table>
          <thead> 
            <tr>
              <th>Estatus</th>
              <th>Quien</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {historialStatus && historialStatus.length > 0 ? (
              historialStatus.map((item) => (
                <tr key={item.sS_HistorialStatusId}>
                  <td>{item.status ?? "No status available"}</td>
                  <td>{item.quien ?? "No data"}</td>
                  <td>
                    {item.fechaSatus
                      ? new Date(item.fechaSatus).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }):"no disponible"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No records available
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <Table>
          <thead> 
            <tr>
              <th>Prioridad</th>
              <th>Quien</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {HistorialPrioridad && HistorialPrioridad.length > 0 ? (
              HistorialPrioridad.map((item) => (
                <tr key={item.sS_HistorialPrioridadId}>
                  <td>{item.prioridad ?? "No status available"}</td>
                  <td>{item.quien ?? "No data"}</td>
                  <td>
                    {item.fechaPrioridad
                      ? new Date(item.fechaPrioridad).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }):"no disponible"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No records available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default HistorialStatus;