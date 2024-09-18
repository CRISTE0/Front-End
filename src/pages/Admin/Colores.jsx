import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ChromePicker } from "react-color";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import show_alerta from "../../components/Show_Alerta/show_alerta";
import { AdminFooter } from "../../components/Admin/AdminFooter";
import Loader from "../../components/Loader/loader";

export const Colores = () => {
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/colores";
  const insumosUrl = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/insumos";
  const [Colores, setColores] = useState([]);
  const [IdColor, setIdColor] = useState("");
  const [Color, setColor] = useState("");
  const [Referencia, setReferencia] = useState("#000000");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getColores();
  }, []);

  const getColores = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const respuesta = await axios.get(url);
      setColores(respuesta.data);
    } catch (error) {
      show_alerta({
        message: "Error al obtener los colores",
        type: "error",
      });
    } finally {
      setLoading(false); // Ocultar el loader después de obtener los colores o en caso de error
    }
  };  

  const getInsumosByColor = async (IdColor) => {
    try {
      const response = await axios.get(insumosUrl);
      // Verifica si el color está asociado a algún insumo
      const insumos = response.data.filter(
        (insumo) => insumo.IdColor === IdColor
      );
      return insumos.length > 0; // Devuelve true si hay al menos un insumo asociado
    } catch (error) {
      console.error("Error fetching insumos:", error);
      show_alerta({ message: "Error al verificar los insumos", type: "error" });
      return false; // Considera que no tiene insumos asociados en caso de error
    }
  };

  const openModal = (op, idColor, color, referencia) => {
    setIdColor("");
    setColor("");
    setReferencia("");
    setOperation(op);
    setErrors({});

    if (op === 1) {
      setTitle("Registrar Colores");
    } else if (op === 2) {
      setTitle("Editar Color");
      setIdColor(idColor);
      setColor(color);
      setReferencia(referencia);
    }
  };

  const validateColores = (value) => {
    if (!value) {
      return "Escribe el color";
    }
    if (!/^[A-Za-záéíóúÁÉÍÓÚ\s]+$/.test(value)) {
      return "El color solo puede contener letras y tildes";
    }
    if (value.length > 20) {
      return "El color no puede tener más de 20 caracteres";
    }
    return "";
  };

  const handleChangeColor = (e) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setColor(value);
      const errorMessage = validateColores(value);
      setErrors((prevState) => ({
        ...prevState,
        colores: errorMessage,
      }));
    } else {
      setErrors((prevState) => ({
        ...prevState,
        colores: "El color no puede tener más de 20 caracteres",
      }));
    }
  };

  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  const validar = () => {
    const errorMessage = validateColores(Color);
    setErrors({ colores: errorMessage });

    if (errorMessage) {
      // Muestra la alerta si hay un error en el campo
      show_alerta({
        message: "Por favor, completa todos los campos correctamente",
        type: "error",
      });
      return; // Detiene la ejecución si hay un error
    }

    // Si Referencia es un valor predeterminado, usa el valor predeterminado
    const referenciaFinal = Referencia || "#000000";

    let parametros, metodo;
    if (operation === 1) {
      parametros = {
        Color: Color.trim(),
        Referencia: referenciaFinal,
        Estado: "Activo",
      };
      metodo = "POST";
    } else {
      parametros = {
        IdColor,
        Color: Color.trim(),
        Referencia: referenciaFinal,
        Estado: "Activo",
      };
      metodo = "PUT";
    }
    enviarSolicitud(metodo, parametros);
  };



  const enviarSolicitud = async (metodo, parametros) => {
    try {
      let urlRequest = url;
      if (metodo === "PUT" || metodo === "DELETE") {
        urlRequest = `${url}/${parametros.IdColor}`;
      }

      setIsSubmitting(true)

      const respuesta = await axios({
        method: metodo,
        url: urlRequest,
        data: parametros,
      });
      show_alerta({
        message: respuesta.data.message,
        type: "success",
      });
      document.getElementById("btnCerrar").click();
      getColores();
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
    } finally {
      setIsSubmitting(false)
    }
  };

  const deleteColor = (id, color) => {
    const MySwal = withReactContent(Swal);

    // Primero, verifica si el color está asociado a un insumo
    getInsumosByColor(id).then((isAssociated) => {
      if (isAssociated) {
        show_alerta({
          message: `El color ${color} está asociado a un insumo y no se puede eliminar.`,
          type: "warning",
        });
      } else {
        // Si no está asociado, procede con la eliminación
        MySwal.fire({
          title: `¿Seguro de eliminar el color ${color}?`,
          icon: "question",
          text: "No se podrá dar marcha atrás",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            enviarSolicitud("DELETE", { IdColor: id })
              .then(() => {
                show_alerta({
                  message: "Color eliminado correctamente",
                  type: "success",
                });
              })
              .catch(() => {
                show_alerta({
                  message: "Hubo un error al eliminar el color",
                  type: "error",
                });
              });
          } else {
            show_alerta({
              message: "El color NO fue eliminado",
              type: "info",
            });
          }
        });
      }
    });
  };

  const cambiarEstadoColor = async (IdColor) => {
    try {
      const colorActual = Colores.find((color) => color.IdColor === IdColor);
      const nuevoEstado =
        colorActual.Estado === "Activo" ? "Inactivo" : "Activo";
  
      // Si el nuevo estado es "Inactivo", verifica si el color está asociado a algún insumo
      if (nuevoEstado === "Inactivo") {
        const isAssociated = await getInsumosByColor(IdColor);
        if (isAssociated) {
          show_alerta({
            message: `El color ${colorActual.Color} está asociado a un insumo y no se puede cambiar a Inactivo.`,
            type: "warning",
          });
          return;
        }
      }
  
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar el estado del color ${colorActual.Color}?`,
        icon: "question",
        html: `El estado actual del color es: <strong> ${colorActual.Estado}</strong>. ¿Desea cambiarlo a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const parametros = {
            IdColor,
            Estado: nuevoEstado,
            Color: colorActual.Color,
            Referencia: colorActual.Referencia,
          };
  
          try {
            const response = await axios.put(`${url}/${IdColor}`, parametros);
            if (response.status === 200) {
              setColores((prevColores) =>
                prevColores.map((color) =>
                  color.IdColor === IdColor
                    ? { ...color, Estado: nuevoEstado }
                    : color
                )
              );
  
              show_alerta({
                message: "Estado del color cambiado con éxito",
                type: "success",
              });
            }
          } catch (error) {
            show_alerta({
              message: "Error cambiando el estado del color",
              type: "error",
            });
          }
        } else {
          show_alerta({
            message: "No se ha cambiado el estado del color",
            type: "info",
          });
        }
      });
    } catch (error) {
      console.error("Error updating state:", error);
      show_alerta({
        message: "Error al procesar la solicitud",
        type: "error",
      });
    }
  };
  

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Resetear la página actual al cambiar el término de búsqueda
  };

  // Filtrar los proveedores según el término de búsqueda
  const filteredColores = Colores.filter((color) =>
    Object.values(color).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Aplicar paginación a los proveedores filtrados
  const totalPages = Math.ceil(filteredColores.length / itemsPerPage);
  const currentColores = filteredColores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div
        className="modal fade"
        id="modalColores"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalAñadirColorLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalAñadirColorLabel">
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
              <input type="hidden" id="Color"></input>
              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.colores ? "is-invalid" : ""
                  }`}
                  id="nombreProveedor"

                  placeholder="Ingrese el color"
                  required
                  value={Color}
                  onChange={handleChangeColor}
                />
                {renderErrorMessage(errors.colores)}
              </div>
              <label>Selecciona la referencia del color</label>
              <div className="input-group mb-3 d-flex justify-content-center">
                <ChromePicker
                  color={Referencia}
                  onChange={(color) => setReferencia(color.hex)}
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  id="btnCerrar"
                  className="btn btn-secondary mr-2"
                  data-dismiss="modal"
                >
                  Cancelar
                </button>
                <button onClick={() => validar()} className="btn btn-primary" disabled={isSubmitting}>
                  <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between">
          {/* <h1 className="h3 mb-3 text-center text-dark">Gestión de Colores</h1> */}
        </div>

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
              data-target="#modalColores"
              style={{
                width: "140px",
                height: "40px"
              }}
            >
              <i className="fas fa-pencil-alt"></i>
              <span className="d-none d-sm-inline ml-2">Crear Color</span>
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table
                className="table table-bordered"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>Color</th>
                    <th>Referencia</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentColores.map((color) => (
                    <tr key={color.IdColor}>
                      <td>{color.Color}</td>
                      <td>
                        {color.Color == "Blanco" ? (
                          <div
                          style={{
                            backgroundColor: color.Referencia,
                            border: "1px solid black",
                            width: "20px",
                            height: "20px",
                            display: "inline-block",
                            marginLeft: "5px",
                          }}
                        ></div>
                        ):(
                          <div
                            style={{
                              backgroundColor: color.Referencia,
                              width: "20px",
                              height: "20px",
                              display: "inline-block",
                              marginLeft: "5px",
                            }}
                          ></div>

                        )}
                      </td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={color.Estado === "Activo"}
                            onChange={() => cambiarEstadoColor(color.IdColor)}
                            className={
                              color.Estado === "Activo"
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
                            onClick={() =>
                              openModal(
                                2,
                                color.IdColor,
                                color.Color,
                                color.Referencia
                              )
                            }
                            disabled={color.Estado !== "Activo"}
                            className="btn btn-warning btn-sm mr-2"
                            title="Editar"
                            data-toggle="modal"
                            data-target="#modalColores"
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>
                          <button
                            onClick={() =>
                              deleteColor(color.IdColor, color.Color)
                            }
                            className="btn btn-danger btn-sm mr-2"
                            disabled={color.Estado !== "Activo"}
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
      </div>
      <AdminFooter/>
    </>
  );
};
