import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import show_alerta from "../../components/Show_Alerta/show_alerta";
import { AdminFooter } from "../../components/Admin/AdminFooter";
import Loader from "../../components/Loader/loader";

export const Clientes = () => {
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/clientes";
  const pedidoUrl = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos";
  const [Clientes, setClientes] = useState([]);
  const [IdCliente, setIdCliente] = useState("");
  const [TipoDocumento, setTipoDocumento] = useState("");
  const [NroDocumento, setNroDocumento] = useState("");
  const [NombreApellido, setNombreApellido] = useState("");
  const [Usuario, setUsuario] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [Direccion, setDireccion] = useState("");
  const [Correo, setCorreo] = useState("");
  const [Contrasenia, setContrasenia] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({
    nroDocumento: "",
    nombreApellido: "",
    usuario: "",
    telefono: "",
    direccion: "",
    correo: "",
    contrasenia: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getClientes();
  }, []);

  const getClientes = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const respuesta = await axios.get(url);
      // Puedes filtrar o manipular los datos aquí si es necesario
      setClientes(respuesta.data);
      console.log(respuesta.data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
      // Puedes manejar el error aquí, como mostrar una alerta o mensaje de error
    } finally {
      setLoading(false); // Ocultar el loader después de la solicitud
    }
  };

  const getComprasByClente = async (IdCliente) => {
    try {
      const response = await axios.get(pedidoUrl);
      // Verifica si el cliente está asociado a algun producto
      const pedidos = response.data.filter(
        (pedido) => pedido.IdCliente === IdCliente
      );
      return pedidos.length > 0; // Devuelve true si hay al menos un producto asociada
    } catch (error) {
      console.error("Error fetching pedidos:", error);
      show_alerta({ message: "Error al verificar el producto", type: "error" });
      return false; // Considera que no tiene productos asociadas en caso de error
    }
  };

  const openModal = (op, cliente = null) => {
    if (op === 1) {
      // Crear cliente
      setIdCliente("");
      setTipoDocumento("");
      setNroDocumento("");
      setNombreApellido("");
      setUsuario("");
      setTelefono("");
      setDireccion("");
      setCorreo("");
      setContrasenia(""); // Limpiar el estado de la contraseña
      setOperation(1);
      setTitle("Crear Cliente");
    } else if (op === 2 && cliente) {
      // Actualizar Cliente
      setIdCliente(cliente.IdCliente);
      setTipoDocumento(cliente.TipoDocumento);
      setNroDocumento(cliente.NroDocumento);
      setNombreApellido(cliente.NombreApellido);
      setUsuario(cliente.Usuario);
      setTelefono(cliente.Telefono);
      setDireccion(cliente.Direccion);
      setCorreo(cliente.Correo);
      setOperation(2);
      setTitle("Actualizar Datos");
      setErrors({
        nroDocumento: "",
        nombreApellido: "",
        usuario: "",
        telefono: "",
        direccion: "",
        correo: "",
        contrasenia: "",
      });
      const errors = {
        nroDocumento: validateNroDocumento(cliente.NroDocumento),
        nombreApellido: validateNombreApellido(cliente.NombreApellido),
        usuario: validateUsuario(cliente.Usuario),
        telefono: validateTelefono(cliente.Telefono),
        direccion: validateDireccion(cliente.Direccion),
        correo: validateCorreo(cliente.Correo),
      };
      setErrors(errors);
    }
  };

  const openModalCambiarContrasenia = (cliente) => {
    setIdCliente(cliente.IdCliente);
    setContrasenia(cliente.Contrasenia || ""); // Asegúrate de manejar el caso donde no hay contraseña inicial
    setTitle("Cambiar Contraseña");
    setOperation(3); // Indica que la operación es cambiar contraseña
    setErrors({
      contrasenia: "",
    });

    // Mostrar el modal de cambiar contraseña
    const modal = new bootstrap.Modal(
      document.getElementById("modalCambiarContrasenia")
    );
    modal.show();
  };

  const validateAllFields = () => {
    const nroDocumentoError = validateNroDocumento(NroDocumento);
    const nombreApellidoError = validateNombreApellido(NombreApellido);
    const usuarioError = validateUsuario(Usuario);
    const telefonoError = validateTelefono(Telefono);
    const direccionError = validateDireccion(Direccion);
    const correoError = validateCorreo(Correo);
    const contraseniaError =
      operation === 1 ? validateContrasenia(Contrasenia) : ""; // Solo valida la contraseña al crear

    setErrors({
      nroDocumento: nroDocumentoError,
      nombreApellido: nombreApellidoError,
      usuario: usuarioError,
      telefono: telefonoError,
      direccion: direccionError,
      correo: correoError,
      contrasenia: contraseniaError,
    });

    return (
      !nroDocumentoError &&
      !nombreApellidoError &&
      !usuarioError &&
      !telefonoError &&
      !direccionError &&
      !correoError &&
      !contraseniaError
    );
  };

  const guardarCliente = async () => {
    // Limpieza de los campos
    const cleanedNombreApellido = NombreApellido.trim().replace(/\s+/g, " ");
    const cleanedUsuario = Usuario.trim().replace(/\s+/g, " ");
    const cleanedDireccion = Direccion.trim().replace(/\s+/g, " ");
    const cleanedContrasenia = Contrasenia ? Contrasenia.trim() : ""; // Solo limpiar si se proporciona

    // Valida todos los campos
    const allFieldsValid = validateAllFields();

    if (!allFieldsValid) {
      show_alerta({
        message: "Por favor, completa todos los campos correctamente",
        type: "error",
      });
      return;
    }

    // Manejo de la contraseña para la operación de creación
    if (operation === 1 && !cleanedContrasenia) {
      setErrors((prevState) => ({
        ...prevState,
        contrasenia: "La contraseña es requerida",
      }));
      show_alerta({
        message: "Verifique los errores en el formulario",
        type: "error",
      });
      return;
    }

    const contraseniaError = validateContrasenia(cleanedContrasenia);

    if (contraseniaError && operation === 1) {
      setErrors((prevState) => ({
        ...prevState,
        contrasenia: contraseniaError,
      }));
      show_alerta({
        message: "Verifique los errores en el formulario",
        type: "error",
      });
      return;
    }

    // Envío de solicitud dependiendo de la operación
    try {
      if (operation === 1) {
        // Crear un nuevo cliente
        await enviarSolicitud("POST", {
          TipoDocumento,
          NroDocumento,
          NombreApellido: cleanedNombreApellido,
          Usuario: cleanedUsuario,
          Telefono,
          Direccion: cleanedDireccion,
          Correo,
          Contrasenia: cleanedContrasenia,
          Estado: "Activo",
        });
      } else if (operation === 2) {
        // Actualizar un cliente existente (sin contraseña)
        await enviarSolicitud("PUT", {
          IdCliente,
          TipoDocumento,
          NroDocumento,
          NombreApellido: cleanedNombreApellido,
          Usuario: cleanedUsuario,
          Telefono,
          Direccion: cleanedDireccion,
          Correo,
        });
      }
    } catch (error) {
      show_alerta({
        message: "Hubo un error al guardar la información. Inténtalo de nuevo.",
        type: "error",
      });
      console.error("Error al guardar cliente:", error);
    }
  };

  // Función para validar el número de documento
  const validateNroDocumento = (value, tipoDocumento) => {
    if (!value) {
      return "Escribe el número de documento";
    }
    if (!/^\d+$/.test(value)) {
      return "El número de documento solo puede contener dígitos";
    }
    if (value.startsWith("0")) {
      return "El número de documento no puede comenzar con 0";
    }
    if (/^0+$/.test(value)) {
      return "El número de documento no puede ser todo ceros";
    }
    const length = value.length;
    if (tipoDocumento === "CC" && (length < 6 || length > 10)) {
      return "El número de documento debe tener entre 6 y 10 dígitos";
    }
    if (tipoDocumento === "CE" && (length < 6 || length > 7)) {
      return "El número de documento debe tener entre 6 y 7 dígitos";
    }
    return "";
  };

  const validateNombreApellido = (value) => {
    if (!value) {
      return "Escribe el nombre y apellido";
    }
    if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ]+( [A-Za-zñÑáéíóúÁÉÍÓÚ]+)*$/.test(value)) {
      return "El nombre y apellido solo puede contener letras, tildes y la letra 'ñ' con un solo espacio entre palabras";
    }
    const length = value.length;
    if (length < 2 || length > 60) {
      return "El nombre y apellido debe tener entre 2 y 60 caracteres";
    }
    return "";
  };

  const validateUsuario = (value) => {
    if (!value) {
      return "Escribe el usuario";
    }
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ!@#$%^&*(),.?":{}|<>]+$/.test(value)) {
      return "El nombre de usuario solo puede contener letras, números, sin espacios";
    }
    if (value.length < 7 || value.length > 15) {
      return "El usuario debe tener entre 7 y 15 caracteres";
    }
    return "";
  };

  // Función para validar el teléfono
  const validateTelefono = (value) => {
    if (!value) {
      return "Escribe el teléfono";
    }
    // El teléfono debe contener solo dígitos
    if (!/^\d+$/.test(value)) {
      return "El teléfono solo puede contener dígitos";
    }
    // El teléfono debe comenzar con 3
    if (!value.startsWith("3")) {
      return "El número de teléfono móvil debe comenzar con 3";
    }
    // El teléfono debe tener exactamente 10 dígitos
    if (!/^\d{10}$/.test(value)) {
      return "El teléfono debe tener exactamente 10 dígitos";
    }
    // El teléfono no debe comenzar con 0
    if (value.startsWith("0")) {
      return "El teléfono no puede comenzar con 0";
    }
    // El teléfono no debe ser todo ceros
    if (/^0+$/.test(value)) {
      return "El teléfono no puede ser todo ceros";
    }
    return "";
  };

  // Función para validar la dirección
  const validateDireccion = (value) => {
    if (!value) {
      return "Escribe la dirección";
    }
    if (/^\s/.test(value)) {
      return "La dirección no puede comenzar con un espacio";
    }
    if (!/^[a-zA-Z0-9#-\s]*$/.test(value)) {
      return "La dirección solo puede contener letras, números, # y -";
    }
    return "";
  };

  // Función para validar el correo electrónico
  const validateCorreo = (value) => {
    if (!value) {
      return "Ingresa tu correo electrónico";
    }
    if (/\s/.test(value)) {
      return "El correo electrónico no puede contener espacios";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Ingresa un correo electrónico válido";
    }
    const length = value.length;
    if (length < 10 || length > 50) {
      return "El correo debe tener entre 10 y 50 caracteres";
    }
    return "";
  };

  const validateContrasenia = (value) => {
    if (!value) {
      return "La contraseña es requerida";
    } else if (value.length < 8 || value.length > 15) {
      return "La contraseña debe tener entre 8 y 15 caracteres";
    }
    return "";
  };

  const handleChangeTipoDocumento = (e) => {
    const value = e.target.value;
    setTipoDocumento(value);

    const errorMessage = validateNroDocumento(NroDocumento, value);
    setErrors((prevState) => ({
      ...prevState,
      nroDocumento: errorMessage,
    }));
  };

  // Función para manejar cambios en el número de documento
  const handleChangeNroDocumento = (e) => {
    let value = e.target.value;
    // Limitar la longitud del valor ingresado a 10 caracteres
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setNroDocumento(value);
    const errorMessage = validateNroDocumento(value, TipoDocumento);
    setErrors((prevState) => ({
      ...prevState,
      nroDocumento: errorMessage,
    }));
  };

  const handleChangeNombreApellido = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setNombreApellido(value);

    // Validar el nombre y apellido
    const errorMessage = validateNombreApellido(value);
    setErrors((prevState) => ({
      ...prevState,
      nombreApellido: errorMessage,
    }));
  };

  const handleChangeUsuario = (e) => {
    const value = e.target.value.replace(/\s+/g, ""); // Eliminar todos los espacios
    setUsuario(value);

    // Validar el usuario
    const errorMessage = validateUsuario(value);
    setErrors((prevState) => ({
      ...prevState,
      usuario: errorMessage,
    }));
  };

  // Función para manejar cambios en el teléfono
  const handleChangeTelefono = (e) => {
    let value = e.target.value;
    // Limitar la longitud del valor ingresado a 10 caracteres
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setTelefono(value);
    const errorMessage = validateTelefono(value);
    setErrors((prevState) => ({
      ...prevState,
      telefono: errorMessage,
    }));
  };

  const handleChangeDireccion = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setDireccion(value);

    // Validar la dirección
    const errorMessage = validateDireccion(value);
    setErrors((prevState) => ({
      ...prevState,
      direccion: errorMessage,
    }));
  };

  // Función para manejar cambios en el correo electrónico
  const handleChangeCorreo = (e) => {
    const value = e.target.value;
    setCorreo(value); // Actualiza el estado del correo electrónico

    // Valida el correo electrónico y obtiene el mensaje de error
    const errorMessage = validateCorreo(value);

    // Actualiza el estado de los errores con el mensaje de error correspondiente
    setErrors((prevState) => ({
      ...prevState,
      correo: errorMessage, // Actualiza el error de correo con el mensaje de error obtenido
    }));
  };

  const handleChangeContrasenia = (e) => {
    setContrasenia(e.target.value); // Actualiza el estado de la contraseña
    const errorMessage = validateContrasenia(e.target.value);
    setErrors((prevState) => ({
      ...prevState,
      contrasenia: errorMessage, // Actualiza el error de contraseña con el mensaje de error obtenido
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Alternar el estado para mostrar/ocultar contraseña
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
        ? `${url}/${parametros.IdCliente}`
        : url;

    try {
      let respuesta;
      if (metodo === "POST") {
        respuesta = await axios.post(url, parametros);
      } else if (metodo === "PUT") {
        respuesta = await axios.put(urlRequest, parametros);
      } else if (metodo === "DELETE") {
        respuesta = await axios.delete(urlRequest);
      }

      setIsSubmitting(true)

      const msj = respuesta.data.message;
      show_alerta({
        message: msj,
        type: "success",
      });
      document.getElementById("btnCerrarCliente").click();
      getClientes();

      if (metodo === "POST") {
        show_alerta({
          message: "Cliente creado con éxito",
          type: "success",
        });
      } else if (metodo === "PUT") {
        show_alerta({
          message: "Cliente actualizado con éxito",
          type: "success",
        });
      } else if (metodo === "DELETE") {
        show_alerta({
          message: "Cliente eliminado con éxito",
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
    }finally {
      setIsSubmitting(false)
    }
  };

  const deleteCliente = async (IdCliente, NombreCliente) => {
    // Verificar si el cliente está asociado a algun producto
    const asociado = await getComprasByClente(IdCliente);

    if (asociado) {
      // Mostrar mensaje si está asociado y no permitir la eliminación
      show_alerta({
        message:
          "El cliente está asociado a un producto y no puede ser eliminado.",
        type: "info",
      });
      return; // Salir de la función para evitar la eliminación
    }

    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar al cliente ${NombreCliente}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        enviarSolicitud("DELETE", { IdCliente: IdCliente }).then(() => {
          // Calcular el índice del cliente eliminado en la lista filtrada
          const index = filteredClientes.findIndex(
            (cliente) => cliente.IdCliente === IdCliente
          );

          // Determinar la página en la que debería estar el cliente después de la eliminación
          const newPage =
            Math.ceil((filteredClientes.length - 1) / itemsPerPage) || 1;

          // Establecer la nueva página como la página actual
          setCurrentPage(newPage);

          show_alerta({
            message: "Cliente eliminado con éxito",
            type: "success",
          });
        });
      } else {
        show_alerta({
          message: "El cliente NO fue eliminado",
          type: "info",
        });
      }
    });
  };

  const cambiarEstadoCliente = async (IdCliente) => {
    try {
      const cliente = Clientes.find(
        (cliente) => cliente.IdCliente === IdCliente
      );
      const nuevoEstado = cliente.Estado === "Activo" ? "Inactivo" : "Activo";

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar el estado del cliente ${cliente.NombreApellido}?`,
        icon: "question",
        html: `El estado actual del cliente es: <strong> ${cliente.Estado}</strong>. ¿Desea cambiarlo a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.put(`${url}/${IdCliente}`, { Estado: nuevoEstado });

          setClientes((prevClientes) =>
            prevClientes.map((cliente) =>
              cliente.IdCliente === IdCliente
                ? { ...cliente, Estado: nuevoEstado }
                : cliente
            )
          );

          show_alerta({
            message: "Estado del cliente cambiado con éxito",
            type: "success",
          });
        } else {
          show_alerta({
            message: "No se ha cambiado el estado del cliente",
            type: "info",
          });
        }
      });
    } catch (error) {
      console.error("Error updating state:", error);
      show_alerta({
        message: "Error cambiando el estado del cliente",
        type: "error",
      });
    }
  };

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Resetear la página actual al cambiar el término de búsqueda
  };

  // Filtrar los clientes según el término de búsqueda
  const filteredClientes = Clientes.filter((cliente) =>
    Object.values(cliente).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Aplicar paginación a los clientes filtrados
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const currentClientes = filteredClientes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* Modal de crear y actualizar clientes */}
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
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="tipoDocumentoCliente">
                      Tipo de documento
                    </label>
                    <select
                      className="form-control"
                      id="tipoDocumentoCliente"
                      value={TipoDocumento}
                      onChange={(e) => handleChangeTipoDocumento(e)}
                      required
                    >
                      <option disabled value="">Seleccione un tipo de documento</option>
                      <option value="CC">Cédula</option>
                      <option value="CE">Cédula de Extranjería</option>
                    </select>

                    {TipoDocumento === "" && (
                      <p className="text-danger">
                        Por favor, seleccione un tipo de documento.
                      </p>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="nroDocumentoCliente">
                      Número de documento
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.nroDocumento ? "is-invalid" : ""
                      }`}
                      id="nroDocumentoCliente"
                      placeholder="Ingrese el número de documento"
                      required
                      value={NroDocumento}
                      onChange={handleChangeNroDocumento}
                    />
                    {renderErrorMessage(errors.nroDocumento)}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="nombreCliente">
                      Nombre y apellido del cliente
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.nombreApellido ? "is-invalid" : ""
                      }`}
                      id="nombreCliente"
                      placeholder="Ingrese el nombre del Cliente"
                      required
                      value={NombreApellido}
                      onChange={handleChangeNombreApellido}
                    />
                    {renderErrorMessage(errors.nombreApellido)}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="nombreUsuario">Nombre de usuario</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.usuario ? "is-invalid" : ""
                      }`}
                      id="nombreUsuario"
                      placeholder="Ingrese el nombre de Usuario"
                      required
                      value={Usuario}
                      onChange={handleChangeUsuario}
                    />
                    {renderErrorMessage(errors.usuario)}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="telefonoCliente">Teléfono</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.telefono ? "is-invalid" : ""
                      }`}
                      id="telefonoCliente"
                      placeholder="Ingrese el teléfono"
                      required
                      value={Telefono}
                      onChange={handleChangeTelefono}
                    />
                    {renderErrorMessage(errors.telefono)}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="direccionCliente">Dirección</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.direccion ? "is-invalid" : ""
                      }`}
                      id="direccionCliente"
                      placeholder="Ingrese la dirección"
                      required
                      value={Direccion}
                      onChange={handleChangeDireccion}
                    />
                    {renderErrorMessage(errors.direccion)}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="correoCliente">Correo electrónico</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.correo ? "is-invalid" : ""
                      }`}
                      id="correoCliente"
                      placeholder="Ingrese el correo electrónico"
                      required
                      value={Correo}
                      onChange={handleChangeCorreo}
                    />
                    {renderErrorMessage(errors.correo)}
                  </div>

                  {operation === 1 && (
                    <div className="form-group col-md-6">
                      <label htmlFor="contraseniaCliente">Contraseña</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="contraseniaNuevo"
                          className={`form-control ${
                            errors.contrasenia ? "is-invalid" : ""
                          }`}
                          placeholder="Contraseña"
                          value={Contrasenia}
                          onChange={handleChangeContrasenia}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary ml-2"
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? (
                            <i className="fas fa-eye-slash"></i>
                          ) : (
                            <i className="fas fa-eye"></i>
                          )}
                        </button>
                        {renderErrorMessage(errors.contrasenia)}
                      </div>
                    </div>
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
                  guardarCliente();
                }}
                disabled={isSubmitting}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de crear y actualizar clientes */}

      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          {/* <h1 className="h3 mb-3 text-center text-dark">Gestión de Clientes</h1> */}
        </div>

        {/* <!-- Tabla de Clientes --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex justify-content-between align-items-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
            <button
              type="button"
              className="btn btn-dark d-flex align-items-center justify-content-center p-0"
              data-toggle="modal"
              data-target="#modalCliente"
              onClick={() => openModal(1, "", "", "", "", "", "")}
              style={{
                width: "150px",
                height: "40px",
              }}
            >
              <i className="fas fa-pencil-alt"></i>
              <span className="d-none d-sm-inline ml-2">Crear Cliente</span>
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table
                className="table table-bordered"
                id="dataTable"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>Tipo de Documento</th>
                    <th>N°Documento</th>
                    <th>Nombre y Apellido</th>
                    <th>Usuario</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Correo Electrónico</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentClientes.map((cliente) => (
                    <tr key={cliente.NroDocumento}>
                      <td>{cliente.TipoDocumento}</td>
                      <td>{cliente.NroDocumento}</td>
                      <td>{cliente.NombreApellido}</td>
                      <td>{cliente.Usuario}</td>
                      <td>{cliente.Telefono}</td>
                      <td>{cliente.Direccion}</td>
                      <td>{cliente.Correo}</td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={cliente.Estado === "Activo"}
                            onChange={() =>
                              cambiarEstadoCliente(cliente.IdCliente)
                            }
                            className={
                              cliente.Estado === "Activo"
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
                            onClick={() => openModal(2, cliente)}
                            disabled={cliente.Estado != "Activo"}
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm mr-2"
                            onClick={() =>
                              deleteCliente(
                                cliente.IdCliente,
                                cliente.NombreApellido
                              )
                            }
                            disabled={cliente.Estado != "Activo"}
                            title="Eliminar"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                          {/* <button
                            type="button"
                            className="btn btn-primary btn-sm mr-2"
                            title="Cambiar Contraseña"
                            onClick={() => openModalCambiarContrasenia(cliente)}
                            disabled={cliente.Estado === "Inactivo"}
                          >
                            <i className="fas fa-key"></i>
                          </button> */}
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
        {/* Fin tabla de clientes */}
      </div>
      <AdminFooter />
    </>
  );
};
