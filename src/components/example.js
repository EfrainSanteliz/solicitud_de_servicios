// RequestTable.js
import { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, Alert, Table } from "react-bootstrap";
import SearchBar from "./SearchBar"; // Import the SearchBar component

function RequestTable() {
  /*
  const [requests, setRequests] = useState([]); // Holds all requests
  const [filteredData, setFilteredData] = useState([]); // Holds filtered data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [options, setOptions] = useState([]); // Options for departments
  const [selectedDepartamento, setselectedDepartamento] = useState(""); // Selected department

  useEffect(() => {
    // Fetch the requests on component mount
    UpdateTableRequest();
  }, []);

  const UpdateTableRequest = () => {
    axios
      .get(`https://localhost:7145/api/Request/`)
      .then((response) => {
        setRequests(response.data); // SuperAdmin sees all requests
        setFilteredData(response.data); // Initially set filtered data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
        setError("El servidor no puede obtener las solicitudes");
        setLoading(false);
      });
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`https://localhost:7145/api/direccionesICESS`);
        const formattedOptions = response.data.map((item) => ({
          value: item.direccionICEESID,
          label: item.descripcion,
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching department options:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    // Filter data based on search term and selected department
    const filtered = requests.filter((item) => {
      const matchesSearch =
        item.firmaEmpleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.servicioSolicitado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fechaSolicitada.toString().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.prioridad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.usuarios.nomEmpleados.direccionesICEES.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartamento = selectedDepartamento === '' || item.usuarios.nomEmpleados.direccionesICEES.descripcion === selectedDepartamento;

      return matchesSearch && matchesDepartamento;
    });
    setFilteredData(filtered);
  }, [searchTerm, requests, selectedDepartamento]); // Runs when searchTerm, requests, or selectedDepartamento changes

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="container mt-4">
      <SearchBar setSearchTerm={setSearchTerm} options={options} setselectedDepartamento={setselectedDepartamento} />
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Firma Empleado</th>
            <th>Descripción</th>
            <th>Servicio Solicitado</th>
            <th>Fecha Solicitada</th>
            <th>Status</th>
            <th>Prioridad</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.firmaEmpleado}</td>
              <td>{request.descripcion}</td>
              <td>{request.servicioSolicitado}</td>
              <td>{request.fechaSolicitada}</td>
              <td>{request.status}</td>
              <td>{request.prioridad}</td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan="7">No requests found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
  */
}

export default RequestTable;