import React from 'react'

export const Ventas = () => {
  return (
    <>

{/* <!-- Modal para crear una Venta --> */}
        <div className="modal fade" id="ModalCrearVenta" tabIndex="-1" role="dialog" aria-labelledby="ModalAñadirVenta"
          aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="ModalAñadirVenta">Crear Venta</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* <!-- Contenido del formulario para crear venta --> */}
                <form id="crearVentaForm">
                  <div className="form-group">
                    <label htmlFor="nombreCliente">Nombre del Cliente:</label>
                    <input type="text" className="form-control" id="nombreCliente"
                      placeholder="Ingrese el nombre del cliente" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fechaVenta">Fecha de la Venta:</label>
                    <input type="date" className="form-control" id="fechaVenta" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="montoVenta">Monto de la Venta:</label>
                    <input type="number" className="form-control" id="montoVenta" placeholder="Ingrese el monto de la venta"
                      max="50000" />
                  </div>
                  {/* <!-- Agrega más campos según tus necesidades --> */}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Guardar Venta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Inicio de Ventas --> */}
        <div className="container-fluid">
          {/* <!-- Page Heading --> */}
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="h3 mb-4 text-center text-dark">Ventas</h1>

            <div className="text-center p-3">
              <button type="button" className="btn btn-dark" data-toggle="modal" data-target="#ModalCrearVenta">
                <i className="fas fa-pencil-alt"></i> Crear Venta
              </button>
            </div>
          </div>

          {/* <!-- Modal de visualización --> */}
          <div className="modal fade" id="ModalVisualizarVenta" tabIndex="-1" role="dialog"
            aria-labelledby="visualizarModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="visualizarModalLabel">
                    Detalles de la Venta
                  </h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                {/* <!-- Campos del modal para Visualizar --> */}
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="nombreCliente" style={{color: "black"}}>Nombre del Cliente:</label>
                    <input type="text" className="form-control" id="nombreCliente" placeholder="Nombre del cliente aquí" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fechaVenta" style={{color: "black"}}>Fecha de la Venta:</label>
                    <input type="date" className="form-control" id="fechaVenta" placeholder="Fecha de la venta aquí" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="montoVenta" style={{color: "black"}}>Cantidad de los productos::</label>
                    <input type="text" className="form-control" id="montoVenta" placeholder="Monto de la venta aquí" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="montoVenta" style={{color: "black"}}>Monto de la Venta:</label>
                    <input type="text" className="form-control" id="montoVenta" placeholder="Monto de la venta aquí" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="montoVenta" style={{color: "black"}}>Subtotal:</label>
                    <input type="text" className="form-control" id="montoVenta" placeholder="Monto de la venta aquí" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="montoVenta" style={{color: "black"}}>Descuento:</label>
                    <input type="text" className="form-control" id="montoVenta" placeholder="Monto de la venta aquí" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="montoVenta" style={{color: "black"}}>IVA:</label>
                    <input type="text" className="form-control" id="montoVenta" placeholder="Monto de la venta aquí" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="detallesVenta" style={{color: "black"}}>Detalles de la Venta:</label>
                    <textarea className="form-control" id="detallesVenta" style={{color: "black"}}
                      placeholder="Ingresa detalles de la venta aquí..."></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Tabla Ventas --> */}
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Ventas</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Acciones</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th>Nombre</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Acciones</th>
                      <th>Estado</th>
                    </tr>
                  </tfoot>
                  <tbody>
                    <tr>
                      <td>Alejandro</td>
                      <td>2011/04/25</td>
                      <td>30,000</td>
                      <td>
                        {/* <!-- Botón de Visualizar con manejo de modal mediante JavaScript --> */}
                        <button type="button" className="btn btn-info" data-toggle="modal"
                          data-target="#ModalVisualizarVenta">
                          <i className="fas fa-eye" title="Ver Detalles"></i>
                        </button>

                        <button style={{display: "none"}} type="button" className="btn btn-success">
                          <i className="fas fa-print" title="Imprimir"></i>
                        </button>
                      </td>
                      <td>
                        <div className="btn-group" role="group" aria-label="Acciones">
                          {/* <button id="toggleButton" className="btn btn-success mr-1" onclick="toggleEstado()">
                            Activo
                          </button> */}
                          <div className="dropdown">
                            <button className="btn btn-light dropdown-toggle" type="button" id="estadoDropdown"
                              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <span className="caret"></span>
                            </button>
                            <div className="dropdown-menu" aria-labelledby="estadoDropdown">
                              {/* <a className="dropdown-item" href="#" onclick="cambiarEstado('Activo')">Activo</a>
                              <a className="dropdown-item" href="#" onclick="cambiarEstado('Pendiente')">Pendiente</a>
                              <a className="dropdown-item" href="#" onclick="cambiarEstado('Inhabilitado')">Inhabilitado</a> */}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Isabella</td>
                      <td>2021/08/25</td>
                      <td>30,000</td>
                      <td>63</td>
                      <td>Activo|Pendiente|Inhabilitado</td>
                    </tr>
                    <tr>
                      <td>Mateo</td>
                      <td>2021/11/21</td>
                      <td>30,000</td>
                      <td>66</td>
                      <td>Activo|Pendiente|Inhabilitado</td>
                    </tr>
                    <tr>
                      <td>Sophia</td>
                      <td>2022/08/21</td>
                      <td>50,000</td>
                      <td>22</td>
                      <td>Activo|Pendiente|Inhabilitado</td>
                    </tr>
                    <tr>
                      <td>Diego</td>
                      <td>2021/08/25</td>
                      <td>30,000</td>
                      <td>33</td>
                      <td>Activo|Pendiente|Inhabilitado</td>
                    </tr>
                    <tr>
                      <td>Olivia</td>
                      <td>2021/01/21</td>
                      <td>30,000</td>
                      <td>61</td>
                      <td>Activo|Pendiente|Inhabilitado</td>
                    </tr>
                    <tr>
                      <td>Sebastián</td>
                      <td>2021/12/27</td>
                      <td>40,000</td>
                      <td>59</td>
                      <td>Activo|Pendiente|Inhabilitado</td>
                    </tr>
                    <tr>
                      <td>Alejandro</td>
                      <td>2021/12/24</td>
                      <td>40,000</td>
                      <td>55</td>
                      <td>Activo|Pendiente|Inhabilitado</td>
                    </tr>
                    <tr>
                      <td>Isabella</td>
                      <td>2021/12/31</td>
                      <td>40,000</td>
                      <td>39</td>
                      <td>Activo|Pendiente|Inhabilitado</td>
                    </tr>
                    <tr>
                      <td>Kevin</td>
                      <td>2021/12/30</td>
                      <td>50,000</td>
                      <td>23</td>
                      <td>Activo|Pendiente|Inhabilitado</td>
                    </tr>
                    <tr>
                      <td>Cristian</td>
                      <td>2021/12/24</td>
                      <td>50,000</td>
                      <td>30</td>
                      <td>Activo|Pendiente|Inhabilitado</td>
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

