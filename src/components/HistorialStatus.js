import { useState, useEffect } from "react";
import { Modal, Button, Tab, Table } from "react-bootstrap";
import axios from "axios";

function HistorialStatus({ RequestID }) {
  const [historialStatus, setHistorialsStatus] = useState();

  const fechData = async (RequestID) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "HistorialStatus"
      );
      setHistorialsStatus(response.data);
    } catch (error) {}
  };

  return (
    <div>
      <Modal>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <Table>
            <thead>
              <tr>
                <th>hola</th>
              </tr>
            </thead>
            <tbody>
              {historialStatus.map((item) => (
                <tr>
                  <th></th>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}

export default HistorialStatus;
