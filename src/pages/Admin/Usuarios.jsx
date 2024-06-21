import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../assets/js/Pagination";
import SearchBar from "../../assets/js/SearchBar";

export const Usuarios = () => {
  let url = "http://localhost:3000/api/usuarios";
  const [Usuarios, setUsuarios] = useState([]);
  const [IdUsuario, setIdUsuario] = useState("");
  const [Usuario, setUsuario] = useState(""); // Corrected from setUsuarios to setUsuario
  const [Correo, setCorreo] = useState("");
  const [Contrasenia, setContrasenia] = useState("");
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

  useEffect(() => {
    getUsuarios();
  }, []);

  const getUsuarios = async () => {
    const respuesta = await axios.get(url);
    setUsuarios(respuesta.data);
  };

  const openModal = (op, usuario = null) => {
    if (op === 1) {
      // Crear Usuario
      setIdUsuario("");
      setUsuario("");
      setCorreo("");
      setContrasenia("");
      setOperation(1);
      setTitle("Crear Usuario");
    } else if (op === 2 && usuario) {
      // Actualizar Usuario
      setIdUsuario(usuario.IdUsuario);
      setUsuario(usuario.Usuario);
      setCorreo(usuario.Correo);
      setContrasenia(usuario.Contrasenia);
      setOperation(2);
      setTitle("Actualizar Usuario");
      setErrors({
        usuario: "",
        correo: "",
        contrasenia: ""
      });
      const errors = {
        usuario: validateUsuario(usuario.Usuario),
        correo: validateCorreo(usuario.Correo),
        contrasenia: validateContrasenia(usuario.Contrasenia)
      };
      setErrors(errors);
    }
  };

  const guardarUsuario = async () => {
    const cleanedUsuario = Usuario.trim().replace(/\s+/g, " "); // Elimina los espacios múltiples y los extremos
    const cleanedCorreo = Correo.trim().replace(/\s+/g, " "); // Elimina los espacios múltiples y los extremos
    const cleanedContrasenia = Contrasenia.trim().replace(/\s+/g, " "); // Elimina los espacios múltiples y los extremos

    if (operation === 1) {
      // Crear Usuario
      await enviarSolicitud("POST", {
        Usuario: cleanedUsuario,
        Correo: cleanedCorreo,
        Contrasenia: cleanedContrasenia,
        Estado: "Activo",
      });
    } else if (operation === 2) {
      // Actualizar Usuario
      await enviarSolicitud("PUT", {
        IdUsuario,
        Usuario: cleanedUsuario,
        Correo: cleanedCorreo,
        Contrasenia: cleanedContrasenia,
      });
    }
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
      const usuario = Usuarios.find((usuario) => usuario.IdUsuario === idUsuario);
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
          show_alerta(
            "Estado del usuario actualizado con éxito",
            "success",
            {
              timer: 2000,
            }
          );
          getUsuarios();
        }
      });
    } catch (error) {
      show_alerta("Error al cambiar el estado del usuario", "error");
      console.error("Error al cambiar el estado del usuario:", error);
    }
  };

  const filteredUsuarios = Usuarios.filter((usuario) =>
    usuario.Usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsuarios = filteredUsuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container-fluid">
      <div className="row mt-3">
        <div className="col-md-4 offset-md-4">
          <div className="d-grid mx-auto">
            <button
              onClick={() => openModal(1)}
              className="btn btn-dark"
              data-bs-toggle="modal"
              data-bs-target="#modalUsuarios"
            >
              <i className="fa-solid fa-circle-plus"></i> Añadir Usuario
            </button>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-4 offset-md-4">
          <div className="d-grid mx-auto">
            <SearchBar
              placeholder="Buscar usuario"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12 col-lg-6 offset-0 offset-lg-3">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Contraseña</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {paginatedUsuarios.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  paginatedUsuarios.map((usuario, index) => (
                    <tr key={usuario.IdUsuario}>
                      <td>{usuario.Usuario}</td>
                      <td>{usuario.Correo}</td>
                      <td>{usuario.Contrasenia}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${
                            usuario.Estado === "Activo"
                              ? "btn-success"
                              : "btn-danger"
                          }`}
                          onClick={() => cambiarEstadoUsuario(usuario.IdUsuario)}
                        >
                          {usuario.Estado}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => openModal(2, usuario)}
                          className="btn btn-warning btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target="#modalUsuarios"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        &nbsp;
                        <button
                          onClick={() =>
                            deleteUsuario(usuario.IdUsuario, usuario.Usuario)
                          }
                          className="btn btn-danger btn-sm"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={filteredUsuarios.length}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
      <div id="modalUsuarios" className="modal fade" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                id="btnCerrar"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-floating mb-3">
                  <input
                    id="Usuario"
                    className={`form-control ${
                      errors.usuario ? "is-invalid" : ""
                    }`}
                    type="text"
                    placeholder="Usuario"
                    value={Usuario}
                    onChange={handleChangeUsuario}
                  />
                  <label htmlFor="Usuario">Usuario</label>
                  {renderErrorMessage(errors.usuario)}
                </div>
                <div className="form-floating mb-3">
                  <input
                    id="Correo"
                    className={`form-control ${
                      errors.correo ? "is-invalid" : ""
                    }`}
                    type="email"
                    placeholder="Correo"
                    value={Correo}
                    onChange={handleChangeCorreo}
                  />
                  <label htmlFor="Correo">Correo</label>
                  {renderErrorMessage(errors.correo)}
                </div>
                <div className="form-floating mb-3">
                  <input
                    id="Contrasenia"
                    className={`form-control ${
                      errors.contrasenia ? "is-invalid" : ""
                    }`}
                    type="password"
                    placeholder="Contraseña"
                    value={Contrasenia}
                    onChange={handleChangeContrasenia}
                  />
                  <label htmlFor="Contrasenia">Contraseña</label>
                  {renderErrorMessage(errors.contrasenia)}
                </div>
                <div className="d-grid col-6 mx-auto">
                  <button
                    onClick={guardarUsuario}
                    type="button"
                    className="btn btn-success"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="btnCerrar"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
