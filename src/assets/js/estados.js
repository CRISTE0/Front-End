// Función para cambiar el estado del botón
function cambiarEstado(estado) {
  // Cambiar la clase y el texto del botón principal
  var toggleButton = document.getElementById("toggleButton");
  toggleButton.classList.remove("btn-success", "btn-warning", "btn-danger");
  toggleButton.classList.add(getColorClass(estado));
  toggleButton.innerText = estado;
}

// Función para obtener la clase de color correspondiente al estado
function getColorClass(estado) {
  switch (estado) {
    case "Finalizado":
      return "btn-success";
    case "Pendiente":
      return "btn-warning";
    case "Anulado":
      return "btn-danger";
    default:
      return "btn-secondary"; // Puedes establecer un color predeterminado si es necesario
  }
}

// Función para cambiar el estado del cliente
function cambiarEstadoCliente(estado) {
  // Cambiar la clase y el texto del botón de cliente
  var toggleClienteButton = document.getElementById("toggleClienteButton");
  toggleClienteButton.classList.remove("btn-success", "btn-danger");
  toggleClienteButton.classList.add(getColorClassCliente(estado));
  toggleClienteButton.innerText = estado;
}

function getColorClassCliente(estado) {
  switch (estado) {
    case "Finalizado":
      return "btn-success";
    case "Inactivo":
      return "btn-danger";
    default:
      return "btn-secondary"; // Puedes establecer un color predeterminado si es necesario
  }
}
