import {useState,} from React;
import {Alert,Button} from "react-bootstrap";
import Form from "react-bootstrap/Form";

function FormSolicitudTable(id) {
       

    const[showRequest,setShowRequest] = useState([]);

     const showForm = (id) =>
     {
        axios(`https//localhost:7145/api/Request/${id}`)
        .then((response) => {
            setShowRequest(response.id)
        })
        .catch((error)=> {
         console.log("Error to show form" , error)

        })
     }

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
            label="Mantenimiento a equipo de computo etc."
            name="servicioSolicitado" // Ensure this matches the state key
            type="radio"
            value="Mantenimiento"
            checked={formData.servicioSolicitado === "Mantenimiento"}
            id="inline-radio-1"
            onChange={(e)=> {handleChange(e);handleRadioChange(e);}}
          />
          <Form.Check
            inline
            label="Sistema Tecnologico"
            name="servicioSolicitado" // Ensure this matches the state key
            type="radio"
            value="Sistema Tecnologico"
            checked={formData.servicioSolicitado === "Sistema Tecnologico"}
            id="inline-radio-2"
            onChange={(e)=> {handleChange(e);handleRadioChange(e);}}
          />
          <Form.Check
            inline
            label="Proyecto Nuevo"
            name="servicioSolicitado" // Ensure this matches the state key
            type="radio"
            value="Proyecto Nuevo"
            checked={formData.servicioSolicitado === "Proyecto Nuevo"}
            id="inline-radio-3"
            onChange={(e)=> {handleChange(e);handleRadioChange(e);}}
          />
          </div>

          <Form.Label>Solicitud de servicio a realizar</Form.Label>
          {selectedService === "inline-radio-2" && (
            <>
              <Form.Control
            as="select"
            name="SolicitudDeServicioARealizar"
            value={formData.SolicitudDeServicioARealizar}
            onChange={handleChange}
          >
            <option value="">Seleccione el tipo de servicio</option>
            <option value="subir informacion al portal web">subir informacion al portal web</option>
            <option value="cambio en palsa IBCESS">cambio en palsa IBCESS</option>
            <option value="cambio en plataforma WEB">cambio en plataforma WEB</option>
            <option value="Publicacion web institucional">Publicacion web institucional</option>
            <option value="permisos Usuarios">permisos Usuarios</option>

          </Form.Control>
            </>
          )}

          {selectedService === "inline-radio-1" && (
            <>
              <option>Selecciona el recurso que presenta problemas </option>
              <Select
                options={options}
                placeholder="Selecciona el recurso que presenta problemas"
                isSearchable={true} // Enables the search bar
                className="basic-single"
                classNamePrefix="select"

                onChange={handleSelectChange}
              />
            </>
          )}
          <br />

          <Form.Label>DESCRIPCION DETALLADA SEL SERVICIO SOLICITADO</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="Descripcion"
            placeholder="Describe tu silicitud"
            value={formData.Descripcion}
            onChange={handleChange}
          />
          <Form.Label>
            Puedes subir una imagen para la descripcion del servicio (opcional).
          </Form.Label>
          <Form.Control
            type="file"
            size="file"
            name="file"
            onChange={handlePhotoChange}
            accept="image/*"
          />

          {formData.File && 
          (
            <div className="mt-3">
              <img 
              src={formData.File}
              alt="Previzualizacion"
              style={{maxWidth:"100%",height:"auto"}}
              />
      
            </div>

          )}

          <Button type="submit" variant="primary ">
            Enviar
          </Button>
        </Form.Group>
      </div>
           
           
        </div>
    );
}

export default FormSolicitudTable;

