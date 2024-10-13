import { Button } from "react-bootstrap";
import axios from 'axios';
import { useState } from "react";



function DownloadPdfAsp({ showRequest }) {
    
    const [isLoading, setIsLoading] = useState(false);


    const handleDownloadPdf = async () => {
        setIsLoading(true); // Activa el indicador de carga
        try {
            const response = await axios.get(`https://localhost:7145/api/request/download-pdf/${showRequest.id}`, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/pdf' });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'solicitud_' + showRequest.id + '.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false); // Desactiva el indicador de carga
        }
      };

    return (
        <div>
            <Button variant="primary" onClick={handleDownloadPdf}
                    style={{ backgroundColor: "#217ABF" }}

            >
                Descargar
            </Button>


        </div>
    );

}

export default DownloadPdfAsp;