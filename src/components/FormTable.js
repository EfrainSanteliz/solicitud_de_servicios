import axios from "axios";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

function FormTable({ options2, list, loagding }) {
  const [options, setOptions] = useState([]);
  //const [options2, setOptions2] = useState([]);

  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");

  // Obtener la fecha en formato año-mes-día y hora-minuto en GMT-7

  useEffect(() => {
    axios
      .get(`https://localhost:7145/api/ConActivosFijos/`)
      .then((response) => {
        //
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

  const handleRadioChange = (event) => {
    setSelectedService(event.target.id);
  };

  const [FirstResponse, setFirstResponse] = useState([]);
  const [SecondResponse, setSecondResponse] = useState([]);
  const [ThirdResponse, setThirdResponse] = useState([]);
  //const [list,setList] = useState([]);

  const [error, setError] = useState(null);

  if (loagding) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <Form>
      <div id="NuevaSolicitud">
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>
            SOLICITUD DE SERVICIOS SUBDIRECCION DE INFRAESTRUCTURA Y TECNOLOGIAS
            DE LA INFORMACION
          </Form.Label>
          <br />
          <br />
          <Form.Label>Servicio Solicitado </Form.Label> <br></br>
          {list.length > 0 ? (
            list.map(
              (item, index) =>
                item.habilitadoServicio_Solicitado && (
                  <Form.Check
                    inline
                    label={item.descripcionServicio_Solicitado}
                    name="servicioSolicitado" // Ensure this matches the state key
                    type="radio"
                    value={item.servicio_solicidato_Id}
                    id={`inline-radio-${index + 1}`}
                    key={item.servicio_solicidato_Id} // Add the key prop here
                    onChange={(e) => {
                      handleRadioChange(e);
                    }}
                  />
                )
            )
          ) : (
            <p></p>
          )}
          {/*<div className="mb-3">
              <Form.Check
                inline
               // label={FirstResponse.descripcionServicio_Solicitado}
                name="servicioSolicitado" // Ensure this matches the state key
                type="radio"
               // value={FirstResponse.servicio_solicidato_Id}
          
                id="inline-radio-1"
                onChange={(e) => {
                  handleRadioChange(e);
                }}
              />
              <Form.Check
                inline
                //label={SecondResponse.descripcionServicio_Solicitado}
                name="servicioSolicitado" // Ensure this matches the state key
                type="radio"
               // value={SecondResponse.servicio_solicidato_Id}
                //checked={formData.servicioSolicitado === "Sistema Tecnologico"}
                id="inline-radio-2"
                onChange={(e) => {
                  handleRadioChange(e);
                }}
              />
              <Form.Check
                inline
              //  label={ThirdResponse.descripcionServicio_Solicitado}
                name="servicioSolicitado" // Ensure this matches the state key
                type="radio"
                //value={ThirdResponse.servicio_solicidato_Id}
                //checked={formData.servicioSolicitado === "Proyecto Nuevo"}
                id="inline-radio-3"
                onChange={(e) => {
                  handleRadioChange(e);
                }}
              />
            </div>*/}
          <br></br>
          <Form.Label>Solicitud de servicio a realizar</Form.Label>
          {selectedService === "inline-radio-2" && (
            <>
              <option>Seleccione una opcion de servicio </option>
              <Select
                options={options2}
                placeholder="Selecciona el recurso que presenta problemas"
                isSearchable={true} // Enables the search bar
                className="basic-single"
                classNamePrefix="select"
                // onChange={handleSelectChangeselectedSolicitudDeServicio}
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
              accept="image/*"
              //capture="environment" // Use the phone's camera
            />
          </Form.Group>
        </Form.Group>
      </div>
    </Form>
  );
}
export default FormTable;
