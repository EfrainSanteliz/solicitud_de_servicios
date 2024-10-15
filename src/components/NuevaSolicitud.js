import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./styles.css";
import { Button, Alert, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { DataTime, DateTime } from "luxon";
import { toast } from 'react-toastify';
import { SendFormSucess, SendFormLoading, SendtFormFailed } from "./AlertService";

function TextControlsExample() {
  const [options, setOptions] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const location = useLocation();
  const NomEmpleadosId =
    location.state?.userId || localStorage.getItem("userid");

  const [formData, setFormData] = useState({
    servicioSolicitado: "0",
    SolicitudDeServicioARealizar: "0",
    Descripcion: "",
    FirmaEmpleado: "0",
    FirmaJefeDepartamento: "0",
    FirmaJefe: "0",
    Prioridad: "sin asignar",
    
  });

  const [fechaSolicitada, setFechaSolicitada] = useState("");
  const [ConActivosFijosId, setConActivosFijosId] = useState(null);
  const [imageSelected,setImageSelected] = useState([]);

  const Status = "Activo";
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
        console.error(
          "Fecha inválida obtenida:",
          dateInGMT7.invalidExplanation
        );
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

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRadioChange = (event) => {
    setSelectedService(event.target.id);
  };

  const handleSelectChange = (selectedOption) => {
    setConActivosFijosId(selectedOption.value);
    console.log("id de inventario seleccionado", ConActivosFijosId);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    
    setFile(event.target.files[0]);

   if (file) {
    setImageSelected(URL.createObjectURL(file));
   }
  };

  const handleSubmit = async (e) => {
    SendFormLoading();
    e.preventDefault();
  
    const {
      servicioSolicitado,
      SolicitudDeServicioARealizar,
      Descripcion,
      FirmaEmpleado,
      FirmaJefeDepartamento,
      FirmaJefe,
      Prioridad,
    } = formData;

    // Use FormData to create a multipart form request
    const data = new FormData();
    data.append("servicioSolicitado", servicioSolicitado);
    data.append("fechaSolicitada", fechaSolicitada);
    data.append("solicitudDeServicioARealizar", SolicitudDeServicioARealizar);
    data.append("descripcion", Descripcion);
    data.append("status", Status);
    data.append("firmaEmpleado", FirmaEmpleado);
    data.append("firmaJefeDepartamento", FirmaJefeDepartamento);
    data.append("firmaJefe", FirmaJefe);
    data.append("nomEmpleadosId", NomEmpleadosId);
    data.append("prioridad",Prioridad);

  
    // Add file only if it exists
    if (file) {
      data.append("file", file); // Append the file to the form data
    }
    if(ConActivosFijosId) {
      data.append("conActivosFijosId", ConActivosFijosId);
    }
    console.log("imagen",file);
  
    // Log FormData content (optional, since FormData can't be fully logged)
    for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
  
    // Send the form data as multipart/form-data
    try {
      const response = await axios.post(
        "https://localhost:7145/api/Request/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      SendFormSucess();
      setFormData({
        servicioSolicitado:'',
        SolicitudDeServicioARealizar:'',
        Descripcion:'',
      });

    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      SendtFormFailed();
      setMessage("Hubo un error al enviar el formulario.");
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
            value="Infraestructura voz/datos"
            checked={formData.servicioSolicitado === "Infraestructura voz/datos"}
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
                onChange={handleChange}
              >
                <option value="">Seleccione el tipo de servicio</option>
                <option value="subir informacion al portal web">
                  subir informacion al portal web
                </option>
                <option value="cambio en plasa IBCESS">
                  cambio en plasa IBCESS
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
            placeholder="Describe tu solicitud"
            value={formData.Descripcion}
            onChange={handleChange}
            required
          />
          <Form.Label>
            Puedes subir una imagen para la descripcion del servicio (opcional).
          </Form.Label>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              onChange={handlePhotoChange}
              accept="image/*"
              
            />
          </Form.Group>

            <div className="mt-3">
              <img
                src={imageSelected}
                alt="Uploaded"
                style={{ maxWidth: '800px', maxHeight: '800px' }}
                />
            </div>
        

          <Button type="submit" variant="primary " style={{backgroundColor:'#237469'}}>
            Enviar
          </Button>
        </Form.Group>
      </div>
    </Form>
  );
}

export default TextControlsExample;
