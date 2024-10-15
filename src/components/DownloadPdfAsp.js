import { Button } from "react-bootstrap";
import axios from 'axios';
import { useState } from "react";



function DownloadPdfAsp({ showRequest }) {
    
    const [isLoading, setIsLoading] = useState(false);

    console.log("showRequest",showRequest.id);


    const handleDownloadPdf = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://localhost:7145/api/request/download-pdf/${showRequest.id}`, { responseType: 'blob' });
            
            console.log("API response: ", response);
    
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
            <Button variant="primary" onClick={handleDownloadPdf}
                    style={{ backgroundColor: "#217ABF" }}

            >
                Descargar
            </Button>


        </div>
    );

}

export default DownloadPdfAsp;