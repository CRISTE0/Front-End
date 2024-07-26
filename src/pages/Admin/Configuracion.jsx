import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../assets/js/Pagination";
import SearchBar from "../../assets/js/SearchBar";

export const Configuracion = () => {
  let url = "http://localhost:3000/api/roles";
  let urlPermisos = "http://localhost:3000/api/permisos"; // URL para obtener los permisos
  let urlUsuarios = "http://localhost:3000/api/usuarios"; // URL para obtener los permisos

  const [Roles, setRoles] = useState([]);
  const [Permisos, setPermisos] = useState([]); // Estado para permisos
  const [SelectedPermisos, setSelectedPermisos] = useState([]); // Estado para permisos seleccionados
  const [IdRol, setIdRol] = useState("");
  const [NombreRol, setNombreRol] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({
    nombreRol: "",
  });

  const [showErrors, setShowErrors] = useState(false);

  // Función para validar el nombre del rol
  const validateNombreRol = (value) => {
    // Expresión regular para validar que solo contiene letras con tildes, la letra ñ y espacios
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!value.trim()) {
      return "El nombre del rol es requerido";
    } else if (!regex.test(value)) {
      return "El nombre del rol solo puede contener letras con tildes, la letra ñ y espacios";
    } else if (value.trim().length !== value.length) {
      return "El nombre del rol no debe tener espacios al principio ni al final";
    }

    return "";
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Estado para el modal de detalle
  const [detailRol, setDetailRol] = useState(null);

  useEffect(() => {
    getRoles();
    getPermisos();
    getUsuarios().then((usuariosData) => setUsuarios(usuariosData));
  }, []);

  useEffect(() => {
    const hasError = Object.values(errors).some((error) => error !== "");
    setShowErrors(hasError);
  }, [errors]);

  const handleChangeRol = (e) => {
    const value = e.target.value.replace(/\s+/g, " "); // Reemplaza múltiples espacios con un solo espacio
    setNombreRol(value);
    const errorMessage = validateNombreRol(value);
    setErrors((prevState) => ({
      ...prevState,
      nombreRol: errorMessage,
    }));
  };

  const getRoles = async () => {
    const respuesta = await axios.get(url);
    setRoles(respuesta.data);
    console.log(respuesta.data);
  };

  const getPermisos = async () => {
    const respuesta = await axios.get(urlPermisos);
    setPermisos(respuesta.data);
    console.log(respuesta.data);
  };

  const getUsuarios = async () => {
    try {
      const respuesta = await axios.get(urlUsuarios);
      return respuesta.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return [];
    }
  };

  const handlePermisosChange = (permisoId) => {
    setSelectedPermisos((prevSelectedPermisos) =>
      prevSelectedPermisos.includes(permisoId)
        ? prevSelectedPermisos.filter((id) => id !== permisoId)
        : [...prevSelectedPermisos, permisoId]
    );
  };

  const openModal = (op, IdRol = "", NombreRol = "", permisos = []) => {
    setIdRol(IdRol);
    setNombreRol(NombreRol);
    setOperation(op);
    setSelectedPermisos(permisos.map((permiso) => permiso.IdPermiso)); // Configurar permisos seleccionados

    if (op === 1) {
      setTitle("Registrar Rol");
    } else if (op === 2) {
      setTitle("Editar Rol");
    }
  };

  const openDetailModal = (rol) => {
    setDetailRol(rol);
  };

  const validar = () => {
    let isValid = true;
    const cleanedNombreRol = NombreRol.trim().replace(/\s+/g, " "); // Elimina los espacios múltiples y los extremos
    const newErrors = {
      nombreRol: validateNombreRol(cleanedNombreRol),
      // Puedes agregar más campos aquí según sea necesario
    };

    // Verificar si hay algún error
    Object.values(newErrors).forEach((error) => {
      if (error) {
        isValid = false;
      }
    });

    // Actualizar el estado de errores y mostrar alerta si es necesario
    setErrors(newErrors);

    if (isValid) {
      // Lógica para enviar la solicitud si no hay errores
      var parametros;
      var metodo;
      if (NombreRol === "") {
        show_alerta("Escribe el nombre del rol", "warning");
      } else {
        if (operation === 1) {
          parametros = {
            NombreRol: cleanedNombreRol,
            Estado: "Activo",
            Permisos: SelectedPermisos, // Añadir permisos seleccionados
          };
          metodo = "POST";
        } else {
          parametros = {
            IdRol: IdRol,
            NombreRol: NombreRol,
            Permisos: SelectedPermisos, // Añadir permisos seleccionados
          };
          metodo = "PUT";
        }
        enviarSolicitud(metodo, parametros);
      }
    } else {
      show_alerta(
        "Por favor, completa todos los campos correctamente",
        "error"
      );
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    if (metodo === "PUT") {
      let urlPut = `${url}/${parametros.IdRol}`;

      await axios({ method: metodo, url: urlPut, data: parametros })
        .then((respuesta) => {
          var msj = respuesta.data.message;
          show_alerta(msj, "success");
          document.getElementById("btnCerrar").click();
          getRoles();
        })
        .catch((error) => {
          show_alerta(
            error.response.data.message || "Error en la solicitud",
            "error"
          );
        });
    } else if (metodo === "DELETE") {
      let urlDelete = `${url}/${parametros.IdRol}`;

      await axios({ method: metodo, url: urlDelete, data: parametros })
        .then((respuesta) => {
          var msj = respuesta.data.message;
          show_alerta(msj, "success");
          document.getElementById("btnCerrar").click();
          getRoles();
        })
        .catch((error) => {
          show_alerta("Error en la solicitud", "error");
        });
    } else {
      await axios({ method: metodo, url: url, data: parametros })
        .then((respuesta) => {
          var msj = respuesta.data.message;
          show_alerta(msj, "success");
          document.getElementById("btnCerrar").click();
          getRoles();
        })
        .catch((error) => {
          show_alerta(
            error.response.data.message || "Error en la solicitud",
            "error"
          );
        });
    }
  };

  const deleteRol = (IdRol, NombreRol) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar el rol ${NombreRol}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        enviarSolicitud("DELETE", { IdRol: IdRol })
          .then(() => {
            setCurrentPage(
              Math.ceil((filteredRoles.length - 1) / itemsPerPage) || 1
            );
          })
          .catch(() => {
            show_alerta("Hubo un error al eliminar el rol", "error");
          });
      } else {
        show_alerta("El rol NO fue eliminado", "info");
      }
    });
  };

  const cambiarEstadoRol = async (IdRol) => {
    try {
      const rolActual = Roles.find((rol) => rol.IdRol === IdRol);
      const nuevoEstado = rolActual.Estado === "Activo" ? "Inactivo" : "Activo";

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar el estado del rol ${rolActual.NombreRol}?`,
        icon: "question",
        text: `El estado actual del rol es: ${rolActual.Estado}. ¿Desea cambiarlo a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const parametrosRol = {
            Estado: nuevoEstado,
          };

          const response = await axios.put(
            `${url}/estado/${IdRol}`,
            parametrosRol
          );

          if (response.status === 200) {
            setRoles((prevRoles) =>
              prevRoles.map((rol) =>
                rol.IdRol === IdRol ? { ...rol, Estado: nuevoEstado } : rol
              )
            );

            show_alerta("Estado del rol cambiado con éxito", "success", {
              timer: 8000,
            });
          }
        } else {
          show_alerta("No se ha cambiado el estado del rol", "info");
        }
      });
    } catch (error) {
      show_alerta("Error cambiando el estado del rol", "error");
    }
  };

  // Configuración mensaje de alerta
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

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };

  // Filtrar los roles según el término de búsqueda
  const filteredRoles = Roles.filter((rol) =>
    Object.values(rol).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Aplicar paginación a los roles filtrados
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const currentRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* <!-- Modal para crear rol --> */}
      <div
        className="modal fade"
        id="modalRoles"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalAñadirRolLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalAñadirRolLabel">
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
              <form>
                <div className="form-group">
                  <input
                    type="hidden"
                    id="id"
                    value={IdRol}
                    onChange={(e) => setIdRol(e.target.value)}
                  />
                </div>
                <form>
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre del Rol:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        showErrors && errors.nombreRol ? "is-invalid" : ""
                      }`}
                      id="nombre"
                      placeholder="Ingrese el nombre del rol"
                      value={NombreRol}
                      onChange={handleChangeRol}
                    />
                    {showErrors && errors.nombreRol && (
                      <div className="invalid-feedback">{errors.nombreRol}</div>
                    )}
                    <small>Ingresa por favor el nombre del rol</small>
                  </div>
                </form>

                <div className="form-group">
                  <label>Permisos:</label>
                  <div className="row">
                    {Permisos.map((permiso) => (
                      <div
                        key={permiso.IdPermiso}
                        className="col-lg-3 col-md-4 col-sm-6 mb-3"
                      >
                        <div className="custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id={`permiso-${permiso.IdPermiso}`}
                            value={permiso.IdPermiso}
                            checked={SelectedPermisos.includes(
                              permiso.IdPermiso
                            )}
                            onChange={() =>
                              handlePermisosChange(permiso.IdPermiso)
                            }
                          />
                          <label
                            className="custom-control-label ml-2"
                            htmlFor={`permiso-${permiso.IdPermiso}`}
                          >
                            {permiso.Permiso}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                id="btnCerrar"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => validar()}
              >
                <i className="fa-solid fa-floppy-disk"></i> Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fin modal crear rol */}

      {/* <!-- Modal de detalle --> */}
      <div
        className="modal fade"
        id="modalDetalleRol"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalDetalleRolLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-l" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalDetalleRolLabel">
                Detalle del Rol
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
              {detailRol && (
                <form>
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre del Rol:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      value={detailRol.NombreRol}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Permisos:</label>
                    <div className="d-flex flex-wrap">
                      {detailRol.Permisos.map((permiso) => (
                        <div key={permiso.IdPermiso} className="mr-3 mb-2">
                          <span className="mr-1">
                            <i className="fas fa-check-circle"></i>
                          </span>
                          {permiso.Permiso}
                        </div>
                      ))}
                    </div>
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

      {/* Fin modal de detalle */}

      {/* <!-- Inicio de roles --> */}
      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-3 text-center text-dark">
            Gestión de Configuración
          </h1>

          <div className="text-right">
            <button
              onClick={() => openModal(1)}
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalRoles"
            >
              <i className="fas fa-pencil-alt"></i> Crear rol
            </button>
          </div>
        </div>

        {/* <!-- Tabla Roles --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex">
            <h6 className="m-2 font-weight-bold text-primary">Configuración</h6>
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
                    <th>Nombre del Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRoles.map((rol) => {
                    // Verificar si el rol está asociado a algún usuario
                    const rolAsociado = usuarios.some(
                      (usuario) => usuario.IdRol === rol.IdRol
                    );

                    return (
                      <tr key={rol.IdRol}>
                        <td>{rol.NombreRol}</td>
                        <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={rol.Estado === "Activo"}
                              onChange={() => cambiarEstadoRol(rol.IdRol)}
                              className={
                                rol.Estado === "Activo"
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
                              className="btn btn-warning btn-sm mr-2 rounded-icon"
                              data-toggle="modal"
                              data-target="#modalRoles"
                              onClick={() =>
                                openModal(
                                  2,
                                  rol.IdRol,
                                  rol.NombreRol,
                                  rol.Permisos
                                )
                              }
                              disabled={rol.Estado !== "Activo"}
                              title="Editar"
                            >
                              <i className="fas fa-sync-alt"></i>
                            </button>
                            {/* Botón de eliminar */}
                            {!rolAsociado && (
                              <button
                                className="btn btn-danger btn-sm mr-2 rounded-icon"
                                onClick={() =>
                                  deleteRol(rol.IdRol, rol.NombreRol)
                                }
                                disabled={rol.Estado !== "Activo"}
                                title="Eliminar"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            )}
                            {/* Botón de detalle */}
                            <button
                              className="btn btn-info btn-sm rounded-icon"
                              data-toggle="modal"
                              data-target="#modalDetalleRol"
                              onClick={() => openDetailModal(rol)}
                              disabled={rol.Estado !== "Activo"}
                              title="Detalle"
                            >
                              <i className="fas fa-info-circle"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
        {/* Fin tabla roles */}
      </div>
    </>
  );
};
