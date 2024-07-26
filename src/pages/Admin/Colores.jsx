import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ChromePicker } from "react-color";
import Pagination from "../../assets/js/Pagination";
import SearchBar from "../../assets/js/SearchBar";

export const Colores = () => {
  const url = "http://localhost:3000/api/colores";
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

  useEffect(() => {
    getColores();
  }, []);

  const getColores = async () => {
    try {
      const respuesta = await axios.get(url);
      setColores(respuesta.data);
    } catch (error) {
      show_alerta("Error al obtener los colores", "error");
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

    if (!errorMessage) {
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
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    try {
      let urlRequest = url;
      if (metodo === "PUT" || metodo === "DELETE") {
        urlRequest = `${url}/${parametros.IdColor}`;
      }
      const respuesta = await axios({
        method: metodo,
        url: urlRequest,
        data: parametros,
      });
      show_alerta(respuesta.data.message, "success");
      document.getElementById("btnCerrar").click();
      getColores();
    } catch (error) {
      if (error.response) {
        show_alerta(error.response.data.message, "error");
      } else if (error.request) {
        show_alerta("Error en la solicitud", "error");
      } else {
        show_alerta("Error desconocido", "error");
      }
    }
  };

  const deleteColor = (id, color) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar el color ${color}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        enviarSolicitud("DELETE", { IdColor: id })
          .then(() => {
            // Calcular el índice del color eliminado en la lista filtrada (si es necesario)
            const index = filteredColores.findIndex((color) => color.id === id);

            // Determinar la página en la que debería estar el color después de la eliminación
            const newPage =
              Math.ceil((filteredColores.length - 1) / itemsPerPage) || 1;

            // Establecer la nueva página como la página actual
            setCurrentPage(newPage);
          })
          .catch(() => {
            show_alerta("Hubo un error al eliminar el color", "error");
          });
      } else {
        show_alerta("El color NO fue eliminado", "info");
      }
    });
  };

  const cambiarEstadoColor = async (IdColor) => {
    try {
      const colorActual = Colores.find((color) => color.IdColor === IdColor);
      const nuevoEstado =
        colorActual.Estado === "Activo" ? "Inactivo" : "Activo";

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar el estado del color ${colorActual.Color}?`,
        icon: "question",
        text: `El estado actual del color es: ${colorActual.Estado}. ¿Desea cambiarlo a ${nuevoEstado}?`,
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

          const response = await axios.put(`${url}/${IdColor}`, parametros);
          if (response.status === 200) {
            setColores((prevColores) =>
              prevColores.map((color) =>
                color.IdColor === IdColor
                  ? { ...color, Estado: nuevoEstado }
                  : color
              )
            );

            const message = `Estado del color cambiado con éxito`;
            show_alerta(message, "success");
          }
        } else {
          show_alerta("No se ha cambiado el estado del color", "info");
        }
      });
    } catch (error) {
      console.error("Error updating state:", error);
      show_alerta("Error cambiando el estado del color", "error");
    }
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
              <label>Selecciona la referencia del color:</label>
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
                <button onClick={() => validar()} className="btn btn-primary">
                  <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-3 text-center text-dark">Gestión de Colores</h1>
          <div className="text-right">
            <button
              onClick={() => openModal(1)}
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalColores"
            >
              <i className="fas fa-pencil-alt"></i> Crear Color
            </button>
          </div>
        </div>

        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex">
            <h6 className="m-2 font-weight-bold text-primary">Colores</h6>
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
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
                        <div
                          style={{
                            backgroundColor: color.Referencia,
                            width: "20px",
                            height: "20px",
                            display: "inline-block",
                            marginLeft: "5px",
                          }}
                        ></div>
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
    </>
  );
};
