import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import show_alerta from "../../components/Show_Alerta/show_alerta";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  editImageComprobante,
  subirImageComprobante,
} from "../../firebase/config";
import { useAuth } from "../../context/AuthProvider";
import { AdminFooter } from "../../components/Admin/AdminFooter";
import Loader from "../../components/Loader/loader";

export const Ventas = () => {
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos";
  const [ventas, setPedidos] = useState([]);
  const [pedidosCliente, setPedidosCliente] = useState([]);
  const [IdPedido, setIdPedido] = useState("");
  const [Clientes, setClientes] = useState([]);
  const [IdCliente, setIdCliente] = useState("");
  const [TipoPago, setTipoPago] = useState("");
  const [Fecha, setFecha] = useState("");
  const [Total, setTotal] = useState("");
  const [IdPedidoActualizar, setIdPedidoActualizar] = useState("");
  const [idEstadoPedidoActualizar, setIdEstdosPedidoActualizar] = useState("");
  let idPedidoActualizarEstado;
  let idEstadoPedidoActualizarEstado;
  const [imagenComprobante, setImagenComprobante] = useState("");
  const [imagenComprobantePrevisualizar, setImagenComprobantePrevisualizar] =
    useState("");
  const { auth } = useAuth();
  const [showComprobanteButton, setShowComprobanteButton] = useState(null);
  const [estadosPedidos, setEstadosPedidos] = useState([]);
  const [nuevosEstadosPedidos, setNuevosEstadosPedidos] = useState([]);
  const [Detalles, setDetalles] = useState([]);
  const [Productos, setProductos] = useState([]);
  const [showDetalleField, setShowDetalleField] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [fechaFinalDisabled, setFechaFinalDisabled] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPedidos();
    getEstadosPedidos();
    getProductos();
    getClientes();
    // getPedidosCliente();
  }, []);

  const handleFechaInicioChange = (e) => {
    const selectedFechaInicio = e.target.value;
    setFechaInicio(selectedFechaInicio);
    // Habilitar fecha final si se ha seleccionado una fecha de inicio
    setIsFechaFinalDisabled(!selectedFechaInicio);
    // Limpiar la fecha final si la fecha de inicio se borra
    if (!selectedFechaInicio) {
      setFechaFinal("");
    }
  };

  const handleFechaFinalChange = (e) => {
    setFechaFinal(e.target.value);
  };

  const handleGenerateReport = () => {
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFinal = document.getElementById("fechaFinal").value;

    if (!fechaInicio || !fechaFinal) {
      show_alerta({
        message: "Por favor, seleccione ambas fechas.",
        type: "error",
      });
      return;
    }

    // Convertir fechas a objetos Date
    const inicio = new Date(fechaInicio);
    const final = new Date(fechaFinal);

    // Filtrar las compras en el rango de fechas seleccionado
    const pedidosFiltradas = ventas.filter((pedido) => {
      const fechaPedido = new Date(pedido.Fecha);
      return fechaPedido >= inicio && fechaPedido <= final;
    });

    if (pedidosFiltradas.length === 0) {
      show_alerta({
        message:
          "No se encontraron compras en el rango de fechas seleccionado.",
        type: "error",
      });
      return;
    }

    // Generar el PDF con las compras filtradas
    generatePDF(pedidosFiltradas);

    // Restablecer el estado del campo de fecha final
    setFechaFinal(""); // Limpia el valor del campo fechaFinal
    setFechaInicio(""); // Limpia el valor del campo fechaInicio
    setFechaFinalDisabled(true); // Establece el estado disabled de fechaFinal a true

    // Cerrar el modal después de generar el reporte
    $("#modalGenerarReporte").modal("hide");
  };

  const generatePDF = async (productosFiltrados) => {
    const doc = new jsPDF();

    // Función para convertir una imagen URL a base64
    const toBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          if (xhr.status === 200) {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(xhr.response);
          } else {
            reject(new Error(`Error al cargar la imagen: ${xhr.status}`));
          }
        };
        xhr.onerror = () =>
          reject(new Error("Error de red al cargar la imagen"));
        xhr.responseType = "blob";
        xhr.open("GET", url);
        xhr.send();
      });
    };

    try {
      // URL de la imagen (usa ruta absoluta o ruta relativa si es necesario)
      const imgUrl = "../../../src/assets/img/imagenesHome/logoSoftShirt.png"; // Cambia esto según tu ruta

      // Convertir la imagen a base64
      const imgData = await toBase64(imgUrl);

      // Configurar el título del PDF
      const addHeader = () => {
        doc.addImage(imgData, "PNG", 170, 15, 30, 30); // Ajusta las coordenadas y el tamaño según sea necesario
        doc.setFontSize(18);
        doc.setTextColor("#1cc88a"); // Color verde para el título
        doc.text("Reporte de Ventas", 14, 22);
      };

      // Agregar el encabezado en la primera página
      addHeader();

      // Inicializar la posición Y para la tabla principal
      let startY = 30;

      // Iterar sobre cada producto
      productosFiltrados.forEach((producto, index) => {
        // Calcular la altura necesaria para la tabla de detalles
        const rowHeight = 10; // Estimación de la altura de cada fila
        const tableHeight =
          producto.DetallesPedidosProductos.length * rowHeight;

        // Verificar si hay espacio suficiente en la página actual
        const pageHeight = doc.internal.pageSize.height;
        const remainingSpace = pageHeight - startY - 20; // Espacio restante en la página

        if (remainingSpace < tableHeight + 30) {
          // Si no hay suficiente espacio, crear una nueva página
          doc.addPage();
          startY = 20; // Resetear la posición Y en la nueva página
          // Agregar el encabezado solo en la primera página
          if (index === 0) {
            addHeader(); // Agregar el encabezado en la primera página
          }
        }

        // Agregar título del producto
        doc.setFontSize(14);
        doc.setTextColor("#1cc88a"); // Color verde para el título del producto
        doc.text(`Venta ${index + 1}`, 14, startY);

        // Incrementar la posición Y
        startY += 10;

        // Agregar la información principal del producto
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Volver al color negro para el resto del texto
        doc.text(`Cliente: ${producto.Cliente.NombreApellido}`, 14, startY);
        doc.text(`Método de Pago: ${producto.TipoPago}`, 14, startY + 5);
        doc.text(`Fecha: ${producto.Fecha}`, 14, startY + 10);
        doc.text(`Total: ${formatPrice(producto.Total)}`, 14, startY + 15);
        doc.text(`Estado: Finalizado`, 14, startY + 20); // Estado fijo a "Finalizado"

        // Verificar si el método de pago es "Transferencia"
        if (
          producto.TipoPago === "Transferencia" &&
          producto.ImagenComprobante
        ) {
          // Agregar título "Comprobante de Pago"
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0); // Color negro para el título del comprobante
          doc.text(`Comprobante de Pago:`, 14, startY + 25);

          // Calcular la posición X para "Ver Comprobante"
          const comprobanteX =
            14 + doc.getTextWidth("Comprobante de Pago: ") + 2; // Añadir 2 unidades de espacio después del texto

          // Cambiar el color del texto a verde para el enlace
          doc.setTextColor("#1cc88a"); // Color verde para el enlace

          // Agregar el enlace "Ver Comprobante" al lado de "Comprobante de Pago:"
          doc.textWithLink("Ver Comprobante", comprobanteX, startY + 25, {
            url: producto.ImagenComprobante,
          });

          // Agregar evento de clic para abrir en una nueva pestaña
          doc.link(comprobanteX, startY + 25, 40, 10, {
            url: producto.ImagenComprobante,
            target: "_blank",
          });
        }

        // Incrementar la posición Y para los detalles
        startY += 35;

        // Configurar las columnas y filas de la tabla de detalles
        const detailColumns = ["Producto", "Cantidad", "Precio", "Subtotal"];

        // Mapear las filas con el precio real
        const detailRows = producto.DetallesPedidosProductos.map((detalle) => [
          detalle.Producto.Referencia, // Utilizar la referencia del producto
          detalle.Cantidad,
          formatPrice(detalle.Precio),
          formatPrice(detalle.SubTotal),
        ]);

        // Generar la tabla de detalles en el PDF
        doc.autoTable({
          head: [detailColumns],
          body: detailRows,
          startY: startY,
          headStyles: {
            fillColor: "#1cc88a", // Color de fondo del encabezado de la tabla
            textColor: "#ffffff", // Color del texto del encabezado de la tabla
          },
          styles: {
            fontSize: 10, // Tamaño de fuente en la tabla
          },
        });

        // Incrementar la posición Y después de la tabla
        startY = doc.lastAutoTable.finalY + 10;

        // Dibujar una línea horizontal después de cada producto
        doc.setLineWidth(0.5);
        doc.setDrawColor("#1cc88a"); // Color verde para la línea
        doc.line(14, startY, 200, startY); // Ajusta las coordenadas según sea necesario
        startY += 10;
      });

      // Calcular la posición para el texto de copyright
      const pageHeight = doc.internal.pageSize.height;
      const footerText = "© Soft-Shirt 2024";
      const textWidth =
        (doc.getStringUnitWidth(footerText) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const footerX = (doc.internal.pageSize.width - textWidth) / 2; // Centrar el texto horizontalmente
      const footerY = pageHeight - 10; // Ajusta la posición vertical según sea necesario

      // Agregar el texto de copyright en la última página
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0); // Color negro para el texto de copyright
      doc.text(footerText, footerX, footerY);

      // Descargar el PDF
      doc.save("Reporte_Ventas_Soft-Shirt.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  // Función para formatear precios
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const getPedidos = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const respuesta = await axios.get(url);
      const pedidosOrdenados = respuesta.data.sort((a, b) => {
        // Ordenar por fecha de forma descendente (de la más reciente a la más antigua)
        return new Date(b.Fecha) - new Date(a.Fecha);
      });

      const ventas = respuesta.data.filter(
        (venta) => venta.IdEstadoPedido == 3
      );

      setPedidos(ventas, pedidosOrdenados);
    } catch (error) {
      show_alerta("Error al obtener los pedidos", "error");
    } finally {
      setLoading(false); // Mostrar el loader antes de realizar la solicitud
    }
  };

  const getClienteName = (idCliente) => {
    const cliente = Clientes.find((prov) => prov.IdCliente === idCliente);
    return cliente ? cliente.NombreApellido : "Cliente no encontrado";
  };

  const getProductoName = (idProducto) => {
    const producto = Productos.find((item) => item.IdProducto === idProducto);
    return producto ? producto.Referencia : "Producto no encontrado";
  };

  const convertEstadoPedidoIdToName = (estadoPedidoId) => {
    const estadoPedido = estadosPedidos.find(
      (pedido) => pedido.IdEstadoPedido === estadoPedidoId
    );
    return estadoPedido ? estadoPedido.NombreEstado : "";
  };

  const getClientes = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const respuesta = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/clientes");
      const clientesActivos = respuesta.data.filter(
        (cliente) => cliente.Estado === "Activo"
      );
      setClientes(clientesActivos);
    } catch (error) {
      show_alerta({
        message: "Error al obtener los clientes",
        type: "error",
      });
    } finally {
      setLoading(false); // Mostrar el loader antes de realizar la solicitud
    }
  };

  const getProductos = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const respuesta = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/productos");
      const productosActivos = respuesta.data.filter(
        (producto) => producto.Estado === "Activo"
      );
      setProductos(productosActivos);
    } catch (error) {
      show_alerta({
        message: "Error al obtener los productos",
        type: "error",
      });
    } finally {
      setLoading(false); // Mostrar el loader antes de realizar la solicitud
    }
  };

  const getEstadosPedidos = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const respuesta = await axios.get(
        "https://softshirt-1c3fad7d72e8.herokuapp.com/api/estadosPedidos"
      );

      setEstadosPedidos(respuesta.data);
    } catch (error) {
      show_alerta({
        message: "Error al obtener los estados de pedidos",
        type: "error",
      });
    } finally {
      setLoading(false); // Mostrar el loader antes de realizar la solicitud
    }
  };

  // Calcular el precio total de la compra en función de los detalles
  const totalCompra =
    Detalles && Detalles.length > 0
      ? Detalles.reduce((total, detalle) => {
          return total + (detalle.cantidad * detalle.precio || 0);
        }, 0)
      : 0;

  // Abre el modal del detalle del pedido
  const handleDetallePedido = async (idPedido) => {
    try {
      // Realizar la solicitud GET para obtener los detalles del pedido
      const respuesta = await axios.get(
        `https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos/${idPedido}`
      );

      // Obtener los detalles del pedido de la respuesta
      const pedido = await respuesta.data;

      // Mostrar los detalles del pedido en la consola para depuración
      console.log("Detalle de Pedido:", pedido);

      // Establecer el pedido seleccionado en el estado
      setPedidoSeleccionado(pedido);
      // setImagenComprobante(pedido.ImagenComprobante);
      setImagenComprobantePrevisualizar(pedido.ImagenComprobante);

      setShowComprobanteButton(null);

      if (auth.idCliente) {
        setTimeout(() => {
          document.getElementById("spanInputFileComprobante").innerHTML =
            "Seleccionar archivo";
        }, 10);
      }

      // Mostrar el modal con los detalles de la compra
      $("#modalDetalleCompra").modal("show");
    } catch (error) {
      // Manejo de errores en caso de que la solicitud falle
      show_alerta({
        message: "Error al obtener los detalles de la compra",
        type: "error",
      });

      console.log(error);
    }
  };

  function formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  }

  const openModal = () => {
    setIdPedido(""); // Resetear el IdCompra al abrir el modal para indicar una nueva compra
    setIdCliente("");
    setTipoPago("");
    setFecha("");
    setTotal("");
    setImagenComprobante(null);
    setImagenComprobantePrevisualizar("0");
    setDetalles([]);
    setOperation(1); // Indicar que es una operación de creación
    setErrors({});
    setTitle("Registrar Venta");
    setShowDetalleField(false); // Ocultar el campo de detalles al abrir el modal

    obtenerFechaActual();
  };

  const obtenerFechaActual = () => {
    // Obtener la fecha actual
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0"); // Día en formato dd
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Mes en formato mm (enero es 0)
    const year = today.getFullYear(); // Año en formato aaaa

    // Formatear la fecha como dd-mm-aaaa
    const formattedDate = `${day}/${month}/${year}`;
    setFecha(formattedDate); // Establecer la fecha formateada en el estado
  };

  const getCurrentDateForInput = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Enero es 0
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name);

    if (name === "IdCliente") {
      errors.IdCliente = "";
      setIdCliente(value);
    } else if (name === "TipoPago") {
      errors.TipoPago = "";
      setTipoPago(value);
    } else if (name === "Fecha") {
      setFecha(value);
    } else if (name === "Total") {
      setTotal(value);
    }
  };

  const [alertas, setAlertas] = useState([]);

  const hayAlertas = () => {
    return alertas.some((alerta) => alerta !== "");
  };

  const handleChangeIdEstadoPedido = (e) => {
    const value = e.target.value;
    setIdEstdosPedidoActualizar(value);
  };

  const getFilteredProductos = (index) => {
    // Obtener los IDs de los insumos seleccionados en las otras filas de detalles
    const productosSeleccionados = Detalles.reduce((acc, detalle, i) => {
      if (i !== index && detalle.IdProducto) {
        acc.push(detalle.IdProducto);
      }
      return acc;
    }, []);

    // Filtrar los insumos disponibles excluyendo los ya seleccionados
    return Productos.filter(
      (producto) => !productosSeleccionados.includes(producto.IdProducto)
    );
  };

  ////////////////////////////////////////////////////////////////////////////

  const addDetail = () => {
    setDetalles([
      ...Detalles,
      {
        IdProducto: "",
        Precio: 0,
        SubTotal: 0,
        insumos: [],
        insumosSeleccionados: [], // Vacío al inicio
        insumoDisabled: true,
        cantidadDisabled: true,
      },
    ]);
  };

  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const detallesActualizados = [...Detalles];
    const detalleActual = detallesActualizados[index];

    if (name === "IdProducto") {
      const productoSeleccionado = Productos.find(
        (producto) => producto.IdProducto === parseInt(value, 10)
      );

      if (productoSeleccionado) {
        detalleActual.IdProducto = parseInt(value, 10);
        detalleActual.precio = productoSeleccionado.ValorVenta; // Asigna el precio del producto
        detalleActual.insumos = productoSeleccionado.ProductoInsumos.map(
          (insumo) => ({
            IdInsumo: insumo.IdInsumo,
            CantidadProductoInsumo: insumo.CantidadProductoInsumo,
            Referencia: insumo.Insumo.Referencia,
            CantidadDisponible: insumo.Insumo.Cantidad,
          })
        );
        detalleActual.IdInsumo = ""; // Reinicia el insumo seleccionado
        detalleActual.cantidad = ""; // Reinicia la cantidad
        detalleActual.subtotal = 0; // Reinicia el subtotal (cambiado de subTotal a subtotal)
      } else {
        detalleActual.IdProducto = "";
        detalleActual.precio = ""; // Limpia el precio si no hay producto seleccionado
        detalleActual.insumos = [];
        detalleActual.IdInsumo = "";
        detalleActual.cantidad = "";
        detalleActual.subtotal = 0; // Reinicia el subtotal
      }

      setDetalles(detallesActualizados);
      return;
    }

    if (name === "IdInsumo") {
      const insumoSeleccionado = detalleActual.insumos.find(
        (insumo) => insumo.IdInsumo === parseInt(value, 10)
      );

      if (insumoSeleccionado) {
        detalleActual.IdInsumo = parseInt(value, 10);
        detalleActual.cantidad = ""; // Reinicia la cantidad cuando se cambia el insumo
        detalleActual.subtotal = 0; // Reinicia el subtotal
      } else {
        detalleActual.IdInsumo = "";
        detalleActual.cantidad = "";
        detalleActual.subtotal = 0;
      }

      setDetalles(detallesActualizados);
      return;
    }

    if (name === "cantidad") {
      const insumoSeleccionado = detalleActual.insumos.find(
        (insumo) => insumo.IdInsumo === parseInt(detalleActual.IdInsumo, 10)
      );

      if (insumoSeleccionado) {
        const cantidadDisponible = insumoSeleccionado.CantidadProductoInsumo;
        const cantidadIngresada = parseInt(value, 10);

        if (cantidadIngresada > cantidadDisponible) {
          alertas[
            index
          ] = `La cantidad máxima disponible es ${cantidadDisponible}`;
          detalleActual.cantidad = cantidadDisponible; // Asigna la cantidad máxima disponible
        } else {
          alertas[index] = ""; // Limpia la alerta si está dentro del rango
          detalleActual.cantidad = cantidadIngresada; // Actualiza la cantidad en el estado
        }

        // Calcula el subtotal (precio del producto * cantidad)
        detalleActual.subtotal =
          detalleActual.precio * (detalleActual.cantidad || 0); // Actualiza el subtotal
      } else {
        alertas[index] = "Insumo no encontrado"; // Maneja el caso donde no se encuentra el insumo
        detalleActual.subtotal = 0;
      }

      setDetalles(detallesActualizados);
      setAlertas([...alertas]);
      return;
    }

    detalleActual[name] = value;
    setDetalles(detallesActualizados);
  };

  const handleQuantityChange = (index, e) => {
    const value = parseInt(e.target.value, 10);
    const insumoId = parseInt(Detalles[index].IdInsumo, 10);

    // Encuentra el insumo asociado al producto seleccionado
    const insumo = Detalles[index].insumos.find(
      (insumo) => insumo.IdInsumo == insumoId
    );

    console.log(value);
    console.log(insumoId);
    console.log(insumo);

    // Verifica si el valor ingresado es válido y no supera la cantidad disponible
    if (
      !isNaN(value) &&
      value >= 0 &&
      value <= (insumo?.CantidadProductoInsumo || 0)
    ) {
      // Actualiza el estado con la nueva cantidad
      const updatedDetalles = [...Detalles];
      updatedDetalles[index].cantidad = value;

      setDetalles(updatedDetalles);
    } else {
      // Si el valor no es válido o excede la cantidad disponible, muestra un error
      alert(
        "La cantidad ingresada no puede superar la cantidad disponible del insumo."
      );
    }
  };

  const removeDetail = (index) => {
    const updatedDetalles = Detalles.filter((_, i) => i !== index);
    setDetalles(updatedDetalles);
  };

  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  // cargar la imagen que se usara en el comprobante
  const handleChangeImagenComprobante = (e) => {
    let errorMessage = "";

    const file = e.target.files[0];
    console.log(file);

    let spanComprobante = document.getElementById("spanInputFileComprobante");

    const fileTypes = ["image/png", "image/jpeg"];

    if (file && fileTypes.includes(file.type)) {
      // Cargar la imagen para previsualizarla
      const reader = new FileReader();
      reader.onloadend = () => {
        // setImagenDisenio(reader.result);
        setImagenComprobantePrevisualizar(reader.result);
        console.log(reader.result);
      };
      reader.readAsDataURL(file);

      setImagenComprobante(file);
      setShowComprobanteButton(true);

      let fileName = "";
      fileName = e.target.value.split("\\").pop();

      spanComprobante.innerHTML = fileName;
    } else {
      errorMessage = "Selecciona un archivo válido .png o .jpg";

      setErrors({ fileComprobante: errorMessage });

      console.log(e.target.files[0]);
      console.log("else");

      // return;
    }
  };

  const enviarComprobante = async (idPed, pedidoIdImagenComprobante) => {
    try {
      console.log(pedidoSeleccionado);
      console.log(pedidoIdImagenComprobante);

      // return;

      if (pedidoIdImagenComprobante != "0") {
        console.log("editarComprobante");

        const url = await editImageComprobante(
          pedidoIdImagenComprobante,
          imagenComprobante
        );

        await axios.put(
          `https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos/comprobante/${idPed}`,
          {
            idImagenComprobante: pedidoIdImagenComprobante,
            imagenComprobante: url,
          }
        );
      } else {
        console.log("crearComprobante");

        const [idImagenComprobante, url] = await subirImageComprobante(
          imagenComprobante
        );

        await axios.put(
          `https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos/comprobante/${idPed}`,
          {
            idImagenComprobante: idImagenComprobante,
            imagenComprobante: url,
          }
        );
      }

      $(".close").click();

      show_alerta({
        message: "El comprobante fue cargado correctamente",
        type: "success",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const formatearDetallesParaBackend = () => {
    const detallesMap = {};

    Detalles.forEach((detalle) => {
      const { IdProducto, IdInsumo, cantidad, precio, subtotal, insumos } =
        detalle;

      // Solo procesar si hay un insumo y cantidad válida
      if (IdInsumo && cantidad > 0) {
        // Si el producto ya existe en el map, agregamos los insumos a su lista
        if (detallesMap[IdProducto]) {
          const insumoExistente = insumos.find(
            (insumo) => insumo.IdInsumo === IdInsumo
          );
          detallesMap[IdProducto].InsumosUtilizados.push({
            IdInsumo: insumoExistente.IdInsumo,
            CantidadUtilizada: cantidad,
          });
        } else {
          // Si no existe el producto, lo agregamos
          const insumoSeleccionado = insumos.find(
            (insumo) => insumo.IdInsumo === IdInsumo
          );
          detallesMap[IdProducto] = {
            IdProducto: IdProducto,
            Precio: precio,
            SubTotal: subtotal,
            InsumosUtilizados: [
              {
                IdInsumo: insumoSeleccionado.IdInsumo,
                CantidadUtilizada: cantidad,
              },
            ],
          };
        }
      }
    });

    // Convertimos el map en un array de detalles
    return Object.values(detallesMap);
  };

  const validar = async () => {
    let errorMessage = "";

    let idImagenComprobante = "0";
    let url = "0";

    // Verificar los campos y establecer errores específicos
    const errores = {};

    if (!IdCliente) {
      errores.IdCliente = "Selecciona un cliente";
    }

    if (!TipoPago) {
      errores.TipoPago = "Selecciona un método de pago";
    }

    if (Detalles.length === 0) {
      errores.Detalles = "Agrega al menos un detalle de compra";
    } else if (
      Detalles.some((detalle) => !detalle.cantidad || !detalle.precio)
    ) {
      errores.Detalles =
        "Ingresa una cantidad y un precio válido para cada detalle";
    }

    // Crear un conjunto para verificar duplicados
    const combinaciones = new Set();

    const filaExistente = [];

    // Validar las filas de los detalles de insumos (color, talla, cantidad)
    Detalles.forEach((detalle, index) => {
      // Verificar duplicados
      const clave = `${detalle.IdProducto}-${detalle.IdInsumo}`;
      if (combinaciones.has(clave)) {
        filaExistente.push(clave);
      } else {
        combinaciones.add(clave);
      }
    });

    if (filaExistente.length > 0) {
      show_alerta({ message: `Existen filas repetidas.`, type: "error" });
      return;
    }

    if (Object.keys(errores).length > 0) {
      // Si hay errores específicos, actualizarlos en el estado
      setErrors(errores);
      // Mostrar un mensaje general de error
      show_alerta({
        message: "Por favor, completa todos los campos correctamente",
        type: "error",
      });
      return;
    }

    // Si hay alertas adicionales, detener el proceso
    if (hayAlertas()) {
      return;
    }

    const detallesFormateados = formatearDetallesParaBackend();

    console.log(Detalles);
    console.log(detallesFormateados);
    console.log(getCurrentDateForInput());
    console.log(TipoPago);
    console.log(totalCompra);

    // return;

    if (TipoPago === "Transferencia") {
      if (!imagenComprobante) {
        show_alerta({
          message: "Es necesario un comprobante de pago",
          type: "error",
        });
        return; // No continuar si falta el comprobante de pago
      }

      [idImagenComprobante, url] = await subirImageComprobante(
        imagenComprobante
      );
    }

    // Enviar solicitud si no hay errores
    enviarSolicitud("POST", {
      IdCliente: IdCliente,
      TipoPago: TipoPago,
      Fecha: getCurrentDateForInput(),
      Total: totalCompra,
      Detalles: detallesFormateados,
      idImagenComprobante: idImagenComprobante,
      imagenComprobante: url,
      intentos: 3,
      IdEstadoPedido: 3,
    });
  };

  const enviarSolicitud = async (metodo, parametros) => {
    console.log(parametros);
    try {
      let urlRequest = url;

      const respuesta = await axios({
        method: metodo,
        url: url,
        data: parametros,
      });

      show_alerta({
        message: respuesta.data.message,
        type: "success",
      });

      setLoading(true); // Mostrar el loader antes de realizar la solicitud

      $(".close").click();

      getPedidos();
      getProductos();
    } catch (error) {
      if (error.response) {
        show_alerta({
          message: error.response.data.message,
          type: "error",
        });
      } else if (error.request) {
        show_alerta({
          message: "Error en la solicitud",
          type: "error",
        });
      } else {
        show_alerta({
          message: "Error desconocido",
          type: "error",
        });
      }
    }finally {
    setLoading(false); // Mostrar el loader antes de realizar la solicitud
    }
  };

  const cambiarEstadoPedido = async () => {
    let idEstPed;
    let idPed;
    let titleOperation;
    let nombreEstado;
    let confirmButtonTextEstado;

    // Cambiar el estado desde el modal
    if (auth.idUsuario) {
      idPed = IdPedidoActualizar;
      idEstPed = idEstadoPedidoActualizar;
      nombreEstado =
        estadosPedidos.find((estado) => estado.IdEstadoPedido == idEstPed)
          ?.NombreEstado || "Estado no encontrado";
      titleOperation = `¿Seguro de cambiar el estado del pedido a ${nombreEstado}?`;
      confirmButtonTextEstado = "Sí, cambiar";
    } else {
      idPed = idPedidoActualizarEstado;
      idEstPed = 4;
      titleOperation = "¿Seguro de cancelar el pedido?";
      confirmButtonTextEstado = "Sí, cancelar";
    }

    // console.log(nombreEstado);
    // console.log(idEstPed);
    // console.log(idPed);

    // return;

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: titleOperation,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: confirmButtonTextEstado,
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log(idPed);
          console.log(idEstPed);

          // return;
          // Cambiar el estado del pedido a "Cancelado"
          await axios.put(`https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos/${idPed}`, {
            Estado: idEstPed,
          });

          // Actualizar la lista de pedidos
          getPedidos();
          $(".close").click();

          show_alerta({
            message: "La compra fue modificada correctamente",
            type: "success",
          });
        } catch (error) {
          show_alerta({
            message: "Hubo un error al cancelar la compra",
            type: "error",
          });
        }
      } else {
        show_alerta({
          message: "La compra NO fue cancelada",
          type: "info",
        });
      }
    });
  };

  const anularPedido = async (idPedido) => {
    try {
      console.log(idPedido);

      // return;
      // Cambiar el estado del pedido a "Cancelado"
      await axios.put(`https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos/${idPedido}`, {
        Estado: 4,
      });

      // Actualizar la lista de pedidos
      // getPedidos();
      // $(".close").click();

      // show_alerta({
      //   message: "El pedido fue cancelado correctamente",
      //   type: "success",
      // });
    } catch (error) {
      show_alerta({
        message: "Hubo un error al cancelar el pedido",
        type: "error",
      });
      console.log(error);
    }
  };

  const aceptarComprobante = async (idPedido) => {
    // let idEstPed = idEstadoPedidoActualizar;
    // let idPed = IdPedidoActualizar ;
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Seguro de aceptar el comprobante del pedido?",
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, aceptar",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log(idPedido);
          // console.log(idEstadoPedido);

          const respuesta = await axios.put(
            `https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos/${idPedido}`,
            {
              Estado: 2,
            }
          );

          let message = respuesta.response.message;

          // Actualizar la lista de pedidos
          getPedidos();
          $(".close").click();

          // show_alerta({
          //   message: "La compra fue modificada correctamente",
          //   type: "success",
          // });

          show_alerta({
            message: message,
            type: "success",
          });
        } catch (error) {
          show_alerta({
            message: "Hubo un error al cancelar la compra",
            type: "error",
          });
        }
      } else {
        show_alerta({
          message: "La compra NO fue cancelada",
          type: "info",
        });
      }
    });
  };

  const rechazarComprobante = async (
    idPedido,
    intentosActuales,
    nombreClientePedido,
    correoClientePedido
  ) => {
    // let idEstPed = idEstadoPedidoActualizar;
    // let idPed = IdPedidoActualizar ;

    let titleText;
    let confirmButtonTextAnular;

    if (intentosActuales == 1) {
      titleText = "¿Seguro de rechazar el comprobante y anular el pedido?";
      confirmButtonTextAnular = "Sí, rechazar y anular";
    } else {
      titleText = "¿Seguro de rechazar el comprobante del pedido?";
      confirmButtonTextAnular = "Sí, rechazar";
    }

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: titleText,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: confirmButtonTextAnular,
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log(idPedido);
          console.log(intentosActuales);
          console.log(nombreClientePedido);
          console.log(correoClientePedido);

          const respuesta = await axios.put(
            `https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos/comprobante/intentos/${idPedido}`,
            {
              intentos: intentosActuales,
              nombreCliente: nombreClientePedido,
              correoCliente: correoClientePedido,
            }
          );

          let message = respuesta.data.message;

          console.log(respuesta);

          if (intentosActuales == 1) {
            await anularPedido(idPedido);

            // Actualizar la lista de pedidos
            getPedidos();

            $(".close").click();

            show_alerta({
              message: "Comprobante rechazado y pedido anulado",
              type: "success",
            });
          } else {
            // Actualizar la lista de pedidos
            getPedidos();

            $(".close").click();

            show_alerta({
              message: message,
              type: "success",
            });
          }
        } catch (error) {
          show_alerta({
            message: "Hubo un error al cancelar la compra",
            type: "error",
          });

          console.log(error);
        }
      } else {
        show_alerta({
          message: "La compra NO fue cancelada",
          type: "info",
        });
      }
    });
  };

  const openModalEstado = (pedido) => {
    setTitle("Actualizar Estado");
    setIdPedidoActualizar(pedido.IdPedido);
    // setIdPedido(pedido.IdPedido);
    setIdEstdosPedidoActualizar(pedido.IdEstadoPedido);

    if (pedido.IdEstadoPedido == 2) {
      const idsBuscados = [2, 3];

      const nuevosEstadosPedido = estadosPedidos.filter((estado) =>
        idsBuscados.includes(estado.IdEstadoPedido)
      );

      setNuevosEstadosPedidos(nuevosEstadosPedido);
    } else if (nuevosEstadosPedidos.length < 3) {
      setNuevosEstadosPedidos(estadosPedidos);
    }
  };

  const formatearFecha = (fechaISO) => {
    const [year, month, day] = fechaISO.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset current page when changing the search term
  };

  let totalPages;
  let currentPedidos;

  // Sirve pa que no se dañe la cantidad de paginas una de admin y otra de cliente
  if (auth.idUsuario) {
    // Filter purchases based on the search term
    const filteredCompras = ventas.filter((compra) =>
      Object.values(compra).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Apply pagination to the filtered purchases
    totalPages = Math.ceil(filteredCompras.length / itemsPerPage);
    currentPedidos = filteredCompras.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  } else {
    // Filter purchases based on the search term
    const filteredPedidosCliente = pedidosCliente.filter((compra) =>
      Object.values(compra).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Apply pagination to the filtered purchases
    totalPages = Math.ceil(filteredPedidosCliente.length / itemsPerPage);
    currentPedidos = filteredPedidosCliente.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }

  const [isZoomed, setIsZoomed] = useState(false);

  const handleToggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleDownload = async (pedido) => {
    const response = await fetch(pedido.ImagenComprobante);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Comprobante ${pedido.Cliente.NombreApellido}.jpg`;
    link.click();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* Inicio modal de editar estado */}
      <div
        className="modal fade"
        id="modalEstadoPedido"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalEditarEstadoLabel"
        // aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalEditarEstadoLabel">
                {title}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              {/* <input type="text" id="IdCompra" value={IdPedidoActualizar}></input> */}

              <div className="form-row">
                {/* Seleccionar estado */}
                <div className="form-group col-md-12">
                  <label>Estados:</label>
                  <select
                    className="form-control"
                    name="IdCliente"
                    value={idEstadoPedidoActualizar}
                    onChange={handleChangeIdEstadoPedido}
                  >
                    <option disabled value="">
                      Selecciona un estado
                    </option>
                    {nuevosEstadosPedidos.map((estado) => (
                      <option
                        key={estado.IdEstadoPedido}
                        value={estado.IdEstadoPedido}
                      >
                        {estado.NombreEstado}
                      </option>
                    ))}
                  </select>
                  {/* {renderErrorMessage(errors.IdCliente)} */}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                id="btnCerrar"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => cambiarEstadoPedido()}
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* fin modal de editar estado */}

      {/* Inicio modal de crear venta con su detalle */}
      <div
        className="modal fade"
        id="modalCompras"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalAñadirCompraLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalAñadirCompraLabel">
                {title}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-body">
                <div>
                  <div className="form-row">
                    <div className="accordion col-md-12" id="accordionExample">
                      {/* Acordeon crear venta */}
                      <div className="card">
                        <div className="card-header" id="headingOne">
                          <h2 className="mb-0">
                            <button
                              className="btn btn-link btn-block text-left"
                              type="button"
                              data-toggle="collapse"
                              data-target="#collapseOne"
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            >
                              Detalles del Pedido
                            </button>
                          </h2>
                        </div>
                        {/* <input type="hidden" id="IdCompra"></input> */}

                        <div
                          id="collapseOne"
                          className="collapse show"
                          aria-labelledby="headingOne"
                          data-parent="#accordionExample"
                        >
                          <div className="card-body">
                            <div className="form-row">
                              {/* Seleccionar cliente */}
                              <div className="form-group col-md-6">
                                <label>Cliente</label>
                                <select
                                  className={`form-control ${
                                    errors.IdCliente ? "is-invalid" : ""
                                  }`}
                                  name="IdCliente"
                                  value={IdCliente}
                                  onChange={handleChange}
                                >
                                  <option value="" disabled>
                                    Selecciona un cliente
                                  </option>
                                  {Clientes.map((cliente) => (
                                    <option
                                      key={cliente.IdCliente}
                                      value={cliente.IdCliente}
                                    >
                                      {cliente.NombreApellido}
                                    </option>
                                  ))}
                                </select>
                                {renderErrorMessage(errors.IdCliente)}
                              </div>

                              {/* Seleccionar tipo de pago */}
                              <div className="form-group col-md-6">
                                <label>Método de pago</label>
                                <select
                                  className={`form-control ${
                                    errors.TipoPago ? "is-invalid" : ""
                                  }`}
                                  name="TipoPago"
                                  value={TipoPago}
                                  onChange={handleChange}
                                >
                                  <option value="" disabled>
                                    Selecciona un método de pago
                                  </option>
                                  <option value={"Transferencia"}>
                                    Transferencia
                                  </option>
                                  <option value={"Efectivo"}>Efectivo </option>
                                </select>
                                {renderErrorMessage(errors.TipoPago)}
                              </div>
                            </div>

                            {/* Fecha */}
                            <div className="form-group">
                              <label>Fecha</label>
                              <input
                                type="text"
                                className={"form-control"}
                                id="Fecha"
                                name="Fecha"
                                value={Fecha}
                                disabled
                                // onChange={handleChange}
                              />
                              {renderErrorMessage(errors.Fecha)}
                            </div>

                            {/* Detalles */}
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>Producto</th>
                                    <th>Insumo</th>
                                    <th>Cantidad</th>
                                    <th>Precio</th>
                                    <th>SubTotal</th>
                                    <th>Acción</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Detalles.map((detalle, index) => (
                                    <tr key={index}>
                                      <td>
                                        <select
                                          className={`form-control ${
                                            errors.Detalles &&
                                            errors.Detalles[index] &&
                                            errors.Detalles[index].IdProducto
                                              ? "is-invalid"
                                              : ""
                                          }`}
                                          name="IdProducto"
                                          value={detalle.IdProducto || ""}
                                          onChange={(e) =>
                                            handleDetailChange(index, e)
                                          }
                                        >
                                          <option value="">
                                            Selecciona un producto
                                          </option>
                                          {Productos.map((producto) => (
                                            <option
                                              key={producto.IdProducto}
                                              value={producto.IdProducto}
                                            >
                                              {producto.Referencia}
                                            </option>
                                          ))}
                                        </select>

                                        {errors.Detalles &&
                                          errors.Detalles[index] &&
                                          errors.Detalles[index].IdProducto && (
                                            <div className="invalid-feedback">
                                              {
                                                errors.Detalles[index]
                                                  .IdProducto
                                              }
                                            </div>
                                          )}
                                      </td>

                                      <td>
                                        <select
                                          className="form-control"
                                          name="IdInsumo"
                                          value={detalle.IdInsumo || ""}
                                          onChange={(e) =>
                                            handleDetailChange(index, e)
                                          }
                                          disabled={!detalle.IdProducto} // Deshabilita si no hay producto seleccionado
                                        >
                                          <option value="">
                                            Selecciona un insumo
                                          </option>
                                          {detalle.insumos
                                            .filter(
                                              (insumo) =>
                                                insumo.CantidadProductoInsumo >
                                                0
                                            ) // Filtrar insumos con cantidad > 1
                                            .map((insumo) => (
                                              <option
                                                key={insumo.IdInsumo}
                                                value={insumo.IdInsumo}
                                              >
                                                {insumo.Referencia}
                                              </option>
                                            ))}
                                        </select>
                                      </td>

                                      <td>
                                        <input
                                          type="number"
                                          className="form-control"
                                          name="cantidad"
                                          placeholder="Cantidad"
                                          value={detalle.cantidad || ""}
                                          onChange={(e) =>
                                            handleDetailChange(index, e)
                                          }
                                          disabled={!detalle.IdInsumo} // Deshabilita si no hay insumo seleccionado
                                        />
                                        {alertas[index] && (
                                          <span
                                            style={{ color: "red" }}
                                            className="alerta"
                                          >
                                            {alertas[index]}
                                          </span>
                                        )}
                                      </td>

                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          name="precio"
                                          placeholder="Precio"
                                          value={formatCurrency(
                                            detalle.precio || ""
                                          )}
                                          disabled
                                        />
                                      </td>

                                      <td>
                                        <input
                                          type="text"
                                          className="form-control"
                                          name="subtotal"
                                          placeholder="Subtotal"
                                          value={formatCurrency(
                                            detalle.subtotal || ""
                                          )}
                                          disabled
                                        />
                                      </td>

                                      <td>
                                        <button
                                          type="button"
                                          className="btn btn-danger"
                                          onClick={() => removeDetail(index)}
                                        >
                                          X
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {errors.Detalles && (
                              <div className="invalid-feedback">
                                {errors.Detalles}
                              </div>
                            )}

                            <div className="text-right mb-3">
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={addDetail}
                              >
                                Añadir Detalle
                              </button>
                            </div>

                            <div className="form-group">
                              <label>Total</label>
                              <input
                                type="text"
                                className="form-control"
                                id="Total"
                                name="Total"
                                value={formatCurrency(totalCompra)}
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Acordeon comprobante de la venta */}
                      {TipoPago == "Transferencia" && (
                        <div className="card">
                          <div className="card-header" id="headingTwo">
                            <h2 className="mb-0">
                              <button
                                className="btn btn-link btn-block text-left collapsed"
                                type="button"
                                data-toggle="collapse"
                                data-target="#collapseTwo"
                                aria-expanded="false"
                                aria-controls="collapseTwo"
                              >
                                Comprobante de pago
                              </button>
                            </h2>
                          </div>

                          {/* {insumoSeleccionado && ( */}
                          <div
                            id="collapseTwo"
                            className="collapse"
                            aria-labelledby="headingTwo"
                            data-parent="#accordionExample"
                          >
                            <div className="card-body">
                              <div className="container">
                                {/* Imagen comprobante */}
                                <div
                                  className="container py-2 d-flex justify-content-center align-items-center"
                                  style={{
                                    overflow: "visible",
                                    position: "relative",
                                  }}
                                >
                                  {/* si existe renderizar la imagen del comprobante, si no mostrar texto  */}
                                  {imagenComprobantePrevisualizar != "0" ? (
                                    <img
                                      onClick={handleToggleZoom}
                                      src={imagenComprobantePrevisualizar}
                                      alt="Vista previa imagen del comprobante"
                                      style={{
                                        cursor: "pointer",
                                        // width: "80%",
                                        // height: "auto",
                                        // maxWidth: "200px",
                                        // display: "",
                                        // border: "1px solid black",
                                        // width: "30%", /* Ajusta al 100% del ancho del contenedor */
                                        maxWidth:
                                          "720px" /* Limita el ancho máximo */,
                                        height:
                                          "300px" /* Mantiene la proporción */,

                                        objectFit: "cover",
                                        position: "relative",
                                        // top: '-50px', /* Ajusta el desbordamiento hacia arriba */
                                        left: "0",

                                        zIndex: 1 /* Asegura que la imagen esté sobre otros elementos */,
                                        transform: isZoomed
                                          ? "scale(2.1)"
                                          : "scale(1)" /* Aplica o quita el zoom */,
                                        transition:
                                          "transform 0.3s ease-in-out" /* Suaviza el cambio */,
                                      }}
                                      className="zoom-image"
                                    />
                                  ) : (
                                    <p className="font-weight-bold text-dark">
                                      Aún no hay un comprobante
                                    </p>
                                  )}
                                </div>

                                {/* Input file comprobante */}
                                {/* Renderizar solo si no hay comprobante */}
                                {imagenComprobantePrevisualizar == "0" && (
                                  <div className="inputComprobante d-flex justify-content-center align-items-center pt-4">
                                    <input
                                      accept=".png, .jpg, .jpeg"
                                      type="file"
                                      name="file-3"
                                      id="inputFileReferencia"
                                      className={`inputfileComprobante inputfileComprobante-2 ${
                                        errors.fileComprobante
                                          ? "is-invalid"
                                          : ""
                                      } `}
                                      onChange={handleChangeImagenComprobante}
                                    />
                                    <label
                                      className="d-flex justify-content-center align-items-center"
                                      htmlFor="inputFileReferencia"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="iborrainputfileComprobante"
                                        width="20"
                                        height="17"
                                        viewBox="0 0 20 17"
                                      >
                                        <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                                      </svg>
                                      <span
                                        className="iborrainputfileComprobante"
                                        id="spanInputFileComprobante"
                                      >
                                        Seleccionar archivo
                                      </span>
                                    </label>
                                    {/* {renderErrorMessage(errors.fileComprobante)} */}
                                  </div>
                                )}

                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                id="btnCerrar"
                className="btn btn-secondary "
                data-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => validar()}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* fin modal de crear venta con el detalle */}

      {/* Inicio modal ver detalle venta */}
      <div
        className="modal fade"
        id="modalDetalleCompra"
        // tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalDetalleCompraLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalDetalleCompraLabel">
                Detalle de la venta
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-body">
                <div>
                  <div className="form-row">
                    <div className="accordion col-md-12" id="accordionExample">
                      {/* Acordeon detalles de la venta */}
                      <div className="card">
                        <div className="card-header" id="headingOne">
                          <h2 className="mb-0">
                            <button
                              className="btn btn-link btn-block text-left"
                              type="button"
                              data-toggle="collapse"
                              data-target="#collapseOne"
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            >
                              Detalles de la venta
                            </button>
                          </h2>
                        </div>

                        {pedidoSeleccionado && (
                          <div
                            id="collapseOne"
                            className="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordionExample"
                          >
                            <div className="card-body">
                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label>Cliente:</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      pedidoSeleccionado.Cliente.NombreApellido
                                    }
                                    disabled
                                  />
                                </div>

                                <div className="col-md-6">
                                  <label>Método de pago:</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={pedidoSeleccionado.TipoPago}
                                    disabled
                                  />
                                </div>

                                <div className="col-md-12 ">
                                  <label>Fecha:</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    value={pedidoSeleccionado.Fecha}
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="table-responsive">
                                <table className="table table-bordered">
                                  <thead>
                                    <tr>
                                      <th>Producto</th>
                                      <th>Insumo</th>
                                      <th>Cantidad</th>
                                      <th>Precio</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {pedidoSeleccionado.DetallesPedidosProductos.map(
                                      (detalle, index) => (
                                        <tr key={index}>
                                          <td>{detalle.Producto.Referencia}</td>
                                          <td>{detalle.Insumo.Referencia}</td>

                                          <td>{detalle.Cantidad}</td>
                                          <td>
                                            {formatCurrency(detalle.Precio)}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              <div className="form-group">
                                <label>Total</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={formatCurrency(
                                    pedidoSeleccionado.Total
                                  )}
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Acordeon comprobante de la venta */}
                      {pedidoSeleccionado?.TipoPago == "Transferencia" && (
                        <div className="card">
                          <div className="card-header" id="headingTwo">
                            <h2 className="mb-0">
                              <button
                                className="btn btn-link btn-block text-left collapsed"
                                type="button"
                                data-toggle="collapse"
                                data-target="#collapseTwo"
                                aria-expanded="false"
                                aria-controls="collapseTwo"
                              >
                                Comprobante de pago
                              </button>
                            </h2>
                          </div>

                          {/* {insumoSeleccionado && ( */}
                          <div
                            id="collapseTwo"
                            className="collapse"
                            aria-labelledby="headingTwo"
                            data-parent="#accordionExample"
                          >
                            <div className="card-body">
                              <div className="container">
                                {/* Imagen comprobante */}
                                <div
                                  className="container py-2 d-flex justify-content-center align-items-center"
                                  style={{
                                    overflow: "visible",
                                    position: "relative",
                                  }}
                                >
                                  {/* si existe renderizar la imagen del comprobante, si no mostrar texto  */}
                                  {imagenComprobantePrevisualizar != "0" ? (
                                    <img
                                      onClick={handleToggleZoom}
                                      src={imagenComprobantePrevisualizar}
                                      alt="Vista previa imagen del comprobante"
                                      style={{
                                        cursor: "pointer",
                                        // width: "80%",
                                        // height: "auto",
                                        // maxWidth: "200px",
                                        // display: "",
                                        // border: "1px solid black",
                                        // width: "30%", /* Ajusta al 100% del ancho del contenedor */
                                        maxWidth:
                                          "720px" /* Limita el ancho máximo */,
                                        height:
                                          "300px" /* Mantiene la proporción */,

                                        objectFit: "cover",
                                        position: "relative",
                                        // top: '-50px', /* Ajusta el desbordamiento hacia arriba */
                                        left: "0",

                                        zIndex: 1 /* Asegura que la imagen esté sobre otros elementos */,
                                        transform: isZoomed
                                          ? "scale(2.1)"
                                          : "scale(1)" /* Aplica o quita el zoom */,
                                        transition:
                                          "transform 0.3s ease-in-out" /* Suaviza el cambio */,
                                      }}
                                      className="zoom-image"
                                    />
                                  ) : (
                                    <p className="font-weight-bold text-dark">
                                      Aún no hay un comprobante
                                    </p>
                                  )}
                                </div>

                                {/* Input file comprobante */}
                                {/* Renderizar solo si es un cliente y no hay comprobante */}
                                {auth.idCliente &&
                                  pedidoSeleccionado?.ImagenComprobante ==
                                    "0" && (
                                    <div className="inputComprobante d-flex justify-content-center align-items-center pt-4">
                                      <input
                                        accept=".png, .jpg, .jpeg"
                                        type="file"
                                        name="file-3"
                                        id="inputFileReferencia"
                                        className={`inputfileComprobante inputfileComprobante-2 ${
                                          errors.fileComprobante
                                            ? "is-invalid"
                                            : ""
                                        } `}
                                        onChange={handleChangeImagenComprobante}
                                      />
                                      <label
                                        className="d-flex justify-content-center align-items-center"
                                        htmlFor="inputFileReferencia"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="iborrainputfileComprobante"
                                          width="20"
                                          height="17"
                                          viewBox="0 0 20 17"
                                        >
                                          <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                                        </svg>
                                        <span
                                          className="iborrainputfileComprobante"
                                          id="spanInputFileComprobante"
                                        >
                                          Seleccionar archivo
                                        </span>
                                      </label>
                                      {/* {renderErrorMessage(errors.fileComprobante)} */}
                                    </div>
                                  )}

                                {/* Boton enviar comprobante */}
                                {showComprobanteButton && (
                                  <div className="d-flex justify-content-center align-items-center pt-4">
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={() =>
                                        enviarComprobante(
                                          pedidoSeleccionado.IdPedido,
                                          pedidoSeleccionado.IdImagenComprobante
                                        )
                                      }
                                    >
                                      Subir Comprobante :)
                                    </button>
                                  </div>
                                )}

                                {auth.idUsuario &&
                                  pedidoSeleccionado?.ImagenComprobante !=
                                    "0" && (
                                    <div className="d-flex justify-content-center pt-4">
                                      <button
                                        className="btn btn-info"
                                        onClick={() =>
                                          handleDownload(pedidoSeleccionado)
                                        }
                                      >
                                        {" "}
                                        Descargar comprobante
                                      </button>
                                    </div>
                                  )}

                                {/*Renderizar botones de acción con comprobante, solo admin puede acceder a ellos */}
                                {auth.idUsuario &&
                                  pedidoSeleccionado?.ImagenComprobante !=
                                    "0" &&
                                  pedidoSeleccionado?.IdEstadoPedido == 1 && (
                                    <div
                                      className="d-flex pt-4"
                                      style={{
                                        justifyContent: "space-evenly",
                                      }}
                                    >
                                      <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() =>
                                          aceptarComprobante(
                                            pedidoSeleccionado.IdPedido
                                          )
                                        }
                                      >
                                        Aceptar Comprobante :)
                                      </button>

                                      <button
                                        type="button"
                                        className="btn btn-danger"
                                        // hacer una especie de funcion en el onclck para determinar si hay o no intentos
                                        onClick={() => {
                                          if (pedidoSeleccionado.Intentos > 1) {
                                            rechazarComprobante(
                                              pedidoSeleccionado.IdPedido,
                                              pedidoSeleccionado.Intentos,
                                              pedidoSeleccionado.Cliente
                                                .NombreApellido,
                                              pedidoSeleccionado.Cliente.Correo
                                            );
                                          } else {
                                            rechazarComprobante(
                                              pedidoSeleccionado.IdPedido,
                                              pedidoSeleccionado.Intentos,
                                              pedidoSeleccionado.Cliente
                                                .NombreApellido,
                                              pedidoSeleccionado.Cliente.Correo
                                            );
                                          }
                                        }}
                                      >
                                        Rechazar Comprobante :(
                                      </button>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                          {/* )} */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Fin modal ver detalle venta */}

      {/* Inicio modal reporte venta */}
      <div>
        <div
          className="modal fade"
          id="modalGenerarReporte"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="ModalGenerarReporteLabel"
          aria-hidden="true"
          data-backdrop="static"
          data-keyboard="false"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="ModalGenerarReporteLabel">
                  Generar Reporte de Ventas
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="fechaInicio">Fecha de Inicio</label>
                    <input
                      type="date"
                      id="fechaInicio"
                      className="form-control"
                      value={fechaInicio}
                      onChange={(e) => {
                        setFechaInicio(e.target.value);
                        // Habilitar/deshabilitar fechaFinal
                        setFechaFinalDisabled(!e.target.value);
                      }}
                      max={fechaFinal || undefined} // Restringir la fecha final si está establecida
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fechaFinal">Fecha Final</label>
                    <input
                      type="date"
                      id="fechaFinal"
                      className="form-control"
                      value={fechaFinal}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        setFechaFinal(selectedDate);
                        setFechaInicio(
                          selectedDate
                            ? fechaInicio > selectedDate
                              ? fechaInicio
                              : fechaInicio
                            : fechaInicio
                        );
                      }}
                      disabled={fechaFinalDisabled}
                      max={new Date().toISOString().split("T")[0]} // Fecha máxima es hoy
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGenerateReport}
                >
                  Generar Reporte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fin modal reporte venta */}

      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          {/* <h1 className="h3 mb-3 text-center text-dark">Gestión de Ventas</h1> */}
        </div>

        {/* <!-- Tabla de Pedidos --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex justify-content-between align-items-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
            <button
              type="button"
              className="btn btn-primary d-flex align-items-center justify-content-center p-0 mr-2"
              data-toggle="modal"
              data-target="#modalGenerarReporte"
              style={{
                width: "205px",
                height: "40px",
              }}
            >
              <i className="fa fa-print"></i>
              <span className="d-none d-sm-inline ml-2">Generar Reporte</span>
            </button>
            <button
              type="button"
              className="btn btn-dark d-flex align-items-center justify-content-center p-0"
              data-toggle="modal"
              data-target="#modalCompras"
              onClick={() => Clientes.length > 0 && openModal(1)}
              style={{
                width: "170px",
                height: "40px",
              }}
            >
              <i className="fas fa-pencil-alt"></i>
              <span className="d-none d-sm-inline ml-2">Crear Venta</span>
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {/* Si un usuario esta logueado renderizara la tabla de admin, si no renderizara la tabla del cliente  */}
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Método pago</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPedidos.map((pedido) => (
                    <tr key={pedido.IdPedido}>
                      <td>{getClienteName(pedido.IdCliente)}</td>

                      <td>{pedido.TipoPago}</td>

                      <td>{formatearFecha(pedido.Fecha)}</td>

                      <td>{formatCurrency(pedido.Total)}</td>

                      <td>
                        {convertEstadoPedidoIdToName(pedido.IdEstadoPedido)}
                      </td>

                      <td>
                        <div className="d-flex">
                          {/* {pedido.IdEstadoPedido === 4 ||
                          pedido.IdEstadoPedido === 3 ? (
                            <button
                              className="btn btn-secondary btn-sm mr-2 rounded-icon"
                              disabled
                            >
                              <i className="fas fa-times-circle"></i>
                            </button>
                          ) : (
                            <button
                              data-toggle="modal"
                              data-target="#modalEstadoPedido"
                              onClick={() => openModalEstado(pedido)}
                              className="btn btn-danger btn-sm mr-2 rounded-icon"
                              title="Editar"
                            >
                              <i className="fas fa-times-circle"></i>
                            </button>
                          )} */}

                          <button
                            onClick={() => handleDetallePedido(pedido.IdPedido)}
                            className={`btn btn-sm btn-info mr-2 rounded-icon`}
                            data-toggle="modal"
                            data-target="#modalDetalleCompra"
                            title="Detalle"
                          >
                            <i className="fas fa-info-circle"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
        {/* Fin tabla de compras */}
      </div>
      <AdminFooter />
    </>
  );
};
