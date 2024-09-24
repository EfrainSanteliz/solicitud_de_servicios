import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./styles.css";
import { Button, Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { DataTime, DateTime } from "luxon";

function TextControlsExample() {
  const [options, setOptions] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const userIDSTORAGE = location.state?.userId || localStorage.getItem("userid");

  const [formData, setFormData] = useState({
    servicioSolicitado: '',
    SolicitudDeServicioARealizar: '',
    Descripcion: '',
    Status: '',
    Comentarios: '',
    FirmaEmpleado: '',
    FirmaJefeDepartamento: '',
    FirmaJefe: '',
    File: '',
    NomEmpleadosId: userIDSTORAGE,
    ConActivosFijosId: null,
  });

  const [fechaSolicitada, setFechaSolicitada] = useState('');

  // Obtener la fecha en formato año-mes-día y hora-minuto en GMT-7
  useEffect(() => {
    const getCurrentDateInGMT7 = () => {
      // Obtener la fecha en GMT-7 con el formato correcto
      const dateInGMT7 = DateTime.now().setZone("America/Hermosillo");
  
      // Verifica si la fecha es válida
      if (dateInGMT7.isValid) {
        // Devuelve la fecha en el formato requerido
        return dateInGMT7.toFormat("yyyy-MM-dd'T'HH:mm");
      } else {
        // Manejar error si la fecha no es válida
        console.error("Fecha inválida obtenida:", dateInGMT7.invalidExplanation);
        return null;
      }
    };
  
    setFechaSolicitada(getCurrentDateInGMT7());
  }, []);

  useEffect(() => {
    axios
      .get(`https://localhost:7145/api/ConActivosFijos/`)
      .then((response) => {
        console.log("get successful", response.data);

        const formattedOptions = response.data.map((item) => ({
          value: item.activoFijoID,
          label: `${item.afClave} - ${item.afNombre} - ${item.afDescripcion}`,
        }));
        setOptions(formattedOptions);
      })
      .catch((error) => {
        console.error("Error al cargar los datos", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRadioChange = (event) => {
    setSelectedService(event.target.id);
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({
      ...formData,
      ConActivosFijosId: selectedOption.value, // Almacenar el ID seleccionado
    });
    console.log("id de inventario seleccionado", selectedOption.value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          File: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalFormData = {
      ...formData,
      fechaSolicitada: fechaSolicitada, // Enviar la fecha formateada
    };

    console.log('datos a enviar' ,finalFormData);

    try {
      const response = await axios.post(
        "https://localhost:7145/api/Request/",
        finalFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Formulario enviado con éxito");
    } catch (error) {
      console.error("error al enviar el formulario:", error);
      setMessage("hubo un error al enviar el formulario.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {message && <Alert variant="info">{message}</Alert>}
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
          

          <Button type="submit" variant="primary ">
            Enviar
          </Button>
        </Form.Group>
      </div>
    </Form>
  );
}

export default TextControlsExample;
