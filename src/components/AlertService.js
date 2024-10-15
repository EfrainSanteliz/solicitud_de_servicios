import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const showLoadingAlertAutorizar = () => {
  MySwal.fire({
    title: "Autorizando...",
    text: "Espera Mientras se Autoriza el docummento",
    icon: "info",
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const showSueccesAlertAutorizar = () => {
    MySwal.fire({
        title: "Exito!",
        text: "Autorizada con exito.",
        icon: "success",
        confirmButtonText: "OK",
      });
};

export const showErrorAlerAutorizar = () => {
    MySwal.fire({
        title: "Error!",
        text: "Error Mientras se Autorizo.",
        icon: "error",
        confirmButtonText: "Intenta de Nuevo",
      });
};

export const SendFormSucess = () => {
    MySwal.fire({
        title: "Exito!",
        text: "Formulario Enviado Con Exito.",
        icon: "success",
        confirmButtonText: "OK",
      });
};

export const SendFormLoading = () => {
    MySwal.fire({
        title: "Enviando...",
        text: "Espera Mientras Se Envia El Formulario",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
};

export const SendtFormFailed = () => {

    MySwal.fire({
        title: "Error!",
        text: "Error Mientras Se Envia El Formulario.",
        icon: "error",
        confirmButtonText: "Intenta de Nuevo",
      });

};