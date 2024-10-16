import { useState, useEffect } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import "./styles.css";

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
              label="Infraestructura voz/datos."
              name="servicioSolicitado" // Ensure this matches the state key
              type="radio"
              value="Infraestructura voz/datos"
              id="inline-radio-1"
              disabled
              checked={
                showRequest.servicioSolicitado === "Infraestructura voz/datos"
              }
            />

            <Form.Check
              inline
              label="Sistema Tecnologico"
              name="servicioSolicitado" // Ensure this matches the state key
              type="radio"
              value="Sistema Tecnologico"
              id="inline-radio-2"
              disabled
              checked={showRequest.servicioSolicitado === "Sistema Tecnologico"}
            />

            <Form.Check
              inline
              label="Proyecto Nuevo"
              name="servicioSolicitado" // Ensure this matches the state key
              type="radio"
              value="Proyecto Nuevo"
              id="inline-radio-3"
              disabled
              checked={showRequest.servicioSolicitado === "Proyecto Nuevo"}
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
            {showRequest.servicioSolicitado === "Sistema Tecnologico" && (
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

            {showRequest.servicioSolicitado === "Mantenimiento" && (
              <>
                <Form.Control
                  as="select"
                  name="infraestructuraVozDatos" // React-friendly name without spaces
                  value={showRequest.servicioSolicitado} // Dynamic value from showRequest
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
