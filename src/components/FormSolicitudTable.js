import { useState, useEffect } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "./styles.css";
import axios from "axios";
function FormSolicitudTable({ showRequest }) {
  const fullyName =
    showRequest.usuarios.nomEmpleados.nomEmpNombre +
    " " +
    showRequest.usuarios.nomEmpleados.nomEmpPaterno +
    " " +
    showRequest.usuarios.nomEmpleados.nomEmpMaterno;

  const [imageURL, setImageURL] = useState([]);

  console.log("image", showRequest.file);

  useEffect(() => {
    if (showRequest.file) {
      setImageURL(`https://localhost:7145${showRequest.file}`);
    }
  }, [showRequest.file]);

  const [FirstResponse,setFirstResponse] = useState([]);
  const [SecondResponse,setSecondResponse] = useState([]);
  const [loagding,setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ThirdResponse,setThirdResponse] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace the URL with your actual endpoint
        const response = await axios.get("https://localhost:7145/api/ServicioSolicitado/");

        const list = response.data; // The whole array from the server

          setFirstResponse(list[0]);
          setSecondResponse(list[1]);
          setThirdResponse(list[2]);

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

  if(loagding) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div id="NuevaSolicitud">
        <Form.Group className="" controlId="">
          <Form.Label>
            SOLICITUD DE SERVICIOS SUBDIRECCION DE INFRAESTRUCTURA Y TECNOLOGIAS
            DE LA INFORMACION
          </Form.Label>
          <br />
          <br />

          <Form.Label>Servicio Solicitado </Form.Label>
          <div className="mb-3">
            <Form.Check
              inline
              label={FirstResponse.descripcionServicio_Solicitado}
              name="servicioSolicitado" // Ensure this matches the state key
              type="radio"
              value={FirstResponse.descripcionServicio_Solicitado}
              id="inline-radio-1"
              disabled
              checked={showRequest.servicio_solicidato_Id === FirstResponse.servicio_solicidato_Id} // Compare strings, not objects

            />

            <Form.Check
              inline
              label={SecondResponse.descripcionServicio_Solicitado}
              name="servicioSolicitado" // Ensure this matches the state key
              type="radio"
              value={SecondResponse.descripcionServicio_Solicitado}
              id="inline-radio-2"
              disabled
              checked={showRequest.servicio_solicidato_Id === SecondResponse.servicio_solicidato_Id}
            />

            <Form.Check
              inline
              label={ThirdResponse.descripcionServicio_Solicitado}
              name="servicioSolicitado" // Ensure this matches the state key
              type="radio"
              value={ThirdResponse.descripcionServicio_Solicitado}
              id="inline-radio-3"
              disabled
              checked={showRequest.servicio_solicidato_Id === ThirdResponse.servicio_solicidato_Id}
            />
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
                  value={showRequest.servicio_solicitado.descripcionServicio_Solicitado} // Dynamic value from showRequest
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
                showRequest.usuarios.nomEmpleados.direccionesICEES.descripcion
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

          <br />
          <Form.Label>DESCRIPCION DETALLADA SEL SERVICIO SOLICITADO</Form.Label>
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
                style={{ maxWidth: "800px", maxHeight: "800px" }}
              />
            </div>
          )}

          <Table id="firmas" striped bordered hover>
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
                <td>
                  {showRequest.firmaJefeDepartamento !== 0 &&
                    showRequest.firmaJefeDepartamento}
                </td>
                <td>{showRequest.firmaJefe !== 0 && showRequest.firmaJefe}</td>
              </tr>
            </tbody>

            <thead>
              <tr>
                <th>Nombre</th>
                <th>Nombre</th>
                <th>
                  JOEL ADRIAN ACUÑA ALCARAZ <br />
                </th>
              </tr>
            </thead>
          </Table>
        </Form.Group>
      </div>
    </div>
  );
}

export default FormSolicitudTable;
