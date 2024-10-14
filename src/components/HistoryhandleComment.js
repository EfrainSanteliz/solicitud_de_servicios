import { useState } from "react";


function HistoryhandleComment ({handleChange}) {
    return (
        <Form onSubmit={handleSubmitComentarios}>
            <Form.Label>AGREGA LOS COMENTARIOS AQUI</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="comentarios"
              placeholder="agrega los comentarios aqui"
              onChange={handleChange}
              required
            />
            </Form>
    )
}

export default  HistoryhandleComment;