import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import show_alerta from "../../components/Show_Alerta/show_alerta";
import { useAuth } from "../../context/AuthProvider";
import { AdminFooter } from "../../components/Admin/AdminFooter";
import Loader from "../../components/Loader/loader";

export const Catalogo = () => {
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/productos";
  const { auth } = useAuth();

  const [productosAdmin, setProductosAdmin] = useState([]);
  const [productosCliente, setProductosCliente] = useState([]);
  const [Disenios, setDisenios] = useState([]);
  const [DiseniosCliente, setDiseniosCliente] = useState([]);
  const [Insumos, setInsumos] = useState([]);
  const [DetallesInsumos, setDetallesInsumos] = useState([]);

  const [InsumosTotales, setInsumosTotales] = useState([]);
  const [Tallas, setTallas] = useState([]);
  const [Colores, setColores] = useState([]);
  const [ColoresDisponibles, setColoresDisponibles] = useState([]);

  const [TallaDetalle, setTallaDetalle] = useState([]);
  const [ColorDetalle, setColorDetalle] = useState([]);
  const [IdDisenio, setIdDisenio] = useState("");
  const [IdProducto, setIdProducto] = useState("");
  const [IdInsumo, setIdInsumo] = useState("");

  const [InsumosCliente, setInsumosCliente] = useState([]);

  const [IdTallaCliente, setIdTallaCliente] = useState("");
  const [IdColorCliente, setIdColorCliente] = useState("");

  const [TallasCliente, setTallasCliente] = useState([]);
  const [ColoresCliente, setColoresCliente] = useState([]);

  const [Referencia, setReferencia] = useState("");
  const [IsSubmitting, setIsSubmitting] = useState(null);
  
  const [Cantidad, setCantidad] = useState("");
  const [CantidadAnterior, setCantidadAnterior] = useState("");
  const [ValorVenta, setValorVenta] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");

  const [ShowBotonAgregarCarrito, setTShowBotonAgregarCarrito] = useState(null);

  const [errors, setErrors] = useState({
    IdDisenio: 0,
    IdInsumo: 0,
    IdColorCliente: 0,
    IdTallaCliente: 0,
    Referencia: "",
    Cantidad: 0,
    CantidadCliente: 0,
    ValorVenta: 0,
  });

  const [alertas, setAlertas] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedDisenio, setSelectedDisenio] = useState(null);
  const [selectedInsumo, setSelectedInsumo] = useState(null);

  // Variables para el detalle del producto
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
  const [disenioSeleccionado, setDisenioSeleccionado] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [loading, setLoading] = useState(true);

  let productosTotales;

  useEffect(() => {
    getProductosAdmin();
    getDisenios();

    getInsumos();
    getTallas();
    getColores();

    console.log(auth.idCliente);

    // obtenerDiseniosCliente();

    // ObtenerColoresTallasCliente();
  }, []);

  const getProductosAdmin = async () => {
    const respuesta = await axios.get(url);

    productosTotales = respuesta.data;

    setProductosAdmin(respuesta.data);
    console.log(respuesta.data);

    getProductosCliente();
  };

  const getProductosCliente = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const productosFiltrados = productosTotales.filter(
        (producto) => producto.IdUsuario == auth.idCliente
      );

      // console.log(pedidosTotales);
      console.log(productosFiltrados);

      setProductosCliente(productosFiltrados);
    } catch (error) {
      console.log(error);

      show_alerta("Error al obtener los pedidos", "error");
    } finally {
      setLoading(false); // Mostrar el loader antes de realizar la solicitud
    }
  };

  const getDisenios = async () => {
    const respuesta = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/disenios");
    const DiseniosActivos = respuesta.data.filter(
      (disenio) => disenio.Estado === "Activo"
    );
    console.log(DiseniosActivos);

    setDisenios(DiseniosActivos);

    obtenerDiseniosCliente(DiseniosActivos);
  };

  const getInsumos = async () => {
    const respuesta = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/insumos");
    const InsumosActivas = respuesta.data.filter(
      (insumo) => insumo.Estado == "Activo" && insumo.Cantidad > 0
    );

    // if (auth.idCliente) {
    obtenerInsumosCliente(InsumosActivas);
    // }

    setInsumos(InsumosActivas);
    setInsumosTotales(respuesta.data);
  };

  const getTallas = async () => {
    const respuesta = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/tallas");
    const TallasActivas = respuesta.data.filter(
      (talla) => talla.Estado === "Activo"
    );
    console.log(TallasActivas);

    setTallas(TallasActivas);
  };

  const getColores = async () => {
    const respuesta = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/colores");
    const ColoresActivas = respuesta.data.filter(
      (color) => color.Estado == "Activo"
    );
    console.log(ColoresActivas);

    setColores(ColoresActivas);
  };

  // Obtener los insumos que seran usados por el cliente, estos estan activos y con cantidad
  const obtenerInsumosCliente = (insumos) => {
    try {
      // Filtrar insumos activos con cantidad mayor a 0
      const insumosFiltrados = insumos.filter(
        (insumo) => insumo.Estado == "Activo" && insumo.Cantidad >= 3
      );

      console.log(insumosFiltrados);

      setInsumosCliente(insumosFiltrados);
    } catch (error) {
      console.error("Error filtrando insumos:", error);
    }
  };

  const obtenerDiseniosCliente = (disenios) => {
    const disenioFiltradosCliente = disenios.filter(
      (disenio) => disenio.IdUsuario == auth.idCliente
    );

    console.log(disenioFiltradosCliente);

    setDiseniosCliente(disenioFiltradosCliente);
  };

  const ObtenerColoresTallasCliente = async () => {
    const coloresUnicos = [];
    const tallasUnicas = [];

    // Filtrar colores y tallas que esten en los insumos para el select del cliente
    InsumosCliente.forEach((insumo) => {
      if (!coloresUnicos.includes(insumo.IdColor)) {
        coloresUnicos.push(insumo.IdColor);
      }
      if (!tallasUnicas.includes(insumo.IdTalla)) {
        tallasUnicas.push(insumo.IdTalla);
      }
    });

    // Filtrar los colores para el select del cliente
    const coloresFiltrados = Colores.filter((color) =>
      coloresUnicos.includes(color.IdColor)
    );

    // Filtrar las tallas para el select del cliente
    const tallasFiltrados = Tallas.filter((talla) =>
      tallasUnicas.includes(talla.IdTalla)
    );

    console.log(coloresFiltrados);
    console.log(tallasFiltrados);

    setColoresCliente(coloresFiltrados);
    setTallasCliente(tallasFiltrados);
  };

  //   Agregar producto del carrito
  const AgregarProductoCarrito = (ProductoS) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];


    console.log(ProductoS);
    

    const productoClienteEncontrado = cart.find(
      (item) => item.IdProd == ProductoS.IdProducto
    );

    if (productoClienteEncontrado) {
      show_alerta({message:"El producto ya esta en el carrito",type:"warning"})
      return;
    }else{
  
      // Si el producto no existe, agrégalo con una cantidad inicial de 1
      cart.push({ IdProd: ProductoS.IdProducto, IdIns:ProductoS.ProductoInsumos[0].IdInsumo, CantidadSeleccionada: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
  
      show_alerta({
        message: "Producto agregado al carrito correctamente",
        type: "success",
      });
      console.log(JSON.parse(localStorage.getItem("cart")));
  
      getProductosAdmin();

    }
  };

  const validarProductoClienteCarrito = (idProductoInsumoCliente) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    console.log(`lo que se manda ${idProductoInsumoCliente}`);
    
    // return
    const productoClienteEncontrado = cart.find(
      (item) => item.IdIns == idProductoInsumoCliente
    );

    console.log(productoClienteEncontrado);
    

    return !productoClienteEncontrado;
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

      const disenioFiltradosAdmin = Disenios.filter(
        (disenio) => disenio.IdUsuario == 1
      );

      console.log(disenioFiltradosAdmin);

      setDisenios(disenioFiltradosAdmin);

      ObtenerColoresTallasCliente();

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
      setCantidadAnterior(insumo.Cantidad);
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

      const BuscarInsumo = Insumos.find((i) => i.IdInsumo == insumo.IdInsumo);

      console.log(BuscarInsumo);

      setSelectedInsumo(BuscarInsumo);
    } else if (op === 3) {
      // Crear producto
      setIdProducto("");
      setIdDisenio("");
      setIdInsumo("");
      setIdColorCliente("");
      setIdTallaCliente("");
      setReferencia("");https://softshirt-1c3fad7d72e8.herokuapp.com
      setCantidad("");
      setValorVenta("");
      setOperation(3);
      setTitle("Crea tu camiseta");

      ObtenerColoresTallasCliente();

      const errors = {
        Referencia: "",
        Cantidad: "",
        ValorVenta: "",
      };
      setErrors(errors);
    }
  };

  // Función simulada para verificar si el producto tiene insumos asociados
  const getPedidosByProducto = async (idProducto) => {
    try {
      let productoEncontrado = [];
      const response = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos");
      // Verifica si el color está asociado a algún insumo

      response.data.forEach((pedido) => {
        pedido.DetallesPedidosProductos.forEach((detalle) => {
          if (detalle.IdProducto === idProducto) {
            console.log(
              `El producto con ID ${idProducto} está en el pedido con ID ${pedido.IdPedido}`
            );
            productoEncontrado.push(detalle.IdProducto);
            // Aquí puedes agregar la lógica para manejar el producto encontrado
          }
        });
      });

      if (productoEncontrado.length > 0) {
        return true;
      }

      // return pedidos.length > 0; // Devuelve true si hay al menos un insumo asociado
    } catch (error) {
      console.error("Error fetching pedidos:", error);
      show_alerta({ message: "Error al verificar los pedidos", type: "error" });
      return false; // Considera que no tiene insumos asociados en caso de error
    }
  };

  let detallesInsumosGuardar;

  // Función para validar todos los campos
  const validar = () => {
    // Inicializa un objeto para almacenar errores
    let errores = {};

    // Validación de campos
    if (!IdDisenio) {
      errores.IdDisenio = "Seleccione un diseño";
    }

    if (Referencia === "") {
      errores.Referencia = "Referencia es requerida";
    }

    if (ValorVenta === "") {
      errores.ValorVenta = "Valor de venta es requerido";
    }

    // Verificar que haya al menos una fila agregada
    if (DetallesInsumos.length === 0) {
      show_alerta({
        message:
          "Debe agregar al menos una fila de insumos con color, talla y cantidad.",
        type: "error",
      });
      return;
    }

    // Crear un conjunto para verificar duplicados
    const combinaciones = new Set();
    const filaExistente = [];

    // Validar las filas de los detalles de insumos (color, talla, cantidad)
    DetallesInsumos.forEach((detalle, index) => {
      if (!detalle.IdColor || !detalle.IdTalla || !detalle.cantidad) {
        errores[`detalle_${index}`] = `La fila ${
          index + 1
        } está incompleta. Por favor, seleccione un color, talla y cantidad.`;
      } else if (parseInt(detalle.cantidad) <= 0) {
        errores[`detalle_cantidad_${index}`] = `La cantidad de la fila ${
          index + 1
        } debe ser mayor que 0.`;
      } else {
        // Verificar si la cantidad supera la cantidad disponible en el insumo
        const insumoSeleccionado = InsumosCliente.find(
          (insumo) =>
            insumo.IdColor === parseInt(detalle.IdColor) &&
            insumo.IdTalla === parseInt(detalle.IdTalla) &&
            insumo.Estado === "Activo"
        );

        if (
          insumoSeleccionado &&
          parseInt(detalle.cantidad) > insumoSeleccionado.Cantidad
        ) {
          errores[
            `detalle_cantidad_supera_${index}`
          ] = `La cantidad de la fila ${
            index + 1
          } supera la cantidad disponible (${insumoSeleccionado.Cantidad}).`;
        }

        // Verificar duplicados
        const clave = `${detalle.IdColor}-${detalle.IdTalla}`;
        if (combinaciones.has(clave)) {
          filaExistente.push(clave);
        } else {
          combinaciones.add(clave);
        }
      }
    });

    if (filaExistente.length > 0) {
      show_alerta({ message: `Existen filas repetidas.`, type: "error" });
      return;
    }

    // Actualiza el estado de errores
    setErrors(errores);

    // Mostrar alerta si hay errores
    if (Object.keys(errores).length > 0) {
      console.log(errores);

      show_alerta({
        message: "Por favor, completa todos los campos correctamente",
        type: "error",
      });
      return false;
    }

    // Si no hay errores, reemplazar IdColor e IdTalla por IdInsumo
    const nuevosDetallesInsumos = DetallesInsumos.map((detalle) => {
      const insumoSeleccionado = InsumosCliente.find(
        (insumo) =>
          insumo.IdColor === parseInt(detalle.IdColor) &&
          insumo.IdTalla === parseInt(detalle.IdTalla) &&
          insumo.Estado === "Activo"
      );

      if (insumoSeleccionado) {
        return {
          IdInsumo: insumoSeleccionado.IdInsumo, // Reemplaza IdColor e IdTalla por IdInsumo
          cantidad: detalle.cantidad, // Mantiene la cantidad
        };
      }

      return detalle; // Si no encuentra el insumo, retorna el detalle sin modificar
    });

    // Actualizar el estado de DetallesInsumos con los nuevos valores
    // setDetallesInsumos([...nuevosDetallesInsumos]);

    detallesInsumosGuardar = nuevosDetallesInsumos;

    // Si no hay errores, retorna true para permitir el envío de datos
    return true;
  };

  // Función para guardar producto

  const guardarProducto = async () => {
    // Validar campos
    if (!validar()) return;

    let IdInsumoCliente;

    let insumoSeleccionado;

    if (operation == 3) {
      IdInsumoCliente = encontrarInsumoCliente();
    }

    console.log(detallesInsumosGuardar);

    // return;

    // Realizar validaciones específicas
    const disenioSeleccionado = Disenios.find(
      (disenio) => disenio.IdDisenio == IdDisenio
    );

    // Validación en el diseño
    if (!disenioSeleccionado) {
      show_alerta({
        message: "Diseño no encontrado",
        type: "error",
      });
      return;
    }

    // Si todas las validaciones son correctas, se envía la solicitud
    try {
      if (operation === 1) {
        await enviarSolicitud("POST", {
          IdDisenio,
          IdUsuario: auth.idUsuario || auth.idCliente,
          Referencia: Referencia.trim(),
          ValorVenta: ValorVenta,
          Publicacion: "Activo",
          Estado: "Activo",
          Insumos: detallesInsumosGuardar,
        });
        show_alerta({
          message: "Producto creado con éxito",
          type: "success",
        });
      } else if (operation === 2) {
        await enviarSolicitud("PUT", {
          Cantidad: Cantidad.trim(),
          // ValorVenta: ValorVenta,
        });
        show_alerta({
          message: "Producto actualizado con éxito",
          type: "success",
        });
      } else if (operation === 3) {
        await enviarSolicitud("POST", {
          IdDisenio,
          IdInsumo: IdInsumoCliente,
          IdUsuario: auth.idUsuario || auth.idCliente,
          Referencia: generarReferenciaUnica(productosAdmin),
          Cantidad: Cantidad,
          ValorVenta: generarValorVentaCliente(IdDisenio, IdInsumoCliente),
          Publicacion: "Inactivo",
          Estado: "Activo",
        });

        show_alerta({
          message: "Producto creado con éxito",
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
      $(".close").click();
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

  const encontrarInsumoCliente = () => {
    const insumoEncontrado = InsumosCliente.find(
      (insumo) =>
        insumo.IdColor == IdColorCliente && insumo.IdTalla == IdTallaCliente
    );
    return insumoEncontrado.IdInsumo;
  };

  // Función para generar una referencia aleatoria
  const generarReferencia = () => {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numeros = "0123456789";

    // Generar tres letras aleatorias
    let parteLetras = "";
    for (let i = 0; i < 3; i++) {
      parteLetras += letras.charAt(Math.floor(Math.random() * letras.length));
    }

    // Generar tres números aleatorios
    let parteNumeros = "";
    for (let i = 0; i < 3; i++) {
      parteNumeros += numeros.charAt(
        Math.floor(Math.random() * numeros.length)
      );
    }

    // Combinar las partes
    return `${parteLetras}-${parteNumeros}`;
  };

  // Función para verificar si la referencia es única
  const esReferenciaUnica = (referencia, productos) => {
    return !productos.some((producto) => producto.referencia === referencia);
  };

  // Función principal para generar una referencia única
  const generarReferenciaUnica = (productos) => {
    let nuevaReferencia;
    do {
      nuevaReferencia = generarReferencia();
    } while (!esReferenciaUnica(nuevaReferencia, productos));

    return nuevaReferencia;
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
    if (value < CantidadAnterior) {
      return "La cantidad no puede ser menor que la actual";
    }
    return "";
  };

  // Función para validar la cantidad del cliente
  const validateCantidadCliente = (value) => {
    if (!value) {
      return "Escribe la cantidad";
    }
    if (!/^\d+$/.test(value)) {
      return "La cantidad solo puede contener números";
    }
    const numericValue = parseInt(value, 10);
    if (numericValue <= 0) {
      return "La cantidad debe ser un número positivo";
    }
    if (numericValue < 1 || numericValue > 3) {
      return "La cantidad debe estar entre 1 y 3";
    }
    return "";
  };

  const generarValorVentaCliente = (IdDisenioCliente, IdInsumoCliente) => {
    const disenioCliente = DiseniosCliente.filter(
      (disenio) => disenio.IdDisenio == IdDisenioCliente
    );
    const insumoCliente = InsumosCliente.filter(
      (insumo) => insumo.IdInsumo == IdInsumoCliente
    );

    const valorVentaProductoCliente = precioSugerido(
      disenioCliente[0].PrecioDisenio,
      insumoCliente[0].ValorCompra
    );

    console.log(disenioCliente[0].PrecioDisenio);
    console.log(insumoCliente);
    console.log(valorVentaProductoCliente);

    return Math.round(valorVentaProductoCliente);
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

  //Funcion para mostrar la talla en el tooltip
  const convertTallaIdToName = (tallaId) => {
    const talla = Tallas.find((talla) => talla.IdTalla == tallaId);
    console.log(talla);
    return talla ? talla.Talla : "";
  };

  // Función para manejar cambios en el diseño
  const handleChangeIdDisenio = (e) => {
    const value = e.target.value;

    const disenio = Disenios.find((d) => d.IdDisenio == value);

    console.log(disenio);

    setIdDisenio(value);
    setSelectedDisenio(disenio);
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

  // Función para manejar cambios en la cantidad del cliente
  const handleChangeCantidadCliente = (e) => {
    let value = e.target.value;
    setCantidad(value);
    const errorMessage = validateCantidadCliente(value);
    setErrors((prevState) => ({
      ...prevState,
      CantidadCliente: errorMessage,
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

  // Funcion para enviar solicitud
  const enviarSolicitud = async (metodo, parametros) => {
    let urlRequest =
      metodo === "PUT" || metodo === "DELETE"
        ? `${url}/${parametros.IdProducto}`
        : url;

    try {
      let respuesta;
      if (metodo === "POST") {
        console.log(parametros);
        // return;
        respuesta = await axios.post(url, parametros);
      } else if (metodo === "PUT") {
        respuesta = await axios.put(urlRequest, parametros);
      } else if (metodo === "DELETE") {
        respuesta = await axios.delete(urlRequest);
      }

      setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProducto = (IdProducto, Referencia) => {
    const MySwal = withReactContent(Swal);

    // Primero, verifica si el color está asociado a un insumo
    getPedidosByProducto(IdProducto).then((isAssociated) => {
      if (isAssociated) {
        show_alerta({
          message: `El producto ${Referencia} está asociado a un pedido - venta y no se puede eliminar.`,
          type: "warning",
        });
      } else {
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
            enviarSolicitud("DELETE", { IdProducto: IdProducto }).then(
              () => {}
            );
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
      }
    });
  };

  const cambiarPublicacionProducto = async (IdProducto) => {
    try {
      const productoActual = productosAdmin.find(
        (producto) => producto.IdProducto === IdProducto
      );

      if (productoActual.Cantidad == 0) {
        show_alerta({
          message:
            "No se puede cambiar la publicación, agrega al menos una cantidad al producto",
          type: "warning",
        });
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
            IdDisenio: productoActual.IdDisenio,
            IdInsumo: productoActual.IdInsumo,
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
              message: "Publicación del producto actualizado correctamente",
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

      if (nuevoEstado === "Inactivo") {
        nuevoEstadoPublicacion = "Inactivo";

        parametros = {
          IdDisenio: productoActual.IdDisenio,
          IdInsumo: productoActual.IdInsumo,
          Publicacion: nuevoEstadoPublicacion,
          Estado: nuevoEstado,
        };
      } else {
        nuevoEstadoPublicacion = productoActual.Publicacion;

        parametros = {
          IdDisenio: productoActual.IdDisenio,
          IdInsumo: productoActual.IdInsumo,
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
          try {
            console.log(parametros);

            const respuesta = await axios.put(
              `${url}/${IdProducto}`,
              parametros
            );

            if (respuesta.status === 200) {
              setProductosAdmin((prevProducto) =>
                prevProducto.map((producto) =>
                  producto.IdProducto === IdProducto
                    ? {
                        ...producto,
                        Publicacion: nuevoEstadoPublicacion,
                        Estado: nuevoEstado,
                      }
                    : producto
                )
              );

              show_alerta({
                message: "Estado del producto actualizado correctamente",
                type: "success",
              });
            } else {
              console.log(respuesta.data);
              show_alerta({
                message: respuesta.data?.message || "Error desconocido",
                type: "error",
              });
            }
          } catch (error) {
            console.error("Error al cambiar el estado del producto:", error);
            show_alerta({
              message:
                error.response?.data?.message ||
                "Error al intentar cambiar el estado del producto",
              type: "error",
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
      console.error("Error general:", error);
      show_alerta({
        message:"Error cambiando el estado del producto",
        type: "error",
      });
    }
  };

  const convertDisenioIdToName = (disenioId) => {
    const disenio = Disenios.find((disenio) => disenio.IdDisenio === disenioId);
    return disenio ? disenio.NombreDisenio : "";
  };

  const convertInsumoIdToName = (insumoId) => {
    const insumo = InsumosTotales.find(
      (insumo) => insumo.IdInsumo === insumoId
    );
    return insumo ? insumo.Referencia : "";
  };

  const handleDetalleProducto = async (idProducto) => {
    try {
      const respuestaProducto = await axios.get(
        `https://softshirt-1c3fad7d72e8.herokuapp.com/api/productos/${idProducto}`
      );

      const producto = respuestaProducto.data;

      console.log("Detalle de producto:", producto);

      setProductoSeleccionado(producto);

      $("#modalDetalleProducto").modal("show");
    } catch (error) {
      show_alerta({
        message: "Error al obtener los detalles del pedido",
        type: "error",
      });
    }
  };

  // __________________________________detalle color y tamaño ___________________

  // Función para añadir un nuevo detalle a la tabla
  const addDetail = () => {
    const newDetail = {
      IdColor: "",
      IdTalla: "",
      cantidad: "",
    };

    setDetallesInsumos([...DetallesInsumos, newDetail]);
  };

  // Función para eliminar un detalle de la tabla
  const removeDetail = (index) => {
    const updatedDetalles = DetallesInsumos.filter((_, i) => i !== index);
    setDetallesInsumos(updatedDetalles);
  };

  // Función para manejar cambios en el color
  const handleChangeColorCliente = (index, e) => {
    const value = e.target.value;

    // Actualiza la selección del color
    const updatedDetalles = [...DetallesInsumos];
    updatedDetalles[index].IdColor = parseInt(value);
    updatedDetalles[index].IdTalla = ""; // Reseteamos la talla al cambiar de color
    setDetallesInsumos(updatedDetalles);

    // Filtra las tallas relacionadas con el color seleccionado
    const tallasFiltradas = InsumosCliente.filter(
      (insumo) =>
        insumo.IdColor === parseInt(value) &&
        insumo.Cantidad > 0 &&
        insumo.Estado === "Activo"
    ).map((insumo) => insumo.IdTalla);

    // Actualiza las tallas disponibles para esa fila
    setTallasCliente((prevState) => {
      const newTallasCliente = [...prevState];
      const nuevasTallasFiltradasCliente = Tallas.filter((talla) =>
        tallasFiltradas.includes(talla.IdTalla)
      );

      newTallasCliente[index] = nuevasTallasFiltradasCliente;
      return newTallasCliente;
    });

    // Mantener los colores que aún tienen tallas disponibles
    actualizarColoresDisponibles();
  };

  // Función para manejar cambios en la talla
  const handleChangeTallaCliente = (index, e) => {
    const value = e.target.value;

    // Actualiza la selección de la talla
    const updatedDetalles = [...DetallesInsumos];
    updatedDetalles[index].IdTalla = parseInt(value);
    setDetallesInsumos(updatedDetalles);

    // Mantener los colores que aún tienen tallas disponibles
    actualizarColoresDisponibles();
  };

  // Función para actualizar la lista de colores disponibles, verificando si aún tienen tallas
  const actualizarColoresDisponibles = () => {
    const coloresFiltrados = InsumosCliente.filter((insumo) => {
      const tallasDisponibles = InsumosCliente.filter(
        (i) =>
          i.IdColor === insumo.IdColor &&
          i.Cantidad > 0 &&
          i.Estado === "Activo"
      ).map((i) => i.IdTalla);

      // Verificar si el color aún tiene tallas disponibles
      return tallasDisponibles.length > 0;
    }).map((insumo) => insumo.IdColor);

    // Actualiza los colores disponibles sin eliminar los que aún tienen tallas
    setColoresDisponibles(coloresFiltrados);
  };

  // Función para manejar los cambios en otros campos (como cantidad)
  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;

    // Validar solo números
    const regex = /^[0-9\b]+$/;
    if (name === "cantidad" && !regex.test(value) && value !== "") {
      return; // Ignora la entrada si no es un número
    }

    const detallesActualizados = [...DetallesInsumos];
    detallesActualizados[index] = {
      ...detallesActualizados[index],
      [name]: value,
    };

    // Validar que la cantidad no supere la cantidad disponible del insumo seleccionado
    if (
      name === "cantidad" &&
      detallesActualizados[index].IdColor &&
      detallesActualizados[index].IdTalla
    ) {
      const insumoSeleccionado = InsumosCliente.find(
        (insumo) =>
          insumo.IdColor === detallesActualizados[index].IdColor &&
          insumo.IdTalla === detallesActualizados[index].IdTalla &&
          insumo.Estado === "Activo"
      );

      if (insumoSeleccionado && parseInt(value) > insumoSeleccionado.Cantidad) {
        alertas[
          index
        ] = `La cantidad máxima disponible es ${insumoSeleccionado.Cantidad}`;
        detallesActualizados[index].cantidad = insumoSeleccionado.Cantidad; // Asignar la cantidad máxima disponible
      } else {
        alertas[index] = ""; // Limpiar la alerta si está dentro del rango
      }
    }

    setDetallesInsumos(detallesActualizados);
    setAlertas([...alertas]); // Actualizar alertas
  };

  // Obtener tallas disponibles para el color seleccionado
  const getTallasDisponibles = (index) => {
    const colorSeleccionado = DetallesInsumos[index].IdColor;
    if (!colorSeleccionado) return [];

    // Filtrar las tallas disponibles para el color seleccionado
    const tallasDisponibles = InsumosCliente.filter(
      (insumo) =>
        insumo.IdColor === colorSeleccionado && insumo.Estado === "Activo"
    ).map((insumo) => insumo.IdTalla);

    return Tallas.filter((talla) => tallasDisponibles.includes(talla.IdTalla));
  };

  // Obtener colores disponibles, excluyendo los que no tienen tallas disponibles
  const getColoresDisponibles = (index) => {
    // Filtrar los colores que tengan al menos una talla disponible y activa
    const coloresDisponibles = Colores.filter((color) => {
      const tallasRelacionadas = InsumosCliente.filter(
        (insumo) =>
          insumo.IdColor === color.IdColor && insumo.Estado === "Activo"
      ).map((insumo) => insumo.IdTalla);

      // Verificar si el color tiene al menos una talla activa
      return tallasRelacionadas.length > 0;
    });

    return coloresDisponibles;
  };

  // __________________________________detalle color y tamaño ___________________

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
  } else {
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

    return operation == 1 || operation == 2 ? formatCurrency(total) : total;
  };

  if (loading) {
    return <Loader />;
  }

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
                  {operation == 1 ? (
                    <>
                      {/* Diseño del Producto */}
                      <div className="form-group col-md-5">
                        <label htmlFor="idDisenio">Diseño del producto</label>
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
                          <div className="invalid-feedback">
                            {errors.IdDisenio}
                          </div>
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
                                style={{ width: "135px", height: "100px" }}
                              />
                            </span>
                          )}
                        </i>
                      </div>

                      {/* Referencia del Producto */}
                      <div className="form-group col-md-6">
                        <label htmlFor="Referencia">
                          Referencia del producto
                        </label>
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

                      {/* Valor venta del producto */}
                      <div className="form-group col-md-12">
                        <label htmlFor="direccionCliente">
                          Valor de la venta del producto
                        </label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.ValorVenta ? "is-invalid" : ""
                          }`}
                          id="direccionCliente"
                          placeholder={
                            selectedInsumo && selectedDisenio
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

                      {/* detalles del insumo */}
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Color</th>
                              <th>Talla</th>
                              <th>Cantidad</th>
                              <th>Acción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {DetallesInsumos.map((detalle, index) => (
                              <tr key={index}>
                                {/* Select de Color */}
                                <td>
                                  <select
                                    className="form-control"
                                    name="IdColor"
                                    value={detalle.IdColor}
                                    onChange={(e) =>
                                      handleChangeColorCliente(index, e)
                                    }
                                  >
                                    <option value="">
                                      Selecciona un color
                                    </option>
                                    {getColoresDisponibles(index).map(
                                      (color) => (
                                        <option
                                          key={color.IdColor}
                                          value={color.IdColor}
                                        >
                                          {color.Color}
                                        </option>
                                      )
                                    )}
                                  </select>
                                  {errors.Detalles &&
                                    errors.Detalles[index] &&
                                    errors.Detalles[index].IdColor && (
                                      <div className="invalid-feedback">
                                        {errors.Detalles[index].IdColor}
                                      </div>
                                    )}
                                </td>

                                {/* Select de Talla */}
                                <td>
                                  <select
                                    className={`form-control ${
                                      errors.Detalles &&
                                      errors.Detalles[index] &&
                                      errors.Detalles[index].IdTalla
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    value={detalle.IdTalla}
                                    onChange={(e) =>
                                      handleChangeTallaCliente(index, e)
                                    } // Llama a la función para manejar el cambio de talla
                                    disabled={!detalle.IdColor} // Deshabilitar si no se ha seleccionado un color
                                  >
                                    <option value="">
                                      Selecciona una talla
                                    </option>
                                    {getTallasDisponibles(index).map(
                                      (talla) => (
                                        <option
                                          key={talla.IdTalla}
                                          value={talla.IdTalla}
                                        >
                                          {talla.Talla}
                                        </option>
                                      )
                                    )}
                                  </select>
                                  {errors.Detalles &&
                                    errors.Detalles[index] &&
                                    errors.Detalles[index].IdTalla && (
                                      <div className="invalid-feedback">
                                        {errors.Detalles[index].IdTalla}
                                      </div>
                                    )}
                                </td>

                                {/* Input de Cantidad */}
                                <td>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="cantidad"
                                    placeholder="Cantidad"
                                    value={detalle.cantidad}
                                    onChange={(e) =>
                                      handleDetailChange(index, e)
                                    }
                                    disabled={
                                      !detalle.IdColor || !detalle.IdTalla
                                    } // Deshabilitar si no se ha seleccionado color y talla
                                    min="0"
                                    onInput={(e) =>
                                      (e.target.value = e.target.value.replace(
                                        /[^1-9]/g,
                                        ""
                                      ))
                                    } // Asegurar que solo se acepten números
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

                                {/* Botón para eliminar fila */}
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removeDetail(index)} // Llama a la función para eliminar el detalle
                                  >
                                    X
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Botón para añadir más filas de detalles */}
                      <div className="text-right mb-3">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={addDetail}
                        >
                          Añadir Detalle
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                    </>
                  )}
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
                Detalle del producto
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
                              Detalles del producto
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
                                    Diseño del producto
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
                                {/* <div className="form-group col-md-6">
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
                                </div> */}

                                {/* Referencia del producto */}
                                <div className="form-group col-md-6">
                                  <label htmlFor="Referencia">
                                    Referencia del producto
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
                                {/* <div className="form-group col-md-6">
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
                                </div> */}

                                {/*Valor de la venta del producto */}
                                <div className="form-group col-md-12">
                                  <label htmlFor="direccionCliente">
                                    Valor de la venta del producto
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="direccionCliente"
                                    value={formatCurrency(
                                      productoSeleccionado.ValorVenta
                                    )}
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Acordeon detalles de los insumos */}

                      {productoSeleccionado &&
                      productoSeleccionado.ProductoInsumos &&
                      productoSeleccionado.ProductoInsumos.length > 0 ? (
                        productoSeleccionado.ProductoInsumos.map(
                          (productoInsumo, index) => (
                            <div
                              className="card"
                              key={productoInsumo.IdProductoInsumo}
                            >
                              <div
                                className="card-header"
                                id={`heading${index}`}
                              >
                                <h2 className="mb-0">
                                  <button
                                    className="btn btn-link btn-block text-left collapsed"
                                    type="button"
                                    data-toggle="collapse"
                                    data-target={`#collapse${index}`}
                                    aria-expanded="false"
                                    aria-controls={`collapse${index}`}
                                  >
                                    Detalles del Insumo #{index + 1}
                                  </button>
                                </h2>
                              </div>

                              {/* Mostrar el contenido de cada insumo */}
                              <div
                                id={`collapse${index}`}
                                className="collapse"
                                aria-labelledby={`heading${index}`}
                                data-parent="#accordionExample"
                              >
                                <div className="card-body">
                                  <div className="form-row">
                                    {/* Color del Insumo */}
                                    <div className="form-group col-md-6">
                                      <label htmlFor={`colorInsumo${index}`}>
                                        Color del insumo
                                      </label>
                                      <input
                                        className="form-control"
                                        id={`colorInsumo${index}`}
                                        value={
                                          productoInsumo.InsumoProd.Color.Color
                                        }
                                        disabled
                                      />
                                    </div>

                                    {/* Talla del Insumo */}
                                    <div className="form-group col-md-6">
                                      <label htmlFor={`tallaInsumo${index}`}>
                                        Talla del insumo
                                      </label>
                                      <input
                                        className="form-control"
                                        id={`tallaInsumo${index}`}
                                        value={
                                          productoInsumo.InsumoProd.Talla.Talla
                                        }
                                        disabled
                                      />
                                    </div>

                                    {/* Referencia del Insumo */}
                                    <div className="form-group col-md-6">
                                      <label
                                        htmlFor={`referenciaInsumo${index}`}
                                      >
                                        Referencia del insumo
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`referenciaInsumo${index}`}
                                        value={
                                          productoInsumo.InsumoProd.Referencia
                                        }
                                        disabled
                                      />
                                    </div>

                                    {/* Cantidad del Insumo */}
                                    <div className="form-group col-md-6">
                                      <label htmlFor={`cantidadInsumo${index}`}>
                                        Cantidad
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`cantidadInsumo${index}`}
                                        value={
                                          productoInsumo.CantidadProductoInsumo
                                        }
                                        disabled
                                      />
                                    </div>

                                    {/* Valor de la compra del Insumo */}
                                    <div className="form-group col-md-12">
                                      <label
                                        htmlFor={`valorCompraInsumo${index}`}
                                      >
                                        Valor de la compra del insumo:
                                      </label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        id={`valorCompraInsumo${index}`}
                                        value={formatCurrency(
                                          productoInsumo.InsumoProd.ValorCompra
                                        )}
                                        disabled
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <p>No hay insumos asociados a este producto.</p>
                      )}

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
                              Detalles del diseño
                            </button>
                          </h2>
                        </div>

                        {productoSeleccionado && (
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
                                    Nombre del diseño
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="nombreDiseño"
                                    value={
                                      productoSeleccionado.Disenio.NombreDisenio
                                    }
                                    disabled
                                  />
                                </div>

                                {/* Tamaño de imagen*/}
                                <div className="form-group col-md-6">
                                  <label htmlFor="tamanioImagen">
                                    Tamaño de imagen
                                  </label>
                                  <input
                                    className="form-control"
                                    id="tamanioImagen"
                                    value={
                                      productoSeleccionado.Disenio.TamanioImagen
                                    }
                                    disabled
                                  />
                                </div>

                                {/* Posicion de imagen*/}
                                <div className="form-group col-md-6">
                                  <label htmlFor="posicionImagen">
                                    Posición de imagen
                                  </label>

                                  <input
                                    className="form-control"
                                    id="posicionImagen"
                                    value={
                                      productoSeleccionado.Disenio
                                        .PosicionImagen
                                    }
                                    disabled
                                  />
                                </div>

                                {/* Precio de diseño */}
                                <div className="form-group col-md-6">
                                  <label htmlFor="precioDiseño">
                                    Precio del diseño
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="precioDiseño"
                                    value={formatCurrency(
                                      productoSeleccionado.Disenio.PrecioDisenio
                                    )}
                                    disabled
                                  />
                                </div>

                                {/* Imagen diseño*/}
                                <div className="form-group col-md-6">
                                  <label>Imagen diseño </label>
                                  <br />

                                  {productoSeleccionado.ImagenDisenio !==
                                  "No aplica" ? (
                                    <div className="container py-5 mx-3">
                                      <img
                                        src={
                                          productoSeleccionado.Disenio
                                            .ImagenDisenio
                                        }
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
                                    Imagen referencia
                                  </label>

                                  <br />

                                  <div className="container py-5 mx-3">
                                    <img
                                      src={
                                        productoSeleccionado.Disenio
                                          .ImagenReferencia
                                      }
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
          {/* <h1 className="h3 mb-3 text-center text-dark">
            Gestión de Productos
          </h1> */}
        </div>

        {/* <!-- Tabla de Productos --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex justify-content-between align-items-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />

            {/* Renderizar boton para crear producto admin o cliente */}
            {auth.idUsuario &&(
              <button
                type="button"
                className="btn btn-dark d-flex align-items-center justify-content-center p-0"
                data-toggle="modal"
                data-target="#modalCliente"
                onClick={() => openModal(1, "", "", "", "", "", "")}
                style={{
                  width: "175px",
                  height: "40px",
                }}
              >
                <i className="fas fa-pencil-alt"></i>
                <span className="d-none d-sm-inline ml-2">Crear Producto</span>
              </button>
            )}
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {auth.idUsuario ? (
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
                        <td>{producto.Disenio.NombreDisenio}</td>
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
                              className="btn btn-danger btn-sm mr-2"
                              onClick={() =>
                                deleteProducto(
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
              ) : (
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
                        <td>{producto.Disenio.NombreDisenio}</td>
                        <td>{formatCurrency(producto.ValorVenta)}</td>

                        <td>
                          <div className="d-flex">
                            {validarProductoClienteCarrito(producto.IdProducto) &&

                              producto.ProductoInsumos[0].CantidadProductoInsumo != 0 && (
                                <button
                                  className="btn btn-success btn-sm mr-2"
                                  onClick={() =>
                                    AgregarProductoCarrito(producto)
                                  }
                                  title="Agregar al carrito"
                                >
                                  <i className="fas fa-cart-plus"></i>
                                </button>
                              )}

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
      <AdminFooter />
    </>
  );
};
