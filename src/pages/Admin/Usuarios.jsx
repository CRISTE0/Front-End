import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../assets/js/Pagination";
import SearchBar from "../../assets/js/SearchBar";

export const Usuarios = () => {
  const url = "http://localhost:3000/api/usuarios";
  const rolesUrl = "http://localhost:3000/api/roles"; // URL de la API de roles
  const [Usuarios, setUsuarios] = useState([]);
  const [IdUsuario, setIdUsuario] = useState("");
  const [IdRol, setIdRol] = useState("");
  const [Usuario, setUsuario] = useState("");
  const [Correo, setCorreo] = useState("");
  const [Contrasenia, setContrasenia] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [Rol, setRol] = useState(""); // Estado para almacenar el rol seleccionado
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({
    usuario: "",
    correo: "",
    contrasenia: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [roles, setRoles] = useState([]); // Estado para almacenar la lista de roles
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña

  useEffect(() => {
    getUsuarios();
    getRoles();
  }, []);

  const getUsuarios = async () => {
    try {
      const respuesta = await axios.get(url);
      setUsuarios(respuesta.data);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    }
  };

  const getRoles = async () => {
    try {
      const response = await axios.get(rolesUrl);
      // Filtrar solo los roles activos
      const rolesActivos = response.data.filter(
        (rol) => rol.Estado === "Activo"
      );
      setRoles(rolesActivos);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const getRolName = (roleId) => {
    const rol = roles.find((rol) => rol.IdRol === roleId);
    return rol ? rol.NombreRol : "Rol no encontrado";
  };

  const openModal = (op, usuario = null) => {
    if (op === 1) {
      // Crear Usuario
      setIdUsuario("");
      setUsuario("");
      setCorreo("");
      setContrasenia(""); // Limpiar el estado de la contraseña
      setIdRol(""); // Limpiar el estado del rol seleccionado al crear usuario
      setOperation(1);
      setTitle("Crear Usuario");
    } else if (op === 2 && usuario) {
      // Actualizar Usuario
      setIdUsuario(usuario.IdUsuario);
      setUsuario(usuario.Usuario);
      setCorreo(usuario.Correo);
      setIdRol(usuario.IdRol); // Establecer el Id del rol seleccionado al actualizar usuario
      setOperation(2);
      setTitle("Actualizar Usuario");
      setErrors({
        usuario: "",
        correo: "",
        contrasenia: "",
      });
    }

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById("modalUsuarios"));
    modal.show();
  };

  const openModalCambiarContrasenia = (usuario) => {
    setIdUsuario(usuario.IdUsuario);
    setContrasenia(usuario.Contrasenia || ""); // Asegúrate de manejar el caso donde no hay contraseña inicial
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

  const guardarUsuario = async () => {
    setErrors({
      usuario: "",
      correo: "",
      contrasenia: "",
      rol: "", // Asegúrate de limpiar el error del rol también
    });

    const cleanedUsuario = Usuario.trim();
    const cleanedCorreo = Correo.trim();
    const cleanedContrasenia = Contrasenia.trim();

    if (operation === 1 || operation === 2) {
      // Validar campos requeridos para crear o editar usuario completo
      if (!cleanedUsuario) {
        setErrors((prevState) => ({
          ...prevState,
          usuario: "El nombre de usuario es requerido",
        }));
      }
      if (!cleanedCorreo) {
        setErrors((prevState) => ({
          ...prevState,
          correo: "El correo electrónico es requerido",
        }));
      }
      if (!IdRol) {
        setErrors((prevState) => ({
          ...prevState,
          rol: "El rol es requerido",
        }));
      }
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
      // Crear Usuario
      await enviarSolicitud("POST", {
        Usuario: cleanedUsuario,
        Correo: cleanedCorreo,
        Contrasenia: cleanedContrasenia,
        Estado: "Activo",
        IdRol: IdRol,
      });
    } else if (operation === 2) {
      // Actualizar Usuario
      await enviarSolicitud("PUT", {
        IdUsuario,
        Usuario: cleanedUsuario,
        Correo: cleanedCorreo,
        Contrasenia: cleanedContrasenia, // Incluso si no cambia, enviar la contraseña
        IdRol: IdRol,
      });
    } else if (operation === 3) {
      // Cambiar Contraseña
      await enviarSolicitud("PUT", {
        IdUsuario,
        Contrasenia: cleanedContrasenia,
      });
    }
  };

  const handleChangeRol = (e) => {
    setIdRol(e.target.value);
    if (!e.target.value) {
      setErrors((prevState) => ({ ...prevState, rol: "El rol es requerido" }));
    } else {
      setErrors((prevState) => ({ ...prevState, rol: "" }));
    }
  };

  const validateUsuario = (value) => {
    if (!value) {
      return "Escribe el usuario";
    }

    // Expresión regular ajustada para permitir solo letras, tildes y 'ñ' con un solo espacio entre palabras
    if (
      !/^[A-Za-zñÑáéíóúÁÉÍÓÚ]+(?: [A-Za-zñÑáéíóúÁÉÍÓÚ]+)*$/.test(value.trim())
    ) {
      return "El usuario solo puede contener letras, tildes y la letra 'ñ' con un solo espacio entre palabras";
    }

    // Verificar si hay espacios al inicio o al final
    if (value !== value.trim()) {
      return "El usuario no puede contener espacios al inicio ni al final";
    }

    return "";
  };

  const validateCorreo = (value) => {
    if (!value) {
      return "El correo electrónico es requerido";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Ingresa un correo electrónico válido";
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

  const handleChangeUsuario = (e) => {
    setUsuario(e.target.value); // Actualiza el estado del nombre de usuario
    const errorMessage = validateUsuario(e.target.value);
    setErrors((prevState) => ({
      ...prevState,
      usuario: errorMessage, // Actualiza el error del nombre de usuario con el mensaje de error obtenido
    }));
  };

  const handleChangeCorreo = (e) => {
    setCorreo(e.target.value); // Actualiza el estado del correo electrónico
    const errorMessage = validateCorreo(e.target.value);
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

  const handleDetalleUsuario = async (IdUsuario) => {
    try {
      const respuesta = await axios.get(
        `http://localhost:3000/api/usuarios/${IdUsuario}`
      );
      const usuario = respuesta.data;
      console.log("Detalle de usuario:", usuario);
      setUsuarioSeleccionado(usuario);
      // Mostrar el modal de detalles de usuario
      const modal = new bootstrap.Modal(
        document.getElementById("modalDetalleUsuario")
      );
      modal.show();
    } catch (error) {
      // Manejar errores
      console.error("Error al obtener los detalles del usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al obtener los detalles del usuario",
      });
    }
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
        const progressBar = MySwal.getTimerProgressBar();
        if (progressBar) {
          progressBar.style.backgroundColor = "black";
          progressBar.style.height = "6px";
        }
      },
    });
  };

  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  const enviarSolicitud = async (metodo, parametros) => {
    let urlRequest =
      metodo === "PUT" || metodo === "DELETE"
        ? `${url}/${parametros.IdUsuario}`
        : url;

    try {
      const respuesta = await axios({
        method: metodo,
        url: urlRequest,
        data: parametros,
      });
      const msj = respuesta.data.message;
      show_alerta(msj, "success");
      document.getElementById("btnCerrar").click();
      getUsuarios();
    } catch (error) {
      if (error.response) {
        show_alerta(error.response.data.message, "error");
      } else if (error.request) {
        show_alerta("Error en la solicitud", "error");
      } else {
        show_alerta("Error desconocido", "error");
      }
      console.error("Error en la solicitud:", error);
    }
  };

  const deleteUsuario = (idUsuario, Usuario) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar al usuario ${Usuario}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        enviarSolicitud("DELETE", { IdUsuario: idUsuario }).then(() => {
          const newPage = Math.ceil((Usuarios.length - 1) / itemsPerPage) || 1;
          setCurrentPage(newPage);
        });
      } else {
        show_alerta("El usuario NO fue eliminado", "info");
      }
    });
  };

  const cambiarEstadoUsuario = async (idUsuario) => {
    try {
      const usuario = Usuarios.find(
        (usuario) => usuario.IdUsuario === idUsuario
      );
      const nuevoEstado = usuario.Estado === "Activo" ? "Inactivo" : "Activo";

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar el estado del usuario ${usuario.Usuario}?`,
        icon: "question",
        text: `El estado actual del usuario es: ${usuario.Estado}. ¿Desea cambiarlo a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.put(`${url}/${idUsuario}`, { Estado: nuevoEstado });
          show_alerta("Estado del usuario actualizado con éxito", "success", {
            timer: 2000,
          });
          getUsuarios();
        }
      });
    } catch (error) {
      if (error.response) {
        show_alerta(error.response.data.message, "error");
      } else if (error.request) {
        show_alerta("Error en la solicitud", "error");
      } else {
        show_alerta("Error desconocido", "error");
      }
      console.error("Error al cambiar estado:", error);
    }
  };

  const filteredUsuarios = Usuarios.filter((usuario) =>
    usuario.Usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Resetear la página actual al cambiar el término de búsqueda
  };

  // Aplicar paginación a los proveedores filtrados
  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  const currentUsuarios = filteredUsuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Modal para crear/editar usuario */}
      <div
        className="modal fade"
        id="modalUsuarios"
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
              <h5 className="modal-title" id="modalUsuariosLabel">
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
              <input
                type="hidden"
                id="id"
                value={IdUsuario}
                onChange={(e) => setIdUsuario(e.target.value)}
              />

              <div className="input-group mb-3">
                <input
                  type="text"
                  id="usuario"
                  className={`form-control ${
                    errors.usuario ? "is-invalid" : ""
                  }`}
                  placeholder="Nombre de usuario"
                  value={Usuario}
                  onChange={handleChangeUsuario}
                />
                {renderErrorMessage(errors.usuario)}
              </div>

              <div className="input-group mb-3">
                <input
                  type="email"
                  id="correo"
                  className={`form-control ${
                    errors.correo ? "is-invalid" : ""
                  }`}
                  placeholder="Correo electrónico"
                  value={Correo}
                  onChange={handleChangeCorreo}
                />
                {renderErrorMessage(errors.correo)}
              </div>

              {operation === 1 && (
                <div className="input-group mb-3">
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
              )}

              {/* Selección de rol */}
              <div className="input-group mb-3">
                <div className="input-group-prepend"></div>
                <select
                  id="rol"
                  className={`form-control ${errors.rol ? "is-invalid" : ""}`}
                  value={IdRol}
                  onChange={handleChangeRol}
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.IdRol} value={rol.IdRol}>
                      {rol.NombreRol}
                    </option>
                  ))}
                </select>
                {renderErrorMessage(errors.rol)}
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
                <button onClick={guardarUsuario} className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fin modal crear/editar usuario */}

      {/* Modal para cambiar contra */}
      <div
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
                <button className="btn btn-primary" onClick={guardarUsuario}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fin modal cambiar la contra*/}

      {/* Inicio de usuarios */}
      <div className="container-fluid">
        {/* Page Heading */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-3 text-center text-dark">Gestión de Usuarios</h1>
          <div className="text-right">
            <button
              onClick={() => openModal(1)}
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalUsuarios"
            >
              <i className="fas fa-pencil-alt"></i> Crear Usuario
            </button>
          </div>
        </div>

        {/* Tabla Usuarios */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex">
            <h6 className="m-2 font-weight-bold text-primary">Usuarios</h6>
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
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsuarios.map((usuario, index) => (
                    <tr key={usuario.IdUsuario}>
                      <td>{usuario.Usuario}</td>
                      <td>{usuario.Correo}</td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={usuario.Estado === "Activo"}
                            onChange={() =>
                              cambiarEstadoUsuario(usuario.IdUsuario)
                            }
                            className={
                              usuario.Estado === "Activo"
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
                            onClick={() => openModal(2, usuario)}
                            disabled={usuario.Estado !== "Activo"}
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm mr-2"
                            title="Eliminar"
                            onClick={() =>
                              deleteUsuario(usuario.IdUsuario, usuario.Usuario)
                            }
                            disabled={usuario.Estado !== "Activo"}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                        <button
                          className="btn btn-info btn-sm mr-2"
                          title="Detalle"
                          onClick={() =>
                            handleDetalleUsuario(usuario.IdUsuario)
                          }
                          disabled={usuario.Estado === "Inactivo"}
                          data-toggle="modal"
                          data-target="#modalDetalleUsuario"
                        >
                          <i className="fas fa-solid fa-info-circle"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm mr-2"
                          title="Cambiar Contraseña"
                          onClick={() => openModalCambiarContrasenia(usuario)}
                          disabled={usuario.Estado === "Inactivo"}
                        >
                          <i className="fas fa-key"></i>
                        </button>
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

        {/* Fin tabla usuarios */}
      </div>
      {/* Modal para detalles de usuario */}
      <div
        className="modal fade"
        id="modalDetalleUsuario"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalDetalleUsuarioLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-l" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalDetalleUsuarioLabel">
                Detalles del Usuario
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
              {usuarioSeleccionado && (
                <form>
                  <div className="form-group">
                    <label htmlFor="idUsuario">ID:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="idUsuario"
                      value={usuarioSeleccionado.IdUsuario}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="usuario">Usuario:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="usuario"
                      value={usuarioSeleccionado.Usuario}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="correo">Correo:</label>
                    <input
                      type="email"
                      className="form-control"
                      id="correo"
                      value={usuarioSeleccionado.Correo}
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="rol">Rol:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="rol"
                      value={getRolName(usuarioSeleccionado.IdRol)}
                      disabled
                    />
                  </div>
                </form>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                id="btnCerrarDetalle"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Usuarios;
