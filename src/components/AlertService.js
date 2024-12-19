import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const showLoadingAlertAutorizar = () => {
  MySwal.fire({
    title: "Autorizando...",
    text: "Espera Mientras se Autoriza el documento",
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

export const showMessageDontDrop = (errorMessage) => {
  MySwal.fire({
    title: "Error!",
    text: errorMessage,
    icon: "error",
    confirmButtonText: "No puedes Eliminar",
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

export const FormularioYaFirmado = () => {

  MySwal.fire({
      title: "Error!",
      text: "Formulario Ya Firmado.",
      icon: "error",
      confirmButtonText: "ok",
    });

};

export const longitudPasswordError = () => {
  MySwal.fire({
    title: "Error!",
    text: "La contraseña tiene que ser mayor o igual a 8 digitos.",
    icon: "error",
    confirmButtonText: "ok",
  });
};

export const PasswordIsNotTheSame = () => {
  MySwal.fire({
    title: "Error!",
    text: "Las contraseñas no coinciden.",
    icon: "error",
    confirmButtonText: "ok",
  });
};

export const codeOfVerificationIsNotTheSame = () => {
  MySwal.fire({
    title: "Error!",
    text: "El código de verificacion no coincide.",
    icon: "error",
    confirmButtonText: "ok",
  });
};

export const EstablescaPrioridad = () => {
  MySwal.fire({
    title: "Error!",
    text: "Establesca un nivel de prioridad antes de firmar.",
    icon: "error",
    confirmButtonText: "ok",
  });
};

export const PasswordErrorPattern = () => {
  MySwal.fire({
    title:"Error!",
    text: "La contraseña debe tener al menos 2 números y 2 letras",
    icon: "error",
    confirmButtonText:"ok",

  })
}

export const Error = () => {
  MySwal.fire({
    title:"Error!",
    text: "Correo no valido",
    icon: "error",
    confirmButtonText:"ok",

  })
}