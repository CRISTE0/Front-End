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
  const [Usuario, setUsuario] = useState("");
  const [Correo, setCorreo] = useState("");
  const [Contrasenia, setContrasenia] = useState("");
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

  useEffect(() => {
    getUsuarios();
    getRoles();
  }, []);

  const getUsuarios = async () => {
    const respuesta = await axios.get(url);
    setUsuarios(respuesta.data);
  };

  const getRoles = async () => {
    try {
      const response = await axios.get(rolesUrl);
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const openModal = (op, usuario = null) => {
    if (op === 1) {
      // Crear Usuario
      setIdUsuario("");
      setUsuario("");
      setCorreo("");
      setContrasenia("");
      setRol(""); // Limpiar el estado del rol seleccionado al crear usuario
      setOperation(1);
      setTitle("Crear Usuario");
    } else if (op === 2 && usuario) {
      // Actualizar Usuario
      setIdUsuario(usuario.IdUsuario);
      setUsuario(usuario.Usuario);
      setCorreo(usuario.Correo);
      setContrasenia(usuario.Contrasenia);
      setRol(usuario.Rol); // Establecer el rol seleccionado al actualizar usuario
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

  const guardarUsuario = async () => {
    const cleanedUsuario = Usuario.trim().replace(/\s+/g, " "); // Elimina los espacios múltiples y los extremos
    const cleanedCorreo = Correo.trim().replace(/\s+/g, " "); // Elimina los espacios múltiples y los extremos
    const cleanedContrasenia = Contrasenia.trim().replace(/\s+/g, " "); // Elimina los espacios múltiples y los extremos

    if (!Rol) {
      // Validar que se seleccione un rol
      show_alerta("Selecciona un rol para el usuario", "error");
      return;
    }

    if (operation === 1) {
      // Crear Usuario
      await enviarSolicitud("POST", {
        Usuario: cleanedUsuario,
        Correo: cleanedCorreo,
        Contrasenia: cleanedContrasenia,
        Estado: "Activo",
        Rol: Rol, // Aquí debe ser el IdRol, no el nombre del rol
      });      
    } else if (operation === 2) {
      // Actualizar Usuario
      await enviarSolicitud("PUT", {
        IdUsuario,
        Usuario: cleanedUsuario,
        Correo: cleanedCorreo,
        Contrasenia: cleanedContrasenia,
        Rol: Rol, // Incluir el rol seleccionado en los parámetros
      });
    }
  };

  const handleChangeRol = (e) => {
    const value = e.target.value;
    setRol(value); // Actualizar el estado del rol seleccionado
  };

  const validateUsuario = (Usuario) => {
    if (!Usuario) {
      return "El nombre de usuario es requerido";
    }
    return "";
  };

  const validateCorreo = (value) => {
    if (!value) {
      return "Ingresa tu correo electrónico";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (/\s/.test(value)) {
      return "El correo electrónico no puede contener espacios";
    }
    if (!emailRegex.test(value)) {
      return "Ingresa un correo electrónico válido";
    }
    return "";
  };

  const validateContrasenia = (Contrasenia) => {
    if (!Contrasenia) {
      return "La contraseña es requerida";
    } else if (Contrasenia.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    return "";
  };

  const handleChangeUsuario = (e) => {
    const value = e.target.value;
    setUsuario(value); // Actualiza el estado del nombre de usuario
    const errorMessage = validateUsuario(value);
    setErrors((prevState) => ({
      ...prevState,
      usuario: errorMessage, // Actualiza el error del nombre de usuario con el mensaje de error obtenido
    }));
  };

  const handleChangeCorreo = (e) => {
    const value = e.target.value;
    setCorreo(value); // Actualiza el estado del correo electrónico
    const errorMessage = validateCorreo(value);
    setErrors((prevState) => ({
      ...prevState,
      correo: errorMessage, // Actualiza el error de correo con el mensaje de error obtenido
    }));
  };

  const handleChangeContrasenia = (e) => {
    const value = e.target.value;
    setContrasenia(value); // Actualiza el estado de la contraseña
    const errorMessage = validateContrasenia(value);
    setErrors((prevState) => ({
      ...prevState,
      contrasenia: errorMessage, // Actualiza el error de contraseña con el mensaje de error obtenido
    }));
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
      var msj = respuesta.data.message;
      show_alerta(msj, "success");
      document.getElementById("btnCerrar").click();
      getUsuarios();
      if (metodo === "POST") {
        show_alerta("Usuario creado con éxito", "success", { timer: 2000 });
      } else if (metodo === "PUT") {
        show_alerta("Usuario actualizado con éxito", "success", {
          timer: 2000,
        });
      } else if (metodo === "DELETE") {
        show_alerta("Usuario eliminado con éxito", "success", {
          timer: 2000,
        });
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
        setIdUsuario(idUsuario);
        enviarSolicitud("DELETE", { IdUsuario: idUsuario }).then(() => {
          const index = filteredUsuarios.findIndex(
            (usuario) => usuario.IdUsuario === idUsuario
          );
          const newPage =
            Math.ceil((filteredUsuarios.length - 1) / itemsPerPage) || 1;
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
      console.log(error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredUsuarios = Usuarios.filter((usuario) =>
    usuario.Usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredUsuarios.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Resetear la página actual al cambiar el término de búsqueda
  };

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
                <span className="input-group-text mx-2">
                  <i className="fa-solid fa-user"></i>
                </span>
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
                <span className="input-group-text mx-2">
                  <i className="fa-solid fa-envelope"></i>
                </span>
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

              <div className="input-group mb-3">
                <span className="input-group-text mx-2">
                  <i className="fa-solid fa-lock"></i>
                </span>
                <input
                  type="password"
                  id="contrasenia"
                  className={`form-control ${
                    errors.contrasenia ? "is-invalid" : ""
                  }`}
                  placeholder="Contraseña"
                  value={Contrasenia}
                  onChange={handleChangeContrasenia}
                />
                {renderErrorMessage(errors.contrasenia)}
              </div>

              {/* Selección de rol */}
              <div className="input-group mb-3">
                <span className="input-group-text mx-2">
                  <i className="fa-solid fa-user-tag"></i>
                </span>
                <select
                  id="rol"
                  className="form-select"
                  value={Rol}
                  onChange={handleChangeRol}
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.IdRol} value={rol.IdRol}>
                      {rol.Nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <div className="text-right">
                <button
                  type="button"
                  id="btnCerrar"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Cancelar
                </button>
                <button onClick={guardarUsuario} className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fin modal crear/editar usuario */}

      {/* Inicio de usuarios */}
      <div className="container-fluid">
        {/* Page Heading */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-4 text-center text-dark">Usuarios</h1>

          <div className="text-center p-3">
            <button
              onClick={() => openModal(1)}
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalUsuarios"
            >
              <i className="fas fa-pencil-alt"></i> Añadir Usuario
            </button>
          </div>
        </div>

        {/* Tabla Usuarios */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Usuarios</h6>
          </div>
          <div className="card-body">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
            <div className="table-responsive">
              <table
                className="table table-bordered"
                id="dataTable"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((usuario, index) => (
                    <tr key={usuario.IdUsuario}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
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
                          {/* Botón de actualizar */}
                          <button
                            className="btn btn-warning btn-sm mr-2"
                            onClick={() => openModal(2, usuario)}
                            disabled={usuario.Estado !== "Activo"}
                          >
                            <i className="fas fa-solid fa-edit"></i>
                          </button>
                          {/* Botón de eliminar */}
                          &nbsp;
                          <button
                            className="btn btn-danger btn-sm mr-2"
                            onClick={() =>
                              deleteUsuario(usuario.IdUsuario, usuario.Usuario)
                            }
                            disabled={usuario.Estado !== "Activo"}
                          >
                            <i className="fas fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={filteredUsuarios.length}
              currentPage={currentPage}
              paginate={paginate}
            />
          </div>
        </div>
        {/* Fin tabla usuarios */}
      </div>
    </>
  );
};

export default Usuarios;
