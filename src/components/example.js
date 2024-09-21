import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import Select from 'react-select';
import { DateTime } from 'luxon';

function TextControlsExample() {
  const [options, setOptions] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    servicioSolicitado: '',
    fechaSolicitada: '',
    SolicitudDeServicioARealizar: '',
    Descripcion: '',
    Status: '',
    Comentarios: "",
    FirmaEmpleado: "",
    FirmaJefeDepartamento: "",
    FirmaJefe: "",
    File: "",
    NomEmpleadosId: localStorage.getItem("userid"),
    ConActivosFijosId: "", // Asegúrate de que el valor esté vacío al principio
  });

  // Obtener los datos del servidor para el select
  useEffect(() => {
    axios
      .get(`https://localhost:7145/api/ConActivosFijos/`)
      .then((response) => {
        console.log("get successful", response.data);

        const formattedOptions = response.data.map((item) => ({
          value: item.activoFijoID, // ID de la fila
          label: `${item.afClave} - ${item.afNombre} - ${item.afDescripcion}`, // Texto que se mostrará en el select
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          file: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({
      ...formData,
      ConActivosFijosId: selectedOption.value, // Almacenar el ID seleccionado
    });
    console.log("id de inventario seleccionado " , selectedOption.value);

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://localhost:7145/api/Request/",
        formData,
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
    <Container className="mt-5">
      <h2>Captura de Información del Usuario</h2>
      <Form onSubmit={handleSubmit}>
        {message && <div>{message}</div>}

        <Form.Group className="mb-3">
          <Form.Label>Servicio Solicitado</Form.Label>
          <Form.Control
            type="text"
            name="servicioSolicitado"
            value={formData.servicioSolicitado}
            onChange={handleChange}
            placeholder="Ingresa el servicio solicitado"
          />
        </Form.Group>

        {/* react-select para seleccionar de la lista */}
        <Form.Group className="mb-3">
          <Form.Label>Selecciona el recurso que presenta problemas</Form.Label>
          <Select
            options={options} // Las opciones cargadas del servidor
            placeholder="Selecciona un recurso"
            isSearchable={true} // Habilita la búsqueda
            className="basic-single"
            classNamePrefix="select"
            onChange={handleSelectChange} // Actualiza el estado cuando se selecciona una opción
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción Detallada del Servicio</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="Descripcion"
            value={formData.Descripcion}
            onChange={handleChange}
            placeholder="Describe el problema"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subir una imagen (opcional)</Form.Label>
          <Form.Control
            type="file"
            name="file"
            onChange={handlePhotoChange}
            accept="image/*"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Enviar
        </Button>
      </Form>
    </Container>
  );
}

export default TextControlsExample;