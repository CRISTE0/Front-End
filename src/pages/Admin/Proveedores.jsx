import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alerta } from "../../assets/js/functions";

export const Proveedores = () => {
  let url = "http://localhost:3000/api/proveedores";
  const [Proveedores, setProveedores] = useState([]);
  const [IdProveedor, setIdProveedor] = useState("");
  const [TipoDocumento, setTipoDocumento] = useState("Cédula");
  const [NroDocumento, setNroDocumento] = useState("");
  const [NombreApellido, setNombreApellido] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [Direccion, setDireccion] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getProveedores();
  }, []);

  const getProveedores = async () => {
    const respuesta = await axios.get(url);
    setProveedores(respuesta.data);
  };

  const openModal = (
    op,
    IdProveedor = "",
    TipoDocumento = "Cédula",
    NroDocumento = "",
    NombreApellido = "",
    Telefono = "",
    Direccion = ""
  ) => {
    setIdProveedor(IdProveedor);
    setTipoDocumento(TipoDocumento);
    setNroDocumento(NroDocumento);
    setNombreApellido(NombreApellido);
    setTelefono(Telefono);
    setDireccion(Direccion);
    setOperation(op);
    setTitle(op === 1 ? "Crear Proveedor" : "Actualizar Datos");
  };

  const validarDireccion = (direccion) => {
    return /^[a-zA-Z0-9#-\s]*$/.test(direccion);
  };

  const handleChangeDireccion = (e) => {
    const direccion = e.target.value;
    if (validarDireccion(direccion)) {
      setDireccion(direccion);
    } else {
      show_alerta(
        "La dirección solo puede contener letras, números, # y -",
        "warning"
      );
    }
  };

  const validar = async () => {
    if (!NroDocumento) {
      show_alerta("Escribe el número de documento", "warning");
      return;
    }
    if (!NombreApellido) {
      show_alerta("Escribe el nombre y apellido", "warning");
      return;
    }
    if (!Telefono) {
      show_alerta("Escribe el teléfono", "warning");
      return;
    }
    if (!Direccion) {
      show_alerta("Escribe la dirección", "warning");
      return;
    }
    if (!TipoDocumento) {
      show_alerta("Selecciona el tipo de documento", "warning");
      return;
    }

    if (NroDocumento.length < 6 || NroDocumento.length > 10) {
      show_alerta(
        "El número de documento debe tener entre 6 y 10 dígitos",
        "warning"
      );
      return;
    }
    if (Telefono.length !== 10) {
      show_alerta("El teléfono debe tener exactamente 10 dígitos", "warning");
      return;
    }

    if (!/^\d+$/.test(NroDocumento)) {
      show_alerta(
        "El número de documento solo puede contener dígitos",
        "warning"
      );
      return;
    }

    if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/.test(NombreApellido)) {
      show_alerta(
        "El nombre y apellido solo puede contener letras, tildes y la letra 'ñ'",
        "warning"
      );
      return;
    }

    var parametros;
    var metodo;
    if (operation === 1) {
      parametros = {
        TipoDocumento,
        NroDocumento,
        NombreApellido,
        Telefono,
        Direccion,
        Estado: "Activo",
      };
      metodo = "POST";
    } else {
      parametros = {
        IdProveedor,
        TipoDocumento,
        NroDocumento,
        NombreApellido,
        Telefono,
        Direccion,
      };
      metodo = "PUT";
    }
    enviarSolicitud(metodo, parametros);
  };

  const enviarSolicitud = async (metodo, parametros) => {
    let urlRequest =
      metodo === "PUT" || metodo === "DELETE"
        ? `${url}/${parametros.IdProveedor}`
        : url;

    await axios({ method: metodo, url: urlRequest, data: parametros })
      .then(function (respuesta) {
        var msj = respuesta.data.message;
        show_alerta(msj, "success");
        document.getElementById("btnCerrar").click();
        getProveedores();
      })
      .catch(function (error) {
        show_alerta("Error en la solicitud", "error");
        console.log(error);
      });
  };

  const deleteProveedor = (IdProveedor, NombreApellido) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar al proveedor ${NombreApellido}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setIdProveedor(IdProveedor);
        enviarSolicitud("DELETE", { IdProveedor });
      } else {
        show_alerta("El proveedor NO fue eliminado", "info");
      }
    });
  };

  const cambiarEstadoProveedor = async (IdProveedor) => {
    try {
      const proveedor = Proveedores.find(
        (proveedor) => proveedor.IdProveedor === IdProveedor
      );
      const nuevoEstado = proveedor.Estado === "Activo" ? "Inactivo" : "Activo";

      await axios.put(`${url}/${IdProveedor}`, { Estado: nuevoEstado });

      setProveedores((prevProveedores) =>
        prevProveedores.map((proveedor) =>
          proveedor.IdProveedor === IdProveedor
            ? { ...proveedor, Estado: nuevoEstado }
            : proveedor
        )
      );

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: "¡Estado cambiado!",
        text: `El estado del proveedor ha sido actualizado correctamente.`,
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (error) {
      console.error("Error updating state:", error);
    }
  };

  return (
    <>
      {/* <!-- Inicio modal crear proveedor --> */}
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
              <form id="crearProveedorForm">
                <div className="form-group">
                  <label htmlFor="tipoDocumentoProveedor">
                    Tipo de Documento:
                  </label>
                  <select
                    className="form-control"
                    id="tipoDocumentoProveedor"
                    value={TipoDocumento}
                    onChange={(e) => setTipoDocumento(e.target.value)}
                  >
                    <option value="Cédula">Cédula</option>
                    <option value="RUC">RUC</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="nroDocumentoProveedor">
                    Número de Documento:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nroDocumentoProveedor"
                    placeholder="Ingrese el número de documento"
                    required
                    value={NroDocumento}
                    onChange={(e) => setNroDocumento(e.target.value)}
                  />
                  <small className="form-text text-muted">
                    Ingrese un documento válido (entre 6 y 10 dígitos
                    numéricos).
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="nombreProveedor">Nombre del Proveedor:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombreProveedor"
                    placeholder="Ingrese el nombre del Proveedor"
                    required
                    value={NombreApellido}
                    onChange={(e) => setNombreApellido(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefonoProveedor">Teléfono:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="telefonoProveedor"
                    placeholder="Ingrese el teléfono"
                    required
                    value={Telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                  <small className="form-text text-muted">
                    Ingrese un número de teléfono válido (10 dígitos).
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="direccionProveedor">Dirección:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="direccionProveedor"
                    placeholder="Ingrese la dirección"
                    required
                    value={Direccion}
                    onChange={handleChangeDireccion}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    id="btnCerrar"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={validar}
                  >
                    Guardar Proveedor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Fin modal crear proveedor --> */}

      {/* <!-- Modal actualizar datos proveedor --> */}
      <div
        className="modal fade"
        id="actualizarModalProveedor"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="actualizarModalProveedorLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="actualizarModalProveedorLabel">
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
              <form id="actualizarProveedorForm">
                <div className="form-group">
                  <label htmlFor="nuevoNombreProveedor">Nuevo Nombre:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nuevoNombreProveedor"
                    placeholder="Ingresa nuevo nombre"
                    required
                    value={NombreApellido}
                    onChange={(e) => setNombreApellido(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="nuevoTipoDocumentoProveedor">
                    Tipo de Documento:
                  </label>
                  <select
                    className="form-control"
                    id="nuevoTipoDocumentoProveedor"
                    value={TipoDocumento}
                    onChange={(e) => setTipoDocumento(e.target.value)}
                  >
                    <option value="Cédula">Cédula</option>
                    <option value="RUC">RUC</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="nuevoNroDocumentoProveedor">
                    Número de Documento:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nuevoNroDocumentoProveedor"
                    placeholder="Ingrese el número de documento"
                    required
                    value={NroDocumento}
                    onChange={(e) => setNroDocumento(e.target.value)}
                  />
                  <small className="form-text text-muted">
                    Ingrese un documento válido (entre 6 y 10 dígitos
                    numéricos).
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="nuevoTelefonoProveedor">Teléfono:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nuevoTelefonoProveedor"
                    placeholder="Ingresa nuevo teléfono"
                    required
                    value={Telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                  <small className="form-text text-muted">
                    Ingrese un número de teléfono válido (10 dígitos).
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="nuevaDireccionProveedor">
                    Nueva Dirección:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nuevaDireccionProveedor"
                    placeholder="Ingresa nueva dirección"
                    required
                    value={Direccion}
                    onChange={handleChangeDireccion}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    id="btnCerrarActualizar"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={validar}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Fin modal actualizar proveedor --> */}

      {/* <!-- Inicio de Proveedores --> */}
      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-4 text-center text-dark">Proveedores</h1>

          <div className="text-center p-3">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#ModalCrearProveedor"
              onClick={() => openModal(1, "", "Cédula", "", "", "", "")}
            >
              <i className="fas fa-pencil-alt"></i> Crear Proveedor
            </button>
          </div>
        </div>

        {/* <!-- Tabla Proveedores --> */}
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
                    <th>Tipo de Documento</th>
                    <th>Número de Documento</th>
                    <th>Nombre y Apellido</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Tipo de Documento</th>
                    <th>Número de Documento</th>
                    <th>Nombre y Apellido</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                    <th>Estado</th>
                  </tr>
                </tfoot>
                <tbody>
                  {Proveedores.map((proveedor) => (
                    <tr key={proveedor.NroDocumento}>
                      <td>{proveedor.TipoDocumento}</td>
                      <td>{proveedor.NroDocumento}</td>
                      <td>{proveedor.NombreApellido}</td>
                      <td>{proveedor.Telefono}</td>
                      <td>{proveedor.Direccion}</td>
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
                            data-target="#actualizarModalProveedor"
                            onClick={() =>
                              openModal(
                                2,
                                proveedor.IdProveedor,
                                proveedor.TipoDocumento,
                                proveedor.NroDocumento,
                                proveedor.NombreApellido,
                                proveedor.Telefono,
                                proveedor.Direccion
                              )
                            }
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm mr-2"
                            onClick={() =>
                              deleteProveedor(
                                proveedor.IdProveedor,
                                proveedor.NombreApellido
                              )
                            }
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                          <button
                            className={`btn btn-${
                              proveedor.Estado === "Activo"
                                ? "success"
                                : "danger"
                            } btn-sm`}
                            onClick={() =>
                              cambiarEstadoProveedor(proveedor.IdProveedor)
                            }
                          >
                            {proveedor.Estado}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
