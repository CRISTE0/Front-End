import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import show_alerta from "../../components/Show_Alerta/show_alerta";
import { AdminFooter } from "../../components/Admin/AdminFooter";
import Loader from "../../components/Loader/loader";

export const Usuarios = () => {
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/usuarios";
  const rolesUrl = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/roles"; // URL de la API de roles
  const [Usuarios, setUsuarios] = useState([]);
  const [IdUsuario, setIdUsuario] = useState("");
  const [IdRol, setIdRol] = useState("");
  const [Usuario, setUsuario] = useState("");
  const [Correo, setCorreo] = useState("");
  const [Contrasenia, setContrasenia] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
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
  const [roles2, setRoles2] = useState([]); // Estado para almacenar la lista de roles
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [showAdminRole, setShowAdminRole] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getUsuarios();
    getRoles();
    verificarAdmin();
  }, []);

  const verificarAdmin = async () => {
    try {
      const response = await axios.get(url);
      const response2 = await axios.get(rolesUrl);
      console.log(response.data);

      // Verifica si existe un usuario con IdRol igual a 1 (Admin)
      if (Array.isArray(response.data)) {
        const existeAdmin = response.data.some(
          (usuario) => usuario.IdRol === 1
        );

        if (existeAdmin) {
          // Filtra los roles para eliminar el rol con IdRol == 1 y solo mostrar los roles activos
          const rolesSinAdmin = response2.data
            .filter((rol) => rol.IdRol !== 1) // Excluir rol Admin
            .filter((rol) => rol.Estado === "Activo"); // Incluir solo roles activos
          console.log("Roles sin Admin y activos:", rolesSinAdmin);

          // Actualiza el estado o realiza las operaciones necesarias
          setRoles2(rolesSinAdmin);
        } else {
          console.log("No hay usuarios con el rol Admin.");
          // Solo mostrar los roles activos
          const rolesActivos = response2.data.filter(
            (rol) => rol.Estado === "Activo"
          );
          setRoles2(rolesActivos);
        }
      } else {
        console.error("La respuesta del API no es un array:", response.data);
      }
    } catch (error) {
      console.error("Error al verificar el rol de Admin:", error);
    }
  };

  const getUsuarios = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const respuesta = await axios.get(url);
      setUsuarios(respuesta.data);
    } catch (error) {
      show_alerta({
        message: "Error al obtener los usuarios",
        type: "error",
      });
    } finally {
      setLoading(false); // Ocultar el loader después de obtener los usuarios o en caso de error
    }
  };
  

  const getRoles = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const response = await axios.get(rolesUrl);
      // Filtrar solo los roles activos
      const rolesActivos = response.data.filter(
        (rol) => rol.Estado === "Activo"
      );
      setRoles(rolesActivos);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false); // Ocultar el loader después de obtener los roles
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
      verificarAdmin();
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
        usuario: usuario.usuario,
        correo: usuario.usuario,
        contrasenia: usuario.usuario,
      });
    }

    // Mostrar el modal
    const modal = new bootstrap.Modal(
      document.getElementById("modalUsuarios"),
      {
        backdrop: "static",
        keyboard: false,
      }
    );
    modal.show();
  };

  const guardarUsuario = async () => {
    // Reiniciar los errores al inicio de la función
    setErrors({
      usuario: "",
      correo: "",
      contrasenia: "",
      rol: "",
    });

    const cleanedUsuario = Usuario.trim();
    const cleanedCorreo = Correo.trim();
    const cleanedContrasenia = Contrasenia.trim();

    // Variable para rastrear si hay errores
    let hayErrores = false;

    if (operation === 1 || operation === 2) {
      // Validar campos requeridos para crear o editar usuario completo
      if (!cleanedUsuario) {
        setErrors((prevState) => ({
          ...prevState,
          usuario: "El nombre de usuario es requerido",
        }));
        hayErrores = true;
      }
      if (!cleanedCorreo) {
        setErrors((prevState) => ({
          ...prevState,
          correo: "El correo electrónico es requerido",
        }));
        hayErrores = true;
      }
      if (!IdRol) {
        setErrors((prevState) => ({
          ...prevState,
          rol: "El rol es requerido",
        }));
        hayErrores = true;
      }
    }

    if (operation === 1 && !cleanedContrasenia) {
      // Validar contraseña solo en creación de usuario
      setErrors((prevState) => ({
        ...prevState,
        contrasenia: "La contraseña es requerida",
      }));
      hayErrores = true;
    }

    // Validar errores específicos para cambiar contraseña
    const contraseniaError = validateContrasenia(cleanedContrasenia);
    if (contraseniaError && operation === 3) {
      // Mostrar error solo si estás cambiando la contraseña
      setErrors((prevState) => ({
        ...prevState,
        contrasenia: contraseniaError,
      }));
      hayErrores = true;
    }

    // Mostrar alerta si hay errores
    if (hayErrores) {
      show_alerta({
        message: "Por favor, completa todos los campos correctamente",
        type: "error",
      });
      return; // Salir de la función si hay errores
    }

    // Si no hay errores, proceder con la solicitud
    try {
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

      // Cerrar el modal después de una solicitud exitosa
      const modalElement = document.getElementById("modalUsuarios");
      const modal = new bootstrap.Modal(modalElement);
      modal.hide();
    } catch (error) {
      // Manejo de errores
      if (error.response) {
        show_alerta({ message: error.response.data.message, type: "error" });
      } else if (error.request) {
        show_alerta({ message: "Error en la solicitud", type: "error" });
      } else {
        show_alerta({ message: "Error desconocido", type: "error" });
      }
      console.error("Error en la solicitud:", error);
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

    if (value.length < 7 || value.length > 15) {
      return "El usuario debe tener entre 7 y 15 caracteres";
    }

    // Verificar si hay espacios al inicio o al final
    if (value !== value.trim()) {
      return "El usuario no puede contener espacios al inicio ni al final";
    }

    // Expresión regular ajustada para permitir solo letras, números, tildes y 'ñ' con un solo espacio entre palabras
    if (
      !/^[A-Za-zñÑáéíóúÁÉÍÓÚ0-9]+(?: [A-Za-zñÑáéíóúÁÉÍÓÚ0-9]+)*$/.test(
        value.trim()
      )
    ) {
      return "El usuario solo puede contener letras, números, tildes y la letra 'ñ', con un solo espacio entre palabras";
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
        `https://softshirt-1c3fad7d72e8.herokuapp.com/api/usuarios/${IdUsuario}`
      );
      const usuario = respuesta.data;
      console.log("Detalle de usuario:", usuario);
      setUsuarioSeleccionado(usuario);
      // Mostrar el modal de detalles de usuario
      const modal = new bootstrap.Modal(
        document.getElementById("modalDetalleUsuario"),
        {
          backdrop: "static",
          keyboard: false,
        }
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

  const renderErrorMessage = (error) => {
    return error ? <div className="invalid-feedback">{error}</div> : null;
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

      setIsSubmitting(true)

      const msj = respuesta.data.message;
      show_alerta({ message: msj, type: "success" });
      // document.getElementById("btnCerrar").click();
      getUsuarios();
    } catch (error) {
      if (error.response) {
        show_alerta({ message: error.response.data.message, type: "error" });
      } else if (error.request) {
        show_alerta({ message: "Error en la solicitud", type: "error" });
      } else {
        show_alerta({ message: "Error desconocido", type: "error" });
      }
      console.error("Error en la solicitud:", error);
    }finally {
      setIsSubmitting(false)
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
        show_alerta({ message: "El usuario NO fue eliminado", type: "info" });
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
        html: `El estado actual del usuario es: <strong> ${usuario.Estado}</strong>. ¿Desea cambiarlo a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.put(`${url}/${idUsuario}`, { Estado: nuevoEstado });
          show_alerta({
            message: "Estado del usuario actualizado con éxito",
            type: "success",
            timer: 2000,
          });
          getUsuarios();
        } else {
          show_alerta({
            message: "No se ha cambiado el estado del usuario",
            type: "info",
          });
        }
      });
    } catch (error) {
      if (error.response) {
        show_alerta({ message: error.response.data.message, type: "error" });
      } else if (error.request) {
        show_alerta({ message: "Error en la solicitud", type: "error" });
      } else {
        show_alerta({ message: "Error desconocido", type: "error" });
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

  if (loading) {
    return <Loader />;
  }

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
        <div className="modal-dialog modal-lg" role="document">
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
              <form id="crearUsuarioForm">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="usuario">Nombre de usuario</label>
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

                  <div className="form-group col-md-6">
                    <label htmlFor="correo">Correo electrónico</label>
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
                    <div className="form-group col-md-6">
                      <label htmlFor="contraseniaNuevo">Contraseña</label>
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
                      {/* Asegúrate de que el mensaje de error se muestre debajo del campo */}
                      {errors.contrasenia && (
                        <div className="invalid-feedback d-block">
                          {errors.contrasenia}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="form-group col-md-6">
                    <label htmlFor="rol">Rol</label>
                    {operation === 1 ? (
                      <select
                        id="rol"
                        className={`form-control ${
                          errors.rol ? "is-invalid" : ""
                        }`}
                        value={IdRol}
                        onChange={handleChangeRol}
                      >
                        <option disabled >Selecciona un rol</option>
                        {roles2.map((rol) => (
                          <option key={rol.IdRol} value={rol.IdRol}>
                            {rol.NombreRol}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        id="rolDetalle"
                        className="form-control"
                        value={getRolName(IdRol)} // Mostrar el nombre del rol basado en el IdRol
                        readOnly
                      />
                    )}
                    {renderErrorMessage(errors.rol)}
                  </div>
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
                onClick={guardarUsuario}
                disabled={isSubmitting}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Fin modal crear/editar usuario */}


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
        <div className="modal-dialog modal-lg" role="document">
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
            <div className="form-row">

              {usuarioSeleccionado && (
                <>
                  <div className="form-group col-md-6">
                    <label htmlFor="usuario">Nombre de usuario</label>
                    <input
                      type="text"
                      className="form-control"
                      id="usuario"
                      value={usuarioSeleccionado.Usuario}
                      disabled
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="correo">Correo electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      id="correo"
                      value={usuarioSeleccionado.Correo}
                      disabled
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="rol">Rol</label>
                    <input
                      type="text"
                      className="form-control"
                      id="rol"
                      value={getRolName(usuarioSeleccionado.IdRol)}
                      disabled
                    />
                  </div>
                </>
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
      </div>
      {/* Modal para detalles de usuario */}



      <div className="container-fluid">
        {/* Tabla Usuarios */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex justify-content-between align-items-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
            <div className="text-right">
              <button
                onClick={() => openModal(1)}
                type="button"
                className="btn btn-dark d-flex align-items-center justify-content-center p-0"
                data-toggle="modal"
                data-target="#modalUsuarios"
                style={{
                  width: "130px",
                  height: "40px",
                }}
              >
                <i className="fas fa-pencil-alt"></i>
                <span className="d-none d-sm-inline ml-2">Crear Usuario</span>
              </button>
            </div>
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
                        <div className="d-flex">
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

                          <button
                            className="btn btn-info btn-sm mr-2"
                            title="Detalle"
                            onClick={() =>
                              handleDetalleUsuario(usuario.IdUsuario)
                            }
                            data-toggle="modal"
                            data-target="#modalDetalleUsuario"
                          >
                            <i className="fas fa-solid fa-info-circle"></i>
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
        {/* Fin tabla usuarios */}
      </div>
      

      <AdminFooter />
    </>
  );
};

export default Usuarios;
