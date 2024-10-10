import React, { useState } from "react";
import { Form } from "react-bootstrap";

const SearchBar = ({ setSearchTerm }) => {
  const [term, setTerm] = useState("");

  const handleSearch = (e) => {
    setTerm(e.target.value);
    setSearchTerm(e.target.value);
  };

  return (
    <div>
    <Form.Control
    type="text"
    value={term}
    onChange={handleSearch}
    placeholder="Buscar..."
    >

    </Form.Control>
     

   </div>
  );
};

export default SearchBar;