import React from "react";

export const Clientes = () => {
  return (
    <>
      {/* <!-- Inicio modal crear cliente --> */}
      <div
        className="modal fade"
        id="ModalCrearCliente"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalAñadirCliente"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalAñadirCliente">
                Crear Cliente
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
                <div className="form-group">
                  <label htmlFor="nombreCliente">Nombre del Cliente:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombreCliente"
                    placeholder="Ingrese el nombre del cliente"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="direccionCliente">
                    Dirección del Cliente:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="direccionCliente"
                    placeholder="Ingrese la dirección del cliente"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefonoCliente">Teléfono del Cliente:</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="telefonoCliente"
                    placeholder="Ingrese el teléfono del cliente"
                    required
                    pattern="[0-9]{10}"
                  />
                  <small className="form-text text-muted">
                    Ingrese un número de teléfono válido (10 dígitos).
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="documentoCliente">
                    Documento del Cliente:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="documentoCliente"
                    placeholder="Ingrese el documento del cliente"
                    required
                    pattern="[0-9]{7,10}"
                  />
                  <small className="form-text text-muted">
                    Ingrese un documento válido (entre 7 y 10 dígitos
                    numéricos).
                  </small>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Guardar Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Fin modal clientes --> */}
      {/* <!-- Modal actualizar datos cliente --> */}
      <div
        className="modal fade"
        id="actualizarModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="actualizarModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="actualizarModalLabel">
                Actualizar Datos
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
              {/* <!-- Contenido del formulario de actualización --> */}
              <form id="actualizarForm">
                {/* <!-- Campo de actualización de nombre --> */}
                <div className="form-group">
                  <label htmlFor="nuevoNombre">Nuevo Nombre:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nuevoNombre"
                    placeholder="Ingresa nuevo nombre"
                    required
                  />
                </div>

                {/* <!-- Campo de actualización de dirección --> */}
                <div className="form-group">
                  <label htmlFor="nuevaDireccion">Nueva Dirección:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nuevaDireccion"
                    placeholder="Ingresa nueva dirección"
                    required
                  />
                </div>

                {/* <!-- Campo de actualización de teléfono --> */}
                <div className="form-group">
                  <label htmlFor="nuevoTelefono">Nuevo Teléfono:</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="nuevoTelefono"
                    placeholder="Ingresa nuevo telefono"
                    required
                    pattern="[0-9]{10}"
                  />
                  <small className="form-text text-muted">
                    Ingrese un número de teléfono válido (10 dígitos).
                  </small>
                </div>

                {/* <!-- Otros campos de actualización... --> */}

                {/* <!-- Botones para enviar el formulario o cancelar --> */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Fin modal de actualizar datos cliente --> */}

      {/* <!-- Inicio de Clientes --> */}
      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-4 text-center text-dark">Clientes</h1>

          <div className="text-center p-3">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#ModalCrearCliente"
            >
              <i className="fas fa-pencil-alt"></i> Crear Cliente
            </button>
          </div>
        </div>

        {/* <!-- Tabla Clientes --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Clientes</h6>
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
                    <th>Dirección</th>
                    <th>Telefono</th>
                    <th>Documento</th>
                    <th>Acciones</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Telefono</th>
                    <th>Documento</th>
                    <th>Acciones</th>
                    <th>Estado</th>
                  </tr>
                </tfoot>
                <tbody>
                  <tr>
                    <td>Johan</td>
                    <td>Calle 98</td>
                    <td>3015497670</td>
                    <td>1025645352</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-warning"
                        title="Actualizar"
                        data-toggle="modal"
                        data-target="#actualizarModal"
                      >
                        <i className="fas fa-sync-alt"></i>
                      </button>
                    </td>
                    <td>
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Acciones"
                      >
                        <button
                          id="toggleClienteButton"
                          className="btn btn-success mr-1"
                          // onclick="toggleEstadoCliente()"
                        >
                          Activo
                        </button>
                        <div className="dropdown">
                          <button
                            className="btn btn-light dropdown-toggle"
                            type="button"
                            id="estadoClienteDropdown"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <span className="caret"></span>
                          </button>
                          <div
                            className="dropdown-menu"
                            aria-labelledby="estadoClienteDropdown"
                          >
                            <a
                              className="dropdown-item"
                              href="#"
                              // onclick="cambiarEstadoCliente('Activo')"
                            >
                              Activo
                            </a>
                            <a
                              className="dropdown-item"
                              href="#"
                              // onclick="cambiarEstadoCliente('Inactivo')"
                            >
                              Inactivo
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Isabella</td>
                    <td>Calle 34</td>
                    <td>324567890</td>
                    <td>109863456</td>
                    <td>Actualizar</td>
                    <td>Estado</td>
                  </tr>
                  <tr>
                    <td>Mateo</td>
                    <td>2021/11/21</td>
                    <td>30,000</td>
                    <td>66</td>
                    <td>Activo|Pendiente|Inhabilitado</td>
                    <td>Estado</td>
                  </tr>
                  <tr>
                    <td>Sophia</td>
                    <td>2022/08/21</td>
                    <td>50,000</td>
                    <td>22</td>
                    <td>Activo|Pendiente|Inhabilitado</td>
                    <td>Estado</td>
                  </tr>
                  <tr>
                    <td>Diego</td>
                    <td>2021/08/25</td>
                    <td>30,000</td>
                    <td>33</td>
                    <td>Activo|Pendiente|Inhabilitado</td>
                    <td>Estado</td>
                  </tr>
                  <tr>
                    <td>Olivia</td>
                    <td>2021/01/21</td>
                    <td>30,000</td>
                    <td>61</td>
                    <td>Activo|Pendiente|Inhabilitado</td>
                    <td>Estado</td>
                  </tr>
                  <tr>
                    <td>Sebastián</td>
                    <td>2021/12/27</td>
                    <td>40,000</td>
                    <td>59</td>
                    <td>Activo|Pendiente|Inhabilitado</td>
                    <td>Estado</td>
                  </tr>
                  <tr>
                    <td>Alejandro</td>
                    <td>2021/12/24</td>
                    <td>40,000</td>
                    <td>55</td>
                    <td>Activo|Pendiente|Inhabilitado</td>
                    <td>Estado</td>
                  </tr>
                  <tr>
                    <td>Isabella</td>
                    <td>2021/12/31</td>
                    <td>40,000</td>
                    <td>39</td>
                    <td>Activo|Pendiente|Inhabilitado</td>
                    <td>Estado</td>
                  </tr>
                  <tr>
                    <td>Kevin</td>
                    <td>2021/12/30</td>
                    <td>50,000</td>
                    <td>23</td>
                    <td>Activo|Pendiente|Inhabilitado</td>
                    <td>Estado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Fin tabla clientes */}
      </div>
    </>
  );
};
