import { Button } from "react-bootstrap";
import axios from 'axios';
import { useState } from "react";



function DownloadPdfAsp({ showRequest }) {
    
    const [isLoading, setIsLoading] = useState(false);



    const handleDownloadPdf = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get( process.env.REACT_APP_API_URL+`request/download-pdf/${showRequest.sS_SolicitudId}`, { responseType: 'blob' });
            
    
            if (response && response.data) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'solicitud_' + showRequest.id + '.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                console.error('No data in the API response');
            }
        } catch (e) {
            console.error('Error downloading the PDF:', e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Button variant="" onClick={handleDownloadPdf}
                    style={{ backgroundColor: "#C5126D" ,color:"white" }}

            >
                Descargar
            </Button>


        </div>
    );

}

export default DownloadPdfAsp;