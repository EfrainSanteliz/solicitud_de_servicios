import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

function TextControlsExample() {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`https://localhost:7142/api/ConActivosFijos/`)
      .then((response) => {
        console.log("get succesful", response.data);

        const formattendOptions = response.data.map((item) => ({
          value: item.activoFijoID,
          label: `${item.afClave} - ${item.afNombre} - ${item.afDescripcion}`,
        }));
        setOptions(formattendOptions);
      })
      .catch((error) => {
        console.error("Error al cargar los datos", error);
      });
  }, []);

  return (
    <Form>
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
            label="Mantenimiento a equipo de computo etc."
            name="group1"
            type="radio"
            id={`inline-radio-1`}
          />
          <Form.Check
            inline
            label="Sistema Tecnologico"
            name="group1"
            type="radio"
            id={`inline-radio-2`}
          />
          <Form.Check
            inline
            label="Proyecto Nuevo"
            type="radio"
            name="group1"
            id={`inline-radio-3`}
          />
        </div>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formDate">
        <Form.Label>Fecha de Solicitud</Form.Label>
        <Form.Control type="date" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="SolicitudDeServicioArealizar">
        <Form.Label>Solicitud de servicio a realizar</Form.Label>
        <Form.Select aria-label="Default select example">
          <option>Selecciona el servicio</option>
          <option value="1">Subir informacion al portal WEB</option>
          <option value="2">Cambio en plasa IBCESS</option>
          <option value="3">Cambio en Plataforma WEB</option>
          <option value="4">Publicacion web institucional</option>
          <option value="5">Permisos Usuarios</option>
        </Form.Select>

        <Form.Select aria-label="Default select example">
          <option>Selecciona el recurso que presenta problemas </option>
          <Select
            options={options}
            placeholder="Selecciona el recurso que presenta problemas"
            isSearchable={true} // Enables the search bar
            className="basic-single"
            classNamePrefix="select"
          />
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>DESCRIPCION DETALLADA SEL SERVICIO SOLICITADO</Form.Label>
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
      <Form.Group controlId="formFileLg" className="mb-3">
        <Form.Label>
          Puedes subir una imagen para la descripcion del servicio (opcional).
        </Form.Label>
        <Form.Control type="file" size="lg" />
      </Form.Group>
    </Form>
  );
}

export default TextControlsExample;
