import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import show_alerta from "../../components/Show_Alerta/show_alerta";
import imagenesAdmin from "../../assets/img/imagenesAdmin";
import { AdminFooter } from "../../components/Admin/AdminFooter";
import Loader from "../../components/Loader/loader";

import {
  editImageDesign,
  editImageReference,
  subirImageDesign,
  // subirImageDesignAdmin,
  subirImageReference,
} from "../../firebase/config";
import withReactContent from "sweetalert2-react-content";

import { useAuth } from "../../context/AuthProvider";
export const Disenios = () => {
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/disenios";
  const productosUrl = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/productos";
  const { auth } = useAuth();
  const [Disenios, setDisenios] = useState([]);
  const [DiseniosCliente, setDiseniosCliente] = useState([]);

  const [IdDisenio, setIdDisenio] = useState("");
  const [NombreDisenio, setNombreDisenio] = useState("");
  const [Fuente, setFuente] = useState("");
  const [TamanioFuente, setTamanioFuente] = useState("");
  const [ColorFuente, setColorFuente] = useState("");
  const [PosicionFuente, setPosicionFuente] = useState("");
  const [TamanioImagen, setTamanioImagen] = useState("");
  const [PosicionImagen, setPosicionImagen] = useState("");
  const [PrecioDisenio, setPrecioDisenio] = useState("");
  const [ImagenDisenio, setImagenDisenio] = useState("");
  const [ImagenReferencia, setImagenReferencia] = useState("");
  const [IdImagenDisenio, setIdImagenDisenio] = useState("");
  const [IdImagenReferencia, setIdImagenReferencia] = useState("");
  const [disenioSeleccionado, setDisenioSeleccionado] = useState(null);

  const [ImagenDisenioPrevisualizar, setImagenDisenioPrevisualizar] =
    useState("");
  const [ImagenReferenciaPrevisualizar, setImagenReferenciaPrevisualizar] =
    useState("");

  const [ImagenDisenioUpdate, setImagenDisenioUpdate] = useState("");
  const [ImagenReferenciaUpdate, setImagenReferenciaUpdate] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  let IdImagenDisenioCreate;
  let ImagenDisenioCreate;

  let IdImagenDisenioUpdate;

  // variables temporales de para el modal de actualizar diseño

  // const [FuenteTemporalEdit, setFuenteTemporalEdit] = useState("");
  // const [TamanioFuenteTemporalEdit, setTamanioFuenteTemporalEdit] =
  //   useState("");
  // const [ColorFuenteTemporalEdit, setColorFuenteTemporalEdit] = useState("");
  // const [PosicionFuenteTemporalEdit, setPosicionFuenteTemporalEdit] =
  //   useState("");

  // const [TamanioImagenTemporalEdit, setTamanioImagenTemporalEdit] =
  //   useState("");
  // const [PosicionImagenTemporalEdit, setPosicionImagenTemporalEdit] =
  //   useState("");
  const [ImagenDisenioTemporalEdit, setImagenDisenioTemporalEdit] =
    useState("");
  const [ImagenReferenciaTemporalEdit, setImagenReferenciaTemporalEdit] =
    useState("");

  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({
    NombreDisenio: "",
    PrecioDisenio: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  let diseniosTotales;

  useEffect(() => {
    getDisenios();
  }, []);

  const getDisenios = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const respuesta = await axios.get(url);
      setDisenios(respuesta.data);

      diseniosTotales = respuesta.data;

      getDiseniosCliente();

      console.log(respuesta.data);
    } catch (error) {
      show_alerta({
        message: "Error al obtener los diseños",
        type: "error",
      });
    } finally {
      setLoading(false); // Ocultar el loader después de obtener los diseños o en caso de error
    }
  };

  const getComprasByDisenios = async (IdDisenio) => {
    try {
      const response = await axios.get(productosUrl);
      // Verifica si el diseño está asociado a algun producto
      const productos = response.data.filter(
        (producto) => producto.IdDisenio === IdDisenio
      );
      return productos.length > 0; // Devuelve true si hay al menos una compra asociada
    } catch (error) {
      console.error("Error fetching productos:", error);
      show_alerta({ message: "Error al verificar el producto", type: "error" });
      return false; // Considera que no tiene productos asociadas en caso de error
    }
  };

  const getDiseniosCliente = async () => {
    try {
      const diseniosFiltrados = diseniosTotales.filter(
        (disenio) => disenio.IdUsuario == auth.idCliente
      );

      // console.log(pedidosTotales);
      console.log(diseniosFiltrados);

      setDiseniosCliente(diseniosFiltrados);
    } catch (error) {
      console.log(error);

      show_alerta("Error al obtener los pedidos", "error");
    }
  };

  const [showInputsFile, setShowInputsFile] = useState(null);

  const [showSavedImages, setShowSavedImages] = useState(null);

  const [showColorInput, setShowColorInput] = useState(null);
  const [showColor, setShowColor] = useState(null);

  const [showDisenio, setShowDisenio] = useState(null);
  const [showDisenioInput, setShowDisenioInput] = useState(null);

  const [showExistsColor, setShowExistsColor] = useState(null);

  const renderInputDisenio =
    showDisenio &&
    (operation === 1 || (operation === 2 && ImagenDisenio !== "No aplica"));

  function formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  }

  const openModal = (op, disenio) => {
    if (op === 1) {
      // Crear diseño
      setTitle("Crear Diseño");
      setOperation(1);
      setIdDisenio("");
      setNombreDisenio("");
      // setFuente("");
      // setTamanioFuente("");
      // setColorFuente("#000000");
      // setShowColorValue(false);
      // setShowExistsColor(false);
      // setPosicionFuente("");

      setTamanioImagen("");
      setPosicionImagen("");
      setPrecioDisenio("");
      setImagenDisenio(null);
      setImagenReferencia(null);
      setImagenDisenioPrevisualizar(null);
      setImagenReferenciaPrevisualizar(null);

      // setShowInputsFile(true);

      // setShowDisenioInput(false);

      // setShowColorInput(false);
      // setShowColor(true);
      setShowDisenio(true);

      setTimeout(() => {
        document.getElementById("spanInputFileDisenio").innerHTML =
          "Seleccionar archivo";
        document.getElementById("spanInputFileReferencia").innerHTML =
          "Seleccionar archivo";
      }, 10);

      // Opcion actualizar diseño
    } else if (op === 2 && disenio) {
      setImagenReferencia("0");

      setTitle("Actualizar Datos");
      setOperation(2);

      setIdDisenio(disenio.IdDisenio);
      setNombreDisenio(disenio.NombreDisenio);

      setTamanioImagen(disenio.TamanioImagen);
      setPosicionImagen(disenio.PosicionImagen);
      setPrecioDisenio(disenio.PrecioDisenio);

      setImagenDisenio(disenio.ImagenDisenio);
      setImagenReferencia(disenio.ImagenReferencia);

      setImagenDisenioPrevisualizar(disenio.ImagenDisenio);
      setImagenReferenciaPrevisualizar(disenio.ImagenReferencia);

      setIdImagenDisenio(disenio.IdImagenDisenio);
      setIdImagenReferencia(disenio.IdImagenReferencia);

      setImagenDisenioUpdate(disenio.ImagenDisenio);
      setImagenReferenciaUpdate(disenio.ImagenReferencia);

      // setImagenDisenioPrevisualizar(null);
      // setImagenReferenciaPrevisualizar(null);

      // console.log(IdImagenDisenio);

      document.getElementById("spanInputFileReferencia").innerHTML =
        "Seleccionar archivo";

      document.getElementById("spanInputFileDisenio").innerHTML =
        "Seleccionar archivo";

      setErrors({
        NombreDisenio: "",
        PosicionImagen: "",
      });

      // const errors = {
      //   NombreDisenio: validateTamanioFuente(disenio.NombreDisenio),
      //   // Fuente: validateTamanioFuente(disenio.Fuente),

      // };
      // setErrors(errors);
    }
  };

  const handleDetalleDisenio = async (idDisenio) => {
    try {
      const respuesta = await axios.get(
        `https://softshirt-1c3fad7d72e8.herokuapp.com/api/disenios/${idDisenio}`
      );

      const disenio = respuesta.data;
      console.log("Detalle de diseño:", disenio);
      setDisenioSeleccionado(disenio);
      $("#modalDetalleDisenio").modal("show");
    } catch (error) {
      show_alerta({
        message: "Error al obtener los detalles del diseño",
        type: "error",
      });
    }
  };

  const validarCampos = () => {
    // Verifica si algún campo requerido está vacío o inválido
    if (
      NombreDisenio === "" ||
      TamanioImagen === "" ||
      PosicionImagen === "" ||
      PrecioDisenio === "" ||
      isNaN(PrecioDisenio) ||
      PrecioDisenio < 0 ||
      !ImagenDisenio ||
      !ImagenReferencia
    ) {
      return "Por favor, completa todos los campos correctamente";
    }

    // Si no hay errores, devuelve null
    return null;
  };

  const guardarDisenio = async () => {
    // Validar campos y mostrar alerta si hay errores
    const error = validarCampos();
    if (error) {
      show_alerta({
        message: error,
        type: "error",
      });
      return;
    }

    if (operation === 1) {
      // Validar si existe un diseño con ese nombre
      const existeNombreDisenio = Disenios.some(
        (disenio) => disenio.NombreDisenio === NombreDisenio
      );

      if (existeNombreDisenio) {
        show_alerta({
          message: "Ya existe un diseño con ese nombre",
          type: "error",
        });
        return;
      }

      const [idDesign, ulrDesign] = await subirImageDesign(ImagenDisenio);
      const [ulrReference, idReference] = await subirImageReference(
        ImagenReferencia
      );

      await enviarSolicitud("POST", {
        IdUsuario: auth.idUsuario || auth.idCliente,
        NombreDisenio,
        TamanioImagen,
        PosicionImagen,
        PrecioDisenio,
        IdImagenDisenio: idDesign,
        ImagenDisenio: ulrDesign,
        IdImagenReferencia: idReference,
        ImagenReferencia: ulrReference,
        Estado: "Activo",
      });

      show_alerta({
        message: "Diseño guardado con éxito",
        type: "success",
      });
    } else if (operation === 2) {
      let inputDisenioFile =
        document.getElementById("inputFileDisenio").files[0];
      let inputReferenciaFile = document.getElementById("inputFileReferencia")
        .files[0];

      // Si hay archivos en los inputs de diseño y referencia
      if (inputDisenioFile) {
        await editImageDesign(IdImagenDisenio, inputDisenioFile);
      }

      if (inputReferenciaFile) {
        await editImageReference(IdImagenReferencia, inputReferenciaFile);
      }

      await enviarSolicitud("PUT", {
        IdDisenio,
        NombreDisenio,
        TamanioImagen,
        PosicionImagen,
        PrecioDisenio,
        IdImagenDisenio,
        ImagenDisenio: ImagenDisenioUpdate,
        IdImagenReferencia,
        ImagenReferencia: ImagenReferenciaUpdate,
      });

      show_alerta({
        message: "Diseño actualizado con éxito",
        type: "success",
      });

      setTimeout(() => {
        setImagenDisenio(null);
        setImagenDisenioPrevisualizar(null);
        setImagenReferencia(null);
        setImagenReferenciaPrevisualizar(null);
      }, 1000);
    }
  };

  // Función para validar el nombre de diseño
  const validateNombreDisenio = (value) => {
    // Verificar que el campo no esté vacío
    if (!value) {
      return "Escribe el nombre del diseño";
    }

    // Verificar que el nombre esté entre 2 y 40 caracteres
    if (value.length < 2 || value.length > 40) {
      return "El nombre del diseño debe tener entre 2 y 40 caracteres";
    }

    // Verificar que el valor tenga el formato adecuado
    if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9]+( [A-Za-zñÑáéíóúÁÉÍÓÚ0-9]+)*$/.test(value)) {
      return "El nombre del diseño solo puede contener letras, tildes, la letra 'ñ' y números con un solo espacio entre palabras";
    }

    return "";
  };

  // Función para validar el precio de diseño
  const validatePrecioDisenio = (value) => {
    // Verificar que el campo no esté vacío
    if (!value) {
      return "Digite el precio del diseño";
    }

    // Verificar que el valor sea un número válido
    if (!/^\d+(\.\d+)?$/.test(value)) {
      return "El precio del diseño solo puede contener números y decimales";
    }

    // Convertir el valor a número para verificar el rango
    const numero = parseFloat(value);

    // Verificar que el valor no exceda 1 millón
    if (numero > 1000000) {
      return "El precio del diseño no puede exceder 1 millón";
    }

    return "";
  };

  // Función para manejar cambios en el nombre de diseño
  const handleChangeNombreDisenio = (e) => {
    let value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio

    // Limitar la longitud del valor ingresado a entre 6 y 10 caracteres
    // if (value.length > 10) {
    //   value = value.slice(0, 10);
    // }
    setNombreDisenio(value);
    const errorMessage = validateNombreDisenio(value);
    setErrors((prevState) => ({
      ...prevState,
      NombreDisenio: errorMessage,
    }));
  };

  // Función para manejar cambios en el tamaño de la imagen
  const handleChangeTamanioImagen = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setTamanioImagen(value);
  };

  // Función para manejar cambios en la posicion de la imagen
  const handleChangePosicionImagen = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setPosicionImagen(value);
  };

  // Función para manejar cambios en el precio de diseño
  const handleChangePrecioDisenio = (e) => {
    let value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio

    // Limitar la longitud del valor ingresado a entre 6 y 10 caracteres
    // if (value.length > 10) {
    //   value = value.slice(0, 10);
    // }
    setPrecioDisenio(value);
    const errorMessage = validatePrecioDisenio(value);
    setErrors((prevState) => ({
      ...prevState,
      PrecioDisenio: errorMessage,
    }));
  };

  // cargar la imagen que se usara en el diseño
  const handleChangeImagenDisenio = (e) => {
    const file = e.target.files[0];
    console.log(file);
    let spanDisenio = document.getElementById("spanInputFileDisenio");

    if (file) {
      setImagenDisenio(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenDisenioPrevisualizar(reader.result);
        console.log(reader.result);
      };
      reader.readAsDataURL(file);

      var fileName = "";
      fileName = e.target.value.split("\\").pop();

      spanDisenio.innerHTML = fileName;
    } else {
      document.getElementById("inputFileDisenio").value = null;
      setImagenDisenio(null);
      setImagenDisenioPrevisualizar(null);
      spanDisenio.innerHTML = "Seleccionar archivo";

      console.log(e.target.files[0]);
    }
  };

  // cargar la imagen que se usara en la imagen de referencia
  const handleChangeImagenReferencia = (e) => {
    const file = e.target.files[0];
    console.log(file);
    let spanReferencia = document.getElementById("spanInputFileReferencia");

    if (file) {
      setImagenReferencia(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenReferenciaPrevisualizar(reader.result);
      };
      reader.readAsDataURL(file);

      var fileName = "";
      fileName = e.target.value.split("\\").pop();

      spanReferencia.innerHTML = fileName;
    } else {
      console.log("elseChanIR");

      document.getElementById("inputFileReferencia").value = null;
      setImagenReferencia(null);
      setImagenReferenciaPrevisualizar(null);
      spanReferencia.innerHTML = "Seleccionar archivo";
    }
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
        ? `${url}/${parametros.IdDisenio}`
        : url;

    console.log(parametros);

    // return

    try {
      let respuesta;
      if (metodo === "POST") {
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
      getDisenios();

      if (metodo === "POST") {
        show_alerta({
          message: "Diseño creado correctamente",
          type: "success",
        });
      } else if (metodo === "PUT") {
        show_alerta({
          message: "Diseño actualizado con éxito",
          type: "success",
        });
      } else if (metodo === "DELETE") {
        show_alerta({
          message: "Diseño eliminado con éxito",
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

  const deleteDisenio = async (IdDisenio, NombreDisenio) => {
    // Verificar si el diseño está asociado a algun producto
    const asociado = await getComprasByDisenios(IdDisenio);

    if (asociado) {
      // Mostrar mensaje si está asociado y no permitir la eliminación
      show_alerta({
        message:
          "El diseño está asociado a un producto y no puede ser eliminado.",
        type: "info",
      });
      return; // Salir de la función para evitar la eliminación
    }

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar el diseño ${NombreDisenio}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        enviarSolicitud("DELETE", { IdDisenio: IdDisenio }).then(() => {
          // Calcular el índice del cliente eliminado en la lista filtrada
          const index = filteredDisenios.findIndex(
            (disenio) => disenio.IdDisenio === IdDisenio
          );

          // Determinar la página en la que debería estar el cliente después de la eliminación
          const newPage =
            Math.ceil((filteredDisenios.length - 1) / itemsPerPage) || 1;

          // Establecer la nueva página como la página actual
          setCurrentPage(newPage);

          show_alerta({
            message: "Diseño eliminado con éxito",
            type: "success",
          });
        });
      } else {
        show_alerta({
          message: "El diseño NO fue eliminado",
          type: "info",
        });
      }
    });
  };

  const cambiarEstadoDisenio = async (IdDisenio) => {
    try {
      const disenio = Disenios.find(
        (disenio) => disenio.IdDisenio === IdDisenio
      );
      const nuevoEstado = disenio.Estado === "Activo" ? "Inactivo" : "Activo";

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar el estado del diseño ${disenio.NombreDisenio}?`,
        icon: "question",
        html: `El estado actual del diseño es: <strong> ${disenio.Estado}</strong>. ¿Desea cambiarlo a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.put(`${url}/${IdDisenio}`, { Estado: nuevoEstado });

          setDisenios((prevDisenios) =>
            prevDisenios.map((disenio) =>
              disenio.IdDisenio === IdDisenio
                ? { ...disenio, Estado: nuevoEstado }
                : disenio
            )
          );

          show_alerta({
            message: "Estado del diseño cambiado con éxito",
            type: "success",
          });
        } else {
          show_alerta({
            message: "No se ha cambiado el estado del diseño",
            type: "info",
          });
        }
      });
    } catch (error) {
      console.error("Error updating state:", error);
      show_alerta({
        message: "Error cambiando el estado del diseño",
        type: "error",
      });
    }
  };

  function formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  }

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Resetear la página actual al cambiar el término de búsqueda
  };

  let totalPages;
  let currentDiseños;

  if (auth.idUsuario) {
    // Filtrar los Disenios según el término de búsqueda
    const filteredDisenios = Disenios.filter((cliente) =>
      Object.values(cliente).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Aplicar paginación a los Disenios filtrados
    totalPages = Math.ceil(filteredDisenios.length / itemsPerPage);
    currentDiseños = filteredDisenios.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  } else {
    // Filtrar los Disenios según el término de búsqueda
    const filteredDisenios = DiseniosCliente.filter((cliente) =>
      Object.values(cliente).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Aplicar paginación a los Disenios filtrados
    totalPages = Math.ceil(filteredDisenios.length / itemsPerPage);
    currentDiseños = filteredDisenios.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* modal crear diseño */}
      <div
        className="modal fade"
        id="modalDisenio"
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
                  {/* Nombre de diseño */}
                  <div className="form-group col-md-6">
                    <label htmlFor="nombreDiseño">Nombre del diseño</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.NombreDisenio ? "is-invalid" : ""
                      }`}
                      id="nombreDiseño"
                      placeholder="Ingrese el nombre del diseño"
                      required
                      value={NombreDisenio}
                      onChange={handleChangeNombreDisenio}
                    />
                    {renderErrorMessage(errors.NombreDisenio)}
                  </div>

                  {/* Tamaño de imagen*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="tamanioImagen">Tamaño de imagen</label>
                    <select
                      className="form-control"
                      id="tamanioImagen"
                      value={TamanioImagen}
                      onChange={(e) => handleChangeTamanioImagen(e)}
                      required
                    >
                      <option value="" disabled>
                        Elige el tamaño de la imagen
                      </option>
                      <option value="Grande">Grande</option>
                      <option value="Mediana">Mediana</option>
                      <option value="Pequeña">Pequeña</option>
                    </select>

                    {TamanioImagen === "" && (
                      <p className="text-danger">
                        Por favor, seleccione un tamaño para la imagen.
                      </p>
                    )}
                  </div>

                  {/* Posicion de imagen*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="posicionImagen">Posición de imagen</label>

                    <select
                      className="form-control"
                      id="posicionImagen"
                      value={PosicionImagen}
                      onChange={(e) => handleChangePosicionImagen(e)}
                      required
                    >
                      <option value="" disabled>
                        Seleccione una posición para la imagen
                      </option>
                      <option value="Arriba Izquierda">Arriba Izquierda</option>
                      <option value="Arriba Derecha">Arriba Derecha</option>
                      <option value="Abajo Izquierda">Abajo Izquierda</option>
                      <option value="Abajo Derecha">Abajo Derecha</option>
                      <option value="Centro">Centro</option>
                    </select>

                    {PosicionImagen === "" && (
                      <p className="text-danger">
                        Por favor, seleccione una posición para la imagen.
                      </p>
                    )}
                  </div>

                  {/* Precio de diseño */}
                  <div className="form-group col-md-6">
                    <label htmlFor="precioDiseño">Precio del diseño</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.PrecioDisenio ? "is-invalid" : ""
                      }`}
                      id="precioDiseño"
                      placeholder="Ingrese el precio del diseño"
                      required
                      value={PrecioDisenio}
                      onChange={handleChangePrecioDisenio}
                    />
                    {renderErrorMessage(errors.PrecioDisenio)}
                  </div>

                  {/* Imagen diseño*/}
                  <div className="form-group col-md-6">
                    <label>Imagen del diseño </label>
                    <br />

                    {/* {renderInputDisenio && ( */}
                    <>
                      <input
                        accept=".png, .jpg, .jpeg"
                        type="file"
                        name="file-2"
                        id="inputFileDisenio"
                        className={`inputfile inputfile-2 `}
                        onChange={handleChangeImagenDisenio}
                        draggable
                      />
                      <label htmlFor="inputFileDisenio">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="iborrainputfile"
                          width="20"
                          height="17"
                          viewBox="0 0 20 17"
                        >
                          <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                        </svg>
                        <span
                          className="iborrainputfile"
                          id="spanInputFileDisenio"
                        >
                          Seleccionar archivo
                        </span>
                      </label>
                    </>
                    {/* )} */}

                    {!ImagenDisenio && (
                      <p className="text-danger">
                        Por favor, ingresa una imagen para tu diseño, se permite
                        (.png .jpg) .
                      </p>
                    )}

                    {ImagenDisenio && (
                      <div className="container py-5 mx-3">
                        <img
                          src={ImagenDisenioPrevisualizar}
                          alt="Vista previa imagen del diseño"
                          style={{
                            maxWidth: "200px",
                            display: "block",
                            border: "1px solid black",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Imagen referencia*/}
                  <div className="form-group col-md-6">
                    <label htmlFor="ImagenDisenioCliente">
                      Imagen de referencia 
                    </label>

                    <br />

                    <input
                      accept=".png, .jpg, .jpeg"
                      type="file"
                      name="file-3"
                      id="inputFileReferencia"
                      className={`inputfile inputfile-2 `}
                      onChange={handleChangeImagenReferencia}
                    />
                    <label htmlFor="inputFileReferencia">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="iborrainputfile"
                        width="20"
                        height="17"
                        viewBox="0 0 20 17"
                      >
                        <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                      </svg>
                      <span
                        className="iborrainputfile"
                        id="spanInputFileReferencia"
                      >
                        Seleccionar archivo
                      </span>
                    </label>

                    {/* {renderErrorMessage(errors.ImagenReferencia)} */}

                    {!ImagenReferencia && (
                      <p className="text-danger">
                        Por favor, ingresa una imagen de referencia de tu
                        diseño, se permite (.png .jpg) .
                      </p>
                    )}

                    <div className="container py-5 mx-3">
                      {ImagenReferencia && (
                        <img
                          src={ImagenReferenciaPrevisualizar}
                          alt="Vista previa imagen del diseño"
                          style={{
                            maxWidth: "200px",
                            display: "block",
                            border: "1px solid black",
                          }}
                        />
                      )}
                    </div>
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
                  guardarDisenio();
                }}
                disabled={isSubmitting}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* modal crear diseño */}

      {/* Inicio modal ver detalle diseño */}
      <div
        className="modal fade"
        id="modalDetalleDisenio"
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
              {disenioSeleccionado && (
                <>
                  <div className="modal-body">
                    <form>
                      <div className="form-row">
                        {/* Nombre de diseño detalle*/}
                        <div className="form-group col-md-6">
                          <label htmlFor="nombreDiseño">
                            Nombre del diseño
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            // id="nombreDiseño"
                            value={disenioSeleccionado.NombreDisenio}
                            disabled
                          />
                        </div>

                        {/* Tamaño de imagen detalle*/}
                        <div className="form-group col-md-6">
                          <label htmlFor="tamanioImagen">
                            Tamaño de imagen
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="tamanioImagen"
                            value={disenioSeleccionado.TamanioImagen}
                            disabled
                          />
                        </div>

                        {/* Posicion de imagen detalle*/}
                        <div className="form-group col-md-6">
                          <label htmlFor="posicionImagen">
                            Posición de la imagen
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            id="nombreDiseño"
                            value={disenioSeleccionado.PosicionImagen}
                            disabled
                          />
                        </div>

                        {/* Precio de diseño detalle*/}
                        <div className="form-group col-md-6">
                          <label htmlFor="precioDiseño">
                            Precio del diseño
                          </label>
                          <input
                            type="text"
                            id="precioDiseño"
                            className="form-control"
                            value={formatCurrency(
                              disenioSeleccionado.PrecioDisenio
                            )}
                            disabled
                          />
                        </div>

                        {/* Imagen diseño detalle*/}
                        <div className="form-group col-md-6">
                          <label>Imagen del diseño </label>

                          {disenioSeleccionado.ImagenDisenio !==
                            "No aplica" && (
                            <div className="container py-4 mx-3">
                              <img
                                src={disenioSeleccionado.ImagenDisenio}
                                alt="Vista previa imagen del diseño"
                                style={{
                                  width: "170px",
                                  height: "150px",
                                  display: "block",
                                  border: "1px solid black",
                                }}
                              />
                            </div>
                          )}

                          {disenioSeleccionado.ImagenDisenio ===
                            "No aplica" && (
                            <input
                              type="text"
                              className="form-control"
                              disabled
                              value={disenioSeleccionado.ImagenDisenio}
                            />
                          )}
                        </div>

                        {/* Imagen referencia detalle*/}
                        <div className="form-group col-md-6">
                          <label>Imagen de referencia </label>

                          <div className="container py-4 mx-3">
                            <img
                              src={disenioSeleccionado.ImagenReferencia}
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
                      </div>
                    </form>
                  </div>
                </>
              )}
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
          {/* <h1 className="h3 mb-3 text-center text-dark">Gestión de Diseños</h1> */}
        </div>

        {/* <!-- Tabla de diseños --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex justify-content-between align-items-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
            {auth.idUsuario &&(

            <button
              type="button"
              className="btn btn-dark d-flex align-items-center justify-content-center p-0"
              data-toggle="modal"
              data-target="#modalDisenio"
              onClick={() => openModal(1, "", "", "", "", "", "")}
              style={{
                width: "150px",
                height: "40px",
              }}
            >
              <i className="fas fa-pencil-alt"></i>
              <span className="d-none d-sm-inline ml-2">Crear Diseño</span>
            </button>
            )}
            
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {/* Si un usuario esta logueado renderizara la tabla de admin, si no renderizara la tabla del cliente  */}

              {auth.idUsuario ? (
                <table
                  className="table table-bordered"
                  id="dataTable"
                  width="100%"
                  cellSpacing="0"
                >
                  <thead>
                    <tr>
                      <th>Nombre del Diseño</th>
                      <th>Tamaño de Imagen</th>
                      <th>Posición de Imagen</th>
                      <th>Precio del Diseño </th>
                      {/* <th>Color de fuente</th> */}
                      {/* <th>Dirección</th>
                    <th>ImagenDisenio Electrónico</th> */}
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDiseños.map((disenio) => (
                      <tr key={disenio.IdDisenio}>
                        <td>{disenio.NombreDisenio}</td>
                        <td>{disenio.TamanioImagen}</td>
                        <td>{disenio.PosicionImagen}</td>
                        <td>{formatCurrency(disenio.PrecioDisenio)}</td>
                        {/* <td>{disenio.ColorFuente}</td> */}
                        {/* <td>{cliente.PosicionImagen}</td>
                      <td>{cliente.ImagenDisenio}</td> */}

                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={disenio.Estado === "Activo"}
                              onChange={() =>
                                cambiarEstadoDisenio(disenio.IdDisenio)
                              }
                              className={
                                disenio.Estado === "Activo"
                                  ? "switch-green"
                                  : "switch-red"
                              }
                            />
                            <span className="slider round"></span>
                          </label>
                        </td>
                        <td>
                          <div
                            className="d-flex"
                            role="group"
                            aria-label="Acciones"
                          >
                            <button
                              className="btn btn-warning btn-sm mr-2"
                              title="Editar"
                              data-toggle="modal"
                              data-target="#modalDisenio"
                              onClick={() => openModal(2, disenio)}
                              disabled={disenio.Estado != "Activo"}
                            >
                              <i className="fas fa-sync-alt"></i>
                            </button>

                            <button
                              className="btn btn-danger btn-sm mr-2"
                              onClick={() =>
                                deleteDisenio(
                                  disenio.IdDisenio,
                                  disenio.NombreDisenio
                                )
                              }
                              disabled={disenio.Estado != "Activo"}
                              title="Eliminar"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>

                            <button
                              className="btn btn-info btn-sm mr-2"
                              onClick={() =>
                                handleDetalleDisenio(disenio.IdDisenio)
                              }
                              data-toggle="modal"
                              data-target="#modalDetalleDisenio"
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
                <table
                  className="table table-bordered"
                  id="dataTable"
                  width="100%"
                  cellSpacing="0"
                >
                  <thead>
                    <tr>
                      <th>Nombre del Diseño</th>
                      <th>Tamaño de Imagen</th>
                      <th>Posición de Imagen</th>
                      <th>Precio del Diseño </th>
                      {/* <th>Color de fuente</th> */}
                      {/* <th>Dirección</th>
                    <th>ImagenDisenio Electrónico</th> */}
                      {/* <th>Estado</th> */}
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDiseños.map((disenio) => (
                      <tr key={disenio.IdDisenio}>
                        <td>{disenio.NombreDisenio}</td>
                        <td>{disenio.TamanioImagen}</td>
                        <td>{disenio.PosicionImagen}</td>
                        <td>{formatCurrency(disenio.PrecioDisenio)}</td>
                        {/* <td>{disenio.ColorFuente}</td> */}
                        {/* <td>{cliente.PosicionImagen}</td>
                      <td>{cliente.ImagenDisenio}</td> */}

                        <td>
                          <div
                            className="d-flex"
                            role="group"
                            aria-label="Acciones"
                          >
                            <button
                              className="btn btn-warning btn-sm mr-2"
                              title="Editar"
                              data-toggle="modal"
                              data-target="#modalDisenio"
                              onClick={() => openModal(2, disenio)}
                              disabled={disenio.Estado != "Activo"}
                            >
                              <i className="fas fa-sync-alt"></i>
                            </button>

                            <button
                              className="btn btn-danger btn-sm mr-2"
                              onClick={() =>
                                deleteDisenio(
                                  disenio.IdDisenio,
                                  disenio.NombreDisenio
                                )
                              }
                              disabled={disenio.Estado != "Activo"}
                              title="Eliminar"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>

                            <button
                              className="btn btn-info btn-sm mr-2"
                              onClick={() =>
                                handleDetalleDisenio(disenio.IdDisenio)
                              }
                              disabled={disenio.Estado != "Activo"}
                              data-toggle="modal"
                              data-target="#modalDetalleDisenio"
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
        {/* Fin tabla de diseños */}
      </div>
      <AdminFooter />
    </>
  );
};
