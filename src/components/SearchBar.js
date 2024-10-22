import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";

const SearchBar = ({
  setSearchTerm,
  setselectedDepartamento,
  selectedDepartamento,
  setSelectedStatus,
  setSelectPrioridad,
}) => {
  const [term, setTerm] = useState("");
  const [selectOptions, setSelectedOption] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedStatusOption, setSelectedStatusOption] = useState("");
  const [selectedPrioridadOption, setSelectPrioridadOption] = useState("");
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
    const DateValue = event.target.value === "" ? "": event.target.value;
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
        <div style={{ display: "flex" }}>
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
                width: "300px",
                marginRight: "10px",
              }),
            }}
          />

          <select
            value={selectedStatusOption}
            className="form-select mt-2"
            onChange={handleSelectStatus}
          >
            <option value="">Todo Estatus</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Cancelado">Cancelado</option>
          </select>

          <select
            value={selectedPrioridadOption}
            className="form-select mt-2"
            onChange={handleSelectPrioridad}
          >
            <option value="">Toda Prioridad</option>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>

          <select
            value={}
            className="form-select mt-2"
            onChange={handleSelectedDate}
          >
            <option value="">Toda Fecha</option>
            <option value="Este año"> </option>
            <option value="Este mes"> </option>
            <option value="Esta semana"> </option>
            <option></option>

          </select>
        </div>
      </>
    </div>
  );
};

export default SearchBar;
