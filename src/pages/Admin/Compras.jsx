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
  const [Detalles, setDetalles] = useState([
    { IdInsumo: "", cantidad: "", precio: "" },
  ]);
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
      setCompras(respuesta.data);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "IdProveedor") {
      setIdProveedor(value);
    } else if (name === "Fecha") {
      setFecha(value);
    } else if (name === "Total") {
      setTotal(value);
    }
  };

  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDetalles = [...Detalles];
    updatedDetalles[index][name] = value;
    setDetalles(updatedDetalles);

    // Actualizar el precio en el insumo seleccionado
    const selectedInsumoId = updatedDetalles[index].IdInsumo;
    const selectedInsumoIndex = Insumos.findIndex(
      (insumo) => insumo.IdInsumo === selectedInsumoId
    );
    if (selectedInsumoIndex !== -1) {
      const updatedInsumos = [...Insumos];
      updatedInsumos[selectedInsumoIndex].ValorCompra = value;
      setInsumos(updatedInsumos);
    }
  };

  const addDetail = () => {
    // Crear un nuevo detalle con valores predeterminados
    const newDetail = {
      IdInsumo: "",
      cantidad: "",
      precio: "",
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

  const validar = () => {
    let errorMessage = "";

    if (!IdProveedor) {
      errorMessage = "Selecciona un proveedor";
      setErrors({ IdProveedor: errorMessage });
      return;
    }

    if (Detalles.length === 0) {
      errorMessage = "Agrega al menos un detalle de compra";
      setErrors({ Detalles: errorMessage });
      return;
    }

    if (Detalles.some((detalle) => !detalle.cantidad || !detalle.precio)) {
      errorMessage =
        "Ingresa una cantidad y un precio válido para cada detalle";
      setErrors({ Detalles: errorMessage });
      return;
    }

    enviarSolicitud("POST", {
      IdProveedor: IdProveedor,
      Fecha: Fecha,
      Total: Total,
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
      {/* Inicio modal de crear compra con su detalle */}
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
              <div className="form-group">
                <label>Proveedor:</label>
                <select
                  className={`form-control ${
                    errors.IdProveedor ? "is-invalid" : ""
                  }`}
                  name="IdProveedor"
                  value={IdProveedor}
                  onChange={handleChange}
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
                {renderErrorMessage(errors.IdProveedor)}
              </div>

              <div className="form-group">
                <label>Fecha:</label>
                <input
                  type="date"
                  className={`form-control ${errors.Fecha ? "is-invalid" : ""}`}
                  id="Fecha"
                  name="Fecha"
                  value={Fecha}
                  onChange={handleChange}
                />
                {renderErrorMessage(errors.Fecha)}
              </div>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Insumo</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Detalles.map((detalle, index) => (
                      <tr key={index}>
                        <td>
                          <select
                            className="form-control"
                            name="IdInsumo"
                            value={detalle.IdInsumo}
                            onChange={(e) => handleDetailChange(index, e)}
                          >
                            <option value="">Selecciona un insumo</option>
                            {Insumos.filter(
                              (insumo) =>
                                !Detalles.some(
                                  (det) => det.IdInsumo === insumo.IdInsumo
                                )
                            ).map((insumo) => (
                              <option
                                key={insumo.IdInsumo}
                                value={insumo.IdInsumo}
                              >
                                {insumo.Referencia}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="cantidad"
                            placeholder="Cantidad"
                            value={detalle.cantidad}
                            onChange={(e) => handleDetailChange(index, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="precio"
                            placeholder="Precio"
                            value={detalle.precio}
                            onChange={(e) => handleDetailChange(index, e)}
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
                  type="number"
                  className="form-control"
                  id="Total"
                  name="Total"
                  value={totalCompra}
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
                Cerrar
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
                        </tr>
                      </thead>
                      <tbody>
                        {compraSeleccionada.DetallesCompras.map(
                          (detalle, index) => (
                            <tr key={index}>
                              <td>{getInsumoName(detalle.IdInsumo)}</td>
                              <td>{detalle.Cantidad}</td>
                              <td>{detalle.Precio}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="form-group">
                    <label>Total:</label>
                    <input
                      type="number"
                      className="form-control"
                      value={compraSeleccionada.Total}
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
          <h1 className="h3 mb-4 text-center text-dark">Compras</h1>
          <div className="text-right">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalCompras"
              onClick={() => proveedores.length > 0 && openModal(1)}
            >
              <i className="fas fa-pencil-alt"></i> Añadir Compra
            </button>
          </div>
        </div>

        {/* <!-- Tabla de Compras --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Compras</h6>
          </div>
          <div className="card-body">
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
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
                      <td>
                        {new Date(compra.Fecha).toLocaleDateString("es-ES")}
                      </td>
                      <td>{compra.Total}</td>
                      <td>
                        {compra.Estado === "Cancelado" ? (
                          <button className="btn btn-secondary mr-2" disabled>
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
                          }`}
                          disabled={compra.Estado === "Cancelado"}
                          data-toggle="modal"
                          data-target="#modalDetalleCompra"
                        >
                          <i className="fas fa-eye"></i>
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
