import Form from "react-bootstrap/Form";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./styles.css";
import { Button, Alert, Row, Col ,Container} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { DataTime, DateTime } from "luxon";
import { toast } from "react-toastify";
import {
  SendFormSucess,
  SendFormLoading,
  SendtFormFailed,
} from "./AlertService";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { FaCamera } from "react-icons/fa"; // Import camera icon
import { DeviceContext } from "./DeviceContext";
import "./Styleradio.css";
import { UserContext } from "./UserContext";

function TextControlsExample() {
  const deviceType = useContext(DeviceContext);
  const [options, setOptions] = useState([]);
  const [options2, setOptions2] = useState([]);
  const Navigate = useNavigate();
  const {empleadoID} = useContext(UserContext);

  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [selectedSolicitudDeServicio, setSelectedSolicitudDeServicio] =
    useState("");

  const location = useLocation();

  const [formData, setFormData] = useState({
    servicioSolicitado: "0",
    Descripcion: "",
    FirmaEmpleado: "",
    FirmaJefeDepartamento: "",
    FirmaJefe: "",
    Prioridad: 0,
  });

  const [fechaSolicitada, setFechaSolicitada] = useState("");
  const [ConActivosFijosId, setConActivosFijosId] = useState(null);
  const [Solicitud_de_Servicio_id, setSolicitud_de_Servicio_id] =
    useState(null);

  const [imageSelected, setImageSelected] = useState([]);

  const Status = 1;
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
      .get(process.env.REACT_APP_API_URL+ `ConActivosFijos/`)
      .then((response) => {

        const formattedOptions = response.data.activosFijos.map((item) => ({
          value: item.activoFijoID,
          label: `${item.afClave} - ${item.afNombre} - ${item.afDescripcion}`,
          key: item.activoFijoID, // Adding key property

        }));
        setOptions(formattedOptions);
      })
      .catch((error) => {
        console.error("Error al cargar los datos", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL+ `Solicitud_de_servicio/`)
      .then((response) => {

        const formattedOptions = response.data
          .map((item) =>
            item.habilitado === true
              ? {
                  value: item.sS_Solicitud_de_servicio_id,
                  label: `${item.descripcionSolicitud_De_Servicio}`,
                  key: item.sS_Solicitud_de_servicio_id, // Adding key property

                }
              : null
          )
          .filter((option) => option !== null);
        setOptions2(formattedOptions);
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
  };

  const handleSelectChangeselectedSolicitudDeServicio = (selectedOption) => {
    setSolicitud_de_Servicio_id(selectedOption.value);
    
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const MAX_WIDTH = 3000;
          const MAX_HEIGHT = 3000;

          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio while resizing
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw the resized image on the canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas to Blob
          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            // Set the resized file to state
            setFile(resizedFile);
          }, file.type);
        };
      };

      reader.readAsDataURL(file);
    }

    if (file) {
      setImageSelected(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    SendFormLoading();
    e.preventDefault();

    const {
      servicioSolicitado,
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
    data.append("descripcion", Descripcion);
    data.append("estatus", Status);
    data.append("firmaEmpleado", FirmaEmpleado);
    data.append("firmaJefeDepartamento", FirmaJefeDepartamento);
    data.append("firmaJefe", FirmaJefe);
    data.append("empleadoID", empleadoID);
    data.append("prioridad", Prioridad);
    data.append("sS_Servicio_solicitado_Id", servicioSolicitado);
    data.append("revisadoSub", "");


    // Add file only if it exists
    if (file) {
      data.append("archivo", file); // Append the file to the form data
    }
    console.log("archivo",file);
    if (ConActivosFijosId) {
      data.append("conActivosFijosId", ConActivosFijosId);
    }

    if (Solicitud_de_Servicio_id) {
      data.append("sS_Solicitud_de_servicio_id", Solicitud_de_Servicio_id);
    }
    
    // Log FormData content (optional, since FormData can't be fully logged)
    for (let pair of data.entries()) {
     
    }

    // Send the form data as multipart/form-data
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL+ `Request/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      SendFormSucess();
      Navigate("/welcome");

      setFormData({
        servicioSolicitado: "",
        SolicitudDeServicioARealizar: "",
        Descripcion: "",
      });
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      SendtFormFailed();
      setMessage("Hubo un error al enviar el formulario.");
    }
  };

  const [FirstResponse, setFirstResponse] = useState([]);
  const [SecondResponse, setSecondResponse] = useState([]);
  const [ThirdResponse, setThirdResponse] = useState([]);

  const [loagding, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace the URL with your actual endpoint
        const response = await axios.get(
          process.env.REACT_APP_API_URL+ `ServicioSolicitado/`
        );

        setList(response.data); // The whole array from the server

        // setFirstResponse(list[0]);
        //  setSecondResponse(list[1]);
        //  setThirdResponse(list[2]);

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
    <Form onSubmit={handleSubmit}>
      <div >
      <Container fluid className="d-flex justify-content-center  vh-100 p-3">
      <Row className="w-100">
      <Col xs={12} md={8} lg={6} className="mx-auto">
      {message && <Alert variant="info">{message}</Alert>}
      <div  style={{fontSize:"24px"}}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>
          <br/>

            SOLICITUD DE SERVICIOS SUBDIRECCION DE INFRAESTRUCTURA Y TECNOLOGIAS
            DE LA INFORMACION
          </Form.Label>
          <br />
          <br />
          <Form.Label>Servicio Solicitado </Form.Label> <br></br>
          <div className="radio-group">

          {list.length > 0 ? (
            list.map(
              (item, index) =>
                item.habilitadoServicio_Solicitado && (
                  <Form.Check
                    inline
                    key={item.sS_Servicio_solicitado_Id}
                    label={item.descripcionServicio_Solicitado}
                    name="servicioSolicitado" // Ensure this matches the state key
                    type="radio"
                    className="custom-radio" // Apply the custom class here
                    value={item.sS_Servicio_solicitado_Id}
                    id={`inline-radio-${index + 1}`}
                    onChange={(e) => {
                      handleChange(e);

                      handleRadioChange(e);
                    }}
                  />
                )
            )
          ) : (
            <p></p>
          )}
          </div>
          {" "}
          <br></br>
          <Form.Label>Solicitud de servicio a realizar</Form.Label>
          {selectedService === "inline-radio-2" && (
            <>
              <option>Seleccione una opcion de servicio </option>
              <Select
                options={options2}
                placeholder="Seleccione una opcion de servicio"
                isSearchable={true} // Enables the search bar
                className="basic-single"
                classNamePrefix="select"
                onChange={handleSelectChangeselectedSolicitudDeServicio}
              />
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
            <Form.Label>
              Subir Imagen desde su dirrecion de archivos local
            </Form.Label>
            <Form.Control
              type="file"
              onChange={handlePhotoChange}
              accept="image/*"
              //capture="environment" // Use the phone's camera
            />
          </Form.Group>
          <div>
            {deviceType === "phone" && (
              // Use a ternary operator here
              <div className="image-upload-container">
                Tomar Foto
                <label htmlFor="file-input" className="image-upload-label">
                  <FaCamera className="camera-icon" size={24} />
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    capture="environment" // Opens camera on mobile devices
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            )}
          </div>
          <br></br>
          {file && (
            <div className="mt-3">
              <img
                src={imageSelected}
                alt="Uploaded"
                style={{ maxWidth: "500px", maxHeight: "500px" }}
              />
            </div>
          )}
          <br></br>
          <Button
            type="submit"
            variant="primary "
            style={{ backgroundColor: "#237469" }}
          >
            Enviar
          </Button>
        </Form.Group>
      </div>
      </Col>
      </Row>
      </Container>

      </div>
    </Form>
  );
}

export default TextControlsExample;
