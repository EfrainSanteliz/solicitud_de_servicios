import { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import { Form, Button } from "react-bootstrap";
import { error } from "ajv/dist/vocabularies/applicator/dependencies";

function StoreUser() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
    getEmpleadosAndUsers();
  }, []);

  const getEmpleadosAndUsers = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `User/SS_ListEmpleadoAndUsers/`
      );
      console.log("usuarios obtenidos correctamente");

      setData(response.data.nomEmpleadosAndUsers);
      setFilteredData(response.data.nomEmpleadosAndUsers);

    } catch (error) {
      console.log("no se pudo", error);
    }
  };

  const handleSubmit = async (e, id, email) => {
    e.preventDefault();

    const data = {
      email: email,
    };

    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL + `User/${id}`,
        data
      );
      console.log("Email updated successfully", response);
    } catch (error) {
      console.log("Error updating email", error);
    }
  };

  const handleChange = (e, index) => {
    const newData = [...data];
    newData[index].email = e.target.value;
    setData(newData);
  };

  const handleStoreUser = async (e,empleadoID) => {
    e.preventDefault();

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL + `User/createUser/${empleadoID}`)

    } catch(error){
       console.log(error);
    }

    getEmpleadosAndUsers();

  };

  const [term, setTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Actualiza el término de búsqueda
  };

  useEffect(() => {
    const filtered = data.filter((item) =>
      `${item.nomEmpNombre} ${item.nomEmpPaterno} ${item.nomEmpMaterno} ${item.direccionesDescripcion}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  return (
    <div style={{ padding: "2%" }}>
      <Form>

      <Form.Control
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Buscar..."
      ></Form.Control>

        <Table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Departamento</th>
              <th>Email</th>
              <th>Acciones </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>
                  {item.nomEmpNombre} {item.nomEmpPaterno} {item.nomEmpMaterno}
                </td>
                <td>{item.direccionesDescripcion}</td>
                {item.email ? (
                  <>
                    <td>
                      <Form.Control
                        type="input"
                        name="email"
                        value={item.email} // Use value instead of defaultValue
                        onChange={(e) => handleChange(e, index)} // Pass the index to track the correct row
                      />
                    </td>
                    <td>
                      <Button
                        style={{ width: "140px" }}
                        onClick={(e) =>
                          handleSubmit(e, item.sS_UsuarioId, item.email)
                        }
                      >
                        Modificar
                      </Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td></td>
                    <td>
                      <Button variant="secondary" style={{ width: "140px" } } onClick={(e) => handleStoreUser(e,item.empleadoID)}>
                        {" "}
                        Agregar Usuario
                      </Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </Form>
    </div>
  );
}

export default StoreUser;
