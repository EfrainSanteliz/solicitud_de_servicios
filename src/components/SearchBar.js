import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";

const SearchBar = ({ setSearchTerm, options }) => {
  const [term, setTerm] = useState("");
  const [selectOptions,setSelectedOption] = useState(null);


  const handleSearch = (e) => {
    setTerm(e.target.value);
    setSearchTerm(e.target.value);
  };

  const handleSelectChange = (option) => {
    console.log("Selected option:", option); // Debugging
    setSelectedOption(option);
    setSearchTerm(option ? option.value : ""); // Update search term based on selection
  };




  return (
    <div>
      <Form.Control
        type="text"
        value={term}
        onChange={handleSearch}
        placeholder="Buscar..."
      ></Form.Control>

      <>
        <option>Departamento </option>
        <Select
          options={options}
          placeholder="Filtrar por departamento"
          isSearchable={true} // Enables the search bar
          className="basic-single"
          classNamePrefix="select"
          onChange={handleSelectChange}
          value={selectOptions}
        />
      </>
    </div>
  );
};

export default SearchBar;
