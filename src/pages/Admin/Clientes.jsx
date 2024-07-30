import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../assets/js/Pagination";
import SearchBar from "../../assets/js/SearchBar";

export const Clientes = () => {
  const url = "http://localhost:3000/api/clientes";
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

  useEffect(() => {
    getClientes();
  }, []);

  const getClientes = async () => {
    const respuesta = await axios.get(url);
    setClientes(respuesta.data);
    console.log(respuesta.data);
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

  const guardarCliente = async () => {
    const cleanedNombreApellido = NombreApellido.trim().replace(/\s+/g, " "); // Elimina los espacios múltiples y los extremos
    const cleanedUsuario = Usuario.trim().replace(/\s+/g, " ");
    const cleanedDireccion = Direccion.trim().replace(/\s+/g, " "); // Elimina los espacios múltiples y los extremos
    const cleanedContrasenia = Contrasenia.trim();

    if (!TipoDocumento) {
      show_alerta(
        "El tipo documento es necesario",
        "error"
      );
      return;
    }

    if (!NroDocumento) {
      show_alerta(
        "El número de documento es necesario",
        "error"
      );
      return;
    }

    if (!NombreApellido) {
      show_alerta(
        "El nombre y apellido son necesario",
        "error"
      );
      return;
    }

    if (!Usuario) {
      show_alerta(
        "El usuario es necesario",
        "error"
      );
      return;
      
    }else if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9!@#$%^&*(),.?":{}|<>]+(?: [A-Za-zñÑáéíóúÁÉÍÓÚ0-9!@#$%^&*(),.?":{}|<>]+)*$/.test(Usuario) ) {
      show_alerta(
        "El nombre de usuario puede contener letras, números, caracteres especiales, y un solo espacio entre palabras",
        "error"
      );
      return;
    }

    if (!Telefono) {
      show_alerta(
        "El teléfono es necesario",
        "error"
      );
      return;
    }

    if (!Direccion) {
      show_alerta(
        "La dirección es necesaria",
        "error"
      );
      return;
    }

    if (!Correo) {
      show_alerta(
        "El correo es necesario",
        "error"
      );
      return;
    }

    if (operation === 1 && !cleanedContrasenia) {
      // Validar contraseña solo en creación de usuario
      setErrors((prevState) => ({
        ...prevState,
        contrasenia: "La contraseña es requerida",
      }));
    }

    // Validar errores específicos para cambiar contraseña
    const contraseniaError = validateContrasenia(cleanedContrasenia);

    if (contraseniaError && operation === 3) {
      // Mostrar error solo si estás cambiando la contraseña
      setErrors((prevState) => ({
        ...prevState,
        contrasenia: contraseniaError,
      }));
      show_alerta("Verifique los errores en el formulario", "error");
      return;
    }

    if (operation === 1) {
      // Crear Cliente
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
      // Actualizar Cliente
      await enviarSolicitud("PUT", {
        IdCliente,
        TipoDocumento,
        NroDocumento,
        NombreApellido: cleanedNombreApellido,
        Usuario: cleanedUsuario,
        Telefono,
        Direccion: cleanedDireccion,
        Correo,
        Contrasenia: cleanedContrasenia,
      });
    } else if (operation === 3) {
      // Cambiar Contraseña
      await enviarSolicitud("PUT", {
        IdCliente,
        Contrasenia: cleanedContrasenia,
      });
    }
  };

  // Función para validar el número de documento
  const validateNroDocumento = (value) => {
    if (!value) {
      return "Escribe el número de documento";
    }
    if (!/^\d+$/.test(value)) {
      return "El número de documento solo puede contener dígitos";
    }
    if (value.startsWith("0")) {
      return "El número de documento no puede empezar con cero";
    }
    if (value.length < 6 || value.length > 10) {
      return "El número de documento debe tener entre 6 y 10 dígitos";
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
    return "";
  };

  const validateUsuario = (value) => {
    if (!value) {
      return "Escribe el usuario";
    }
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ!@#$%^&*(),.?":{}|<>]+$/.test(value)) {
      return "El nombre de usuario solo puede contener letras, números y caracteres especiales, sin espacios";
    }
    if (value.length < 10 || value.length > 60) {
      return "El usuario debe tener entre 10 y 60 caracteres";
    }
    return "";
  };

  // Función para validar el teléfono
  const validateTelefono = (value) => {
    if (!value) {
      return "Escribe el teléfono";
    }
    if (!/^\d+$/.test(value)) {
      return "El teléfono solo puede contener dígitos";
    }
    if (value.startsWith("0")) {
      return "El teléfono no puede empezar con cero";
    }
    if (value.length !== 10) {
      return "El teléfono debe tener exactamente 10 dígitos";
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
  };

  // Función para manejar cambios en el número de documento
  const handleChangeNroDocumento = (e) => {
    let value = e.target.value;
    // Limitar la longitud del valor ingresado a entre 6 y 10 caracteres
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setNroDocumento(value);
    const errorMessage = validateNroDocumento(value);
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

  const show_alerta = (message, type) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: message,
      icon: type,
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: () => {
        // Selecciona la barra de progreso y ajusta su estilo
        const progressBar = MySwal.getTimerProgressBar();
        if (progressBar) {
          progressBar.style.backgroundColor = "black";
          progressBar.style.height = "6px";
        }
      },
    });
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

      const msj = respuesta.data.message;
      show_alerta(msj, "success");
      document.getElementById("btnCerrarCliente").click();
      getClientes();
      if (metodo === "POST") {
        show_alerta("Cliente creado con éxito", "success", { timer: 2000 });
      } else if (metodo === "PUT") {
        show_alerta("Cliente actualizado con éxito", "success", {
          timer: 2000,
        });
      } else if (metodo === "DELETE") {
        show_alerta("Cliente eliminado con éxito", "success", { timer: 2000 });
      }
    } catch (error) {
      if (error.response) {
        show_alerta(error.response.data.message, "error");
      } else if (error.request) {
        show_alerta("Error en la solicitud", "error");
      } else {
        show_alerta("Error desconocido", "error");
      }
      console.log(error);
    }
  };

  const deleteCliente = (IdCliente, NombreCliente) => {
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
        });
      } else {
        show_alerta("El cliente NO fue eliminado", "info");
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
        text: `El estado actual del cliente es: ${cliente.Estado}. ¿Desea cambiarlo a ${nuevoEstado}?`,
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

          show_alerta("Estado del cliente cambiado con éxito", "success", {
            timer: 2000,
          });
        } else {
          show_alerta("No se ha cambiado el estado del cliente", "info");
        }
      });
    } catch (error) {
      console.error("Error updating state:", error);
      show_alerta("Error cambiando el estado del cliente", "error");
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

  return (
    <>
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
                      Tipo de Documento:
                    </label>
                    <select
                      className="form-control"
                      id="tipoDocumentoCliente"
                      value={TipoDocumento}
                      onChange={(e) => handleChangeTipoDocumento(e)}
                      required
                    >
                      <option value="">Seleccione un tipo de documento</option>
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
                      Número de Documento:
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
                    <small className="form-text text-muted">
                      Ingrese un documento válido (entre 6 y 10 dígitos
                      numéricos).
                    </small>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="nombreCliente">Nombre del Cliente:</label>
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
                    <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
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
                    <label htmlFor="telefonoCliente">Teléfono:</label>
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
                    <small className="form-text text-muted">
                      Ingrese un número de teléfono válido (10 dígitos).
                    </small>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="direccionCliente">Dirección:</label>
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
                    <label htmlFor="correoCliente">Correo Electrónico:</label>
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
                      <label htmlFor="contraseniaCliente">Contraseña :</label>
                      <div className="d-flex align-items-center">
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
                      </div>
                      {renderErrorMessage(errors.contrasenia)}
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
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para cambiar contra */}
      {/* <div
        className="modal fade"
        id="modalCambiarContrasenia"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalUsuariosLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalCambiarContrasenia">
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
              <div className="input-group mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  id="contrasenia"
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
            <div className="modal-footer">
              <div className="text-right">
                <button
                  type="button"
                  id="btnCerrar"
                  className="btn btn-secondary mr-2"
                  data-dismiss="modal"
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={guardarCliente}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* Fin modal cambiar la contra*/}

      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-3 text-center text-dark">Gestión de Clientes</h1>
          <div className="text-right">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalCliente"
              onClick={() => openModal(1, "", "", "", "", "", "")}
            >
              <i className="fas fa-pencil-alt"></i> Crear Cliente
            </button>
          </div>
        </div>

        {/* <!-- Tabla de Clientes --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex">
            <h6 className="m-2 font-weight-bold text-primary">Clientes</h6>
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
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
                    <th>Número de Documento</th>
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
                        <div
                          className="btn-group"
                          role="group"
                          aria-label="Acciones"
                        >
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
    </>
  );
};
