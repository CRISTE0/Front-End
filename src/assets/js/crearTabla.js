function crearTabla() {
  // Datos de ejemplo (puedes sustituirlos con tus propios datos)
  var datos = { imagen:"../img/camisetas/camisa2.png",nombre: "Camiseta AmongUs", precio: 30000 };

  // Obtener la tabla existente o crear una nueva
  var tablaDiv = document.getElementById("tablaDiv");
  var tabla = tablaDiv.querySelector("table");
  
  if (!tabla) {
    tabla = document.createElement("table");
    tabla.innerHTML = "<tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Acciones</th></tr>";
    tablaDiv.appendChild(tabla);
  }

  // Crear una nueva fila y su estructura HTML
  var nuevaFila = document.createElement("tr");
  nuevaFila.innerHTML = "<td><img src='" + datos.imagen + "' alt='Imagen del producto' class='imagen-producto'></td><td>" + datos.nombre + "</td><td>" + datos.precio + "</td><td><button class='eliminar-btn' onclick='eliminarFila(this)'>Eliminar</button></td>";


  // Agregar la nueva fila a la tabla
  tabla.appendChild(nuevaFila);
}

function eliminarFila(btn) {
  // Obtener la fila a eliminar
  var fila = btn.parentNode.parentNode;
  
  // Obtener la tabla
  var tabla = fila.parentNode;

  // Eliminar la fila de la tabla
  tabla.removeChild(fila);
}