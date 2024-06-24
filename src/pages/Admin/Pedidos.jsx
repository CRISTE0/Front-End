import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../assets/js/Pagination";
import SearchBar from "../../assets/js/SearchBar";

export const Pedidos = () => {
  const url = "http://localhost:3000/api/pedidos";
  const [pedidos, setPedidos] = useState([]);
  const [IdPedido, setIdPedido] = useState("");
  const [Clientes, setClientes] = useState([]);
  const [IdCliente, setIdCliente] = useState("");
  const [Fecha, setFecha] = useState("");
  const [Total, setTotal] = useState("");
  const [estadosPedidos, setEstadosPedidos] = useState("");
  const [Detalles, setDetalles] = useState([
    { IdProducto: "", cantidad: "", precio: "" },
  ]);
  const [Productos, setProductos] = useState([]);
  const [showDetalleField, setShowDetalleField] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    getEstadosPedidos();
    getPedidos();
    getProductos();
    getClientes();
  }, []);

  const getPedidos = async () => {
    try {
      const respuesta = await axios.get(url);
      setPedidos(respuesta.data);
    } catch (error) {
      show_alerta("Error al obtener los pedidos", "error");
    }
  };

  const getClienteName = (idCliente) => {
    const cliente = Clientes.find(
      (prov) => prov.IdCliente === idCliente
    );
    return cliente ? cliente.NombreApellido : "Cliente no encontrado";
  };

  const getProductoName = (idProducto) => {
    const producto = Productos.find((item) => item.IdProducto === idProducto);
    return producto ? producto.Referencia : "Producto no encontrado";
  };

  const convertEstadoPedidoIdToName = (estadoPedidoId) => {
    const estadoPedido = estadosPedidos.find((pedido) => pedido.IdEstadoPedido === estadoPedidoId);
    return estadoPedido ? estadoPedido.NombreEstado : "";
  };

  const getClientes = async () => {
    try {
      const respuesta = await axios.get(
        "http://localhost:3000/api/clientes"
      );
      const ClientesActivos = respuesta.data.filter(
        (cliente) => cliente.Estado === "Activo"
      );
      setClientes(ClientesActivos);
    } catch (error) {
      show_alerta("Error al obtener los Clientes", "error");
    }
  };

  const getProductos = async () => {
    try {
      const respuesta = await axios.get("http://localhost:3000/api/productos");
      const productosActivos = respuesta.data.filter(
        (producto) => producto.Estado === "Activo"
      );
      setProductos(productosActivos);
    } catch (error) {
      show_alerta("Error al obtener los Productos", "error");
    }
  };

  const getEstadosPedidos = async () => {
    try {
      const respuesta = await axios.get("http://localhost:3000/api/estadosPedidos");

      setEstadosPedidos(respuesta.data);
    } catch (error) {
      show_alerta("Error al obtener los Productos", "error");
    }
  };

  // Calcular el precio total de la compra en función de los detalles
  const totalCompra =
    Detalles && Detalles.length > 0
      ? Detalles.reduce((total, detalle) => {
          return total + (detalle.cantidad * detalle.precio || 0);
        }, 0)
      : 0;

  const handleDetalleCompra = async (idPedido) => {
    try {
      const respuesta = await axios.get(
        `http://localhost:3000/api/pedidos/${idPedido}`
      );
      const pedido = respuesta.data;
      console.log("Detalle de Pedido:", pedido);
      setPedidoSeleccionado(pedido);
      $("#modalDetalleCompra").modal("show");
    } catch (error) {
      show_alerta("Error al obtener los detalles de la compra", "error");
    }
  };

  const openModal = () => {
    setIdPedido(""); // Resetear el IdCompra al abrir el modal para indicar una nueva compra
    setIdCliente("");
    setFecha("");
    setTotal("");
    setDetalles([]);
    setOperation(1); // Indicar que es una operación de creación
    setErrors({});
    setTitle("Registrar Pedido");
    setShowDetalleField(false); // Ocultar el campo de detalles al abrir el modal
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "IdCliente") {
      setIdCliente(value);
    } else if (name === "Fecha") {
      setFecha(value);
    } else if (name === "Total") {
      setTotal(value);
    }
  };

  const [alertas, setAlertas] = useState([]);

  const hayAlertas = () => {
    return alertas.some(alerta => alerta !== '');
  };
  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDetalles = [...Detalles];
    updatedDetalles[index][name] = value;
    setDetalles(updatedDetalles);

    // Actualizar el precio en el insumo seleccionado
    const selectedProductoId = updatedDetalles[index].IdProducto;
    console.log(selectedProductoId);
    
    const selectedInsumoIndex = Productos.findIndex(
      (producto) => producto.IdProducto === selectedProductoId
    );


    const selectedProduct = Productos.find(producto => producto.IdProducto == selectedProductoId);
    console.log(selectedProduct);
    console.log(Productos);

    if (selectedProductoId) {
      // Actualizar el precio en el detalle
      updatedDetalles[index].precio = selectedProduct.ValorVenta;
    }
  
    if (selectedProduct) {
      console.log("entro selectedP");
      // Validar la cantidad
      const newAlertas = [...alertas]; 
      if (parseInt(value) > selectedProduct.Cantidad) {
        newAlertas[index] = 'La cantidad ingresada es mayor que la cantidad disponible';
        setAlertas(newAlertas);
      } else {
        // const newAlertas = [...alertas];
        // newAlertas[index] = null;
        // setAlertas(newAlertas);
        newAlertas[index] = '';
      }
      setAlertas(newAlertas);

      console.log(alertas);

      console.log(alertas.length);
    }



    if (selectedInsumoIndex !== -1) {
      const updatedInsumos = [...Productos];
      updatedInsumos[selectedInsumoIndex].ValorCompra = value;
      setProductos(updatedInsumos);
    }

    
    

  };



  const addDetail = () => {
    // Crear un nuevo detalle con valores predeterminados
    const newDetail = {
      IdProducto: "",
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

    if (!IdCliente) {
      errorMessage = "Selecciona un cliente";
      setErrors({ IdCliente: errorMessage });
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

    if (hayAlertas()) {
      return;
    }

    enviarSolicitud("POST", {
      IdCliente: IdCliente,
      Fecha: Fecha,
      Total: totalCompra,
      Detalles: Detalles,
      IdEstadoPedido:1
    });
  };

  const enviarSolicitud = async (metodo, parametros) => {
    console.log(parametros);
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
      getPedidos();
      getProductos();

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
          getPedidos();

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
  const filteredCompras = pedidos.filter((compra) =>
    Object.values(compra).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Apply pagination to the filtered purchases
  const totalPages = Math.ceil(filteredCompras.length / itemsPerPage);
  const currentPedidos = filteredCompras.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Inicio modal de crear pedido con su detalle */}
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
                <label>Cliente:</label>
                <select
                  className={`form-control ${
                    errors.IdCliente ? "is-invalid" : ""
                  }`}
                  name="IdCliente"
                  value={IdCliente}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un cliente</option>
                  {Clientes.map((cliente) => (
                    <option
                      key={cliente.IdCliente}
                      value={cliente.IdCliente}
                    >
                      {cliente.NombreApellido}
                    </option>
                  ))}
                </select>
                {renderErrorMessage(errors.IdCliente)}
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
                      <th>Producto</th>
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
                            name="IdProducto"
                            value={detalle.IdProducto}
                            onChange={(e) => handleDetailChange(index, e)}
                          >
                            <option value="">Selecciona un producto</option>
                            {Productos.filter(
                              (producto) =>
                                !Detalles.some(
                                  (det) => det.IdProducto === producto.IdProducto
                                )
                            ).map((producto) => (
                              <option
                                key={producto.IdProducto}
                                value={producto.IdProducto}
                              >
                                {producto.Referencia}
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
                            {alertas[index] && <span style={{ color: 'red' }} className="alerta">{alertas[index]}</span>}
                        </td>

                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name="precio"
                            placeholder="Precio"
                            value={detalle.precio}
                            onChange={(e) => handleDetailChange(index, e)}
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
                Detalle del Pedido
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
              {pedidoSeleccionado && (
                <>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label>Proveedor:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={getClienteName(pedidoSeleccionado.IdCliente)}
                        disabled
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Fecha:</label>
                      <input
                        type="date"
                        className="form-control"
                        value={pedidoSeleccionado.Fecha}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedidoSeleccionado.DetallesPedidosProductos.map(
                          (detalle, index) => (
                            <tr key={index}>
                              <td>{getProductoName(detalle.IdProducto)}</td>
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
                      value={pedidoSeleccionado.Total}
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
          <h1 className="h3 mb-4 text-center text-dark">Pedidos</h1>
          <div className="text-right">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalCompras"
              onClick={() => Clientes.length > 0 && openModal(1)}
            >
              <i className="fas fa-pencil-alt"></i> Añadir Pedido
            </button>
          </div>
        </div>

        {/* <!-- Tabla de Pedidos --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Pedidos</h6>
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
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPedidos.map((compra) => (
                    <tr
                      key={compra.IdPedido}
                      className={
                        compra.Estado === "Cancelado" ? "table-secondary" : ""
                      }
                    >
                      <td>{getClienteName(compra.IdCliente)}</td>

                      <td>
                        {new Date(compra.Fecha).toLocaleDateString("es-ES")}
                      </td>

                      <td>{compra.Total}</td>

                      <td>{convertEstadoPedidoIdToName(compra.IdEstadoPedido)}</td>

                      <td>
                        {compra.Estado === "Cancelado" ? (
                          <button className="btn btn-secondary mr-2" disabled>
                            <i className="fas fa-times-circle"></i>
                          </button>
                        ) : (
                          <button
                            onClick={() => cancelCompra(compra.IdPedido)}
                            className="btn btn-danger mr-2"
                          >
                            <i className="fas fa-times-circle"></i>
                          </button>
                        )}

                        <button
                          onClick={() => handleDetalleCompra(compra.IdPedido)}
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
