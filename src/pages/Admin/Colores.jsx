import React from "react";

export const Colores = () => {
  return (
    <>
      {/* <!-- Modal para crear talla --> */}

      <div
        className="modal fade"
        id="ModalCrearProveedor"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalAñadirProveedorLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalAñadirProveedorLabel">
                Crear Talla
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
              {/* <!-- Contenido del formulario para crear Proveedor --> */}
              <form id="crearProveedorForm" className="justify-content-end">
                <div className="form-group">
                  <label htmlFor="nombreProveedor">Nombre del Proveedor:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombreProveedor"
                    placeholder="Ingrese el nombre del Proveedor"
                    required
                    pattern="[A-Za-zÁ-ú\s]+"
                    title="Solo se permiten letras y espacios"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cedulaProveedor">Cédula del Proveedor:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="cedulaProveedor"
                    placeholder="Ingrese la cédula del Proveedor"
                    required
                  />
                  <small id="cedulaHelp" className="form-text text-muted">
                    Ingrese un documento válido (entre 7 y 10 dígitos
                    numéricos).
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="telefonoProveedor">
                    Teléfono del Proveedor:
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="telefonoProveedor"
                    placeholder="Ingrese el teléfono del Proveedor"
                    required
                    pattern="\d*"
                    inputMode="numeric"
                    title="Solo se permiten números"
                  />
                  <small id="telefonoHelp" className="form-text text-muted">
                    Ingrese un número de teléfono válido (10 dígitos).
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="direccionProveedor">
                    Dirección del Proveedor:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="direccionProveedor"
                    placeholder="Ingrese la dirección del Proveedor"
                    required
                  />
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
                    Guardar Proveedor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Fin modal crear proveedor */}


      {/* <!-- Modal de visualización --> */}
      <div
        className="modal fade"
        id="ModalVisualizarProveedor"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="visualizarModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="visualizarModalLabel">
                Detalles del Proveedor
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
                <label htmlFor="nombreProveedor" style={{ color: "black" }}>
                  Nombre del Proveedor:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombreProveedor"
                  placeholder="Nombre del proveedor aquí"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cedulaProveedor" style={{ color: "black" }}>
                  Cédula del proveedor:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="cedulaProveedor"
                  placeholder="Cédula del proveedor aquí "
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefonoProveedor" style={{ color: "black" }}>
                  Télefono del proveedor:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="télefonoProveedor"
                  placeholder="Télefono del proveedor aquí"
                />
              </div>
              <div className="form-group">
                <label htmlFor="direccionProveedor" style={{ color: "black" }}>
                  Dirección del proveedor:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="télefonoProveedor"
                  placeholder="Dirección del proveedor aquí"
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
      {/* <!-- Fin modal de visualización --> */}

      {/* <!-- Inicio de Proveedor --> */}
      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-4 text-center text-dark">Colores</h1>

          <div className="text-center p-3">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#ModalCrearProveedor"
            >
              <i className="fas fa-pencil-alt"></i> Crear Proveedor
            </button>
          </div>
        </div>

        {/* <!-- Tabla Proveedor --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Proveedores</h6>
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
                    <th>Cédula</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Nombre</th>
                    <th>Cédula</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Acciones</th>
                  </tr>
                </tfoot>
                <tbody>
                  <tr>
                    <td>Alejandro</td>
                    <td>567890123</td>
                    <td>555-1234</td>
                    <td>Calle de la Luna 789</td>
                    <td>
                      {/* <!-- Botón de Visualizar con manejo de modal mediante JavaScript --> */}
                      <button
                        type="button"
                        className="btn btn-info"
                        data-toggle="modal"
                        data-target="#ModalVisualizarProveedor"
                      >
                        <i className="fas fa-eye" title="Ver Detalles"></i>
                      </button>

                      <button
                        style={{ display: "none" }}
                        type="button"
                        className="btn btn-success"
                        // onClick="imprimirDocumento()"
                      >
                        <i className="fas fa-print" title="Imprimir"></i>
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>Isabella</td>
                    <td>890123456</td>
                    <td>555-5678</td>
                    <td>Calle de la Luna 783</td>
                    <td>63</td>
                  </tr>
                  <tr>
                    <td>Mateo</td>
                    <td>345678901</td>
                    <td>555-7890</td>
                    <td>Calle de la Luna 589</td>
                    <td>66</td>
                  </tr>
                  <tr>
                    <td>Sophia</td>
                    <td>901234567</td>
                    <td>555-2345</td>
                    <td>Calle de la Luna 789</td>
                    <td>42</td>
                  </tr>
                  <tr>
                    <td>Diego</td>
                    <td>678901234</td>
                    <td>555-6789</td>
                    <td>Calle de la Luna 789</td>
                    <td>33</td>
                  </tr>
                  <tr>
                    <td>Olivia</td>
                    <td>112233445</td>
                    <td>555-8901</td>
                    <td>Calle de la Luna 783</td>
                    <td>61</td>
                  </tr>
                  <tr>
                    <td>Sebastián</td>
                    <td>998877665</td>
                    <td>555-3456</td>
                    <td>Calle de la Luna 781</td>
                    <td>59</td>
                  </tr>
                  <tr>
                    <td>Samuel</td>
                    <td>445566778</td>
                    <td>555-4567</td>
                    <td>Calle de la Luna 786</td>
                    <td>55</td>
                  </tr>
                  <tr>
                    <td>Fernando</td>
                    <td>334455667</td>
                    <td>555-6780</td>
                    <td>Calle de la Luna 784</td>
                    <td>39</td>
                  </tr>
                  <tr>
                    <td>Kevin</td>
                    <td>556677889</td>
                    <td>555-9012</td>
                    <td>Carrera de las Flores 456</td>
                    <td>23</td>
                  </tr>
                  <tr>
                    <td>Cristian</td>
                    <td>765432109</td>
                    <td>555-9012</td>
                    <td>Calle del Sol 123</td>
                    <td>30</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Fin tabla proveedores */}
      </div>
    </>
  );
};
