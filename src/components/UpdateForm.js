import { Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Table, Button, Modal, Container, Row, Col, Spinner } from "react-bootstrap";
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
  const [Loaging2, setLoading2] = useState(true);
  const [Loaging3, setLoading3] = useState(true);

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


    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL+`Solicitud_de_servicio/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      getSolicitudesDeServicios();

    } catch (error) {
      console.error("Error updating habilitar:", error);
    }
  };

  const handleUpdateHabilitar2 = async (id, habilitadoServicio_Solicitado) => {
    const data = {
      habilitadoServicio_Solicitado: habilitadoServicio_Solicitado,
    };


    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL+`servicioSolicitado/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      getServicioSolicitado();

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

  const handleSaveChanges = async (e) => {
    e.preventDefault();
  
    if (saveSolicitudDeServicioARealizar) {
  
      // Update modified data for "Solicitud de servicio"
      try {
        for (let row of modifiedData) {
          const response = await axios.put(
            process.env.REACT_APP_API_URL+`Solicitud_de_servicio/${row.solicitud_de_servicio_id}`,
            row
          );
        }
      } catch (error) {
      }
  
      // Add new row if there is data
      if (newRow.descripcion !== "") {
        const formattedNewRow = {
          ...newRow,
          habilitado: newRow.habilitado === "true", // Convert habilitado to boolean
        };
  
        try {
          const response = await axios.post(
            process.env.REACT_APP_API_URL+`Solicitud_de_servicio/`,
            formattedNewRow
          );
          setData((prevData) => [...prevData, response.data]);
          setNewRow({ habilitado: "", descripcion: "" });
        } catch (error) {
          console.error("Error adding new row:", error);
        }
      }
  
      setModifiedData([]);
      setValidacion(false);
  
      // Reload data
      await getSolicitudesDeServicios();
      setsaveSolicitudDeServicioARealizar(false);
    }
  
    if (saveServicioSolicitado) {
  
      // Update modified data for "Servicio Solicitado"
      try {
        for (let row of modifiedData2) {
          const response = await axios.put(
            process.env.REACT_APP_API_URL+`ServicioSolicitado/${row.sS_servicio_solicidato_Id}`,
            row
          );
        }
      } catch (error) {
      }
  
      // Add new row if there is data
      if (newRow2.descripcionServicio_Solicitado !== "") {
        const formattedNewRow2 = {
          ...newRow2,
          habilitadoServicio_Solicitado:
            newRow2.habilitadoServicio_Solicitado === "true", // Convert habilitado to boolean
        };
  
        try {
          const response = await axios.post(
            process.env.REACT_APP_API_URL+`ServicioSolicitado/`,
            formattedNewRow2
          );
          setData((prevData) => [...prevData, response.data]);
          setNewRow2({
            habilitadoServicio_Solicitado: "",
            descripcionServicio_Solicitado: "",
          });
        } catch (error) {
          console.error("Error adding new row:", error);
        }
      }
  
      setModifiedData2([]);
      setValidacion(false);
  
      // Reload data
      await getServicioSolicitado();
    }
  };
  const [Options2, setOptions2] = useState([]);

  const getSolicitudesDeServicios = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL+`Solicitud_de_servicio/`
      );

      setSolicitudesDeServicios(response.data);

      const formattedOptions = response.data
        .map((item) =>
          item.habilitado === true
            ? {
                value: item.sS_Solicitud_de_servicio_id,
                label: `${item.descripcion}`,
              }
            : null
        )
        .filter((option) => option !== null);
      setOptions2(formattedOptions);
      setLoading2(false);
    } catch (error) {
      console.error("Error fetching service requests:", error);
    }
  };
  const [loagding, setLoading] = useState(true);

  const getServicioSolicitado = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL+`ServicioSolicitado/`
      );
      setServicioSolicitado(response.data);
      setLoading3(false);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (id) => {
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_URL+`Solicitud_de_servicio/${id}`
      );
      getSolicitudesDeServicios();
    } catch (error) {
      // Extract the message from the response
      const serverMessage = error.response?.data;
      setErrorMessage(serverMessage); // Update error message state
      showMessageDontDrop(serverMessage); // Show SweetAlert
    }
  };
  const handleDrop2 = async (id) => {
    try {
      const response = await axios.delete(
        process.env.REACT_APP_API_URL+`ServicioSolicitado/${id}`
      );
      getServicioSolicitado();
    } catch (error) {
      // Extract the message from the response
      const serverMessage = error.response?.data;
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
    <div  >
      {Loaging2 && Loaging3 ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Cargando..</span>
        </Spinner>
      ) : (
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
                <Modal.Title style={{fontSize:"24px"}} >Modificar Formulario</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <br></br>
                <Row>
                  <Col xs={12}>
                    <div className="table-responsive" style={{fontSize:"22px"}}>
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
                            <tr key={row.sS_Servicio_solicitado_Id}>
                              <td>
                                <Form.Control
                                style={{fontSize:"19px"}}
                                  type="text"
                                  defaultValue={
                                    row.descripcionServicio_Solicitado
                                  }
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
                                      row.habilitadoServicio_Solicitado ===
                                      false
                                        ? "#DC7F37"
                                        : "#C5126D", // Apply color conditionally
                                  }}
                                  onChange={handleChange}
                                  onClick={(e) => {
                                    const habilitadoValue =
                                      e.target.value === "true"; // Convert to boolean
                                    handleUpdateHabilitar2(
                                      row.sS_Servicio_solicitado_Id,
                                      habilitadoValue
                                    );
                                  }}
                                  name="prioridad"
                                  defaultValue={
                                    row.habilitadoServicio_Solicitado
                                  }
                                >
                                  <option value={false}>No</option>
                                  <option value={true}>Si</option>
                                </Form.Select>
                              </td>

                              <td>
                                <Button
                                  onClick={(e) => {
                                    handleDrop2(row.sS_Servicio_solicitado_Id);
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
                                value={newRow2.descripcionServicio_Solicitado}
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
                                value={newRow2.habilitadoServicio_Solicitado}
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
                    <div className="table-responsive" style={{fontSize:"22px"}}>
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
                            <tr key={row.sS_Solicitud_de_servicio_id}>
                              <td>
                                <Form.Control
                                  type="text"
                                  style={{fontSize:"19px"}}

                                  defaultValue={row.descripcion}
                                  onChange={(e) =>
                                    handleEdit(
                                      index,
                                      "descripcion",
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
                                      row.habilitado === false
                                        ? "#DC7F37"
                                        : "#C5126D", // Apply color conditionally
                                  }}
                                  onChange={handleChange}
                                  onClick={(e) => {
                                    const habilitadoValue =
                                      e.target.value === "true"; // Convert to boolean
                                    handleUpdateHabilitar(
                                      row.sS_Solicitud_de_servicio_id,
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
                                    handleDrop(row.sS_Solicitud_de_servicio_id);
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
                                  handleNewRowChange(
                                    "descripcion",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <Form.Select
                                type="email"
                                placeholder=""
                                value={newRow.habilitado}
                                onChange={(e) =>
                                  handleNewRowChange(
                                    "habilitado",
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
                  <Button variant="primary" onClick={ (e) => {handleSaveChanges(e);}}>
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
      )}
    </div>
  );
}
export default UpdateForm;
