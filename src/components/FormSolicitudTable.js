import { useState, useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

function FormSolicitudTable({ showRequest }) {



  const downloadPDF = () => {

  };


  return (
    <div>
      <div id="NuevaSolicitud">
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
              checked={showRequest.servicioSolicitado === "Infraestructura voz/datos"}
            />

            <Form.Checkn
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

          <Form.Label>Solicitud de servicio a realizar</Form.Label>
          {showRequest.servicioSolicitado === "Sistema Tecnologico" && (
            <>
              <Form.Control
                as="select"
                name="SolicitudDeServicioARealizar"
                value={showRequest.solicitudDeServicioARealizar}
                disabled
              >
                <option value="">Seleccione el tipo de servicio</option>
                <option value="subir informacion al portal web">
                  subir informacion al portal web
                </option>
                <option value="cambio en palsa IBCESS">
                  cambio en palsa IBCESS
                </option>
                <option value="cambio en plataforma WEB">
                  cambio en plataforma WEB
                </option>
                <option value="Publicacion web institucional">
                  Publicacion web institucional
                </option>
                <option value="permisos Usuarios">permisos Usuarios</option>
              </Form.Control>
            </>
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
        
            <div className="mt-3">
              <img
                src={showRequest.file}
                alt="Previzualizacion"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>

        
        </Form.Group>
      </div>
    </div>
  );
}

export default FormSolicitudTable;
