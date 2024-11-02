import { useState, useEffect } from "react";
import { Alert, Button, Table ,Row, Col} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "./styles.css";
import axios from "axios";
function FormSolicitudTable({ showRequest }) {
  const fullyName =
    showRequest.nomEmpleados.nomEmpNombre +
    " " +
    showRequest.nomEmpleados.nomEmpPaterno +
    " " +
    showRequest.nomEmpleados.nomEmpMaterno;

  const [imageURL, setImageURL] = useState([]);

  console.log("image", showRequest.file);

  useEffect(() => {
    if (showRequest.file) {
      setImageURL(`https://localhost:7145${showRequest.file}`);
    }
  }, [showRequest.file]);

  const [FirstResponse, setFirstResponse] = useState([]);
  const [SecondResponse, setSecondResponse] = useState([]);
  const [loagding, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ThirdResponse, setThirdResponse] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace the URL with your actual endpoint
        const response = await axios.get(
          "https://localhost:7145/api/ServicioSolicitado/"
        );

        setList(response.data); // The whole array from the server

        //setFirstResponse(list[0]);
        //setSecondResponse(list[1]);
        //setThirdResponse(list[2]);

        console.log("ServiceRequest get successful");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loagding) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="container">
      <div id="NuevaSolicitud">
        <Form.Group controlId="">
          <Form.Label className="text-center">
            SOLICITUD DE SERVICIOS SUBDIRECCION DE INFRAESTRUCTURA Y TECNOLOGIAS DE LA INFORMACION
          </Form.Label>
          <br />
          <br />
          <Form.Label>Servicio Solicitado </Form.Label>
          <div className="mb-3">
            {list.map((item, index) => (
              <Form.Check
                key={item.servicio_solicidato_Id}
                inline
                label={item.descripcionServicio_Solicitado}
                name="servicioSolicitado"
                type="radio"
                value={item.descripcionServicio_Solicitado}
                id={`inline-radio-${index + 1}`}
                disabled
                checked={showRequest.servicio_solicidato_Id === item.servicio_solicidato_Id}
              />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Form.Label>Fecha:{""}</Form.Label>
            <Form.Control
              type="text" // Change it to text if you want to format it differently
              name="fecha"
              value={new Date(showRequest.fechaSolicitada).toLocaleDateString(
                "es-ES",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }
              )} // Format as dd/mm/yyyy
              disabled
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Form.Label>Solicitud de servicio a realizar</Form.Label>
            {showRequest.solicitud_de_servicio_id && (
              <>
                <Form.Control
                  as="select"
                  name="SolicitudDeServicioARealizar"
                  value={showRequest.solicitud_de_servicio?.descripcion || ""}
                  disabled
                >
                  <option>
                    {showRequest.solicitud_de_servicio?.descripcion}
                  </option>
                </Form.Control>
              </>
            )}

            {showRequest.servicio_solicitado && (
              <>
                <Form.Control
                  as="select"
                  name="infraestructuraVozDatos" // React-friendly name without spaces
                  value={
                    showRequest.servicio_solicitado
                      .descripcionServicio_Solicitado
                  } // Dynamic value from showRequest
                  disabled // Keeps the field disabled since it's for "Mantenimiento"
                >
                  <option value="Mantenimiento">Mantenimiento</option>{" "}
                  {/* Add this */}
                </Form.Control>
              </>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Form.Label>Area Administrativa Requirente</Form.Label>
            <Form.Control
              type="text"
              name="AreaAdministrativaRequirente"
              value={
                showRequest.nomEmpleados.direccionesICEES.descripcion
              }
              disabled
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Form.Label>solicitante </Form.Label>
            <Form.Control
              type="text"
              name="solicitante"
              value={fullyName}
              disabled
            />
          </div>
          {showRequest.conActivosFijos && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Form.Label>Recurso que presenta el problema </Form.Label>
              <Form.Control
                type="text"
                name="recurso"
                value={
                  showRequest.conActivosFijos.afClave +
                  " " +
                  showRequest.conActivosFijos.afDescripcion
                }
                disabled
              />
            </div>
          )}
          <Form.Label>DESCRIPCION DETALLADA DEL SERVICIO SOLICITADO</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="Descripcion"
            value={showRequest.descripcion}
            disabled
          />
          {showRequest.file && (
            <div className="mt-3">
              <img
                src={imageURL}
                alt="Uploaded"
                style={{ maxWidth: "100%", height: "auto" }} // Make image responsive
              />
            </div>
          )}
          <Row>
            <Col xs={12}>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: "33%" }}>Solicitante</th>
                      <th style={{ width: "33%" }}>
                        Autorizo
                        <br />
                        UNIDAD ADMVA SOLICITANTE
                      </th>
                      <th style={{ width: "33%" }}>
                        ACEPTA <br />
                        INFRAESTRUCTURA Y <br /> TECNOLOGIAS DE LA INFORMACION
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{fullyName}</td>
                      <td>{showRequest.firmaJefeDepartamento !== 0 && showRequest.firmaJefeDepartamento}</td>
                      <td>{showRequest.firmaJefe !== 0 && showRequest.firmaJefe}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Form.Group>
      </div>
    </div>
  );
  
}

export default FormSolicitudTable;
