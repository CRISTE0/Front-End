import React from 'react'

export const Compras = () => {
  return (
    <>
      
      {/* <!-- Modal para crear una Compra --> */}

          <div
            className="modal fade"
            id="ModalCrearCompra"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="ModalAñadirCompraLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="ModalAñadirCompraLabel">
                    Crear Compra
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
                  {/* <!-- Contenido del formulario para crear compra --> */}
                  <form>
                    <div className="form-group">
                      <label htmlFor="nombreCliente">Nombre del Proveedor:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="nombreCliente"
                        placeholder="Ingrese el nombre del Proveedor"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fechaCompra">Fecha de la Compra:</label>
                      <input
                        type="date"
                        className="form-control"
                        id="fechaCompra"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="montoCompra">Monto de la Compra:</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="montoCompra"
                        placeholder="Ingrese el monto de la compra"
                        required
                        pattern="\d*"
                        inputMode="numeric"
                        title="Solo se permiten números"
                        max="50000"
                      />
                      <small id="montoCompraHelp" className="form-text text-muted"
                        >Ingrese un monto válido (solo números).</small
                      >
                    </div>
                    {/* <!-- Agrega más campos según tus necesidades --> */}
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    // onclick="guardarCompra()"
                  >
                    Guardar Compra
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Inicio de Compras --> */}
          <div className="container-fluid">
            {/* <!-- Page Heading --> */}
            <div className="d-flex align-items-center justify-content-between">
              <h1 className="h3 mb-4 text-center text-dark">Compras</h1>

              <div className="text-center p-3">
                <button
                  type="button"
                  className="btn btn-dark"
                  data-toggle="modal"
                  data-target="#ModalCrearCompra"
                >
                  <i className="fas fa-pencil-alt"></i> Crear Compra
                </button>
              </div>
            </div>

            {/* <!-- Modal de visualización --> */}
            <div
              className="modal fade"
              id="ModalVisualizarCompra"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="visualizarModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="visualizarModalLabel">
                      Detalles de la Compra
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

                  {/* <!-- Campos del modal para Visualizar --> */}
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="nombreProveedor" style={{color: "black"}}
                        >Nombre del Proveedor de la Compra:</label
                      >
                      <input
                        type="text"
                        className="form-control"
                        id="nombreCompraProveedor"
                        placeholder="Nombre del proveedor aquí"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fechaCompra" style={{color: "black"}}
                        >Fecha de la Compra:</label
                      >
                      <input
                        type="date"
                        className="form-control"
                        id="fechaCompra"
                        placeholder="Fecha de la compra aquí"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="montoCompra" style={{color: "black"}}
                        >Monto de la Compra:</label
                      >
                      <input
                        type="text"
                        className="form-control"
                        id="montoCompra"
                        placeholder="Monto de la compra aquí"
                      />
                    </div>
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

            {/* <!-- Tabla Compras --> */}
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Compras</h6>
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
                    <tfoot>
                      <tr>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Acciones</th>
                      </tr>
                    </tfoot>
                    <tbody>
                      <tr>
                        <td>Alejandro</td>
                        <td>2011/04/25</td>
                        <td>30,000</td>
                        <td>
                          {/* <!-- Botón de Visualizar con manejo de modal mediante JavaScript --> */}
                          <button
                            type="button"
                            className="btn btn-info"
                            data-toggle="modal"
                            data-target="#ModalVisualizarCompra"
                          >
                            <i className="fas fa-eye" title="Ver Detalles"></i>
                          </button>

                          <button
                            style={{display: "none"}}
                            type="button"
                            className="btn btn-success"
                            // onclick="imprimirDocumento()"
                          >
                            <i className="fas fa-print" title="Imprimir"></i>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>Isabella</td>
                        <td>2021/08/25</td>
                        <td>30,000</td>
                        <td>63</td>
                      </tr>
                      <tr>
                        <td>Mateo</td>
                        <td>2021/11/21</td>
                        <td>30,000</td>
                        <td>66</td>
                      </tr>
                      <tr>
                        <td>Sophia</td>
                        <td>2022/08/21</td>
                        <td>50,000</td>
                        <td>42</td>
                      </tr>
                      <tr>
                        <td>Diego</td>
                        <td>2021/08/25</td>
                        <td>30,000</td>
                        <td>33</td>
                      </tr>
                      <tr>
                        <td>Olivia</td>
                        <td>2021/01/21</td>
                        <td>20,000</td>
                        <td>61</td>
                      </tr>
                      <tr>
                        <td>Sebastián</td>
                        <td>2021/12/27</td>
                        <td>30,000</td>
                        <td>59</td>
                      </tr>
                      <tr>
                        <td>Samuel</td>
                        <td>2021/12/24</td>
                        <td>20,000</td>
                        <td>55</td>
                      </tr>
                      <tr>
                        <td>Fernando</td>
                        <td>2021/12/31</td>
                        <td>20,000</td>
                        <td>39</td>
                      </tr>
                      <tr>
                        <td>Kevin</td>
                        <td>2021/12/30</td>
                        <td>20,000</td>
                        <td>23</td>
                      </tr>
                      <tr>
                        <td>Cristian</td>
                        <td>2021/12/24</td>
                        <td>20,000</td>
                        <td>30</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>


    </>
  )
}

