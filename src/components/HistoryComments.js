import React from 'react';
import { Table } from 'react-bootstrap';

function HistoryComments({ Historials }) {

    return (
        <div>
        <Table border="1">
          <thead>
            <tr>
              <th >Fecha</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            {
              Historials.map((historial) => (
                <tr key={historial.historialID}>
                  <td >{new Date(historial.fecha).toLocaleString()}</td>
                  <td>{historial.comentarios}</td>
                </tr>
              ))
           }
          </tbody>
        </Table>
      </div>
    );
}

export default HistoryComments;