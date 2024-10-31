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
