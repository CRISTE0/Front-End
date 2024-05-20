import React from "react";

export const Usuarios = () => {
  return (
    <>
      {/* <!-- Modal para crear usuario --> */}

      <div
        className="modal fade"
        id="crearUsuarioModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Crear Usuario
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Cerrar"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {/* <!-- Formulario para crear usuario --> */}
              <form id="crearUsuarioForm" className="justify-content-end">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre del Usuario:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    placeholder="Ingresa el nombre del Usuario"
                    required
                    pattern="[A-Za-zÁ-ú\s]+"
                    title="Solo se permiten letras y espacios"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="correo">Correo del Usuario:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="correo"
                    placeholder="Ingresa el correo del Usuario"
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  />
                  <small id="emailHelp" className="form-text text-muted">
                    Ingresa un correo electrónico válido.
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="contrasena">Contraseña del Usuario:</label>
                  <input
                    type="password"
                    className="form-control"
                    id="contrasena"
                    placeholder="Ingresa la contraseña del Usuario"
                    required
                    minLength="6"
                  />
                  <small id="passwordHelp" className="form-text text-muted">
                    La contraseña debe tener al menos 6 caracteres.
                  </small>
                </div>

                {/* <!-- Línea divisoria --> */}
                <hr className="my-4" />

                {/* <!-- Botones dentro del formulario --> */}
                <div className="text-right">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Guardar Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Inicio de Usuarios --> */}
      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-4 text-center text-dark">Usuarios</h1>

          <div className="text-center p-3">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#crearUsuarioModal"
            >
              <i className="fas fa-pencil-alt"></i> Crear Usuario
            </button>
          </div>
        </div>

        {/* <!-- Tabla Usuarios --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Usuarios</h6>
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
                    <th>Correo</th>
                    <th>Contraseña</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Contraseña</th>
                    <th>Estado</th>
                  </tr>
                </tfoot>
                <tbody>
                  <tr>
                    <td>Alejandro</td>
                    <td>lejo45@gmail.com</td>
                    <td>4545456</td>
                    <td>
                      <div className="btn-group" role="group" aria-label="Acciones">
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
                    <td>isa69@gmail.com</td>
                    <td>6446446</td>
                    <td>Activo|Inactivo</td>
                  </tr>
                  <tr>
                    <td>Mateo</td>
                    <td>Matrox84@gmail.com</td>
                    <td>6464553</td>
                    <td>Activo|Inactivo</td>
                  </tr>
                  <tr>
                    <td>Sophia</td>
                    <td>Sophia888@gmail.com</td>
                    <td>558461</td>
                    <td>Activo|Inactivo</td>
                  </tr>
                  <tr>
                    <td>Diego</td>
                    <td>diego454@gmail.com</td>
                    <td>55468</td>
                    <td>Activo|Inactivo</td>
                  </tr>
                  
                 
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- /.container-fluid --> */}
    </>
  );
};
