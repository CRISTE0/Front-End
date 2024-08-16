import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import show_alerta from "../../components/Show_Alerta/show_alerta";

export const Tallas = () => {
  let url = "http://localhost:3000/api/tallas";

  const [Tallas, setTallas] = useState([]);
  const [IdTalla, setIdTalla] = useState("");
  const [Talla, setTalla] = useState([]);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    getTallas();
  }, []);

  const handleChangeTalla = (e) => {
    setTalla(e.target.value.toUpperCase());
  };

  const getTallas = async () => {
    const respuesta = await axios.get(url);
    setTallas(respuesta.data);
    console.log(respuesta.data);
  };

  const openModal = (op, IdTalla, Talla) => {
    setIdTalla("");
    setTalla("");
    setOperation(op);
    if (op === 1) {
      setTitle("Registrar talla");
    } else if (op === 2) {
      setTitle("Editar talla");
      setIdTalla(IdTalla);
      setTalla(Talla);
    }
    // window.setTimeout(function () {
    //   document.getElementById("nombre").focus();
    // }, 500);
  };

  const validar = () => {
    if (Talla === "") {
      show_alerta({
        message: "Escribe el nombre de la talla",
        type: "warning",
      });
    } else {
      console.log(Talla);
      let parametros;
      let metodo;
      if (operation === 1) {
        parametros = {
          Talla: Talla.trim(),
        };
        metodo = "POST";
      } else {
        parametros = {
          IdTalla: IdTalla,
          Talla: Talla,
        };
        metodo = "PUT";
      }
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    try {
      let urlRequest = url;
      if (metodo === "PUT" || metodo === "DELETE") {
        urlRequest = `${url}/${parametros.IdTalla}`;
      }

      const respuesta = await axios({
        method: metodo,
        url: urlRequest,
        data: parametros,
      });

      const mensaje = respuesta.data.message;
      show_alerta({
        message: mensaje,
        type: "success",
      });

      document.getElementById("btnCerrar").click();
      getTallas();
    } catch (error) {
      if (error.response) {
        const mensaje =
          error.response.data.error || error.response.data.message;
        show_alerta({
          message: mensaje,
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

  const deletetalla = (IdTalla, Talla) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar la talla ${Talla}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        enviarSolicitud("DELETE", { IdTalla: IdTalla })
          .then(() => {
            show_alerta({
              message: "Talla eliminada con éxito",
              type: "success",
            });
          })
          .catch(() => {
            show_alerta({
              message: "Hubo un error al eliminar la talla",
              type: "error",
            });
          });
      } else {
        show_alerta({
          message: "La talla NO fue eliminada",
          type: "info",
        });
      }
    });
  };

  const cambiarEstadoTalla = async (IdTalla) => {
    try {
      const tallaActual = Tallas.find((talla) => talla.IdTalla === IdTalla);

      const nuevoEstado =
        tallaActual.Estado === "Activo" ? "Inactivo" : "Activo";

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar el estado de la talla ${tallaActual.Talla}?`,
        icon: "question",
        text: `El estado actual de la talla es: ${tallaActual.Estado}. ¿Desea cambiarlo a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const parametrosTalla = {
            IdTalla,
            Talla: tallaActual.Talla,
            Estado: nuevoEstado,
          };

          const response = await axios.put(
            `${url}/${IdTalla}`,
            parametrosTalla
          );

          if (response.status === 200) {
            setTallas((prevTalla) =>
              prevTalla.map((talla) =>
                talla.IdTalla === IdTalla
                  ? { ...talla, Estado: nuevoEstado }
                  : talla
              )
            );

            show_alerta({
              message: "Estado de la talla cambiada con éxito",
              type: "success",
            });
          }
        } else {
          show_alerta({
            message: "No se ha cambiado el estado de la talla",
            type: "info",
          });
        }
      });
    } catch (error) {
      console.error("Error updating state:", error);
      show_alerta({
        message: "Error cambiando el estado de la talla",
        type: "error",
      });
    }
  };

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Resetear la página actual al cambiar el término de búsqueda
  };

  // Filtrar las tallas según el término de búsqueda
  const filteredTallass = Tallas.filter((talla) =>
    Object.values(talla).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Aplicar paginación a las tallas filtrados
  const totalPages = Math.ceil(filteredTallass.length / itemsPerPage);
  const currenTallas = filteredTallass.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* <!-- Modal para crear talla --> */}

      <div
        className="modal fade"
        id="modalTallas"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalAñadirTallaLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalAñadirTallaLabel">
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
                value={IdTalla}
                onChange={(e) => setIdTalla(e.target.value)}
              ></input>

              <div className="input-group mb-3">
                <span className="input-group-text mx-2">
                  <i className="fas fa-solid fa-ruler-combined"></i>
                </span>
                <input
                  type="text"
                  id="precio"
                  className="form-control"
                  placeholder="Talla"
                  value={Talla}
                  onChange={handleChangeTalla}
                ></input>
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

                  <button onClick={() => validar()} className="btn btn-success">
                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fin modal crear talla */}

      {/* <!-- Inicio de tallas --> */}
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-3 text-center text-dark">Gestión de Tallas</h1>

          <div className="text-right">
            <button
              onClick={() => openModal(1)}
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalTallas"
            >
              <i className="fas fa-pencil-alt"></i> Crear Talla
            </button>
          </div>
        </div>

        {/* <!-- Tabla Proveedor --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex">
            <h6 className="m-2 font-weight-bold text-primary"></h6>
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
                    <th>Talla</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {currenTallas.map((talla) => (
                    <tr key={talla.IdTalla}>
                      <td>{talla.Talla}</td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={talla.Estado === "Activo"}
                            onChange={() => cambiarEstadoTalla(talla.IdTalla)}
                            className={
                              talla.Estado === "Activo"
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
                        >
                          <button
                            className="btn btn-warning btn-sm mr-2"
                            title="Editar"
                            data-toggle="modal"
                            data-target="#modalTallas"
                            onClick={() =>
                              openModal(2, talla.IdTalla, talla.Talla)
                            }
                            disabled={talla.Estado !== "Activo"}
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>
                          &nbsp;
                          <button
                            className="btn btn-danger btn-sm mr-2"
                            onClick={() =>
                              deletetalla(talla.IdTalla, talla.Talla)
                            }
                            disabled={talla.Estado !== "Activo"}
                            title="Eliminar"
                          >
                            <i className="fas fa-trash-alt"></i>
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
        {/* Fin tabla tallas */}
      </div>
    </>
  );
};
