import { Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Table, Button, Modal, Container, Row, Col } from "react-bootstrap";
import { Input } from "react-select/animated";
import axios from "axios";
import { error } from "ajv/dist/vocabularies/applicator/dependencies";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import FormTable from "./FormTable";
// SweetAlert setup
const MySwal = withReactContent(Swal);

// Alert functions
export const showMessageDontDrop = (errorMessage) => {
  MySwal.fire({
    title: "Error!",
    text: errorMessage,
    icon: "error",
    confirmButtonText: "ok",
  });
};

function UpdateForm() {
  const values = [true, "sm=down", "lg-down", "xl-down", "xxl-down"];
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [showFirst, setShowFirst] = useState(false);
  const [solicitudesDeServicios, setSolicitudesDeServicios] = useState([]);
  const [servicioSolicitado, setServicioSolicitado] = useState([]);
  const [data, setData] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);
  const [modifiedData2, setModifiedData2] = useState([]);

  const [newRow, setNewRow] = useState({ descripcion: "", habilitado: "" });
  const [newRow2, setNewRow2] = useState({
    descripcionServicio_Solicitado: "",
    habilitadoServicio_Solicitado: "",
  });

  const [validacion, setValidacion] = useState(false);
  const [show2, setShow2] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  function handleClose() {
    if (validacion === false) {
      setShow(false);
    } else {
      setShow2(true);
    }
  }

  function handleClose2() {
    setShow2(false);
  }

  function handleClose3() {
    setShow2(false);
    setShow(false);
  }

  useEffect(() => {
    getSolicitudesDeServicios();
    getServicioSolicitado();
  }, []);

  const handleUpdateHabilitar = async (id, habilitado) => {
    const data = {
      habilitado: habilitado,
    };

    console.log("habilitado:", habilitado);

    try {
      const response = await axios.put(
        `https://localhost:7145/api/Solicitud_de_servicio/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      getSolicitudesDeServicios();

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error updating habilitar:", error);
    }
  };

  const handleUpdateHabilitar2 = async (id, habilitadoServicio_Solicitado) => {
    const data = {
      habilitadoServicio_Solicitado: habilitadoServicio_Solicitado,
    };

    console.log("habilitado:", habilitadoServicio_Solicitado);

    try {
      const response = await axios.put(
        `https://localhost:7145/api/servicioSolicitado/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      getServicioSolicitado();

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error updating habilitar:", error);
    }
  };

  const handleEdit = (index, field, value) => {
    const updatedData = [...solicitudesDeServicios];
    updatedData[index][field] = value;
    setData(updatedData);

    if (!modifiedData.includes(updatedData[index])) {
      setModifiedData([...modifiedData, updatedData[index]]);
    }
    setsaveSolicitudDeServicioARealizar(true);
  };

  const handleEdit2 = (index, field, value) => {
    const updatedData = [...servicioSolicitado];
    updatedData[index][field] = value;
    setData(updatedData);

    if (!modifiedData2.includes(updatedData[index])) {
      setModifiedData2([...modifiedData2, updatedData[index]]);
    }
    setSaveServicioSolicitado(true);
  };

  const [
    saveSolicitudDeServicioARealizar,
    setsaveSolicitudDeServicioARealizar,
  ] = useState(false);
  const [saveServicioSolicitado, setSaveServicioSolicitado] = useState(false);

  const handleNewRowChange = (field, value) => {
    setNewRow({ ...newRow, [field]: value });
    setValidacion(true);
    setsaveSolicitudDeServicioARealizar(true);
  };
  const handleNewRowChange2 = (field, value) => {
    setNewRow2({ ...newRow2, [field]: value });
    setValidacion(true);
    setSaveServicioSolicitado(true);
  };

  const handleSaveChanges = () => {
    if (saveSolicitudDeServicioARealizar) {
      modifiedData.forEach((row) => {
        axios
          .put(
            `https://localhost:7145/api/Solicitud_de_servicio/${row.solicitud_de_servicio_id}`,
            row
          )
          .then((response) => {
            console.log("Data Update Successfully", response.data);
          })
          .catch((error) => {
            console.log("Error updating data:", error);
          });
      });

      if (newRow.descripcion !== "") {
        const formattedNewRow = {
          ...newRow,
          habilitado: newRow.habilitado === "true", // Convert habilitado to boolean
        };

        axios
          .post(
            `https://localhost:7145/api/Solicitud_de_servicio/`,
            formattedNewRow
          )
          .then((response) => {
            setData([...solicitudesDeServicios, response.data]);
            setNewRow({ habilitado: "", descripcion: "" });
          })
          .catch((error) => {
            console.error("Error adding new row:", error);
          });
      }

      setModifiedData([]);
      setValidacion(false);

      getSolicitudesDeServicios();
      getSolicitudesDeServicios();
      getSolicitudesDeServicios();
      setsaveSolicitudDeServicioARealizar(false);
    }
    if (saveServicioSolicitado) {
      modifiedData2.forEach((row) => {
        axios
          .put(
            `https://localhost:7145/api/ServicioSolicitado/${row.servicio_solicidato_Id}`,
            row
          )
          .then((response) => {
            console.log("Data Update Successfully2", response.data);
          })
          .catch((error) => {
            console.log("Error updating data:", error);
          });
      });

      if (newRow2.descripcionServicio_Solicitado !== "") {
        const formattedNewRow = {
          ...newRow2,
          habilitadoServicio_Solicitado:
            newRow2.habilitadoServicio_Solicitado === "true", // Convert habilitado to boolean
        };

        axios
          .post(
            `https://localhost:7145/api/ServicioSolicitado/`,
            formattedNewRow
          )
          .then((response) => {
            setData([...solicitudesDeServicios, response.data]);
            setNewRow2({
              habilitadoServicio_Solicitado: "",
              descripcionServicio_Solicitado: "",
            });
          })
          .catch((error) => {
            console.error("Error adding new row:", error);
          });
      }

      setModifiedData2([]);
      setValidacion(false);

      getServicioSolicitado();
      getServicioSolicitado();
      getServicioSolicitado();
    }
  };
  const [Options2, setOptions2] = useState([]);

  const getSolicitudesDeServicios = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7145/api/Solicitud_de_servicio/`
      );

      setSolicitudesDeServicios(response.data);

      const formattedOptions = response.data
        .map((item) =>
          item.habilitado === true
            ? {
                value: item.solicitud_de_servicio_id,
                label: `${item.descripcion}`,
              }
            : null
        )
        .filter((option) => option !== null);
      setOptions2(formattedOptions);
    } catch (error) {
      console.error("Error fetching service requests:", error);
    }
  };
  const [loagding,setLoading] = useState(true);

  const getServicioSolicitado = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7145/api/ServicioSolicitado/`
      );
      setServicioSolicitado(response.data);
    } catch (err) {
      console.log("erro to get SolicitudesOfServices");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (id) => {
    try {
      const response = await axios.delete(
        `https://localhost:7145/api/Solicitud_de_servicio/${id}`
      );
      getSolicitudesDeServicios();
    } catch (error) {
      // Extract the message from the response
      const serverMessage = error.response?.data;
      console.log(" ", serverMessage);
      setErrorMessage(serverMessage); // Update error message state
      showMessageDontDrop(serverMessage); // Show SweetAlert
    }
  };
  const handleDrop2 = async (id) => {
    try {
      const response = await axios.delete(
        `https://localhost:7145/api/ServicioSolicitado/${id}`
      );
      getServicioSolicitado();
    } catch (error) {
      // Extract the message from the response
      const serverMessage = error.response?.data;
      console.log(" ", serverMessage);
      setErrorMessage(serverMessage); // Update error message state
      showMessageDontDrop(serverMessage); // Show SweetAlert
    }
  };

  const [formData, setFormData] = useState({
    habilitado: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const styles = {
    button: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#9B2F3E ",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "10px 15px",
      cursor: "pointer",
    },
    icon: {
      marginRight: "8px", // Space between icon and text
    },
  };

  const handleDeleteServicio = async () => {};

  return (
    <div>
      <Form>
        <Button variant="success" onClick={handleShow}>
          Modificar Formulario
        </Button>{" "}
        <Modal
          show={show}
          onHide={handleClose}
          animation={false}
          size="xl" // Use "lg" for large or "xl" for extra-large
        >
          <Modal.Header closeButton>
            <Modal.Title>Modificar Formulario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <br></br>
            <Row>
              <Col xs={12}>
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Servicio Solicitado</th>
                        <th style={{ width: "120px", textAlign: "center" }}>
                          Habilitado{" "}
                        </th>
                        <th style={{ width: "80px", textAlign: "center" }}>
                          Eliminar
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicioSolicitado.map((row, index) => (
                        <tr key={row.servicio_solicidato_Id}>
                          <td>
                            <Form.Control
                              type="text"
                              defaultValue={row.descripcionServicio_Solicitado}
                              onChange={(e) =>
                                handleEdit2(
                                  index,
                                  "descripcionServicio_Solicitado",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Form.Select
                              aria-label="Default select example"
                              style={{
                                color: "white",
                                width: "100px",
                                textAlign: "center",
                                backgroundColor:
                                  row.habilitadoServicio_Solicitado === false
                                    ? "#DC7F37"
                                    : "#C5126D", // Apply color conditionally
                              }}
                              onChange={handleChange}
                              onClick={(e) => {
                                const habilitadoValue =
                                  e.target.value === "true"; // Convert to boolean
                                handleUpdateHabilitar2(
                                  row.servicio_solicidato_Id,
                                  habilitadoValue
                                );
                              }}
                              name="prioridad"
                              defaultValue={row.habilitadoServicio_Solicitado}
                            >
                              <option value={false}>No</option>
                              <option value={true}>Si</option>
                            </Form.Select>
                          </td>

                          <td>
                            <Button
                              onClick={(e) => {
                                handleDrop2(row.servicio_solicidato_Id);
                              }}
                              style={styles.button}
                            >
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                style={styles.icon}
                              ></i>{" "}
                              {/* Use trash icon */}
                            </Button>
                          </td>
                        </tr>
                      ))}

                      <tr>
                        <td>
                          <Form.Control
                            type="text"
                            placeholder=""
                            value={newRow.descripcionServicio_Solicitado}
                            onChange={(e) =>
                              handleNewRowChange2(
                                "descripcionServicio_Solicitado",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <Form.Select
                            type="email"
                            placeholder=""
                            value={newRow.habilitadoServicio_Solicitado}
                            onChange={(e) =>
                              handleNewRowChange2(
                                "habilitadoServicio_Solicitado",
                                e.target.value
                              )
                            }
                          >
                            <option value="true">Seleccione</option>
                            <option value="true">Habilitado</option>
                            <option value="false">Deshabilitado</option>
                          </Form.Select>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col xs={12}>
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Solicitud de servicio a realizar</th>
                        <th style={{ width: "120px", textAlign: "center" }}>
                          Habilitado{" "}
                        </th>
                        <th style={{ width: "80px", textAlign: "center" }}>
                          Eliminar
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {solicitudesDeServicios.map((row, index) => (
                        <tr key={row.solicitud_de_servicio_id}>
                          <td>
                            <Form.Control
                              type="text"
                              defaultValue={row.descripcion}
                              onChange={(e) =>
                                handleEdit(index, "descripcion", e.target.value)
                              }
                            />
                          </td>

                          <td
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Form.Select
                              aria-label="Default select example"
                              style={{
                                color: "white",
                                width: "100px",
                                textAlign: "center",
                                backgroundColor:
                                  row.habilitado === false
                                    ? "#DC7F37"
                                    : "#C5126D", // Apply color conditionally
                              }}
                              onChange={handleChange}
                              onClick={(e) => {
                                const habilitadoValue =
                                  e.target.value === "true"; // Convert to boolean
                                handleUpdateHabilitar(
                                  row.solicitud_de_servicio_id,
                                  habilitadoValue
                                );
                              }}
                              name="prioridad"
                              defaultValue={row.habilitado}
                            >
                              <option value={false}>No</option>
                              <option value={true}>Si</option>
                            </Form.Select>
                          </td>

                          <td>
                            <Button
                              onClick={(e) => {
                                handleDrop(row.solicitud_de_servicio_id);
                              }}
                              style={styles.button}
                            >
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                style={styles.icon}
                              ></i>{" "}
                              {/* Use trash icon */}
                            </Button>
                          </td>
                        </tr>
                      ))}

                      <tr>
                        <td>
                          <Form.Control
                            type="text"
                            placeholder=""
                            value={newRow.descripcion}
                            onChange={(e) =>
                              handleNewRowChange("descripcion", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Select
                            type="email"
                            placeholder=""
                            value={newRow.habilitado}
                            onChange={(e) =>
                              handleNewRowChange("habilitado", e.target.value)
                            }
                          >
                            <option value="true">Seleccione</option>
                            <option value="true">Habilitado</option>
                            <option value="false">Deshabilitado</option>
                          </Form.Select>
                        </td>
                      </tr>
                    </tbody>
                  </Table>

                  <FormTable
                    options2={Options2}
                    list={servicioSolicitado}
                    loagding={loagding}
                  ></FormTable>
                  <br></br>
                </div>
              </Col>
            </Row>

            <Modal.Footer>
              <Button variant="primary" onClick={handleSaveChanges}>
                {" "}
                Guardar{" "}
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
        <Modal show={show2}>
          <Modal.Header>
            <b>Quieres salir sin guardar cambios? </b>
          </Modal.Header>
          <Modal.Body>
            <br></br>
            <br></br>
            <br></br>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose2}>
              Permanecer
            </Button>
            <Button variant="danger" onClick={handleClose3}>
              Salir sin guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    </div>
  );
}
export default UpdateForm;
