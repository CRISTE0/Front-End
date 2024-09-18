import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import show_alerta from "../../components/Show_Alerta/show_alerta";
import {
  editImageComprobante,
  subirImageComprobante,
} from "../../firebase/config";
import { useAuth } from "../../context/AuthProvider";
import { AdminFooter } from "../../components/Admin/AdminFooter";
import Loader from "../../components/Loader/loader";

export const Pedidos = () => {
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos";
  const [pedidos, setPedidos] = useState([]);
  const [pedidosCliente, setPedidosCliente] = useState([]);
  const [IdPedido, setIdPedido] = useState("");

  const [Clientes, setClientes] = useState([]);
  const [IdCliente, setIdCliente] = useState("");
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
  const [ImagenDisenioPedido, setImagenDisenioPedido] = useState(null);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [loading, setLoading] = useState(true);

  // let ImagenDisenioPedido;
  let pedidosTotales;

  useEffect(() => {
    getPedidos();
    getEstadosPedidos();
    getProductos();
    getClientes();
    // getPedidosCliente();
  }, []);

  const getPedidos = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const respuesta = await axios.get(url);

      // Filtrar los pedidos que no tienen IdEstadoPedido igual a 3
      const pedidosFiltradosAdmin = respuesta.data.filter(
        (pedido) => pedido.IdEstadoPedido !== 3
      );

      // Ordenar los pedidos filtrados por fecha de forma descendente (de la más reciente a la más antigua)
      const pedidosOrdenados = pedidosFiltradosAdmin.sort((a, b) => {
        return new Date(b.Fecha) - new Date(a.Fecha);
      });

      // Actualizar el estado con los pedidos ordenados
      setPedidos(pedidosOrdenados);

      pedidosTotales = respuesta.data; // Mantener los pedidos totales sin filtrar
      getPedidosCliente(); // Llamada a otra función (si es necesaria)
    } catch (error) {
      show_alerta("Error al obtener los pedidos", "error");
    } finally {
      setLoading(false); // Mostrar el loader antes de realizar la solicitud
    }
  };

  const getPedidosCliente = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const pedidosFiltrados = pedidosTotales.filter(
        (pedido) => pedido.Cliente.IdCliente == auth.idCliente
      );

      console.log(pedidosTotales);
      console.log(pedidosFiltrados);

      setPedidosCliente(pedidosFiltrados);
    } catch (error) {
      console.log(error);

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
    const producto = Productos.find((item) => item.IdProducto == idProducto);
    return producto ? producto.Referencia : "Producto no encontrado";
  };

  const convertEstadoPedidoIdToName = (estadoPedidoId) => {
    const estadoPedido = estadosPedidos.find(
      (pedido) => pedido.IdEstadoPedido === estadoPedidoId
    );
    return estadoPedido ? estadoPedido.NombreEstado : "";
  };

  const getClientes = async () => {https://softshirt-1c3fad7d72e8.herokuapp.com
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
    setLoading(true); // Mostrar el loadehttps://softshirt-1c3fad7d72e8.herokuapp.coma solicitud
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
      // https://softshirt-1c3fad7d72e8.herokuapp.com GET para obtener los detalles del pedido
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

      if (auth.idCliente && !pedido.ImagenComprobante) {
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
    setFecha("");
    setTotal("");
    setDetalles([]);
    setOperation(1); // Indicar que es una operación de creación
    setErrors({});
    setTitle("Registrar Pedido");
    setShowDetalleField(false); // Ocultar el campo de detalles al abrir el modal
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "IdCliente") {
      setIdCliente(value);
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

  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDetalles = [...Detalles];
    const updatedAlertas = [...alertas];

    console.log(name);

    if (name === "IdProducto") {
      // Verificar si el producto ya está en los detalles
      const productoDuplicado = updatedDetalles.some(
        (detalle, detalleIndex) =>
          detalle.IdProducto === value && detalleIndex !== index
      );

      if (productoDuplicado) {
        show_alerta({
          message: "Este producto ya está agregado en los detalles",
          type: "error",
        });
        return; // No permitir la selección del producto duplicado
      }

      // Actualizar el IdProducto en el detalle
      updatedDetalles[index][name] = value;
      setDetalles(updatedDetalles);

      // Encontrar el producto seleccionado
      const selectedProduct = Productos.find(
        (producto) => producto.IdProducto == value
      );

      if (selectedProduct) {
        // Actualizar el precio en el detalle
        updatedDetalles[index].precio = selectedProduct.ValorVenta;
        setDetalles(updatedDetalles);
      }
    }

    if (name === "cantidad") {
      // Actualizar la cantidad en el detalle
      updatedDetalles[index][name] = value;
      setDetalles(updatedDetalles);

      const selectedProductoId = updatedDetalles[index].IdProducto;
      const selectedProduct = Productos.find(
        (producto) => producto.IdProducto == selectedProductoId
      );

      if (selectedProduct) {
        // Validar la cantidad
        if (parseInt(value) > selectedProduct.Cantidad) {
          updatedAlertas[index] =
            "La cantidad ingresada es mayor que la cantidad disponible";
          show_alerta({
            message:
              "La cantidad ingresada es mayor que la cantidad disponible",
            type: "error",
          });
        } else {
          updatedAlertas[index] = "";
        }
        setAlertas(updatedAlertas);
      }

      // Calcular el subtotal
      const cantidad = parseFloat(updatedDetalles[index].cantidad || 0);
      const precio = parseFloat(updatedDetalles[index].precio || 0);
      updatedDetalles[index].subtotal = cantidad * precio;
      setDetalles(updatedDetalles);
    }
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

  const addDetail = () => {
    // Crear un nuevo detalle con valores predeterminados
    const newDetail = {
      IdProducto: "",
      cantidad: "",
      precio: "",
      subtotal: 0,
    };

    // Crear una nueva matriz de detalles con el nuevo detalle agregado
    const updatedDetalles = [...Detalles, newDetail];

    // Establecer los detalles actualizados
    setDetalles(updatedDetalles);

    // Mostrar el campo de detalles cuando se agrega un detalle
    setShowDetalleField(true);
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
https://softshirt-1c3fad7d72e8.herokuapp.com
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
https://softshirt-1c3fad7d72e8.herokuapp.com
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

  const validar = () => {
    let errorMessage = "";

    if (!IdCliente) {
      errorMessage = "Selecciona un cliente";
      setErrors({ IdCliente: errorMessage });
      return;
    }

    if (Detalles.length === 0) {
      errorMessage = "Agrega al menos un detalle de compra";
      setErrors({ Detalles: errorMessage });
      return;
    }

    if (Detalles.some((detalle) => !detalle.cantidad || !detalle.precio)) {
      errorMessage =
        "Ingresa una cantidad y un precio válido para cada detalle";
      setErrors({ Detalles: errorMessage });
      return;
    }

    if (hayAlertas()) {
      return;
    }
    console.log(Detalles);
    console.log(Fecha);
    console.log(Total);

    // return;

    enviarSolicitud("POST", {
      IdCliente: IdCliente,
      Fecha: Fecha,
      Total: totalCompra,
      Detalles: Detalles,
      idImagenComprobante: "0",
      imagenComprobante: "0",
      intentos: 3,
      IdEstadoPedido: 1,
    });
  };

  const enviarSolicitud = async (metodo, parametros) => {
    console.log(parametros);
    try {
      let urlRequest = url;
      if (metodo === "PUT" || metodo === "DELETE") {
        urlRequest = `${url}/${parametros.IdCompra}`;
      }

      const respuesta = await axios({
        method: metodo,
        url: urlRequest,
        data: parametros,
      });

      show_alerta({
        message: respuesta.data.message,
        type: "success",
      });

      $(".close").click();

    setLoading(true); // Mostrar el loader antes de realizar la solicitud

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

          // return;https://softshirt-1c3fad7d72e8.herokuapp.com

          await axios.put(`https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos/${idPed}`, {
            Estado: idEstPed,
          });

          // Actualizar la lista de pedidos
          getPedidos();
          $(".close").click();

          show_alerta({
            message: "El pedido fue modificado correctamente",
            type: "success",
          });
        } catch (error) {
          show_alerta({
            message: "Hubo un error al cancelar el pedido",
            type: "error",
          });
        }
      } else {
        show_alerta({
          message: "El pedido NO fue cancelado",
          type: "info",
        });
      }
    });
  };

  const anularPedido = async (idPedido) => {
    try {
      console.log(idPedido);

      // return;https://softshirt-1c3fad7d72e8.herokuapp.com
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
// https://softshirt-1c3fad7d72e8.herokuapp.com
          const respuesta = await axios.put(
            `https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos/${idPedido}`,
            {
              Estado: 2,
            }
          );

          let message = respuesta.data.message;

          console.log(message);


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
          console.log(error);
          
          show_alerta({
            message: "Hubo un error al cancelar el pedido",
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
// https://softshirt-1c3fad7d72e8.herokuapp.com
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
    const filteredCompras = pedidos.filter((compra) =>
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

   
      {/* Inicio modal ver detalle pedido */}
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
                Detalle del Pedido
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
                      {/* Acordeon detalles del pedido */}
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
                              Detalles del pedido
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
                                  <label>Cliente</label>
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
                                  <label>Fecha</label>
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
                                      <th>Diseño</th>
                                      <th>Talla</th>
                                      <th>Color</th>
                                      <th>Cantidad</th>
                                      <th>Precio</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {pedidoSeleccionado.DetallesPedidosProductos.map(
                                      (detalle, index) => (
                                        <tr key={index}>
                                          <td>{detalle.Producto.Referencia}</td>
                                          <td>
                                          <button
                                            onClick={() =>{
                                              setImagenDisenioPedido(detalle.Producto.Disenio.ImagenReferencia);

                                              console.log(ImagenDisenioPedido);
                                              
                                            }}
                                            className={"btn btn-info btn-sm"}
                                            data-toggle="modal"
                                            data-target="#modalVerdisenio"
                                            title="Ver diseño"
                                          >
                                            <i className="fas fa-info-circle"></i>
                                          </button>
                                          </td>
                                          <td>{detalle.Insumo.Talla.Talla}</td>
                                          <td>{detalle.Insumo.Color.Color}</td>
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

                      {/* Acordeon detalles del cliente */}
                      <div className="card">
                        <div className="card-header" id="headingThree">
                          <h2 className="mb-0">
                            <button
                              className="btn btn-link btn-block text-left"
                              type="button"
                              data-toggle="collapse"
                              data-target="#collapseThree"
                              aria-expanded="false"
                              aria-controls="collapseThree"
                            >
                              Detalles del cliente
                            </button>
                          </h2>
                        </div>

                        {pedidoSeleccionado && (
                          <div
                            id="collapseThree"
                            className="collapse"
                            aria-labelledby="headingThree"
                            data-parent="#accordionExample"
                          >
                            <div className="card-body">
                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label>Tipo de documento</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      pedidoSeleccionado.Cliente.TipoDocumento == "CC" ? "Cedula de ciudadanía" : "Cedula de extranjeria"
                                    }
                                    disabled
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label>Número de documento</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={pedidoSeleccionado.Cliente.NroDocumento}
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label>Nombre y apellido</label>
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
                                  <label>Télefono</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={pedidoSeleccionado.Cliente.Telefono}
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="row mb-3">
                                <div className="col-md-6">
                                  <label>Direcion de domicilio</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      pedidoSeleccionado.Cliente.Direccion
                                    }
                                    disabled
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label>Correo electrónico</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={pedidoSeleccionado.Cliente.Correo}
                                    disabled
                                  />
                                </div>
                              </div>



                            </div>
                          </div>
                        )}
                      </div>

                      {/* Acordeon comprobante del pedido */}
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
                                    Subir Comprobante
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
                                pedidoSeleccionado?.ImagenComprobante != "0" &&
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
                                      Aceptar Comprobante
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
                                      Rechazar Comprobante
                                    </button>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                      </div>
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
      {/* Fin modal ver detalle pedido */}

      {/* Inicio modal de ver diseño*/}
      <div
        className="modal fade"
        id="modalVerdisenio"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalVerdisenioLabel"
        // aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-md" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalVerdisenioLabel"> Ver diseño</h5>
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

                  {pedidoSeleccionado && (
                    <>

                      <div className="container">
                        <label style={{display:"block"}}>Imagen de referencia</label>

                        <div className="d-flex justify-content-center py-4 mx-3">
                          <img
                            src={ImagenDisenioPedido}
                            alt="Vista previa imagen del diseño"
                            style={{
                              width: "170px",
                              height: "150px",
                              display: "block",
                              border: "1px solid black",
                            }}
                          />
                        </div>
                      </div>


                    </>
                  )}
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
              {/* <button
                type="button"
                className="btn btn-primary"
                onClick={() => cambiarEstadoPedido()}
              >
                Actualizar
              </button> */}
            </div>
          </div>
        </div>
      </div>
      {/* fin modal de ver diseño*/}


      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          {/* <h1 className="h3 mb-3 text-center text-dark">Gestión de Pedidos</h1> */}
        </div>

        {/* <!-- Tabla de Pedidos --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex justify-content-between align-items-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {/* Si un usuario esta logueado renderizara la tabla de admin, si no renderizara la tabla del cliente  */}
              {auth.idUsuario ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPedidos.map((pedido) => (
                      <tr
                        key={pedido.IdPedido}
                        className={
                          pedido.IdEstadoPedido === 4 ||
                          pedido.IdEstadoPedido === 3
                            ? "table-secondary"
                            : ""
                        }
                      >
                        <td>{getClienteName(pedido.IdCliente)}</td>

                        <td>{formatearFecha(pedido.Fecha)}</td>

                        <td>{formatCurrency(pedido.Total)}</td>

                        <td>
                          {convertEstadoPedidoIdToName(pedido.IdEstadoPedido)}
                        </td>

                        <td>
                          <div className="d-flex">
                            {pedido.IdEstadoPedido === 4 ||
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
                                className="btn btn-warning btn-sm mr-2 rounded-icon"
                                title="Editar"
                              >
                                <i className="fas fa-sync-alt"></i>
                              </button>
                            )}

                            <button
                              onClick={() =>
                                handleDetallePedido(pedido.IdPedido)
                              }
                              className={`btn btn-sm ${
                                pedido.IdEstadoPedido === 9 ||
                                pedido.IdEstadoPedido === 9
                                  ? "btn-secondary mr-2 rounded-icon"
                                  : "btn-info"
                              }`}
                              disabled={
                                pedido.IdEstadoPedido === 9 ||
                                pedido.IdEstadoPedido === 9
                              }
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
              ) : (
                // tabla de cliente
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPedidos.map((pedido) => (
                      <tr
                        key={pedido.IdPedido}
                        className={
                          pedido.IdEstadoPedido === 4 ||
                          pedido.IdEstadoPedido === 3
                            ? "table-secondary"
                            : ""
                        }
                      >
                        <td>{getClienteName(pedido.IdCliente)}</td>

                        <td>{formatearFecha(pedido.Fecha)}</td>

                        <td>{formatCurrency(pedido.Total)}</td>

                        <td>
                          {convertEstadoPedidoIdToName(pedido.IdEstadoPedido)}
                        </td>

                        <td>
                          <div className="d-flex">
                            {pedido.IdEstadoPedido === 4 ||
                            pedido.IdEstadoPedido === 2 ||
                            pedido.IdEstadoPedido == 3 ? (
                              <button
                                className="btn btn-secondary btn-sm mr-2 rounded-icon"
                                disabled
                              >
                                <i className="fas fa-sync-alt"></i>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  idPedidoActualizarEstado = pedido.IdPedido;
                                  // setIdEstdosPedidoActualizar(pedido.IdEstadoPedido);

                                  cambiarEstadoPedido();
                                }}
                                className="btn btn-warning btn-sm mr-2 rounded-icon"
                                title="Cancelar pedido"
                              >
                                <i className="fas fa-sync-alt"></i>
                              </button>
                            )}

                            <button
                              onClick={() =>
                                handleDetallePedido(pedido.IdPedido)
                              }
                              className={`btn btn-sm ${
                                pedido.IdEstadoPedido === 9 ||
                                pedido.IdEstadoPedido === 9
                                  ? "btn-secondary mr-2 rounded-icon"
                                  : "btn-info"
                              }`}
                              disabled={
                                pedido.IdEstadoPedido === 9 ||
                                pedido.IdEstadoPedido === 9
                              }
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
              )}
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
