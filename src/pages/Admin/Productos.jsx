import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../assets/js/Pagination";
import SearchBar from "../../assets/js/SearchBar";

export const Catalogo = () => {
  const url = "http://localhost:3000/api/productos";
  const [productosAdmin, setProductosAdmin] = useState([]);
  const [Disenios, setDisenios] = useState([]);
  const [Insumos, setInsumos] = useState([]);
  const [IdDisenio, setIdDisenio] = useState("");
  const [IdInsumo, setIdInsumo] = useState("");
  const [IdProducto, setIdProducto] = useState("");
  const [Referencia, setReferencia] = useState("");
  const [Cantidad, setCantidad] = useState("");
  const [ValorVenta, setValorVenta] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({
    IdDisenio: 0,
    IdInsumo: 0,
    Referencia: "",
    Cantidad: 0,
    ValorVenta: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    getProductosAdmin();
    getDisenios();
    getInsumos(); // Obtener los Disenios cuando el componente se monta
  }, []);

  const getProductosAdmin = async () => {
    const respuesta = await axios.get(url);
    setProductosAdmin(respuesta.data);
    console.log(respuesta.data);
  };

  const getDisenios = async () => {
    const respuesta = await axios.get("http://localhost:3000/api/disenios");
    const DiseniosActivos = respuesta.data.filter(
      (disenio) => disenio.Estado === "Activo"
    );
    setDisenios(DiseniosActivos);
  };
  
  const getInsumos = async () => {
    const respuesta = await axios.get("http://localhost:3000/api/insumos");
    const InsumosActivas = respuesta.data.filter(
      (talla) => talla.Estado === "Activo"
    );
    setInsumos(InsumosActivas);
  };

  const openModal = (op, insumo = null) => {
    if (op === 1) {
      // Crear cliente
      setIdProducto("");
      setIdDisenio("");
      setIdInsumo("");
      setReferencia("");
      setCantidad("");
      setValorVenta("");
      setOperation(1);
      setTitle("Crear Producto");
    } else if (op === 2 && insumo) {
      // Actualizar Cliente
      setIdProducto(insumo.IdProducto);
      setIdDisenio(insumo.IdDisenio);
      setIdInsumo(insumo.IdInsumo);
      setReferencia(insumo.Referencia);
      setCantidad(insumo.Cantidad);
      setValorVenta(insumo.ValorVenta);
      setOperation(2);
      setTitle("Actualizar Datos");
      setErrors({
        IdDisenio: 0,
        IdInsumo: 0,
        Referencia: "",
        Cantidad: 0,
        ValorVenta: 0,
      });
      const errors = {
        Referencia: validateReferencia(insumo.Referencia),
        Cantidad: validateCantidad(insumo.Cantidad),
        ValorVenta: validateValorVenta(insumo.ValorVenta),
      };
      setErrors(errors);
    }
  };

  // funcion para guardar producto
  const guardarProducto = async () => {
    const insumoSeleccionado = Insumos.find(
      (insumo) => insumo.IdInsumo == IdInsumo
    );
  
    if (!insumoSeleccionado) {
      show_alerta("Insumo no encontrado", "error");
      return;
    }
  
    if (parseInt(Cantidad) > insumoSeleccionado.Cantidad) {
      show_alerta("La cantidad de productos no puede ser mayor que la cantidad de insumos disponibles", "error");
      return;
    }
  
    if (parseFloat(ValorVenta) <= parseFloat(insumoSeleccionado.ValorCompra)) {
      show_alerta("El valor de venta debe ser mayor que el valor de compra del insumo", "error");
      return;
    }
  
    if (operation === 1) {
      await enviarSolicitud("POST", {
        IdDisenio,
        IdInsumo,
        Referencia: Referencia.trim(),
        Cantidad: Cantidad,
        ValorVenta: ValorVenta,
      });
    } else if (operation === 2) {
      await enviarSolicitud("PUT", {
        IdProducto,
        IdDisenio,
        IdInsumo,
        Referencia: Referencia.trim(),
        Cantidad: Cantidad,
        ValorVenta: ValorVenta,
      });
    }
  };
  
  

// Función para validar la referencia
const validateReferencia = (value) => {
  if (!value) {
    return "Escribe la referencia";
  }
  // Validar que la referencia siga el patrón TST-001
  if (!/^[A-Z]{3}-\d{3}$/.test(value)) {
    return "La referencia debe ser en el formato AAA-000";
  }
  return "";
};

  // Función para validar la cantidad
  const validateCantidad = (value) => {
    if (!value) {
      return "Escribe la cantidad";
    }
    if (!/^\d+$/.test(value)) {
      return "La cantidad solo puede contener números";
    }
    return "";
  };

  // Función para validar el valorVenta
  const validateValorVenta = (value) => {
    if (!value) {
      return "Escribe el valor de venta";
    }
    if (!/^\d+(\.\d+)?$/.test(value)) {
      return "El valor de venta solo puede contener números y decimales";
    }
    return "";
  };
  

  const handleChangeIdDisenio = (e) => {
    const value = e.target.value;
    setIdDisenio(value);
  };

  const handleChangeIdInsumo = (e) => {
    const value = e.target.value;
    setIdInsumo(value);
  };

  // Función para manejar cambios en la referencia
  const handleChangeReferencia = (e) => {
    let value = e.target.value.trim();
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
  

  // Función para manejar cambios en la cantidad
  const handleChangeCantidad = async (e) => {
    let value = e.target.value;
    setCantidad(value);
    
    const errorMessage = validateCantidad(value);
    setErrors((prevState) => ({
      ...prevState,
      Cantidad: errorMessage,
    }));
  };
  
  // Función para manejar cambios en el valorVenta
  const handleChangeValorVenta = async (e) => {
    let value = e.target.value;
    setValorVenta(value);
  
    const insumoSeleccionado = Insumos.find(
      (insumo) => insumo.IdInsumo === IdInsumo
    );
  
    let errorMessage = '';
    if (insumoSeleccionado && parseFloat(value) <= parseFloat(insumoSeleccionado.ValorCompra)) {
      errorMessage = 'El valor de venta debe ser mayor que el valor de compra del insumo';
    } else {
      errorMessage = validateValorVenta(value);
    }
  
    setErrors((prevState) => ({
      ...prevState,
      ValorVenta: errorMessage,
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
        // Selecciona la barra de progreso y ajusta su estilo
        const progressBar = MySwal.getTimerProgressBar();
        if (progressBar) {
          progressBar.style.backgroundColor = "black";
          progressBar.style.height = "6px";
        }
      },
    });
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
        ? `${url}/${parametros.IdProducto}`
        : url;

    try {
      let respuesta;
      if (metodo === "POST") {
        console.log(parametros);
        respuesta = await axios.post(url, parametros);
      } else if (metodo === "PUT") {
        respuesta = await axios.put(urlRequest, parametros);
      } else if (metodo === "DELETE") {
        respuesta = await axios.delete(urlRequest);
      }

      const msj = respuesta.data.message;
      show_alerta(msj, "success");
      document.getElementById("btnCerrarCliente").click();
      getProductosAdmin();
      if (metodo === "POST") {
        show_alerta("producto creado con éxito", "success", { timer: 2000 });
      } else if (metodo === "PUT") {
        show_alerta("producto actualizado con éxito", "success", {
          timer: 2000,
        });
      } else if (metodo === "DELETE") {
        show_alerta("producto eliminado con éxito", "success", { timer: 2000 });
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

  const deleteInsumo = (IdProducto, Referencia) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar el producto ${Referencia}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      showClass: {
        popup: 'swal2-show',
        backdrop: 'swal2-backdrop-show',
        icon: 'swal2-icon-show'
      },
      hideClass: {
        popup: 'swal2-hide',
        backdrop: 'swal2-backdrop-hide',
        icon: 'swal2-icon-hide'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setIdProducto(IdProducto);
        enviarSolicitud("DELETE", { IdProducto: IdProducto }).then(() => {
          // Calcular el índice del insumo eliminado en la lista filtrada
          const index = filteredproductosAdmin.findIndex(
            (insumo) => insumo.IdProducto === IdProducto
          );
  
          // Determinar la página en la que debería estar el insumo después de la eliminación
          const newPage = Math.ceil((filteredproductosAdmin.length - 1) / itemsPerPage) || 1;
  
          // Establecer la nueva página como la página actual
          setCurrentPage(newPage);
  
          // Actualizar la lista de productosAdmin eliminando el insumo eliminado
          setProductosAdmin((prevproductosAdmin) =>
            prevproductosAdmin.filter((insumo) => insumo.IdProducto !== IdProducto)
          );
  
          show_alerta("El producto fue eliminado correctamente", "success");
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        show_alerta("El producto NO fue eliminado", "info");
      } else if (result.dismiss === Swal.DismissReason.backdrop || result.dismiss === Swal.DismissReason.esc) {
        show_alerta("El producto NO fue eliminado", "info");
      }
    });
  };
  

  const cambiarEstadoProducto = async (IdProducto) => {
    try {
      const productoActual = productosAdmin.find((producto) => producto.IdProducto === IdProducto);

      const nuevoEstado =
        productoActual.Estado === "Activo" ? "Inactivo" : "Activo";

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar el estado del producto ${productoActual.Referencia}?`,
        icon: "question",
        text: `El estado actual del producto es: ${productoActual.Estado}. ¿Desea cambiarlo a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const parametros = {
            IdProducto,
            IdDisenio: productoActual.IdDisenio,
            IdInsumo: productoActual.IdInsumo,
            Referencia: productoActual.Referencia,
            Cantidad: productoActual.Cantidad,
            ValorVenta: productoActual.ValorVenta,
            Estado: nuevoEstado,
          };

          const response = await axios.put(
            `${url}/${IdProducto}`,
            parametros
          );

          if (response.status === 200) {
            setProductosAdmin((prevProducto) =>
              prevProducto.map((producto) =>
                producto.IdProducto === IdProducto
                  ? { ...producto, Estado: nuevoEstado }
                  : producto
              )
            );

            show_alerta("Estado del producto cambiada con éxito", "success", {
              timer: 8000,
            });
          }
        } else {
          show_alerta("No se ha cambiado el estado del producto", "info");
        }
      });
    } catch (error) {
      console.error("Error updating state:", error);
      show_alerta("Error cambiando el estado del producto", "error");
    }
  };
  

  const convertDisenioIdToName = (disenioId) => {
    const disenio = Disenios.find((disenio) => disenio.IdDisenio === disenioId);
    return disenio ? disenio.Fuente : "";
  };

  const convertInsumoIdToName = (insumoId) => {
    const insumo = Insumos.find((insumo) => insumo.IdInsumo === insumoId);
    return insumo ? insumo.Referencia : "";
  };

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Resetear la página actual al cambiar el término de búsqueda
  };

  // Filtrar los productosAdmin según el término de búsqueda
  const filteredproductosAdmin = productosAdmin.filter((insumo) => {
    const colorName = convertDisenioIdToName(insumo.IdDisenio);
    const tallaName = convertInsumoIdToName(insumo.IdInsumo);
    const referencia = insumo.Referencia ? insumo.Referencia.toString() : "";
    const cantidad = insumo.Cantidad ? insumo.Cantidad.toString() : "";
    const valorVenta = insumo.ValorVenta ? insumo.ValorVenta.toString() : "";
    const estado = insumo.Estado ? insumo.Estado.toString() : "";


    return (
      colorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tallaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cantidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      valorVenta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estado.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    );
  });

  // Aplicar paginación a los productosAdmin filtrados
  const totalPages = Math.ceil(filteredproductosAdmin.length / itemsPerPage);
  const currentproductosAdmin = filteredproductosAdmin.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
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
                    <label htmlFor="idDisenio">Diseño del Producto:</label>
                    <select
                      className="form-control"
                      id="idDisenio"
                      value={IdDisenio}
                      onChange={(e) => handleChangeIdDisenio(e)}
                      required
                    >
                      <option value="" disabled>Seleccione un Diseño</option>
                      {Disenios.map((disenio) => (
                        <option key={disenio.IdDisenio} value={disenio.IdDisenio}>
                          {disenio.Fuente}
                        </option>
                      ))}
                    </select>
                    {IdDisenio === "" && (
                      <p className="text-danger">
                        Por favor, seleccione un diseño.
                      </p>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="idInsumo">Insumo del Producto:</label>
                    <select
                      className="form-control"
                      id="idInsumo"
                      value={IdInsumo}
                      onChange={(e) => handleChangeIdInsumo(e)}
                      required
                    >
                      <option value="" disabled>Seleccione un Insumo</option>
                      {Insumos.map((insumo) => (
                        <option key={insumo.IdInsumo} value={insumo.IdInsumo}>
                          {insumo.Referencia}
                        </option>
                      ))}
                    </select>
                    {IdInsumo === "" && (
                      <p className="text-danger">
                        Por favor, seleccione un insumo.
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="Referencia">
                      Referencia del Producto:
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.Referencia ? "is-invalid" : ""
                      }`}
                      id="Referencia"
                      placeholder="Ingrese la referencia del producto"
                      required
                      value={Referencia}
                      onChange={handleChangeReferencia}
                    />
                    {renderErrorMessage(errors.Referencia)}
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="nombreCliente">Cantidad:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.Cantidad ? "is-invalid" : ""
                      }`}
                      id="nombreCliente"
                      placeholder="Ingrese la cantidad del insumo"
                      required
                      value={Cantidad} 
                      onChange={handleChangeCantidad}
                      
                    />
                    {renderErrorMessage(errors.Cantidad)}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label htmlFor="direccionCliente">
                      Valor de la venta del producto:
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.ValorVenta ? "is-invalid" : ""
                      }`}
                      id="direccionCliente"
                      placeholder="Ingrese el valor del producto"
                      required
                      value={ValorVenta}
                      onChange={handleChangeValorVenta}
                      
                    />
                    {renderErrorMessage(errors.ValorVenta)}
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
                  guardarProducto();
                }}
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
          <h1 className="h3 mb-4 text-center text-dark">Gestión de Productos</h1>
          <div className="text-right">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalCliente"
              onClick={() => openModal(1, "", "", "", "", "", "")}
            >
              <i className="fas fa-pencil-alt"></i> Crear Producto
            </button>
          </div>
        </div>

        {/* <!-- Tabla de Productos --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Productos</h6>
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
                    <th>Referencia</th>
                    <th>Diseño</th>
                    <th>Insumo</th>
                    <th>Cantidad</th>
                    <th>Valor de la Venta</th>
                    {/* <th>Estado</th> */}
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentproductosAdmin.map((producto) => (
                    <tr key={producto.IdProducto}>
                      <td>{producto.Referencia}</td>
                      <td>{convertDisenioIdToName(producto.IdDisenio)}</td>
                      <td>{convertInsumoIdToName(producto.IdInsumo)}</td>
                      <td>{producto.Cantidad}</td>
                      <td>{formatCurrency(producto.ValorVenta)}</td>
                      <td>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={producto.Estado === "Activo"}
                              onChange={() =>
                                cambiarEstadoProducto(producto.IdProducto)
                              }
                              className={
                                producto.Estado === "Activo"
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
                          <button
                            className="btn btn-warning btn-sm mr-2"
                            title="Actualizar"
                            data-toggle="modal"
                            data-target="#modalCliente"
                            onClick={() => openModal(2, producto)}
                            disabled={producto.Estado != "Activo"}
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm mr-2"
                            onClick={() =>
                              deleteInsumo(producto.IdProducto, producto.Referencia)
                            }
                            disabled={producto.Estado != "Activo"}
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
        {/* Fin tabla de productosAdmin */}
      </div>
    </>
  );
};
