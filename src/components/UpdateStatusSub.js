import { useState } from "react";
import axios from "axios";
import { waitFor } from "@testing-library/react";
import { Form } from "react-bootstrap";

function UpdateStatusSub({
  handleChange,
  showRequest,
  formData,
  UpdateTableRequest,
  showRequest2,
}) {
  const UserRole = localStorage.getItem("UserRole");

  const handleUpdateStatus = async (newStatus) => {
    const { status } = formData;
    
    const UserRole = localStorage.getItem("UserRole");

    const data = {
     status:newStatus,
     revisadoSub:true,
     ultimoStatus:UserRole,
    };



    try {
      const response = await axios.put(
        `https://localhost:7145/api/Request/${showRequest.id}`,
        data,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      UpdateTableRequest();
      showRequest2(showRequest.id);

    } catch (error) {
      console.log("no update status succesfully");
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
        <option value="3">Revertido</option>
        <option value="4">Finalizado</option>

      </Form.Select>
    </div>
  );
}

export default UpdateStatusSub;
