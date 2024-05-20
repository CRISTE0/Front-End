import React from "react";

export const ProductosA = () => {
  return (
    <>
      {/* <!-- Inicio Modal Ver Productos --> */}
      <div
        className="modal fade"
        id="ModalVisualizarProducto"
        tabIndex="-1"
        aria-labelledby="visualizarModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="visualizarModalLabel">
                Información Producto
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
              <div className="d-flex justify-content-center container">
                <div className="card rounded-1" id="infoImagen">
                  <img
                    className=""
                    src="../assets/img/camisetas/camisa1.jfif"
                    width="220px"
                    height="220px"
                  />
                </div>
              </div>
              <br/>

              {/* <!-- Campos del modal para Visualizar --> */}
              <div className="form-group">
                <label htmlFor="nombreCliente" style={{color: "black"}}>
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombreCliente"
                  defaultValue="Camiseta Espacio"
                />
              </div>
              <div className="form-group">
                <label htmlFor="fechaVenta" style={{color: "black"}}>
                  Talla:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fechaVenta"
                  defaultValue="M"
                />
              </div>
              <div className="form-group">
                <label htmlFor="montoVenta" style={{color: "black"}}>
                  Color:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="montoVenta"
                  defaultValue="Negro"
                />
              </div>
              <div className="form-group">
                <label htmlFor="detallesVenta" style={{color: "black"}}>
                  Precio:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="montoVenta"
                  defaultValue="35.000"
                />
              </div>
              <div className="form-group">
                <label htmlFor="detallesVenta" style={{color: "black"}}>
                  Cantidad:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="montoVenta"
                  defaultValue="4"
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
      {/* <!-- Fin Modal Ver Productos --> */}

      {/* <!--Inicio modal crear camiseta --> */}

      <div
        className="modal fade"
        id="ModalAñadirCamiseta"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title " id="exampleModalLabel">
                Añadir Camiseta
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
              <form action="" className="">
                <div className="d-flex justify-content-center container-input">
                  <input
                    type="file"
                    name="file-5"
                    id="file-5"
                    className="inputfile inputfile-5"
                    data-multiple-caption="{count} archivos seleccionados"
                    multiple
                  />
                  <label htmlFor="file-5">
                    <figure>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="iborrainputfile"
                        width="20"
                        height="17"
                        viewBox="0 0 20 17"
                      >
                        <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                      </svg>
                    </figure>
                    <span className="iborrainputfile">Subir Imágen</span>
                  </label>
                </div>
                <div className="d-flex justify-content-between">
                  <input type="text" placeholder="Nombre Camiseta" />
                  <input type="number" placeholder="Cantidad" />
                </div>

                <div className="d-flex justify-content-between my-4">
                  <select name="Colores" id="" defaultValue="nvcbx">
                    <option defaultValue="">------Elige un color------</option>
                    <option defaultValue="Blanco">Blanco</option>
                    <option defaultValue="Negro">Negro</option>
                  </select>

                  <select name="Colores" id="" defaultValue="nvcbx">
                    <option defaultValue="">-----Elige una Talla----</option>
                    <option defaultValue="Blanco">M</option>
                    <option defaultValue="Negro">L</option>
                    <option defaultValue="Blanco">S</option>
                    <option defaultValue="Negro">XL</option>
                  </select>
                </div>

                <div className="d-flex justify-content-between">
                  <input type="number" placeholder="Precio" />
                </div>
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
              <button type="button" className="btn btn-primary">
                Guardar Camisa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <!--Fin modal crear camiseta --> */}

      {/* <!--Inicio modal editar camiseta --> */}
      <div
        className="modal fade"
        id="ModalAccionesCamiseta"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title " id="exampleModalLabel">
                Editar Camiseta
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
              <form action="" className="">
                <div className="d-flex justify-content-center container my-2">
                  <div className="card rounded-1" id="infoImagen">
                    <img
                      className=""
                      src="../assets/img/camisetas/camisa1.jfif"
                      width="220px"
                      height="220px"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <input type="text" defaultValue="Camiseta Espacio" />
                  <div className="d-flex">
                    <input
                      type="file"
                      name="file-1"
                      id="file-1"
                      className="inputfile inputfile-1"
                      data-multiple-caption="{count} archivos seleccionados"
                      multiple
                    />
                    <label htmlFor="file-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="iborrainputfile"
                        width="20"
                        height="17"
                        viewBox="0 0 20 17"
                      >
                        <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
                      </svg>
                      <span className="iborrainputfile">Seleccionar archivo</span>
                    </label>
                  </div>
                </div>

                <div className="d-flex justify-content-between my-4">
                  <select name="Colores" id="" defaultValue="nvcbx">
                    <option defaultValue="">-----Elige un color-----</option>
                    <option defaultValue="Blanco">Blanco</option>
                    <option defaultValue="Negro">Negro</option>
                  </select>

                  <select name="Colores" id="" defaultValue="nvcbx">
                    <option defaultValue="">-----Elige una Talla-----</option>
                    <option defaultValue="Blanco">M</option>
                    <option defaultValue="Negro">L</option>
                    <option defaultValue="Blanco">S</option>
                    <option defaultValue="Negro">XL</option>
                  </select>
                </div>

                <div className=" d-flex justify-content-between checkbox">
                  <input type="number" defaultValue="4" />
                  <input type="number" defaultValue="35.000" />
                </div>
              </form>
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
            <button type="button" className="btn btn-primary">
              Gurdar Cambios
            </button>
          </div>
        </div>
      </div>
      {/* <!--Fin modal editar camiseta --> */}

      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-4 text-center text-dark">Productos</h1>

          <div className="text-center p-3">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#ModalAñadirCamiseta"
            >
              <i className="fas fa-pencil-alt"></i>Añadir Camiseta
            </button>
          </div>
        </div>

        {/* <!-- DataTales Example --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Productos</h6>
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
                    <th>Nombre</th>
                    <th>Talla</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Nombre</th>
                    <th>Talla</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                    <th>Estado</th>
                  </tr>
                </tfoot>
                <tbody>
                  <tr>
                    <td>Camiseta Espacio</td>
                    <td>M</td>
                    <td>30,000</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-info"
                        data-toggle="modal"
                        data-target="#ModalVisualizarProducto"
                      >
                        <i className="fas fa-eye" title="Ver Detalles"></i>
                      </button>

                      <button
                        type="button"
                        className="btn btn-warning"
                        data-toggle="modal"
                        data-target="#ModalAccionesCamiseta"
                      >
                        <i className="fas fa-edit" title="Imprimir"></i>
                      </button>
                    </td>
                    <td>
                      <div className="btn-group" role="group" aria-label="Acciones">
                        <button
                          id="toggleButton"
                          className="btn btn-success mr-1"
                          // onclick="toggleEstado()"
                        >
                          Activo
                        </button>
                        <div className="dropdown">
                          <button
                            className="btn btn-Light dropdown-toggle"
                            type="button"
                            id="estadoDropdown"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <span className="caret"></span>
                          </button>
                          <div
                            className="dropdown-menu"
                            aria-labelledby="estadoDropdown"
                          >
                            <a
                              className="dropdown-item"
                              href="#"
                              // onclick="cambiarEstado('Activo')"
                            >
                              Activo
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              // onclick="cambiarEstado('Pendiente')"
                            >
                              Pendiente
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              // onclick="cambiarEstado('Inhabilitado')"
                            >
                              Inhabilitado
                            </a>
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
  );
};
