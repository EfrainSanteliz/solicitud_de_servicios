import { Button } from "react-bootstrap";
import jsPDF from "jspdf";


function DownloadPdf({showRequest}) {
  /*
  const handleDowloadPdf = async () => {
    try {
      console.log("requestId", showRequest.id);

      const descripcion2 =
        showRequest.nomEmpleados.direccionesICEES.descripcion;
      const fechaSolicitada = new Date(
        showRequest.fechaSolicitada
      ).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const {
        servicioSolicitado,
        solicitudDeServicioARealizar,
        descripcion,
        firmaEmpleado,
        firmaJefeDepartamento,
        firmaJefe,
        file,
      } = showRequest;

      const doc = new jsPDF();

      // Add content to the PDF
      doc.setFont("bold"); // Use helvetica bold instead
      doc.setFontSize(14);
      doc.text(
        "SOLICITUD DE SERVICIOS SUBDIRECCION DE INFRAESTRUCTURA ",
        20,
        20
      );
      doc.text(" Y TECNOLOGIAS DE LA INFORMACION", 50, 30);

      doc.setFontSize(12);
      doc.setFontSize(12);
      // Add the specific data from the response
      doc.text(`Servicio solicitado: ${servicioSolicitado}`, 20, 40);
      doc.text(`Fecha: ${fechaSolicitada}`, 20, 50);

      if (solicitudDeServicioARealizar !== "0") {
        doc.text(
          `Solicitud de servicio a realizar: ${solicitudDeServicioARealizar}`,
          20,
          60
        );
      }

      if (solicitudDeServicioARealizar === "0") {
        doc.text(
          `recurso que presenta el problema: ${showRequest.conActivosFijos.afClave +
            " " +
            showRequest.conActivosFijos.afDescripcion}`,
          20,
          60
        );
      }
      
      doc.text(`Area Administrativa requirente: ${descripcion2}`, 20, 70);
      doc.text(`Solicitante: ${firmaEmpleado}`, 20, 80);
      const descriptionLines = doc.splitTextToSize(descripcion,170); 
      doc.text('Descripcion:',20,90)
      doc.text(descriptionLines, 20, 95); 
      
      if (file) {
        const baseURL = "https://localhost:7145"; 
        const fullImageUrl = `${baseURL}${file}`;

        const img = new Image();
        img.src = fullImageUrl;

        await new Promise((resolve, reject) => {
          img.onload = function () {
            // Add the image to the PDF
            doc.addImage(img, "JPEG", 20, 130, 120, 120); 
            resolve();
          };

          img.onerror = function (err) {
            console.error("Failed to load image:", err, fullImageUrl);
            reject(err); // Reject the promise on error
          };
        });
      } else {
        doc.text("No image provided", 20, 100);
      }

      doc.setFontSize(10);

      doc.text(`solicitante:`, 20, 260);
      doc.text(`${firmaEmpleado}`, 20, 280);
      doc.text(`Aurizo `, 80, 260);
      doc.text(`Unidad adm solicitante`, 80, 270);
      doc.text(`${firmaJefeDepartamento}`, 80, 280);
      doc.text(`Acepta insfreastructura y`, 140, 260);
      doc.text(`Tecnologia de la Informacion`, 140, 270);
      doc.text(`${firmaJefe}`, 140, 280);

      // Save the PDF after the image has loaded
      doc.save(`Solicitud ${showRequest.nomEmpleados.nomEmpClave}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div>
      <Button
        variant=""
        onClick={(e) => {
          handleDowloadPdf(e);
        }}
        style={{ backgroundColor: "#C5126D", color:"white" }}
      >
        Descargar
      </Button>
    </div>
  );

  */
}


export default DownloadPdf;
