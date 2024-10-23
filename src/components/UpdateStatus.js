import { useState } from "react";
import axios from "axios";
import { waitFor } from "@testing-library/react";
import { Form } from "react-bootstrap";

function UpdateStatus({handleChange,showRequest,formData,UpdateTableRequest}) {


  const handleUpdateStatus = async (e) => {

    const {status} = formData;
    const data = new FormData;

    data.append("status",status);

    try {
      const response = await axios.put(
        `https://localhost:7145/api/Request/${showRequest.id}`,
        data, {
            headers: {
              "content-type": "application/json",
            },
          }
      );
      UpdateTableRequest();
    } catch (error) {
      console.log("no update status succesfully");
    }
  };

  return (
    <div>
      <Form.Select
        aria-label="Default select example"
        style={{ width: "130px", backgroundColor: "#DC7F37" ,color:"white" }}
        onChange={handleChange}
        onClick={(e) => {
            handleUpdateStatus(e);
        }}
        name="status"
        defaultValue={showRequest.status}
      >
        <option value="0">status</option>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
        <option value="Cancelado">Cancelado</option>
      </Form.Select>
    </div>
  );
}

export default UpdateStatus;
