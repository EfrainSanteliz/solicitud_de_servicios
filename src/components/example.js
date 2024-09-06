import React, { useState } from "react";
import {
  ButtonGroup,
  ToggleButton,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import "./styles.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const NuevaSolicitud = () => {
  // State to keep track of the selected radio button
  const [selectedOption, setSelectedOption] = useState("1");

  // Define the radio options
  const options = [
    { name: "Infraestructura    ", value: "1" },
    { name: "Sistema Tecnologico", value: "2" },
    { name: "Proyecto Nuevo", value: "3" },
  ];

  const [selectedDate,setSelectedDate]= useState(null);


  return (
    <Container className="my-3">
      <div className="Titulo">
        SOLICITUD DE SERVICIO SUBDIRECCION DE INFRAESTRUCTURA Y TECNOLOGIAS DE
        LA INFORMACION
      </div>
      <Row
        className="justify-content-center align-items-flex-start"
        style={{ marginTop: "-10px" }}
      >
        Servicio Solicitado
        {options.map((option, idx) => (
          <Col
            key={idx}
            xs="auto"
            className="d-flex flex-column align-items-center"
          >
            <ToggleButton
              id={`radio-${idx}`}
              type="radio"
              variant={
                selectedOption === option.value
                  ? "primary"
                  : "outline-secondary"
              }
              name="radio"
              value={option.value}
              checked={selectedOption === option.value}
              onChange={(e) => setSelectedOption(e.currentTarget.value)}
              className="rounded-circle"
              style={{
                width: "20px", // Reduced width for the button
                height: "20px",
                padding: "5px",
                borderRadius: "50%",
                marginBottom: "5px", // Margin between button and text
              }}
            />
            <span
              style={{
                textAlign: "center",
                fontSize: "14px", // Font size of the text
                color:
                  selectedOption === option.value ? "primary" : "secondary",
              }}
            >
              {option.name}
            </span>
          </Col>
        ))}
      </Row>
      <Row className="justify-content-start">
        {/* Label for date picker */}
        <Col xs="auto">
          <label htmlFor="fecha-solicitud">Fecha de Solicitud:</label>
        </Col>
        {/* Date picker component */}
        <Col xs="auto">
          <DatePicker
            id="fecha-solicitud"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
        </Col>
      </Row>

      
    </Container>
  );
};

export default NuevaSolicitud;
