import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./styles.css";
import { Button ,Alert} from "react-bootstrap";
import { useLocation } from "react-router-dom";

function TextControlsExample() {
  const [options, setOptions] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");

  
  const location = useLocation();
  const userIDSTORAGE = location.state?.userId || localStorage.getItem("userid");

  const [formData, setFormData] = useState({
    NomEmpleadosId: "",
    ServicioSolicitado: "",
    FechaSolicitada: "",
    AreaAdministrativaRequirente: "",
    PersonaQueSolicitaElServicio: "",
    Descripcion: "",
    file: null,
    conActivosFijosId: ""
  });

  const handleRadioChange = (event) => {
    setSelectedService(event.target.id);
  };

  const options2 = [
    { value: "1", label: "subir informacion al portal web" },
    { value: "2", label: "cambio en palsa IBCESS" },
    { value: "3", label: "cambio en plataforma WEB" },
    { value: "4", label: "Publicacion web institucional" },
    { value: "5", label: "permisos Usuarios" },
  ];

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("ServicioSolicitado", formData.ServicioSolicitado);
    data.append("FechaSolicitada", formData.FechaSolicitada);
    data.append("Descripcion", formData.email);
    data.append("FechaSolicitada", formData.date);



    if (formData.file) {
      data.append("file", formData.file);
    }

    try {
      const response = await axios.post(
        "https://localhost:7141/api/Request/Create",data
      );
      setMessage("Formulario enviado con éxito");
    } catch (error) {
      console.error("error al enviar el formulario:", error);
      setMessage("hubo un error al enviar el formulario.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>

      idUsuario{userIDSTORAGE}
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
              name="group1"
              type="radio"
              value={formData.ServicioSolicitado}
              id={`inline-radio-1`}
              onChange={(e) => {
                handleRadioChange(e);
                handleChange(e);
              }}
            />
            <Form.Check
              inline
              label="Sistema Tecnologico"
              name="group1"
              type="radio"
              value={formData.ServicioSolicitado}
              id={`inline-radio-2`}
              onChange= {(e)=>{
                handleChange(e);
                handleRadioChange(e);
              }}
            />
            <Form.Check
              inline
              label="Proyecto Nuevo"
              type="radio"
              name="group1"
              value={formData.ServicioSolicitado}
              id={`inline-radio-3`}
              onChange={(e) => {
                handleChange(e);
                handleRadioChange(e);
              }}
            />
          </div>

          <Form.Label>Fecha de Solicitud</Form.Label>
          <Form.Control 
            type="date" 
            name= "FechaSolicitada"
            value={formData.date}
            onChange={handleChange}
          />

          <Form.Label>Solicitud de servicio a realizar</Form.Label>
          {selectedService === "inline-radio-2" && (
            <>
              <Form.Select aria-label="Default select example">
                <option>Selecciona el servicio</option>
                {options2.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                  
                ))}
              </Form.Select>
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
                value={formData.conActivosFijosId}
                onChange={handleChange}
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
          <Form.Control type="file" size="file" name="hola" onChange={handleChange} />

          <Button type="submit" variant= "primary ">Enviar</Button>
        </Form.Group>
      </div>
    </Form>
  );
}

export default TextControlsExample;
