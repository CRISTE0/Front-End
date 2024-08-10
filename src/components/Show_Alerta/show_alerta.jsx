import React from "react";
import "../../assets/css/style.css"; // Ajusta la ruta si es necesario
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const show_alerta = ({ message, type }) => {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    title: message,
    icon: type,
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true,
    toast: true, // Activa el modo "toast" para mostrar alertas pequeñas
    position: "top-end", // Posiciona la alerta en la esquina superior derecha
    customClass: {
      popup: "small-alert custom-popup-background", // Aplica ambas clases personalizadas
    },
    didOpen: () => {
      const progressBar = MySwal.getTimerProgressBar();
      if (progressBar) {
        progressBar.style.backgroundColor = "black";
        progressBar.style.height = "6px";
      }
    },
  });
};

export default show_alerta;
