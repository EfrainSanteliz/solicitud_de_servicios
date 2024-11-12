import { useState } from "react";
import axios from "axios";
import { waitFor } from "@testing-library/react";
import { Form } from "react-bootstrap";
import { DateTime } from "luxon";


function UpdateStatus({
  handleChange,
  showRequest,
  formData,
  UpdateTableRequest,
  showRequest2,
}) {

  const handleUpdateStatus = async (newStatus) => {
    const { status } = formData;
    
    const UserRole = localStorage.getItem("UserRole");
    const nombre = localStorage.getItem("name_secondname");

    const fechaSatus = DateTime.now();


    const data = {
     status:newStatus,
     ultimoStatus:UserRole,
    };

    const data2 = {
      status:newStatus,
      quien:nombre,
      fechaStatus:fechaSatus,
      SS_SolicitudId:showRequest.sS_SolicitudId,
     };

    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL+`Request/${showRequest.sS_SolicitudId}`,
        data,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      UpdateTableRequest();
      showRequest2(showRequest.sS_SolicitudId);

    } catch (error) {
    }

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL+`HistorialStatus/`,
        data2,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      UpdateTableRequest();
      showRequest2(showRequest.sS_SolicitudId);

    } catch (error) {
    }
  };
  const [forceUpdate, setForceUpdate] = useState(0);


  return (
    <div>
      <Form.Select
        aria-label="Default select example"
        style={{ width: "130px", backgroundColor: "#DC7F37", color: "white" }}
        onChange={(e) => {
          handleChange(e);
          handleUpdateStatus(e.target.value);  // Pass the current selected value
          // Force re-render to ensure state is updated
        }}      
        name="status"
        defaultValue={showRequest.status}
      >
        <option value="">status</option>
        <option value="1">Activo</option>
        <option value="2">Inactivo</option>
        <option value="3">Devolucion</option>
        <option value="4">Finalizado</option>
        <option value="5">Cancelado</option>

      </Form.Select>
    </div>
  );
}

export default UpdateStatus;
