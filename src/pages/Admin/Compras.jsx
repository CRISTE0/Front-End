import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../assets/js/Pagination";
import SearchBar from "../../assets/js/SearchBar";

export const Compras = () => {
  const url = "http://localhost:3000/api/compras";
  const [Compras, setCompras] = useState([]);
  const [IdCompra, setIdCompra] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [IdProveedor, setIdProveedor] = useState("");
  const [Fecha, setFecha] = useState("");
  const [Total, setTotal] = useState("");
  const [Detalles, setDetalles] = useState([]);
  const [Insumos, setInsumos] = useState([]);
  const [showDetalleField, setShowDetalleField] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    getCompras();
    getInsumos();
    getProveedores();
  }, []);

  const getCompras = async () => {
    try {
      const respuesta = await axios.get(url);
      const comprasOrdenadas = respuesta.data.sort((a, b) => {
        // Ordenar por fecha de forma descendente (de la más reciente a la más antigua)
        return new Date(b.Fecha) - new Date(a.Fecha);
      });
      setCompras(comprasOrdenadas);
    } catch (error) {
      show_alerta("Error al obtener las compras", "error");
    }
  };

  const getProveedorName = (idProveedor) => {
    const proveedor = proveedores.find(
      (prov) => prov.IdProveedor === idProveedor
    );
    return proveedor ? proveedor.NombreApellido : "Proveedor no encontrado";
  };

  const getInsumoName = (idInsumo) => {
    const insumo = Insumos.find((item) => item.IdInsumo === idInsumo);
    return insumo ? insumo.Referencia : "Insumo no encontrado";
  };

  const getProveedores = async () => {
    try {
      const respuesta = await axios.get(
        "http://localhost:3000/api/proveedores"
      );
      const proveedoresActivos = respuesta.data.filter(
        (proveedor) => proveedor.Estado === "Activo"
      );
      setProveedores(proveedoresActivos);
    } catch (error) {
      show_alerta("Error al obtener los proveedores", "error");
    }
  };

  const getInsumos = async () => {
    try {
      const respuesta = await axios.get("http://localhost:3000/api/insumos");
      const insumosActivos = respuesta.data.filter(
        (insumo) => insumo.Estado === "Activo"
      );
      setInsumos(insumosActivos);
    } catch (error) {
      show_alerta("Error al obtener los insumos", "error");
    }
  };

  // Calcular el precio total de la compra en función de los detalles
  const totalCompra =
    Detalles && Detalles.length > 0
      ? Detalles.reduce((total, detalle) => {
          return total + (detalle.cantidad * detalle.precio || 0);
        }, 0)
      : 0;

  const handleDetalleCompra = async (idCompra) => {
    try {
      const respuesta = await axios.get(
        `http://localhost:3000/api/compras/${idCompra}`
      );
      const compra = respuesta.data;
      console.log("Detalle de compra:", compra);
      setCompraSeleccionada(compra);
      $("#modalDetalleCompra").modal("show");
    } catch (error) {
      show_alerta("Error al obtener los detalles de la compra", "error");
    }
  };

  const formatPrice = (price) => {
    // Convertir el precio a número si es una cadena
    const formattedPrice =
      typeof price === "string" ? parseFloat(price) : price;

    // Verificar si el precio es un número válido
    if (!isNaN(formattedPrice)) {
      // Formatear el número con separadores de miles y coma decimal
      const formattedNumber = formattedPrice.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      // Retornar el número con el símbolo de peso
      return `$${formattedNumber}`;
    }

    return `$0.00`; // Valor predeterminado si no es un número válido
  };

  // Función para obtener el precio actual del insumo
  const getCurrentPrice = (idInsumo) => {
    const insumo = Insumos.find((item) => item.IdInsumo === idInsumo);
    const precioActual = insumo ? insumo.precio : 0; // Obtener el precio actual del insumo

    // Verificar si hay detalles en la compra seleccionada y devolver el precio correspondiente
    if (compraSeleccionada && compraSeleccionada.DetallesCompras) {
      const detalleCompra = compraSeleccionada.DetallesCompras.find(
        (detalle) => detalle.IdInsumo === idInsumo
      );
      if (detalleCompra) {
        return detalleCompra.Precio; // Devolver el precio del detalle de la compra
      }
    }

    return precioActual; // Si no hay detalle de compra asociado, devolver el precio actual
  };

  const openModal = () => {
    setIdCompra(""); // Resetear el IdCompra al abrir el modal para indicar una nueva compra
    setIdProveedor("");
    setFecha("");
    setTotal("");
    setDetalles([]);
    setOperation(1); // Indicar que es una operación de creación
    setErrors({});
    setTitle("Registrar Compra");
    setShowDetalleField(false); // Ocultar el campo de detalles al abrir el modal
  };

  // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "IdProveedor") {
      setIdProveedor(value);
    } else if (name === "Fecha") {
      const selectedDate = new Date(value);
      const currentDate = new Date();

      // Calcular la fecha hace 8 días
      const minDate = new Date();
      minDate.setDate(currentDate.getDate() - 8);

      if (selectedDate > currentDate) {
        // Si la fecha seleccionada es después de la fecha actual,
        // establecer la fecha actual como valor de Fecha
        const formattedCurrentDate = currentDate.toISOString().split("T")[0];
        setFecha(formattedCurrentDate);
      } else if (selectedDate < minDate) {
        // Si la fecha seleccionada es anterior a 8 días atrás, establecer la fecha mínima
        const formattedMinDate = minDate.toISOString().split("T")[0];
        setFecha(formattedMinDate);
      } else {
        // Establecer la fecha seleccionada sin modificarla
        setFecha(value);
      }
    } else if (name === "Total") {
      setTotal(value);
    }
  };

  // Función para manejar los cambios en los detalles de la compra
  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDetalles = [...Detalles];

    if (name === "IdInsumo") {
      const insumoDuplicado = updatedDetalles.some(
        (detalle, detalleIndex) =>
          detalle.IdInsumo === value && detalleIndex !== index
      );
      if (insumoDuplicado) {
        show_alerta("Este insumo ya está agregado en los detalles", "error");
        return;
      }
    }

    if (name === "cantidad") {
      // Validar que la cantidad sea un número entero positivo sin signos más o menos al principio
      if (value === "" || /^[1-9]\d*$/.test(value)) {
        // Aceptar solo números enteros positivos
        updatedDetalles[index][name] = value;

        // Actualizar el subtotal si se modificó cantidad
        const cantidad = parseFloat(value || 0);
        const precio = parseFloat(updatedDetalles[index].precio || 0);
        updatedDetalles[index].subtotal = cantidad * precio;

        // Mostrar alerta si la cantidad es 0 y no se está eliminando el detalle
        if (cantidad === 0 && Detalles[index].cantidad !== "") {
          show_alerta("La cantidad no puede ser 0", "error");
        }
      } else {
        if (value !== "") {
          show_alerta(
            "La cantidad debe ser un número entero positivo sin signos más o menos al principio",
            "error"
          );
        }
        return; // No actualizar si no es un número entero positivo y no está vacío
      }
    } else if (name === "precio") {
      // Validar que el precio sea un número positivo sin signos más o menos al principio
      if (
        value === "" ||
        (/^\d+(\.\d+)?$/.test(value) && parseFloat(value) <= 10000000)
      ) {
        // Aceptar solo números válidos y que no superen los 10 millones
        const newPrice = parseFloat(value || 0);

        // Mostrar advertencia si el precio es menor al actual
        const idInsumo = updatedDetalles[index].IdInsumo;
        const currentPrice = getCurrentPrice(idInsumo);

        if (newPrice < currentPrice && value !== "") {
          show_alerta(
            `El precio no puede ser menor al actual (${formatPrice(
              currentPrice
            )})`,
            "warning"
          );
        }

        // Validar que el precio no sea 0, solo si el campo no está vacío
        if (newPrice === 0 && value !== "") {
          show_alerta("El precio no puede ser 0", "error");
          updatedDetalles[index][name] = ""; // Limpiar el campo de precio
        } else {
          // Actualizar el subtotal si se modificó precio
          const cantidad = parseFloat(updatedDetalles[index].cantidad || 0);
          updatedDetalles[index][name] = value;
          updatedDetalles[index].subtotal = cantidad * newPrice;
        }
      } else {
        if (value !== "") {
          show_alerta(
            "El precio debe ser un número válido y no superar los 10 millones, sin signos más o menos al principio",
            "error"
          );
        }
        return; // No actualizar si no es un número válido o si supera el límite
      }
    } else {
      updatedDetalles[index][name] = value;
    }

    setDetalles(updatedDetalles);
  };

  const getFilteredInsumos = (index) => {
    // Obtener los IDs de los insumos seleccionados en las otras filas de detalles
    const insumosSeleccionados = Detalles.reduce((acc, detalle, i) => {
      if (i !== index && detalle.IdInsumo) {
        acc.push(detalle.IdInsumo);
      }
      return acc;
    }, []);

    // Filtrar los insumos disponibles excluyendo los ya seleccionados
    return Insumos.filter(
      (insumo) => !insumosSeleccionados.includes(insumo.IdInsumo)
    );
  };

  const addDetail = () => {
    // Crear un nuevo detalle con valores predeterminados
    const newDetail = {
      IdInsumo: "",
      cantidad: "",
      precio: "",
      subtotal: 0,
    };

    // Crear una nueva matriz de detalles con el nuevo detalle agregado
    const updatedDetalles = [...Detalles, newDetail];

    // Establecer los detalles actualizados
    setDetalles(updatedDetalles);

    // Mostrar el campo de detalles cuando se agrega un detalle
    setShowDetalleField(true);
  };

  const removeDetail = (index) => {
    const updatedDetalles = Detalles.filter((_, i) => i !== index);
    setDetalles(updatedDetalles);
  };

  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  const showDetalleAlert = (message) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: message,
      icon: "error",
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

  const validar = () => {
    let errorMessage = "";

    // Validar campos de la compra (Proveedor, Fecha, Detalles)
    if (!IdProveedor) {
      errorMessage = "Selecciona un proveedor";
      setErrors({ ...errors, IdProveedor: errorMessage });
      return;
    }

    if (!Fecha) {
      errorMessage = "Selecciona una fecha";
      setErrors({ ...errors, Fecha: errorMessage });
      return;
    }

    // Validar detalles de la compra
    if (
      Detalles.length === 0 ||
      Detalles.some(
        (detalle) =>
          !detalle.IdInsumo ||
          !detalle.cantidad ||
          !detalle.precio ||
          detalle.cantidad === "0" ||
          detalle.precio === "0"
      )
    ) {
      errorMessage = "Agrega detalles válidos de compra";
      showDetalleAlert(errorMessage); // Mostrar la alerta cuando no hay detalles válidos
      return;
    }

    const detallesValidados = Detalles.map((detalle, index) => {
      const errors = {};

      if (!detalle.IdInsumo) {
        errors.IdInsumo = "Selecciona un insumo";
      }

      if (
        !detalle.cantidad ||
        detalle.cantidad <= 0 ||
        !/^\d+$/.test(detalle.cantidad) ||
        detalle.cantidad === "0"
      ) {
        errors.cantidad = "Ingresa una cantidad válida";
        if (detalle.cantidad === "0") {
          show_alerta("La cantidad no puede ser 0", "error");
        }
      }

      if (
        !detalle.precio ||
        detalle.precio <= 0 ||
        parseFloat(detalle.precio) > 10000000 ||
        detalle.precio === "0"
      ) {
        errors.precio =
          "Ingresa un precio válido que no supere los 10 millones y no sea 0";
        if (detalle.precio === "") {
          show_alerta("El precio no puede estar vacío", "error");
        } else if (detalle.precio === "0") {
          show_alerta("El precio no puede ser 0", "error");
        }
      }

      if (Object.keys(errors).length > 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Detalles: { ...prevErrors.Detalles, [index]: errors },
        }));
      }

      return errors;
    });

    const hasErrors = detallesValidados.some(
      (errors) => Object.keys(errors).length > 0
    );

    if (hasErrors) {
      return;
    }

    // Si pasa la validación, enviar la solicitud
    enviarSolicitud("POST", {
      IdProveedor: IdProveedor,
      Fecha: Fecha,
      Total: totalCompra,
      detalles: Detalles,
    });
  };

  const enviarSolicitud = async (metodo, parametros) => {
    try {
      let urlRequest = url;
      if (metodo === "PUT" || metodo === "DELETE") {
        urlRequest = `${url}/${parametros.IdCompra}`;
      }
      const respuesta = await axios({
        method: metodo,
        url: urlRequest,
        data: parametros,
      });
      show_alerta(respuesta.data.message, "success");
      document.getElementById("btnCerrar").click();
      getCompras();

      // Cerrar el modal de detalles si está abierto
      if (compraSeleccionada) {
        $("#modalDetalleCompra").modal("hide");
      }
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

  const cancelCompra = async (id) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Seguro de cancelar la compra?",
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Si, cancelar",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Cambiar el estado de la compra a "Cancelado"
          await axios.put(`http://localhost:3000/api/compras/${id}`, {
            Estado: "Cancelado",
          });

          // Actualizar la lista de compras
          getCompras();

          show_alerta("La compra fue cancelada correctamente", "success");
        } catch (error) {
          show_alerta("Hubo un error al cancelar la compra", "error");
        }
      } else {
        show_alerta("La compra NO fue cancelada", "info");
      }
    });
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

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset current page when changing the search term
  };

  // Filter purchases based on the search term
  const filteredCompras = Compras.filter((compra) =>
    Object.values(compra).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Apply pagination to the filtered purchases
  const totalPages = Math.ceil(filteredCompras.length / itemsPerPage);
  const currentCompras = filteredCompras.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Modal para crear o editar una compra con detalles */}
      <div
        className="modal fade"
        id="modalCompras"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalAñadirCompraLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalAñadirCompraLabel">
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
              <input type="hidden" id="IdCompra"></input>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Proveedor:</label>
                    <select
                      className={`form-control ${
                        errors.IdProveedor ? "is-invalid" : ""
                      }`}
                      name="IdProveedor"
                      value={IdProveedor}
                      onChange={(e) => setIdProveedor(e.target.value)}
                    >
                      <option value="">Selecciona un proveedor</option>
                      {proveedores.map((proveedor) => (
                        <option
                          key={proveedor.IdProveedor}
                          value={proveedor.IdProveedor}
                        >
                          {proveedor.NombreApellido}
                        </option>
                      ))}
                    </select>
                    {errors.IdProveedor && (
                      <div className="invalid-feedback">
                        {errors.IdProveedor}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Fecha:</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.Fecha ? "is-invalid" : ""
                      }`}
                      id="Fecha"
                      name="Fecha"
                      value={Fecha}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                    />
                    <small>
                      Selecciona una fecha dentro de los últimos 8 días.
                    </small>
                    {renderErrorMessage(errors.Fecha)}
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Insumo</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>SubTotal</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Detalles.map((detalle, index) => (
                      <tr key={index}>
                        <td>
                          <select
                            className={`form-control ${
                              errors.Detalles &&
                              errors.Detalles[index] &&
                              errors.Detalles[index].IdInsumo
                                ? "is-invalid"
                                : ""
                            }`}
                            name="IdInsumo"
                            value={detalle.IdInsumo}
                            onChange={(e) => handleDetailChange(index, e)}
                          >
                            <option value="">Selecciona un insumo</option>
                            {getFilteredInsumos(index).map((insumo) => (
                              <option
                                key={insumo.IdInsumo}
                                value={insumo.IdInsumo}
                              >
                                {insumo.Referencia}
                              </option>
                            ))}
                          </select>
                          {errors.Detalles &&
                            errors.Detalles[index] &&
                            errors.Detalles[index].IdInsumo && (
                              <div className="invalid-feedback">
                                {errors.Detalles[index].IdInsumo}
                              </div>
                            )}
                        </td>
                        <td>
                          <input
                            type="number"
                            className={`form-control ${
                              errors.Detalles &&
                              errors.Detalles[index] &&
                              errors.Detalles[index].cantidad
                                ? "is-invalid"
                                : ""
                            }`}
                            name="cantidad"
                            placeholder="Cantidad"
                            value={detalle.cantidad}
                            onChange={(e) => handleDetailChange(index, e)}
                          />
                          {errors.Detalles &&
                            errors.Detalles[index] &&
                            errors.Detalles[index].cantidad && (
                              <div className="invalid-feedback">
                                {errors.Detalles[index].cantidad}
                              </div>
                            )}
                        </td>
                        <td>
                          <input
                            type="number"
                            className={`form-control ${
                              errors.Detalles &&
                              errors.Detalles[index] &&
                              errors.Detalles[index].precio
                                ? "is-invalid"
                                : ""
                            }`}
                            name="precio"
                            placeholder="Precio"
                            value={detalle.precio}
                            onChange={(e) => handleDetailChange(index, e)}
                          />
                          {errors.Detalles &&
                            errors.Detalles[index] &&
                            errors.Detalles[index].precio && (
                              <div className="invalid-feedback">
                                {errors.Detalles[index].precio}
                              </div>
                            )}
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            name="subtotal"
                            placeholder="Subtotal"
                            value={formatPrice(detalle.subtotal)}
                            disabled
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => removeDetail(index)}
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {errors.Detalles && (
                <div className="invalid-feedback">{errors.Detalles}</div>
              )}

              <div className="text-right mb-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={addDetail}
                >
                  Añadir Detalle
                </button>
              </div>
              <div className="form-group">
                <label>Total:</label>
                <input
                  type="text"
                  className="form-control"
                  id="Total"
                  name="Total"
                  value={formatPrice(totalCompra)}
                  disabled
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="btnCerrar"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => validar()}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* fin modal de crear compra con el detalle */}

      {/* Inicio modal ver detalle compra */}
      <div
        className="modal fade"
        id="modalDetalleCompra"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalDetalleCompraLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalDetalleCompraLabel">
                Detalle de la Compra
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
              {compraSeleccionada && (
                <>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label>Proveedor:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={getProveedorName(compraSeleccionada.IdProveedor)}
                        disabled
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Fecha:</label>
                      <input
                        type="date"
                        className="form-control"
                        value={compraSeleccionada.Fecha}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Insumo</th>
                          <th>Cantidad</th>
                          <th>Precio</th>
                          <th>SubTotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compraSeleccionada.DetallesCompras.map(
                          (detalle, index) => (
                            <tr key={index}>
                              <td>{getInsumoName(detalle.IdInsumo)}</td>
                              <td>{detalle.Cantidad}</td>
                              <td>{formatPrice(detalle.Precio)}</td>
                              <td>
                                {formatPrice(detalle.Cantidad * detalle.Precio)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="form-group">
                    <label>Total:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formatPrice(compraSeleccionada.Total)}
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
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fin modal ver detalle compra */}

      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-3 text-center text-dark">Gestión de Compras</h1>
          <div className="text-right">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalCompras"
              onClick={() => proveedores.length > 0 && openModal(1)}
            >
              <i className="fas fa-pencil-alt"></i> Crear Compra
            </button>
          </div>
        </div>

        {/* <!-- Tabla de Compras --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-1 d-flex">
            <h6 className="m-2 font-weight-bold text-primary">Compras</h6>
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
                    <th>Proveedor</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCompras.map((compra) => (
                    <tr
                      key={compra.IdCompra}
                      className={
                        compra.Estado === "Cancelado" ? "table-secondary" : ""
                      }
                    >
                      <td>{getProveedorName(compra.IdProveedor)}</td>
                      <td>{compra.Fecha}</td>
                      <td>{formatPrice(compra.Total)}</td>
                      <td>
                        {compra.Estado === "Cancelado" ? (
                          <button
                            className="btn btn-secondary mr-2"
                            disabled
                          >
                            <i className="fas fa-times-circle"></i>
                          </button>
                        ) : (
                          <button
                            onClick={() => cancelCompra(compra.IdCompra)}
                            className="btn btn-danger mr-2"
                          >
                            <i className="fas fa-times-circle"></i>
                          </button>
                        )}
                        <button
                          onClick={() => handleDetalleCompra(compra.IdCompra)}
                          className={`btn ${
                            compra.Estado === "Cancelado"
                              ? "btn-secondary mr-2"
                              : "btn-info"
                          } rounded-icon`}
                          disabled={compra.Estado === "Cancelado"}
                          data-toggle="modal"
                          data-target="#modalDetalleCompra"
                        >
                          <i className="fas fa-info-circle"></i>
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

        {/* Fin tabla de compras */}
      </div>
    </>
  );
};
