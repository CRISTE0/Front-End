import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import show_alerta from "../../components/Show_Alerta/show_alerta";
import { AdminFooter } from "../../components/Admin/AdminFooter";
import Loader from "../../components/Loader/loader";

export const Tallas = () => {
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/tallas";
  const insumosUrl = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/insumos";
  const [Tallas, setTallas] = useState([]);
  const [IdTalla, setIdTalla] = useState("");
  const [Talla, setTalla] = useState([]);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const tallasPermitidas = [
    "XXXS",
    "XXS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "XXXXL",
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getTallas();
  }, []);

  const handleChangeTalla = (e) => {
    const tallaValue = e.target.value.toUpperCase();
    setTalla(tallaValue);

    // Validación en tiempo real
    if (tallaValue.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        talla: "Escribe el nombre de la talla",
      }));
    } else if (!tallasPermitidas.includes(tallaValue)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        talla:
          "Talla no válida. Debe ser una de las siguientes: XXXS, XXS, XS, S, M, L, XL, XXL, XXXL, XXXXL",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        talla: "",
      }));
    }
  };

  const getTallas = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const respuesta = await axios.get(url);
      setTallas(respuesta.data);
    } catch (error) {
      show_alerta({
        message: "Error al obtener las tallas",
        type: "error",
      });
    } finally {
      setLoading(false); // Ocultar el loader después de obtener las tallas o en caso de error
    }
  };

  const getInsumosByTalla = async (IdTalla) => {
    try {
      const response = await axios.get(insumosUrl);
      // Verifica si la talla está asociado a algún insumo
      const insumos = response.data.filter(
        (insumo) => insumo.IdTalla === IdTalla
      );
      return insumos.length > 0; // Devuelve true si hay al menos un insumo asociado
    } catch (error) {
      console.error("Error fetching insumos:", error);
      show_alerta({ message: "Error al verificar los insumos", type: "error" });
      return false; // Considera que no tiene insumos asociados en caso de error
    }
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
  };

  const validar = () => {
    // Inicializa un objeto para almacenar errores
    let errores = {};

    // Verifica si el campo Talla está vacío
    if (Talla.trim() === "") {
      errores.talla = "Escribe el nombre de la talla";
      show_alerta({
        message: "Por favor, completa todos los campos correctamente",
        type: "error",
      });
    } else if (!tallasPermitidas.includes(Talla.trim())) {
      errores.talla =
        "Talla no válida. Debe ser una de las siguientes: XXXS, XXS, XS, S, M, L, XL, XXL, XXXL, XXXXL";
      show_alerta({
        message: "Por favor, completa todos los campos correctamente",
        type: "error",
      });
    }

    // Establece los errores para el renderizado en el campo
    setErrors(errores);

    // Si hay errores, detiene la ejecución
    if (Object.keys(errores).length > 0) {
      return;
    }

    // Si no hay errores, continúa con la lógica de envío de datos
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
        Talla: Talla.trim(),
      };
      metodo = "PUT";
    }

    // Llama a la función para enviar la solicitud con los parámetros adecuados
    enviarSolicitud(metodo, parametros);
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

      setIsSubmitting(true)

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
    }finally {
      setIsSubmitting(false)
    }
  };

  const deletetalla = (id, talla) => {
    const MySwal = withReactContent(Swal);

    // Primero, verifica si la talla está asociada a un insumo
    getInsumosByTalla(id).then((isAssociated) => {
      if (isAssociated) {
        show_alerta({
          message: `La talla ${talla} está asociada a un insumo y no se puede eliminar.`,
          type: "warning",
        });
      } else {
        // Si no está asociada, procede con la eliminación
        MySwal.fire({
          title: `¿Seguro de eliminar la talla ${talla}?`,
          icon: "question",
          text: "No se podrá dar marcha atrás",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            enviarSolicitud("DELETE", { IdTalla: id })
              .then(() => {
                show_alerta({
                  message: "Talla eliminada correctamente",
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
      }
    });
  };
  const cambiarEstadoTalla = async (IdTalla) => {
    try {
      const tallaActual = Tallas.find((talla) => talla.IdTalla === IdTalla);

      // Verificar si la talla está asociada a un insumo
      const isAssociated = await getInsumosByTalla(IdTalla);

      // Si está asociada y se está intentando desactivar, mostrar un mensaje
      if (isAssociated && tallaActual.Estado === "Activo") {
        show_alerta({
          message: `La talla ${tallaActual.Talla} está asociada a un insumo y no se puede cambiar a Inactivo.`,
          type: "warning",
        });
        return; // Salir de la función sin hacer el cambio
      }

      const nuevoEstado =
        tallaActual.Estado === "Activo" ? "Inactivo" : "Activo";

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar el estado de la talla ${tallaActual.Talla}?`,
        icon: "question",
        html: `El estado actual de la talla es: <strong> ${tallaActual.Estado}</strong>. ¿Desea cambiarlo a ${nuevoEstado}?`,
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
              message: "Estado de la talla cambiado con éxito",
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

  if (loading) {
    return <Loader />;
  }

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
              />

              <div className="form-group">
                <label htmlFor="talla">Talla</label>
                <input
                  type="text"
                  id="talla"
                  className={`form-control ${errors.talla ? "is-invalid" : ""}`}
                  placeholder="Ingrese la talla"
                  value={Talla}
                  onChange={handleChangeTalla}
                />
                {errors.talla && (
                  <div className="invalid-feedback">{errors.talla}</div>
                )}
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

                  <button
                    type="button"
                    onClick={() => validar()}
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
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
          {/* <h1 className="h3 mb-3 text-center text-dark">Gestión de Tallas</h1> */}
        </div>

        {/* <!-- Tabla Proveedor --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex justify-content-between align-items-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
            <button
              onClick={() => openModal(1)}
              type="button"
              className="btn btn-dark d-flex align-items-center justify-content-center p-0"
              data-toggle="modal"
              data-target="#modalTallas"
              style={{
                width: "135px",
                height: "40px",
              }}
            >
              <i className="fas fa-pencil-alt"></i>
              <span className="d-none d-sm-inline ml-2">Crear Talla</span>
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
                        <div className="d-flex">
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
      <AdminFooter />
    </>
  );
};
