import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useAsyncError } from "react-router-dom";

function RevisadoSub({ showRequest,showRequest2, formData, UpdateTableRequest }) {
  const [data, setData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      revisadoSub: true,
    };


    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL+ `Request/${showRequest.sS_SolicitudId}`,
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
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        {!showRequest.revisadoSub || showRequest.revisadoSub === false ? (
          <Button
            style={{ backgroundColor: "#237469", color: "white" }}
            type="submit"
            value="true"
            variant=""
            name="revisadoSub"
          >
            Revisar
          </Button>
        ) : (
          <div>
            <Button
              style={{ backgroundColor: "#237469", color: "white" }}
              disabled
            >
              Revisado
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}

export default RevisadoSub;
