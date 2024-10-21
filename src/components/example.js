import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InteractiveTable = () => {
  const [data, setData] = useState([]);
  const [newRow, setNewRow] = useState({ name: '', email: '' });
  const [modifiedData, setModifiedData] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Handle value changes for editing the table
  const handleEdit = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);

    // Track modified rows
    if (!modifiedData.includes(updatedData[index])) {
      setModifiedData([...modifiedData, updatedData[index]]);
    }
  };

  // Handle new row input (always the last row)
  const handleNewRowChange = (field, value) => {
    setNewRow({ ...newRow, [field]: value });
  };

  // Save all changes (existing rows and new row if filled)
  const handleSaveChanges = () => {
    // Update modified rows
    modifiedData.forEach(row => {
      axios.put(`http://localhost:5000/api/users/${row.id}`, row)
        .then(response => {
          console.log('Data updated successfully:', response.data);
        })
        .catch(error => {
          console.error('Error updating data:', error);
        });
    });

    // Add the new row if both fields are filled
    if (newRow.name && newRow.email) {
      axios.post('http://localhost:5000/api/users', newRow)
        .then(response => {
          setData([...data, response.data]);
          setNewRow({ name: '', email: '' });  // Clear the new row
        })
        .catch(error => {
          console.error('Error adding new row:', error);
        });
    }

    // Clear modified data tracking
    setModifiedData([]);
  };

  return (
    <div>
      <h1>Interactive Table (Excel-like)</h1>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id}>
              <td>
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => handleEdit(index, 'name', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="email"
                  value={row.email}
                  onChange={(e) => handleEdit(index, 'email', e.target.value)}
                />
              </td>
            </tr>
          ))}
          {/* Always an empty row for adding new entries */}
          <tr>
            <td>
              <input
                type="text"
                placeholder="Enter name"
                value={newRow.name}
                onChange={(e) => handleNewRowChange('name', e.target.value)}
              />
            </td>
            <td>
              <input
                type="email"
                placeholder="Enter email"
                value={newRow.email}
                onChange={(e) => handleNewRowChange('email', e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Save changes button */}
      <button onClick={handleSaveChanges}>Save Changes</button>
    </div>
  );
};

export default InteractiveTable;