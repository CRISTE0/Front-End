import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import show_alerta from "../../components/Show_Alerta/show_alerta";
import { AdminFooter } from "../../components/Admin/AdminFooter";
import Loader from "../../components/Loader/loader";

export const Insumos = () => {
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/insumos";
  const [Insumos, setInsumos] = useState([]);
  const [Colores, setColores] = useState([]);
  const [Tallas, setTallas] = useState([]);
  const [IdInsumo, setIdInsumo] = useState("");
  const [IdColor, setIdColor] = useState("");
  const [IdTalla, setIdTalla] = useState("");
  const [Referencia, setReferencia] = useState("");
  const [Cantidad, setCantidad] = useState(0);
  const [ValorCompra, setValorCompra] = useState(0);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({
    IdColor: 0,
    IdTalla: 0,
    Referencia: "",
    Cantidad: 0,
    ValorCompra: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getInsumos();
    getColores();
    getTallas(); // Obtener los colores cuando el componente se monta
  }, []);

  const getInsumos = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const response = await axios.get(url);
      setInsumos(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching insumos:", error);
    } finally {
      setLoading(false); // Ocultar el loader después de obtener los insumos
    }
  };
  
  const getColores = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const response = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/colores");
      // Filtrar solo los colores activos
      const coloresActivos = response.data.filter(
        (color) => color.Estado === "Activo"
      );
      setColores(coloresActivos);
    } catch (error) {
      console.error("Error fetching colores:", error);
    } finally {
      setLoading(false); // Ocultar el loader después de obtener los colores
    }
  };
  
  const getTallas = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      const response = await axios.get("https://softshirt-1c3fad7d72e8.herokuapp.com/api/tallas");
      // Filtrar solo las tallas activas
      const tallasActivas = response.data.filter(
        (talla) => talla.Estado === "Activo"
      );
      setTallas(tallasActivas);
    } catch (error) {
      console.error("Error fetching tallas:", error);
    } finally {
      setLoading(false); // Ocultar el loader después de obtener las tallas
    }
  };

  const openModal = (op, insumo = null) => {
    if (op === 1) {
      // Crear cliente
      setIdInsumo("");
      setIdColor("");
      setIdTalla("");
      setReferencia("");
      setCantidad(0);
      setValorCompra(0);
      setOperation(1);
      setTitle("Crear Insumo");
    } else if (op === 2 && insumo) {
      // Actualizar Cliente
      setIdInsumo(insumo.IdInsumo);
      setIdColor(insumo.IdColor);
      setIdTalla(insumo.IdTalla);
      setReferencia(insumo.Referencia);
      setCantidad(insumo.Cantidad);
      setValorCompra(insumo.ValorCompra);
      setOperation(2);
      setTitle("Actualizar Datos");
      setErrors({
        IdColor: 0,
        IdTalla: 0,
        Referencia: "",
        Cantidad: 0,
        ValorCompra: 0,
      });
      const errors = {
        Referencia: validateReferencia(insumo.Referencia),
        // Cantidad: validateCantidad(insumo.Cantidad),
        // ValorCompra: validateValorCompra(insumo.ValorCompra),
      };
      setErrors(errors);
    }
  };

  const guardarInsumo = async () => {
    // Verificar errores de validación antes de enviar los datos
    const errors = {
      IdColor: IdColor === "" ? "Seleccione un color" : "",
      IdTalla: IdTalla === "" ? "Seleccione una talla" : "",
    };
    setErrors(errors);

    // Comprobar si hay errores
    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (hasErrors) {
      // Mostrar mensaje específico si hay errores en los campos
      show_alerta({
        message: "Por favor, completa todos los campos correctamente",
        type: "error",
      });
      return; // Detener la ejecución si hay errores
    }

    // Verificar si la referencia ya existe
    const referenciaExiste = Insumos.some(
      (insumo) => insumo.Referencia.toLowerCase() === Referencia.toLowerCase()
    );

    if (referenciaExiste && operation === 1) {
      // Solo en la creación
      show_alerta({
        message: "La referencia ya existe. Elige una referencia diferente.",
        type: "error",
      });
      return; // Detener la ejecución si la referencia ya existe
    }

    try {
      if (operation === 1) {
        // Crear Insumo
        await enviarSolicitud("POST", {
          IdColor,
          IdTalla,
          Referencia: Referencia.trim(),
          Cantidad,
          ValorCompra,
        });
        show_alerta({
          message: "Insumo creado con éxito",
          type: "success",
        });
      } else if (operation === 2) {
        // Actualizar Insumo
        await enviarSolicitud("PUT", {
          IdInsumo,
          IdColor,
          IdTalla,
          Referencia: Referencia.trim(),
          Cantidad,
          ValorCompra,
        });
        show_alerta({
          message: "Insumo actualizado con éxito",
          type: "success",
        });
      }

      // Usar jQuery para cerrar el modal
      $("#modalCliente").modal("hide");

      // Opcionalmente, actualizar la lista de insumos
      getInsumos();
    } catch (error) {
      show_alerta({
        message: "Error al guardar el insumo",
        type: "error",
      });
    }
  };

  // Función para validar la referencia
  const validateReferencia = (value) => {
    if (!value) {
      return "Escribe la referencia";
    }
    // Validar que la referencia siga el patrón TST-001
    // if (!/^[A-Z]{3}-\d{3}$/.test(value)) {
    //   return "La referencia debe ser en el formato AAA-000";
    // }
    // return "";
  };

  // // Función para validar la cantidad
  // const validateCantidad = (value) => {
  //   if (!value) {
  //     return "Escribe la cantidad";
  //   }
  //   if (!/^\d+$/.test(value)) {
  //     return "La cantidad solo puede contener números";
  //   }
  //   return "";
  // };

  // const validateValorCompra = (value) => {
  //   if (!value) {
  //     return "Escribe el valor de compra";
  //   }
  //   if (!/^\d+(\.\d+)?$/.test(value)) {
  //     return "El valor de compra solo puede contener números y decimales";
  //   }
  //   return "";
  // };

  const updateReferencia = (colorId, tallaId) => {
    const color = Colores.find((color) => color.IdColor === parseInt(colorId));
    const talla = Tallas.find((talla) => talla.IdTalla === parseInt(tallaId));
    if (color && talla) {
      const colorHex = color.Referencia.substring(1, 4).toUpperCase(); // Obtén los primeros 3 caracteres hexadecimales
      const referenciaGenerada = `${talla.Talla}-${colorHex}`;
      setReferencia(referenciaGenerada);
    } else {
      setReferencia(""); // Vaciar la referencia si no hay color o talla
    }
  };
  const handleChangeIdColor = (e) => {
    const value = e.target.value;
    setIdColor(value);
    setErrors((prevState) => ({
      ...prevState,
      IdColor: value === "" ? "Seleccione un color" : "",
    }));
    updateReferencia(value, IdTalla);
  };

  const handleChangeIdTalla = (e) => {
    const value = e.target.value;
    setIdTalla(value);
    setErrors((prevState) => ({
      ...prevState,
      IdTalla: value === "" ? "Seleccione una talla" : "",
    }));
    updateReferencia(IdColor, value);
  };

  // Función para manejar cambios en el teléfono
  const handleChangeReferencia = (e) => {
    let value = e.target.value.trim();
    // Limitar la longitud del valor ingresado a 7 caracteres
    if (value.length > 7) {
      value = value.slice(0, 7);
    }
    setReferencia(value);
    const errorMessage = validateReferencia(value);
    setErrors((prevState) => ({
      ...prevState,
      Referencia: errorMessage,
    }));
  };

  // Función para manejar cambios en la dirección
  const handleChangeCantidad = (e) => {
    const value = e.target.value;
    setCantidad(value);
    const errorMessage = validateCantidad(value);
    setErrors((prevState) => ({
      ...prevState,
      Cantidad: errorMessage,
    }));
  };

  // Función para manejar cambios en el correo electrónico
  const handleChangeValorCompra = (e) => {
    const value = e.target.value;
    setValorCompra(value);
    const errorMessage = validateValorCompra(value);
    setErrors((prevState) => ({
      ...prevState,
      ValorCompra: errorMessage,
    }));
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
        ? `${url}/${parametros.IdInsumo}`
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

      setIsSubmitting(true)

      const msj = respuesta.data.message;
      show_alerta({
        message: msj,
        type: "success",
      });

      document.getElementById("btnCerrarCliente").click();
      getInsumos();
    } catch (error) {
      console.log("Error details:", error.response); // Inspeccionar la estructura del error
      if (error.response) {
        show_alerta({
          message:
            error.response.data.message || "Error al procesar la solicitud",
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
      console.error(error);
    }finally {
      setIsSubmitting(false)
    }
  };

  // const deleteInsumo = (IdInsumo, Referencia) => {
  //   const MySwal = withReactContent(Swal);
  //   MySwal.fire({
  //     title: `¿Seguro de eliminar el insumo ${Referencia}?`,
  //     icon: "question",
  //     text: "No se podrá dar marcha atrás",
  //     showCancelButton: true,
  //     confirmButtonText: "Sí, eliminar",
  //     cancelButtonText: "Cancelar",
  //     showClass: {
  //       popup: "swal2-show",
  //       backdrop: "swal2-backdrop-show",
  //       icon: "swal2-icon-show",
  //     },
  //     hideClass: {
  //       popup: "swal2-hide",
  //       backdrop: "swal2-backdrop-hide",
  //       icon: "swal2-icon-hide",
  //     },
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       setIdInsumo(IdInsumo);
  //       enviarSolicitud("DELETE", { IdInsumo: IdInsumo }).then(() => {
  //         // Calcular el índice del insumo eliminado en la lista filtrada
  //         const index = filteredInsumos.findIndex(
  //           (insumo) => insumo.IdInsumo === IdInsumo
  //         );

  //         // Determinar la página en la que debería estar el insumo después de la eliminación
  //         const newPage =
  //           Math.ceil((filteredInsumos.length - 1) / itemsPerPage) || 1;

  //         // Establecer la nueva página como la página actual
  //         setCurrentPage(newPage);

  //         // Actualizar la lista de insumos eliminando el insumo eliminado
  //         setInsumos((prevInsumos) =>
  //           prevInsumos.filter((insumo) => insumo.IdInsumo !== IdInsumo)
  //         );

  //         show_alerta("El insumo fue eliminado correctamente", "success");
  //       });
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       show_alerta("El insumo NO fue eliminado", "info");
  //     } else if (
  //       result.dismiss === Swal.DismissReason.backdrop ||
  //       result.dismiss === Swal.DismissReason.esc
  //     ) {
  //       show_alerta("El insumo NO fue eliminado", "info");
  //     }
  //   });
  // };

  const deleteInsumo = async (idInsumo, referencia) => {
    const MySwal = withReactContent(Swal);

    // Mostrar el mensaje de confirmación
    MySwal.fire({
      title: `¿Seguro de eliminar el insumo ${referencia}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `https://softshirt-1c3fad7d72e8.herokuapp.com/api/insumos/${idInsumo}`,
            {
              method: "DELETE",
            }
          );

          if (response.status === 409) {
            const data = await response.json();
            show_alerta({
              message: data.message,
              type: "error",
            });
          } else if (response.status === 200) {
            show_alerta({
              message: "Insumo eliminado correctamente",
              type: "success",
            });
            // Actualizar la tabla de insumos
            getInsumos();
          } else {
            show_alerta({
              message:
                "El insumo está asociado a una compra, no se puede eliminar",
              type: "error",
            });
          }
        } catch (error) {
          console.error("Error al eliminar el insumo:", error);
          show_alerta({
            message: "Error al eliminar el insumo",
            type: "error",
          });
        }
      } else {
        show_alerta({
          message: "El insumo NO fue eliminado",
          type: "info",
        });
      }
    });
  };

  const cambiarEstadoInsumo = async (IdInsumo) => {
    try {
      const insumoActual = Insumos.find(
        (insumo) => insumo.IdInsumo === IdInsumo
      );

      if (insumoActual.Cantidad > 0) {
        show_alerta({
          message:
            "No se puede desactivar el insumo porque la cantidad es mayor a 0",
          type: "warning",
        });
        return;
      }

      const nuevoEstado =
        insumoActual.Estado === "Activo" ? "Inactivo" : "Activo";

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar el estado del insumo ${insumoActual.Referencia}?`,
        icon: "question",
        html: `El estado actual del insumo es: <strong> ${insumoActual.Estado}</strong>. ¿Desea cambiarlo a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const parametros = {
            IdInsumo,
            IdColor: insumoActual.IdColor,
            IdTalla: insumoActual.IdTalla,
            Referencia: insumoActual.Referencia,
            Cantidad: insumoActual.Cantidad,
            ValorCompra: insumoActual.ValorCompra,
            Estado: nuevoEstado,
          };

          const response = await axios.put(`${url}/${IdInsumo}`, parametros);
          if (response.status === 200) {
            setInsumos((prevInsumos) =>
              prevInsumos.map((insumo) =>
                insumo.IdInsumo === IdInsumo
                  ? { ...insumo, Estado: nuevoEstado }
                  : insumo
              )
            );

            show_alerta({
              message: "Estado del insumo cambiado con éxito",
              type: "success",
            });
          }
        } else {
          show_alerta({
            message: "No se ha cambiado el estado del insumo",
            type: "info",
          });
        }
      });
    } catch (error) {
      console.error("Error updating state:", error);
      show_alerta({
        message: "Error cambiando el estado del insumo",
        type: "error",
      });
    }
  };

  const convertColorIdToName = (colorId) => {
    const color = Colores.find((color) => color.IdColor === colorId);
    return color ? color.Color : "";
  };

  const convertTallaIdToName = (tallaId) => {
    const talla = Tallas.find((talla) => talla.IdTalla === tallaId);
    return talla ? talla.Talla : "";
  };

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Resetear la página actual al cambiar el término de búsqueda
  };

  // Filtrar los insumos según el término de búsqueda
  const filteredInsumos = Insumos.filter((insumo) => {
    const colorName = convertColorIdToName(insumo.IdColor);
    const tallaName = convertTallaIdToName(insumo.IdTalla);
    const referencia = insumo.Referencia ? insumo.Referencia.toString() : "";
    const cantidad = insumo.Cantidad ? insumo.Cantidad.toString() : "";
    const valorCompra = insumo.ValorCompra ? insumo.ValorCompra.toString() : "";

    return (
      colorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tallaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cantidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      valorCompra.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Aplicar paginación a los insumos filtrados
  const totalPages = Math.ceil(filteredInsumos.length / itemsPerPage);
  const currentInsumos = filteredInsumos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  }

  if (loading) {
    return <Loader />;
  }

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
                    <label htmlFor="idColor">Color del insumo</label>
                    <select
                      className="form-control"
                      id="idColor"
                      value={IdColor}
                      onChange={(e) => handleChangeIdColor(e)}
                      required
                    >
                      <option disabled value="">Seleccione un color</option>
                      {Colores.map((color) => (
                        <option key={color.IdColor} value={color.IdColor}>
                          {color.Color}
                        </option>
                      ))}
                    </select>
                    {IdColor === "" && (
                      <p className="text-danger">
                        Por favor, seleccione un color.
                      </p>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="idTalla">Talla del insumo</label>
                    <select
                      className="form-control"
                      id="idTalla"
                      value={IdTalla}
                      onChange={(e) => handleChangeIdTalla(e)}
                      required
                    >
                      <option disabled value="">Seleccione una talla</option>
                      {Tallas.map((talla) => (
                        <option key={talla.IdTalla} value={talla.IdTalla}>
                          {talla.Talla}
                        </option>
                      ))}
                    </select>
                    {IdTalla === "" && (
                      <p className="text-danger">
                        Por favor, seleccione una talla.
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="referencia">Referencia del insumo</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.Referencia ? "is-invalid" : ""
                      }`}
                      id="referencia"
                      placeholder="Ingrese la referencia del insumo"
                      required
                      value={Referencia}
                      onChange={handleChangeReferencia}
                      disabled
                    />
                    {errors.Referencia && (
                      <div className="invalid-feedback">
                        {errors.Referencia}
                      </div>
                    )}
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="nombreCliente">Cantidad</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.Cantidad ? "is-invalid" : ""
                      }`}
                      id="nombreCliente"
                      placeholder="Ingrese la cantidad del insumo"
                      required
                      value={Cantidad} // Aquí usamos la variable ValorCompra del estado
                      onChange={handleChangeCantidad}
                      disabled
                    />
                    {renderErrorMessage(errors.Cantidad)}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label htmlFor="direccionCliente">
                      Valor de la compra del insumo
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.ValorCompra ? "is-invalid" : ""
                      }`}
                      id="direccionCliente"
                      placeholder="Ingrese el valor de la compra"
                      required
                      value={ValorCompra} // Aquí usamos la variable ValorCompra del estado
                      onChange={handleChangeValorCompra}
                      disabled
                    />
                    {renderErrorMessage(errors.ValorCompra)}
                  </div>
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
                  guardarInsumo();
                }}
                disabled={isSubmitting}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          {/* <h1 className="h3 mb-3 text-center text-dark">Gestión de Insumos</h1> */}
        </div>

        {/* <!-- Tabla de Clientes --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex justify-content-between align-items-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
            <button
              type="button"
              className="btn btn-dark d-flex align-items-center justify-content-center p-0"
              data-toggle="modal"
              data-target="#modalCliente"
              style={{
                width: "155px",
                height: "40px"
              }}
              onClick={() => openModal(1, "", "", "", "", "", "")}
            >
              <i className="fas fa-pencil-alt"></i>
              <span className="d-none d-sm-inline ml-2">Crear Insumo</span>
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
                    <th>Referencia</th>
                    <th>Color</th>
                    <th>Talla</th>
                    <th>Cantidad</th>
                    <th>Valor de la Compra</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInsumos.map((insumo) => (
                    <tr key={insumo.IdInsumo}>
                      <td>{insumo.Referencia}</td>
                      <td>{convertColorIdToName(insumo.IdColor)}</td>
                      <td>{convertTallaIdToName(insumo.IdTalla)}</td>
                      <td>{insumo.Cantidad}</td>
                      <td>{formatCurrency(insumo.ValorCompra)}</td>
                      <td>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={insumo.Estado === "Activo"}
                            onChange={() =>
                              cambiarEstadoInsumo(insumo.IdInsumo)
                            }
                            className={
                              insumo.Estado === "Activo"
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
                            data-target="#modalCliente"
                            onClick={() => openModal(2, insumo)}
                            disabled={insumo.Estado !== "Activo"}
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>
                          {insumo.Cantidad === 0 && (
                            <button
                              className="btn btn-danger btn-sm mr-2"
                              onClick={() =>
                                deleteInsumo(insumo.IdInsumo, insumo.Referencia)
                              }
                              disabled={insumo.Estado !== "Activo"}
                              title="Eliminar"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          )}
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
        {/* Fin tabla de insumos */}
      </div>
      <AdminFooter/>
    </>
  );
};
