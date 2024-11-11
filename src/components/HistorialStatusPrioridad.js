import { useState, useEffect } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import axios from "axios";

function HistorialStatus({ RequestID, show, onHide }) {
  const [historialStatus, setHistorialsStatus] = useState([]);
  const [HistorialPrioridad, setHistorialPrioridad] = useState([]);


  useEffect(() => {
    if (RequestID) {
      axios
        .get(`${process.env.REACT_APP_API_URL}HistorialStatus/statusYprioridad/${RequestID}`)
        .then((response) => {

          const statusid = {
            1: "Activo",
            2: "Inactivo",
            3: "Revertido",
            4: "Finalizado",
            5: "Cancelado",
          };
  
          const prioridad = {
            1: "Baja",
            2: "Media",
            3: "Alta",
            0: "Sin prioridad",
          };

          // Confirm the response data is an array before setting it
          if (Array.isArray(response.data.status)) {
              const StatusFormat = response.data.status.map((item)=> ({
                   id: item.sS_HistorialStatusId ,
                   quien: item.quien,
                   status: statusid[item.status],
                   fechaStatus: item.fechaSatus,

              }));
                
        
            setHistorialsStatus(StatusFormat);
          } else {
            console.error("Unexpected response format:", response.data);
            setHistorialsStatus([]); // Reset to an empty array on unexpected format
          }

         // Format priority data
         if (Array.isArray(response.data.prioridad)) {
          const PrioridadFormat = response.data.prioridad.map((item) => ({
            id: item.sS_HistorialPrioridadId,
            quien: item.quien,
            prioridad: prioridad[item.prioridad],
            fechaPrioridad: item.fechaPrioridad,
          }));
          setHistorialPrioridad(PrioridadFormat);
        } else {
          console.error("Unexpected response format:", response.data);
          setHistorialPrioridad([]);
        }
      })
        .catch((error) => {
          console.error("Error fetching historials:", error);
          setHistorialsStatus([]); // Reset to empty array on error
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
              <th style={{width:"150px"}}>Estatus</th>
              <th>Quien</th>
              <th style={{width:"150px"}}>Fecha </th>
            </tr>
          </thead>
          <tbody>
            {historialStatus.length > 0 ? (
              historialStatus.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Button
                      variant=""
                      style={{
                        color: "white",
                        width: "120px",
                        backgroundColor:
                          item.status === "Activo"
                            ? "#217ABF"
                            : item.status === "Cancelado"
                            ? "#DC7F37"
                            : item.status === "Inactivo"
                            ? "#999999"
                            : item.status === "Finalizado"
                            ? "#237469"
                            : item.status === "Revertido"
                            ? "#DC7F37"
                            : "",
                      }}
                    >
                      {item.status}
                    </Button>
                  </td>
                  <td>{item.quien ?? "No data"}</td>
                  <td>
                    {item.fechaStatus
                      ? new Date(item.fechaStatus).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No disponible"}
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
              <th style={{width:"150px"}}>Prioridad</th>
              <th>Quien</th>
              <th style={{width:"150px"}}>Fecha </th>
            </tr>
          </thead>
          <tbody>
            {HistorialPrioridad.length > 0 ? (
              HistorialPrioridad.map((item, index) => (
                <tr key={index}>
                  <td style={{ width: "100px" }}>
                    <Button
                      variant=""
                      style={{
                        color: "white",
                        width: "120px",
                        backgroundColor:
                          item.prioridad === "Alta"
                            ? "#C5126D"
                            : item.prioridad === "Media"
                            ? "#DC7F37"
                            : item.prioridad === "Baja"
                            ? "#217ABF"
                            : item.prioridad === "Sin prioridad"
                            ? "#999999"
                            : "",
                      }}
                    >
                      {item.prioridad}
                    </Button>
                  </td>
                  <td>{item.quien ?? "No data"}</td>
                  <td>
                    {item.fechaPrioridad
                      ? new Date(item.fechaPrioridad).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "No disponible"}
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
    </Modal>
  );
}

export default HistorialStatus;