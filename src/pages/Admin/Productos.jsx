import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import show_alerta from "../../components/Show_Alerta/show_alerta";
import { useAuth } from "../../context/AuthProvider";


export const Catalogo = () => {
  const url = "http://localhost:3000/api/productos";
  const {auth} = useAuth();

  const [productosAdmin, setProductosAdmin] = useState([]);
  const [productosCliente, setProductosCliente] = useState([]);
  const [Disenios, setDisenios] = useState([]);
  const [Insumos, setInsumos] = useState([]);
  const [Tallas, setTallas] = useState([]);
  const [TallaDetalle, setTallaDetalle] = useState([]);
  const [ColorDetalle, setColorDetalle] = useState([]);
  const [IdDisenio, setIdDisenio] = useState("");
  const [IdProducto, setIdProducto] = useState("");
  const [IdInsumo, setIdInsumo] = useState("");

  const [TallaCliente, setTallaCliente] = useState([]);

  const [ColorCliente, setColorCliente] = useState([]);

  const [Referencia, setReferencia] = useState("");
  const [Cantidad, setCantidad] = useState("");
  const [ValorVenta, setValorVenta] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");

  const [errors, setErrors] = useState({
    IdDisenio: 0,
    IdInsumo: 0,
    Referencia: "",
    Cantidad: 0,
    ValorVenta: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedDisenio, setSelectedDisenio] = useState(null);
  const [selectedInsumo, setSelectedInsumo] = useState(null);

  // Variables para el detalle del producto
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
  const [disenioSeleccionado, setDisenioSeleccionado] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  let productosTotales;

  useEffect(() => {
    getProductosAdmin();
    getDisenios();
    getInsumos(); // Obtener los Disenios cuando el componente se monta
    getTallas();
  }, []);

  const getProductosAdmin = async () => {
    const respuesta = await axios.get(url);

    productosTotales=respuesta.data;

    setProductosAdmin(respuesta.data);
    console.log(respuesta.data);

    getProductosCliente();
  };

  const getProductosCliente = async  () => {
    try {
      const productosFiltrados = productosTotales.filter(producto => producto.IdUsuario == auth.idCliente);

      // console.log(pedidosTotales);
      console.log(productosFiltrados);

      setProductosCliente(productosFiltrados);

    } catch (error) {
      console.log(error);

      show_alerta("Error al obtener los pedidos", "error");
    }
  };

  const getDisenios = async () => {
    const respuesta = await axios.get("http://localhost:3000/api/disenios");
    const DiseniosActivos = respuesta.data.filter(
      (disenio) => disenio.Estado === "Activo"
    );
    console.log(DiseniosActivos);

    setDisenios(DiseniosActivos);
  };

  const getInsumos = async () => {
    const respuesta = await axios.get("http://localhost:3000/api/insumos");
    const InsumosActivas = respuesta.data.filter(
      (insumo) => insumo.Estado === "Activo"
    );
    setInsumos(InsumosActivas);
  };

  const getTallas = async () => {
    const respuesta = await axios.get("http://localhost:3000/api/tallas");
    const TallasActivas = respuesta.data.filter(
      (talla) => talla.Estado === "Activo"
    );
    console.log(TallasActivas);

    setTallas(TallasActivas);
  };

  const openModal = (op, insumo = null) => {
    if (op === 1) {
      // Crear producto
      setIdProducto("");
      setIdDisenio("");
      setIdInsumo("");
      setReferencia("");
      setCantidad("");
      setValorVenta("");
      setOperation(1);
      setTitle("Crear Producto");

      setSelectedInsumo(null);

      const errors = {
        Referencia: "",
        Cantidad: "",
        ValorVenta: "",
      };
      setErrors(errors);
    } else if (op === 2 && insumo) {
      // Actualizar producto
      setIdProducto(insumo.IdProducto);
      setIdDisenio(insumo.IdDisenio);
      setIdInsumo(insumo.IdInsumo);
      setReferencia(insumo.Referencia);
      setCantidad(insumo.Cantidad);
      setValorVenta(insumo.ValorVenta);
      setOperation(2);
      setTitle("Actualizar Datos");
      setErrors({
        IdDisenio: 0,
        IdInsumo: 0,
        Referencia: "",
        Cantidad: 0,
        ValorVenta: 0,
      });
      const errors = {
        Referencia: validateReferencia(insumo.Referencia),
        Cantidad: validateCantidad(insumo.Cantidad),
        ValorVenta: validateValorVenta(insumo.ValorVenta),
      };
      setErrors(errors);
    }else if(op === 3){

      // Crear producto
      setIdProducto("");
      setIdDisenio("");
      setIdInsumo("");
      setColorCliente("");
      setTallaCliente("");
      setReferencia("");
      setCantidad("");
      setValorVenta("");
      setOperation(1);
      setTitle("Crea tu camiseta");

      setSelectedInsumo(null);

      const errors = {
        Referencia: "",
        Cantidad: "",
        ValorVenta: "",
      };
      setErrors(errors);

    }
  };

  const validar = () => {
    // Inicializa un objeto para almacenar errores
    let errores = {};

    // Limpieza de datos y validación de campos
    const cleanedReferencia = Referencia.trim();
    const cleanedCantidad = Cantidad.trim();
    const cleanedValorVenta = ValorVenta.trim();

    // Validación de campos
    if (!IdDisenio) {
      errores.IdDisenio = "Seleccione un diseño";
    }
    if (!IdInsumo) {
      errores.IdInsumo = "Seleccione un insumo";
    }
    if (cleanedReferencia === "") {
      errores.Referencia = "Referencia es requerida";
    }
    if (cleanedCantidad === "") {
      errores.Cantidad = "Cantidad es requerida";
    }
    if (cleanedValorVenta === "") {
      errores.ValorVenta = "Valor de venta es requerido";
    }

    // Actualiza el estado de errores
    setErrors(errores);

    // Mostrar alerta si hay errores
    if (Object.keys(errores).length > 0) {
      show_alerta({
        message: "Por favor, completa todos los campos correctamente",
        type: "error",
      });
      return false;
    }

    // Si no hay errores, retorna true para permitir el envío de datos
    return true;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Actualizar el estado de los campos según el id
    if (id === "Referencia") {
      setReferencia(value);
    } else if (id === "Cantidad") {
      setCantidad(value);
    } else if (id === "ValorVenta") {
      setValorVenta(value);
    } else if (id === "IdDisenio") {
      setIdDisenio(value);
    } else if (id === "IdInsumo") {
      setIdInsumo(value);
    }

    // Validar en tiempo real
    validar();
  };

  // Función para guardar producto
  const guardarProducto = async () => {
    // Validar campos
    if (!validar()) return;

    // Realizar validaciones específicas
    const disenioSeleccionado = Disenios.find(
      (disenio) => disenio.IdDisenio == IdDisenio
    );

    const insumoSeleccionado = Insumos.find(
      (insumo) => insumo.IdInsumo == IdInsumo
    );

    // Validación en el diseño
    if (!disenioSeleccionado) {
      show_alerta({
        message: "Diseño no encontrado",
        type: "error",
      });
      return;
    }

    // Validación en el insumo
    if (!insumoSeleccionado) {
      show_alerta({
        message: "Insumo no encontrado",
        type: "error",
      });
      return;
    }

    // Si todas las validaciones son correctas, se envía la solicitud
    try {
      if (operation === 1) {
        await enviarSolicitud("POST", {
          IdDisenio,
          IdInsumo,
          IdUsuario: auth.idUsuario || auth.idCliente,
        Referencia: Referencia.trim(),
          Cantidad: Cantidad,
          ValorVenta: ValorVenta,
        });
        show_alerta({
          message: "Producto creado con éxito",
          type: "success",
        });
      } else if (operation === 2) {
        await enviarSolicitud("PUT", {
          IdProducto,
          IdDisenio,
          IdInsumo,
          Referencia: Referencia.trim(),
          Cantidad: Cantidad,
          ValorVenta: ValorVenta,
        });
        show_alerta({
          message: "Producto actualizado con éxito",
          type: "success",
        });
      }
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
      console.log(error);
    } finally {
      document.getElementById("btnCerrarCliente").click();
      getProductosAdmin();
    }
  };

  // Función para validar la referencia
  const validateReferencia = (value) => {
    if (!value) {
      return "Escribe la referencia";
    }
    // Validar que la referencia siga el patrón TST-001
    if (!/^[A-Z]{3}-\d{3}$/.test(value)) {
      return "La referencia debe ser en el formato AAA-000";
    }
    return "";
  };

  // Función para validar la cantidad
  const validateCantidad = (value) => {
    if (!value) {
      return "Escribe la cantidad";
    }
    if (!/^\d+$/.test(value)) {
      return "La cantidad solo puede contener números";
    }
    if (selectedInsumo && value > selectedInsumo.Cantidad) {
      return "La cantidad no puede superar a la del insumo seleccionado";
    }
    return "";
  };

  // Función para validar el valorVenta
  const validateValorVenta = (value) => {
    if (!value) {
      return "Escribe el valor de venta";
    }
    if (!/^\d+(\.\d+)?$/.test(value)) {
      return "El valor de venta solo puede contener números y decimales";
    }
    return "";
  };

  const convertTallaIdToName = (tallaId) => {
    const talla = Tallas.find((talla) => talla.IdTalla == tallaId);
    console.log(talla);
    return talla ? talla.Talla : "";
  };

  const handleChangeIdDisenio = (e) => {
    const value = e.target.value;

    const disenio = Disenios.find((d) => d.IdDisenio == value);

    console.log(disenio);

    setIdDisenio(value);
    setSelectedDisenio(disenio);
  };

  const handleChangeIdInsumo = (e) => {
    const value = e.target.value;

    const insumo = Insumos.find((i) => i.IdInsumo == value);

    console.log(insumo);

    setSelectedInsumo(insumo);
    setIdInsumo(value);
  };

  // Función para manejar cambios en la referencia
  const handleChangeReferencia = (e) => {
    let value = e.target.value.trim();
    if (value.length > 7) {
      value = value.slice(0, 7);
    }
    setReferencia(value);
    const errorMessage = validateReferencia(value);
    setErrors((prevState) => ({
      ...prevState,
      Referencia: errorMessage,
    }));
  };

  // Función para manejar cambios en la cantidad
  const handleChangeCantidad = (e) => {
    let value = e.target.value;
    setCantidad(value);
    const errorMessage = validateCantidad(value);
    setErrors((prevState) => ({
      ...prevState,
      Cantidad: errorMessage,
    }));
  };
  // Función para manejar cambios en el valorVenta
  const handleChangeValorVenta = (e) => {
    let value = e.target.value;
    setValorVenta(value);

    // Obtener el insumo seleccionado para la validación
    const insumoSeleccionado = Insumos.find(
      (insumo) => insumo.IdInsumo === IdInsumo
    );

    let errorMessage = validateValorVenta(value);

    if (
      insumoSeleccionado &&
      parseFloat(value) <= parseFloat(insumoSeleccionado.ValorCompra)
    ) {
      errorMessage =
        "El valor de venta debe ser mayor que el valor de compra del insumo";
    }

    setErrors((prevState) => ({
      ...prevState,
      ValorVenta: errorMessage,
    }));
  };

  // Función para renderizar los mensajes de error
  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  const enviarSolicitud = async (metodo, parametros) => {
    let urlRequest =
      metodo === "PUT" || metodo === "DELETE"
        ? `${url}/${parametros.IdProducto}`
        : url;

    try {
      let respuesta;
      if (metodo === "POST") {
        console.log(parametros);
        respuesta = await axios.post(url, parametros);
      } else if (metodo === "PUT") {
        respuesta = await axios.put(urlRequest, parametros);
      } else if (metodo === "DELETE") {
        respuesta = await axios.delete(urlRequest);
      }

      const msj = respuesta.data.message;
      show_alerta({
        message: msj,
        type: "success",
      });
      document.getElementById("btnCerrarCliente").click();
      getProductosAdmin();

      if (metodo === "POST") {
        show_alerta({
          message: "Producto creado con éxito",
          type: "success",
        });
      } else if (metodo === "PUT") {
        show_alerta({
          message: "Producto actualizado con éxito",
          type: "success",
        });
      } else if (metodo === "DELETE") {
        show_alerta({
          message: "Producto eliminado con éxito",
          type: "success",
        });
      }
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
      console.log(error);
    }
  };

  const deleteInsumo = (IdProducto, Referencia) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar el producto ${Referencia}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      showClass: {
        popup: "swal2-show",
        backdrop: "swal2-backdrop-show",
        icon: "swal2-icon-show",
      },
      hideClass: {
        popup: "swal2-hide",
        backdrop: "swal2-backdrop-hide",
        icon: "swal2-icon-hide",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setIdProducto(IdProducto);
        enviarSolicitud("DELETE", { IdProducto: IdProducto }).then(() => {
          // Calcular el índice del insumo eliminado en la lista filtrada
          const index = filteredproductosAdmin.findIndex(
            (insumo) => insumo.IdProducto === IdProducto
          );

          // Determinar la página en la que debería estar el insumo después de la eliminación
          const newPage =
            Math.ceil((filteredproductosAdmin.length - 1) / itemsPerPage) || 1;

          // Establecer la nueva página como la página actual
          setCurrentPage(newPage);

          // Actualizar la lista de productosAdmin eliminando el insumo eliminado
          setProductosAdmin((prevproductosAdmin) =>
            prevproductosAdmin.filter(
              (insumo) => insumo.IdProducto !== IdProducto
            )
          );

          show_alerta({
            message: "El producto fue eliminado correctamente",
            type: "success",
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        show_alerta({
          message: "El producto NO fue eliminado",
          type: "info",
        });
      } else if (
        result.dismiss === Swal.DismissReason.backdrop ||
        result.dismiss === Swal.DismissReason.esc
      ) {
        show_alerta({
          message: "El producto NO fue eliminado",
          type: "info",
        });
      }
    });
  };

  const cambiarPublicacionProducto = async (IdProducto) => {
    try {
      const productoActual = productosAdmin.find(
        (producto) => producto.IdProducto === IdProducto
      );

      if (productoActual.Cantidad == 0) {
        show_alerta({message: "No se puede cambiar la publicación, agrega al menos una cantidad al producto",type:"warning"});
        return;
      }

      const nuevoEstado =
        productoActual.Publicacion === "Activo" ? "Inactivo" : "Activo";

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar la publicación del producto ${productoActual.Referencia}?`,
        icon: "question",
        text: `La publicación actual del producto es: ${productoActual.Publicacion}. ¿Desea cambiarlo a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar publicación",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const parametros = {
            IdProducto,
            IdDisenio: productoActual.IdDisenio,
            IdInsumo: productoActual.IdInsumo,
            Referencia: productoActual.Referencia,
            Cantidad: productoActual.Cantidad,
            ValorVenta: productoActual.ValorVenta,
            Publicacion: nuevoEstado,
            Estado: productoActual.Estado,
          };

          console.log(parametros);

          const response = await axios.put(`${url}/${IdProducto}`, parametros);

          if (response.status === 200) {
            setProductosAdmin((prevProducto) =>
              prevProducto.map((producto) =>
                producto.IdProducto === IdProducto
                  ? { ...producto, Publicacion: nuevoEstado }
                  : producto
              )
            );

            show_alerta({
              message: "La publicación del producto cambiada con éxito",
              type: "success",
            });
          }
        } else {
          show_alerta({
            message: "No se ha cambiado la publicación del producto",
            type: "info",
          });
        }
      });
    } catch (error) {
      console.error("Error updating state:", error);
      show_alerta({
        message: "Error cambiando la publicación del producto",
        type: "error",
      });
    }
  };

  const cambiarEstadoProducto = async (IdProducto) => {
    try {
      const productoActual = productosAdmin.find(
        (producto) => producto.IdProducto === IdProducto
      );
      let nuevoEstadoPublicacion;

      let parametros;

      const nuevoEstado =
        productoActual.Estado === "Activo" ? "Inactivo" : "Activo";

        if (nuevoEstado == "Inactivo") {
          nuevoEstadoPublicacion= "Inactivo";

          parametros = {
            IdProducto,
            IdDisenio: productoActual.IdDisenio,
            IdInsumo: productoActual.IdInsumo,
            Referencia: productoActual.Referencia,
            Cantidad: productoActual.Cantidad,
            ValorVenta: productoActual.ValorVenta,
            Publicacion: nuevoEstadoPublicacion,
            Estado: nuevoEstado,
          };
        }else{
          nuevoEstadoPublicacion= productoActual.Publicacion;


          parametros = {
            IdProducto,
            IdDisenio: productoActual.IdDisenio,
            IdInsumo: productoActual.IdInsumo,
            Referencia: productoActual.Referencia,
            Cantidad: productoActual.Cantidad,
            ValorVenta: productoActual.ValorVenta,
            Publicacion: nuevoEstadoPublicacion,
            Estado: nuevoEstado,
          };
        }


      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar el estado del producto ${productoActual.Referencia}?`,
        icon: "question",
        text: `El estado actual del producto es: ${productoActual.Estado}. ¿Desea cambiarlo a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {

          console.log(parametros);
          
          

          const response = await axios.put(`${url}/${IdProducto}`, parametros);

          if (response.status === 200) {
            setProductosAdmin((prevProducto) =>
              prevProducto.map((producto) =>
                producto.IdProducto === IdProducto
                  ? { ...producto, Publicacion: nuevoEstadoPublicacion, Estado: nuevoEstado }
                  : producto
              )
            );

            show_alerta({
              message: "Estado del producto cambiado con éxito",
              type: "success",
            });
          }
        } else {
          show_alerta({
            message: "No se ha cambiado el estado del producto",
            type: "info",
          });
        }
      });
    } catch (error) {
      console.error("Error updating state:", error);
      show_alerta({
        message: "Error cambiando el estado del producto",
        type: "error",
      });
    }
  };

  const convertDisenioIdToName = (disenioId) => {
    const disenio = Disenios.find((disenio) => disenio.IdDisenio === disenioId);
    return disenio ? disenio.NombreDisenio : "";
  };

  const convertInsumoIdToName = (insumoId) => {
    const insumo = Insumos.find((insumo) => insumo.IdInsumo === insumoId);
    return insumo ? insumo.Referencia : "";
  };

  const handleDetalleProducto = async (idProducto) => {
    try {
      const respuestaProducto = await axios.get(
        `http://localhost:3000/api/productos/${idProducto}`
      );

      const producto = respuestaProducto.data;

      const respuestaInsumo = await axios.get(
        `http://localhost:3000/api/insumos/${producto.IdInsumo}`
      );

      const respuestaDisenio = await axios.get(
        `http://localhost:3000/api/disenios/${producto.IdDisenio}`
      );

      const insumo = respuestaInsumo.data;
      const disenio = respuestaDisenio.data;

      const respuestaColorInsumo = await axios.get(
        `http://localhost:3000/api/colores/${insumo.IdColor}`
      );

      const respuestaTallaInsumo = await axios.get(
        `http://localhost:3000/api/tallas/${insumo.IdTalla}`
      );

      const colorInsumo = respuestaColorInsumo.data;
      const tallaInsumo = respuestaTallaInsumo.data;

      console.log("Detalle de producto:", producto);
      console.log("Detalle de insumo:", insumo);
      console.log("Detalle de diseno:", disenio);
      console.log("Detalle de colorInsumo:", colorInsumo);
      console.log("Detalle de tallaInsumo:", tallaInsumo);

      setProductoSeleccionado(producto);
      setDisenioSeleccionado(disenio);
      setInsumoSeleccionado(insumo);
      setColorDetalle(colorInsumo);
      setTallaDetalle(tallaInsumo);

      $("#modalDetalleProducto").modal("show");
    } catch (error) {
      show_alerta({
        message: "Error al obtener los detalles del diseño",
        type: "error",
      });
    }
  };

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Resetear la página actual al cambiar el término de búsqueda
  };

  
  let totalPages;
  let currentproductosAdmin;

  if (auth.idUsuario) {
    // Filtrar los productosAdmin según el término de búsqueda
    const filteredproductosAdmin = productosAdmin.filter((insumo) => {
    const colorName = convertDisenioIdToName(insumo.IdDisenio);
    const tallaName = convertInsumoIdToName(insumo.IdInsumo);
    const referencia = insumo.Referencia ? insumo.Referencia.toString() : "";
    const cantidad = insumo.Cantidad ? insumo.Cantidad.toString() : "";
    const valorVenta = insumo.ValorVenta ? insumo.ValorVenta.toString() : "";
    const estado = insumo.Estado ? insumo.Estado.toString() : "";

      return (
        colorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tallaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cantidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        valorVenta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estado.toLowerCase().includes(searchTerm.toLocaleLowerCase())
      );
    });

    // Aplicar paginación a los productosAdmin filtrados
    totalPages = Math.ceil(filteredproductosAdmin.length / itemsPerPage);
     currentproductosAdmin = filteredproductosAdmin.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  }else{
    // Filtrar los productosAdmin según el término de búsqueda
    const filteredproductoClientes = productosCliente.filter((insumo) => {
      const colorName = convertDisenioIdToName(insumo.IdDisenio);
      const tallaName = convertInsumoIdToName(insumo.IdInsumo);
      const referencia = insumo.Referencia ? insumo.Referencia.toString() : "";
      const cantidad = insumo.Cantidad ? insumo.Cantidad.toString() : "";
      const valorVenta = insumo.ValorVenta ? insumo.ValorVenta.toString() : "";
      const estado = insumo.Estado ? insumo.Estado.toString() : "";
  
        return (
          colorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tallaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cantidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
          valorVenta.toLowerCase().includes(searchTerm.toLowerCase()) ||
          estado.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        );
      });
  
      // Aplicar paginación a los productosAdmin filtrados
      totalPages = Math.ceil(filteredproductoClientes.length / itemsPerPage);
       currentproductosAdmin = filteredproductoClientes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
  }


  



  function formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  }

  const precioSugerido = (precioDisenio, precionInsumo) => {
    let subTotal = precioDisenio + precionInsumo;
    let margen = subTotal * 0.3;
    let total = subTotal + margen;

    return formatCurrency(total);
  };

  return (
    <>
      {/* Modal crear producto */}
      <div
        className="modal fade"
        id="modalCliente"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalClienteLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalClienteLabel">
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
              <form id="crearClienteForm">
                {errors.general && (
                  <div className="alert alert-danger" role="alert">
                    {errors.general}
                  </div>
                )}
                <div className="form-row">
                  {/* Diseño del Producto */}
                  <div className="form-group col-md-5">
                    <label htmlFor="idDisenio">Diseño del Producto:</label>
                    <select
                      className={`form-control ${
                        errors.IdDisenio ? "is-invalid" : ""
                      }`}
                      id="idDisenio"
                      value={IdDisenio}
                      onChange={(e) => handleChangeIdDisenio(e)}
                      required
                    >
                      <option value="" disabled>
                        Seleccione un Diseño
                      </option>
                      {Disenios.map((disenio) => (
                        <option
                          key={disenio.IdDisenio}
                          value={disenio.IdDisenio}
                        >
                          {disenio.NombreDisenio}
                        </option>
                      ))}
                    </select>
                    {errors.IdDisenio && (
                      <div className="invalid-feedback">{errors.IdDisenio}</div>
                    )}
                  </div>

                  {/* ToolTip imagen de referencia */}
                  <div className="col-md-1 mt-4 pt-3">
                    <i className="tooltipReferenceImage fas fa-info-circle">
                      {selectedDisenio && (
                        <span className="tooltiptext">
                          <img
                            src={selectedDisenio.ImagenReferencia}
                            alt={selectedDisenio.NombreDisenio}
                            style={{ width: "150px", height: "100px" }}
                          />
                        </span>
                      )}
                    </i>
                  </div>

                  {/* Insumo del Producto */}
                  <div className="form-group col-md-5">
                    <label htmlFor="idInsumo">Insumo del Producto:</label>
                    <select
                      className={`form-control ${
                        errors.IdInsumo ? "is-invalid" : ""
                      }`}
                      id="idInsumo"
                      value={IdInsumo}
                      onChange={(e) => handleChangeIdInsumo(e)}
                      required
                    >
                      <option value="" disabled>
                        Seleccione un Insumo
                      </option>
                      {Insumos.map((insumo) => (
                        <option key={insumo.IdInsumo} value={insumo.IdInsumo}>
                          {insumo.Referencia}
                        </option>
                      ))}
                    </select>
                    {errors.IdInsumo && (
                      <div className="invalid-feedback">{errors.IdInsumo}</div>
                    )}
                  </div>

                  {/* ToolTip talla del producto */}
                  <div className="col-md-1 mt-4 pt-3">
                    <i className="tooltipReferenceImage fas fa-info-circle">
                      {selectedInsumo && (
                        <span className="tooltiptext">
                          {`La talla del insumo es: ${convertTallaIdToName(
                            selectedInsumo.IdTalla
                          )}`}
                        </span>
                      )}
                    </i>
                  </div>

                  {/* Referencia del Producto */}
                  <div className="form-group col-md-6">
                    <label htmlFor="Referencia">Referencia del Producto:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.Referencia ? "is-invalid" : ""
                      }`}
                      id="Referencia"
                      placeholder="Ingrese la referencia del producto"
                      required
                      value={Referencia}
                      onChange={handleChangeReferencia}
                    />
                    {errors.Referencia && (
                      <div className="invalid-feedback">
                        {errors.Referencia}
                      </div>
                    )}
                  </div>

                  {/* Cantidad del producto */}
                  <div className="form-group col-md-6">
                    <label htmlFor="cantidadProducto">Cantidad:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.Cantidad ? "is-invalid" : ""
                      }`}
                      id="cantidadProducto"
                      placeholder={
                        selectedInsumo
                          ? `La cantidad máxima del insumo es: ${selectedInsumo.Cantidad}`
                          : "Ingrese la cantidad del insumo"
                      }
                      required
                      value={Cantidad}
                      onChange={handleChangeCantidad}
                    />
                    {errors.Cantidad && (
                      <div className="invalid-feedback">{errors.Cantidad}</div>
                    )}
                  </div>

                  {/* Valor venta del producto */}
                  <div className="form-group col-md-12">
                    <label htmlFor="direccionCliente">
                      Valor de la venta del producto:
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.ValorVenta ? "is-invalid" : ""
                      }`}
                      id="direccionCliente"
                      placeholder={
                        selectedInsumo
                          ? `Precio sugerido para el producto es: ${precioSugerido(
                              selectedDisenio.PrecioDisenio,
                              selectedInsumo.ValorCompra
                            )}`
                          : "Ingrese el valor del producto"
                      }
                      required
                      value={ValorVenta}
                      onChange={handleChangeValorVenta}
                    />
                    {errors.ValorVenta && (
                      <div className="invalid-feedback">
                        {errors.ValorVenta}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                id="btnCerrarCliente"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (validar()) {
                    guardarProducto();
                  }
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal crear producto */}


      {/* Modal crear producto cliente*/}
      <div
        className="modal fade"
        id="modalProductoCliente"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalClienteLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalClienteLabel">
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
              <form id="crearClienteForm">
                <div className="form-row">

                  {/* Diseño del Producto */}
                  <div className="form-group col-md-5">
                    <label htmlFor="idDisenio">Diseño del Producto:</label>
                    <select
                      className="form-control"
                      id="idDisenio"
                      value={IdDisenio}
                      onChange={(e) => handleChangeIdDisenio(e)}
                      required
                    >
                      <option value="" disabled>
                        Seleccione un Diseño
                      </option>
                      {Disenios.map((disenio) => (
                        <option
                          key={disenio.IdDisenio}
                          value={disenio.IdDisenio}
                        >
                          {disenio.NombreDisenio}
                        </option>
                      ))}
                    </select>

                    {IdDisenio === "" && (
                      <p className="text-danger">
                        Por favor, seleccione un diseño.
                      </p>
                    )}
                  </div>

                  {/* ToolTip imagen de referencia*/}
                  <div className="col-md-1 mt-4 pt-3">
                    <i className="tooltipReferenceImage fas fa-info-circle">
                      {selectedDisenio && (
                        <span className="tooltiptext">
                          <img
                            src={selectedDisenio.ImagenReferencia}
                            alt={selectedDisenio.NombreDisenio}
                            style={{ width: "150px", height: "100px" }}
                          />
                        </span>
                      )}
                    </i>
                  </div>

                  {/* Insumo del Producto */}
                  <div className="form-group col-md-5">
                    <label htmlFor="idInsumo">Insumo del Producto:</label>
                    <select
                      className="form-control"
                      id="idInsumo"
                      value={IdInsumo}
                      onChange={(e) => handleChangeIdInsumo(e)}
                      required
                    >
                      <option value="" disabled>
                        Seleccione un Insumo
                      </option>
                      {Insumos.map((insumo) => (
                        <option key={insumo.IdInsumo} value={insumo.IdInsumo}>
                          {insumo.Referencia}
                        </option>
                      ))}
                    </select>
                    {IdInsumo === "" && (
                      <p className="text-danger">
                        Por favor, seleccione un insumo.
                      </p>
                    )}
                  </div>

                  {/* ToolTip talla del producto*/}
                  {/* <div className="col-md-1 mt-4 pt-3">
                    <i className="tooltipReferenceImage fas fa-info-circle">
                      {selectedInsumo && (
                        <span className="tooltiptext">
                          {" "}
                          {`La talla del insumo es: ${convertTallaIdToName(
                            selectedInsumo.IdTalla
                          )}`}{" "}
                        </span>
                      )}
                    </i>
                  </div> */}

                  {/* Referencia del Producto*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="Referencia">Referencia del Producto:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.Referencia ? "is-invalid" : ""
                      }`}
                      id="Referencia"
                      placeholder="Ingrese la referencia del producto"
                      required
                      // disabled
                      value={Referencia}
                      onChange={handleChangeReferencia}
                    />
                    {renderErrorMessage(errors.Referencia)}
                  </div>

                  {/* Cantidad del producto */}
                  <div className="form-group col-md-6">
                    <label htmlFor="cantidadProducto">Cantidad:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.Cantidad ? "is-invalid" : ""
                      }`}
                      id="cantidadProducto"
                      placeholder={
                        selectedInsumo
                          ? `La cantidad maxima del insumo es: ${selectedInsumo.Cantidad}`
                          : "Ingrese la cantidad del insumo"
                      }
                      required
                      value={Cantidad}
                      onChange={handleChangeCantidad}
                    />
                    {renderErrorMessage(errors.Cantidad)}
                  </div>

                  {/* Valor venta del producto */}
                  <div className="form-group col-md-12">
                    <label htmlFor="direccionCliente">
                      Valor de la venta del producto:
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.ValorVenta ? "is-invalid" : ""
                      }`}
                      id="direccionCliente"
                      placeholder={
                        selectedInsumo
                          ? `Precio sugerido para el producto es: ${precioSugerido(
                              selectedDisenio.PrecioDisenio,
                              selectedInsumo.ValorCompra
                            )}`
                          : "Ingrese el valor del producto"
                      }
                      required
                      value={ValorVenta}
                      onChange={handleChangeValorVenta}
                    />
                    {renderErrorMessage(errors.ValorVenta)}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                id="btnCerrarCliente"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  guardarProducto();
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal crear producto cliente*/}



      {/* Inicio modal ver detalle diseño */}
      <div
        className="modal fade"
        id="modalDetalleProducto"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalDetalleDisenioLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalDetalleDisenioLabel">
                Detalle del diseño
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
                <form>
                  <div className="form-row">
                    <div className="accordion col-md-12" id="accordionExample">
                      {/* Acordeon detalles del producto */}
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
                              Detalles del Producto
                            </button>
                          </h2>
                        </div>

                        {productoSeleccionado && (
                          <div
                            id="collapseOne"
                            className="collapse show"
                            aria-labelledby="headingOne"
                            data-parent="#accordionExample"
                          >
                            <div className="card-body">
                              <div className="form-row">
                                {/* Nombre del diseño */}
                                <div className="form-group col-md-6">
                                  <label htmlFor="idDisenio">
                                    Diseño del Producto:
                                  </label>
                                  <input
                                    className="form-control"
                                    id="idDisenio"
                                    value={convertDisenioIdToName(
                                      productoSeleccionado.IdDisenio
                                    )}
                                    disabled
                                  />
                                </div>

                                {/* Referencia del insumo */}
                                <div className="form-group col-md-6">
                                  <label htmlFor="idInsumo">
                                    Insumo del Producto:
                                  </label>
                                  <input
                                    className="form-control"
                                    id="idInsumo"
                                    value={convertInsumoIdToName(
                                      productoSeleccionado.IdInsumo
                                    )}
                                    disabled
                                  />
                                </div>

                                {/* Referencia del producto */}
                                <div className="form-group col-md-6">
                                  <label htmlFor="Referencia">
                                    Referencia del Producto:
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="Referencia"
                                    value={productoSeleccionado.Referencia}
                                    disabled
                                  />
                                </div>

                                {/* Cantidad del producto */}
                                <div className="form-group col-md-6">
                                  <label htmlFor="nombreCliente">
                                    Cantidad:
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="nombreCliente"
                                    value={productoSeleccionado.Cantidad}
                                    disabled
                                  />
                                </div>

                                {/*Valor de la venta del producto */}
                                <div className="form-group col-md-12">
                                  <label htmlFor="direccionCliente">
                                    Valor de la venta del producto:
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="direccionCliente"
                                    value={productoSeleccionado.ValorVenta}
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Acordeon detalles del insumo */}
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
                              Detalles del Insumo
                            </button>
                          </h2>
                        </div>

                        {insumoSeleccionado && (
                          <div
                            id="collapseTwo"
                            className="collapse"
                            aria-labelledby="headingTwo"
                            data-parent="#accordionExample"
                          >
                            <div className="card-body">
                              <div className="form-row">
                                {/* Color del Insumo */}
                                <div className="form-group col-md-6">
                                  <label htmlFor="idColor">
                                    Color del Insumo:
                                  </label>
                                  <input
                                    className="form-control"
                                    id="idColor"
                                    value={ColorDetalle.Color}
                                    disabled
                                  />
                                </div>

                                {/* Talla del insumo */}
                                <div className="form-group col-md-6">
                                  <label htmlFor="idTalla">
                                    Talla del insumo:
                                  </label>
                                  <input
                                    className="form-control"
                                    id="idTalla"
                                    value={TallaDetalle.Talla}
                                    disabled
                                  />
                                </div>

                                {/* Referencia del insumo */}
                                <div className="form-group col-md-6">
                                  <label htmlFor="nroDocumentoCliente">
                                    Referencia del insumo:
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="nroDocumentoCliente"
                                    value={insumoSeleccionado.Referencia}
                                    disabled
                                  />
                                </div>

                                {/* Cantidad del insumo */}
                                <div className="form-group col-md-6">
                                  <label htmlFor="nombreCliente">
                                    Cantidad:
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="nombreCliente"
                                    value={insumoSeleccionado.Cantidad}
                                    disabled
                                  />
                                </div>

                                {/* Valor de la compra del insumo */}
                                <div className="form-group col-md-12">
                                  <label htmlFor="direccionCliente">
                                    Valor de la compra del insumo:
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="direccionCliente"
                                    value={formatCurrency(
                                      insumoSeleccionado.ValorCompra
                                    )}
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Acordeon detalles del diseño */}
                      <div className="card">
                        <div className="card-header" id="headingThree">
                          <h2 className="mb-0">
                            <button
                              className="btn btn-link btn-block text-left collapsed"
                              type="button"
                              data-toggle="collapse"
                              data-target="#collapseThree"
                              aria-expanded="false"
                              aria-controls="collapseThree"
                            >
                              Detalles del Diseño
                            </button>
                          </h2>
                        </div>

                        {disenioSeleccionado && (
                          <div
                            id="collapseThree"
                            className="collapse"
                            aria-labelledby="headingThree"
                            data-parent="#accordionExample"
                          >
                            <div className="card-body">
                              <div className="form-row">
                                {/* Nombre de diseño */}
                                <div className="form-group col-md-6">
                                  <label htmlFor="nombreDiseño">
                                    Nombre del Diseño:
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="nombreDiseño"
                                    value={disenioSeleccionado.NombreDisenio}
                                    disabled
                                  />
                                </div>

                                {/* Nombre de fuente*/}
                                <div className="form-group col-md-6">
                                  <label htmlFor="nombreFuente">Fuente:</label>
                                  <input
                                    className="form-control"
                                    id="nombreFuente"
                                    value={disenioSeleccionado.Fuente}
                                    disabled
                                  />
                                </div>

                                {/* Tamaño de fuente*/}
                                <div className="form-group col-md-6">
                                  <label htmlFor="tamanioFuente">
                                    Tamaño de Fuente:
                                  </label>
                                  <input
                                    className="form-control"
                                    id="tamanioFuente"
                                    value={disenioSeleccionado.TamanioFuente}
                                    disabled
                                  />
                                </div>

                                {/* Color de fuente*/}
                                <div className="form-group col-md-6">
                                  <label htmlFor="colorFuente">
                                    Color de Fuente:
                                  </label>

                                  {disenioSeleccionado.ColorFuente !==
                                  "No aplica" ? (
                                    <div className="d-flex align-items-center">
                                      <input
                                        type="color"
                                        className="form-control col-md-4"
                                        id="colorFuente"
                                        value={disenioSeleccionado.ColorFuente}
                                        disabled
                                      />

                                      <span className="ml-3" id="spanColor">
                                        {disenioSeleccionado.ColorFuente}
                                      </span>
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      className="form-control"
                                      disabled
                                      required
                                      value={"No aplica"}
                                    />
                                  )}
                                </div>

                                {/* Posicion de fuente*/}
                                <div className="form-group col-md-6">
                                  <label htmlFor="posicionFuente">
                                    Posicion de Fuente:
                                  </label>
                                  <input
                                    className="form-control"
                                    id="posicionFuente"
                                    value={disenioSeleccionado.PosicionFuente}
                                    disabled
                                  />
                                </div>

                                {/* Tamaño de imagen*/}
                                <div className="form-group col-md-6">
                                  <label htmlFor="tamanioImagen">
                                    Tamaño de Imagen:
                                  </label>
                                  <input
                                    className="form-control"
                                    id="tamanioImagen"
                                    value={disenioSeleccionado.TamanioImagen}
                                    disabled
                                  />
                                </div>

                                {/* Posicion de imagen*/}
                                <div className="form-group col-md-6">
                                  <label htmlFor="posicionImagen">
                                    Posicion de Imagen:
                                  </label>

                                  <input
                                    className="form-control"
                                    id="posicionImagen"
                                    value={disenioSeleccionado.PosicionImagen}
                                    disabled
                                  />
                                </div>

                                {/* Precio de diseño */}
                                <div className="form-group col-md-6">
                                  <label htmlFor="precioDiseño">
                                    Precio del Diseño:
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="precioDiseño"
                                    value={formatCurrency(
                                      disenioSeleccionado.PrecioDisenio
                                    )}
                                    disabled
                                  />
                                </div>

                                {/* Imagen diseño*/}
                                <div className="form-group col-md-6">
                                  <label>Imagen Diseño :</label>
                                  <br />

                                  {disenioSeleccionado.ImagenDisenio !==
                                  "No aplica" ? (
                                    <div className="container py-5 mx-3">
                                      <img
                                        src={disenioSeleccionado.ImagenDisenio}
                                        alt="Vista previa imagen del diseño"
                                        style={{
                                          maxWidth: "200px",
                                          display: "block",
                                          border: "1px solid black",
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      className="form-control"
                                      disabled
                                      value={"No aplica"}
                                    />
                                  )}
                                </div>

                                {/* Imagen referencia*/}
                                <div className="form-group col-md-6">
                                  <label htmlFor="ImagenDisenioCliente">
                                    Imagen Referencia :
                                  </label>

                                  <br />

                                  <div className="container py-5 mx-3">
                                    <img
                                      src={disenioSeleccionado.ImagenReferencia}
                                      alt="Vista previa imagen del diseño"
                                      style={{
                                        maxWidth: "200px",
                                        display: "block",
                                        border: "1px solid black",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
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
      {/* Fin modal ver detalle diseño */}

      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-3 text-center text-dark">
            Gestión de Productos
          </h1>
        </div>

        {/* <!-- Tabla de Productos --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex justify-content-between align-items-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />

            {auth.idUsuario ? 
            (
              <button
              type="button"
              className="btn btn-dark d-flex align-items-center justify-content-center p-0"
              data-toggle="modal"
              data-target="#modalCliente"
              onClick={() => openModal(1, "", "", "", "", "", "")}
              style={{
                width: "175px",
                height: "40px"
                
              }}
            >
              <i className="fas fa-pencil-alt"></i> 
              <span className="d-none d-sm-inline ml-2">Crear Producto</span>
            </button>

            )
            
            :
            (
              <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalProductoCliente"
              onClick={() => openModal(3, "", "", "", "", "", "")}
              style={{
                width: "175px",
                height: "40px"
                
              }}
            >
              <i className="fas fa-pencil-alt"></i> 
              <span className="d-none d-sm-inline ml-2">Crear Producto</span>
            </button>

            )
            
            
            }

            

          </div>
          <div className="card-body">
            <div className="table-responsive">

            {auth.idUsuario ?(
              
              <table
                className="table table-bordered"
                id="dataTable"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>Referencia</th>
                    <th>Diseño</th>
                    <th>Insumo</th>
                    <th>Cantidad</th>
                    <th>Valor de la Venta</th>
                    <th>Publicación</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentproductosAdmin.map((producto) => (
                    <tr key={producto.IdProducto}>
                      <td>{producto.Referencia}</td>
                      <td>{convertDisenioIdToName(producto.IdDisenio)}</td>
                      <td>{convertInsumoIdToName(producto.IdInsumo)}</td>
                      <td>{producto.Cantidad}</td>
                      <td>{formatCurrency(producto.ValorVenta)}</td>
                      <td>
                        <label
                          className={`switch ${
                            producto.Estado !== "Activo" ? "switch-grey" : ""
                          }`}
                        >
                          <input
                            disabled={producto.Estado !== "Activo"}
                            type="checkbox"
                            checked={producto.Publicacion === "Activo"}
                            onChange={() =>
                              cambiarPublicacionProducto(producto.IdProducto)
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>

                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={producto.Estado === "Activo"}
                            onChange={() =>
                              cambiarEstadoProducto(producto.IdProducto)
                            }
                            className={
                              producto.Estado === "Activo"
                                ? "switch-green"
                                : "switch-red"
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      </td>
                      <td>
                        <div className="d-flex">
                          <button
                            className="btn btn-warning btn-sm mr-2"
                            title="Editar"
                            data-toggle="modal"
                            data-target="#modalCliente"
                            onClick={() => openModal(2, producto)}
                            disabled={producto.Estado != "Activo"}
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>

                        <button
                          className="btn btn-danger btn-sm mr-2"
                          onClick={() =>
                            deleteInsumo(
                              producto.IdProducto,
                              producto.Referencia
                            )
                          }
                          disabled={producto.Estado != "Activo"}
                          title="Eliminar"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>

                          <button
                            className="btn btn-info btn-sm mr-2"
                            onClick={() =>
                              handleDetalleProducto(producto.IdProducto)
                            }
                            data-toggle="modal"
                            data-target="#modalDetalleProducto"
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
            )
            :
            (
            <table
              className="table table-bordered"
              id="dataTable"
              width="100%"
              cellSpacing="0"
            >
              <thead>
                <tr>
                  <th>Referencia</th>
                  <th>Diseño</th>
                  <th>Insumo</th>
                  <th>Cantidad</th>
                  <th>Valor de la Venta</th>
                  {/* <th>Publicación</th>
                  <th>Estado</th> */}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentproductosAdmin.map((producto) => (
                  <tr key={producto.IdProducto}>
                    <td>{producto.Referencia}</td>
                    <td>{convertDisenioIdToName(producto.IdDisenio)}</td>
                    <td>{convertInsumoIdToName(producto.IdInsumo)}</td>
                    <td>{producto.Cantidad}</td>
                    <td>{formatCurrency(producto.ValorVenta)}</td>
                    
                    {/* <td>
                      <label
                        className={`switch ${
                          producto.Estado !== "Activo" ? "switch-grey" : ""
                        }`}
                      >
                        <input
                          disabled={producto.Estado !== "Activo"}
                          type="checkbox"
                          checked={producto.Publicacion === "Activo"}
                          onChange={() =>
                            cambiarPublicacionProducto(producto.IdProducto)
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>

                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={producto.Estado === "Activo"}
                          onChange={() =>
                            cambiarEstadoProducto(producto.IdProducto)
                          }
                          className={
                            producto.Estado === "Activo"
                              ? "switch-green"
                              : "switch-red"
                          }
                        />
                        <span className="slider round"></span>
                      </label>
                    </td> */}

                    <td>
                      <div
                        className="d-flex"
                      >
                        {auth.idUsuario && (
                        <button
                          className="btn btn-warning btn-sm mr-2"
                          title="Editar"
                          data-toggle="modal"
                          data-target="#modalCliente"
                          onClick={() => openModal(2, producto)}
                          disabled={producto.Estado != "Activo"}
                        >
                          <i className="fas fa-sync-alt"></i>
                        </button>

                        )}

                        <button
                          className="btn btn-danger btn-sm mr-2"
                          onClick={() =>
                            deleteInsumo(
                              producto.IdProducto,
                              producto.Referencia
                            )
                          }
                          disabled={producto.Estado != "Activo"}
                          title="Eliminar"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>

                        <button
                          className="btn btn-info btn-sm mr-2"
                          onClick={() =>
                            handleDetalleProducto(producto.IdProducto)
                          }
                          disabled={producto.Estado != "Activo"}
                          data-toggle="modal"
                          data-target="#modalDetalleProducto"
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
        {/* Fin tabla de productosAdmin */}
      </div>
    </>
  );
};
