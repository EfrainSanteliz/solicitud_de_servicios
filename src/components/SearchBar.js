import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { DateTime } from "luxon";

const SearchBar = ({
  setSearchTerm,
  setselectedDepartamento,
  selectedDepartamento,
  setSelectedStatus,
  setSelectPrioridad,
  setDateSystem,
  setRangeComparationDate,
}) => {
  const [term, setTerm] = useState("");
  const [selectOptions, setSelectedOption] = useState("Todo Departamento");
  const [options, setOptions] = useState([]);
  const [selectedStatusOption, setSelectedStatusOption] = useState("");
  const [selectedPrioridadOption, setSelectPrioridadOption] = useState("");
  const [DateRangeSelected, setDateRangeSelected] = useState("");

  const UserRole = localStorage.getItem("UserRole");

  useEffect(() => {
    const fechOptions = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7145/api/direccionesICESS`
        );

        const formattedOptions = response.data.map((item) => ({
          value: item.direccionICEESID,
          label: item.descripcion,
        }));
        setOptions([
          { value: "", label: "Todo Departamento" },
          ...formattedOptions,
        ]);
      } catch (error) {}
    };

    fechOptions();
  }, [setOptions]);


  const handleSearch = (e) => {
    setTerm(e.target.value);
    setSearchTerm(e.target.value);
  };

  const handleSelectDepartamento = (option) => {
    setSelectedOption(option);
    if (option.value === "") {
      setselectedDepartamento(option ? option.value : "");
    } else {
      setselectedDepartamento(option ? option.label : "");
    }
  };

  const handleSelectStatus = (event) => {
    const statusValue = event.target.value === "" ? "" : event.target.value;
    setSelectedStatus(statusValue);
    setSelectedStatusOption(statusValue);
  };

  const handleSelectPrioridad = (event) => {
    const prioridadValue = event.target.value === "" ? "" : event.target.value;
    setSelectPrioridad(prioridadValue);
    setSelectPrioridadOption(prioridadValue);
  };

  const handleSelectedDate = (event) => {
    const DateValue = event.target.value === "" ? "" : event.target.value;
    setRangeComparationDate(DateValue);
    setDateRangeSelected(DateValue);
  };

  const handleDeleteFilters = () => {
   
    if (UserRole=== "SuperAdministrador") {
      setselectedDepartamento("");
      setSelectedOption("Todo Departamento");
    }
 
    setSelectedStatus("");
    setSelectedStatusOption("");
    setSelectPrioridad("");
    setSelectPrioridadOption("");
    setRangeComparationDate("");
    setDateRangeSelected("");
    setTerm("");
    setSearchTerm("");

  }

  return (
    <div>
      <Form.Control
        type="text"
        value={term}
        onChange={handleSearch}
        placeholder="Buscar..."
      ></Form.Control>

      <>
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Filtros
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

          {UserRole === "SuperAdministrador" &&  (  
            <Select
            options={options}
            placeholder={selectOptions}
            isSearchable={true} // Enables the search bar
            className="basic-single"
            classNamePrefix="select"
            onChange={handleSelectDepartamento}
            value={selectOptions}
            styles={{
              control: (provided) => ({
                ...provided,
                width: "280px", // Adjust width for better fit
              }),
            }}
          />)}
        

          <select
            value={selectedStatusOption}
            className="form-select"
            onChange={handleSelectStatus}
            style={{ width: "200px" }} // Adjust width
          >
            <option value="">Todo Estatus</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Cancelado">Cancelado</option>
          </select>

          <select
            value={selectedPrioridadOption}
            className="form-select"
            onChange={handleSelectPrioridad}
            style={{ width: "200px" }} // Adjust width
          >
            <option value="">Toda Prioridad</option>
            <option value="sin asignar">sin asignar</option>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>

          <select
            value={DateRangeSelected}
            className="form-select"
            onChange={handleSelectedDate}
            style={{ width: "200px" }} // Adjust width
          >
            <option value="">Toda Fecha</option>
            <option value="Este año">Este Año</option>
            <option value="Este mes">Este mes</option>
            <option value="Esta semana">Esta semana</option>
            <option value="Este dia">Este dia</option>
          </select>

          <Button variant="" onClick={handleDeleteFilters}  style={{ width: "130px", backgroundColor: "#C5126D", color:"white" }}>Limpiar Filtros</Button>
        </div>
      </>
    </div>
  );
};

export default SearchBar;
