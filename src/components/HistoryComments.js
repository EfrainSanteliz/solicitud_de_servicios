import React from 'react';
import { Form, Table } from 'react-bootstrap';

function HistoryComments({ Historials }) {


  return (
    <div>
        {Historials.length === 0 ? (
        <p>Aún no tienes comentarios </p>
      ) : (
      <Form onSubmit={''}>
        <Table border="1">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Observacion</th>
            </tr>
          </thead>
          <tbody>
            {
              Historials.map((historial) => (
                <tr key={historial.historialID}>
                  <td>
                    {new Date(historial.fecha).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td>{historial.comentarios}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>



      </Form>
      )}
    </div>
  );
}

export default HistoryComments;