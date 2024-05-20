import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alerta } from "../../assets/js/functions";

export const Clientes = () => {
  const url = "http://localhost:3000/api/clientes";
  const [Clientes, setClientes] = useState([]);
  const [IdCliente, setIdCliente] = useState("");
  const [TipoDocumento, setTipoDocumento] = useState("Cédula");
  const [NroDocumento, setNroDocumento] = useState("");
  const [NombreApellido, setNombreApellido] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [Direccion, setDireccion] = useState("");
  const [Correo, setCorreo] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getClientes();
  }, []);

  const getClientes = async () => {
    const respuesta = await axios.get(url);
    setClientes(respuesta.data);
    console.log(respuesta.data);
  };

  const openModal = (op, cliente = null) => {
    if (op === 1) {
      // Crear cliente
      setIdCliente("");
      setTipoDocumento("Cédula");
      setNroDocumento("");
      setNombreApellido("");
      setTelefono("");
      setDireccion("");
      setCorreo("");
      setOperation(1);
      setTitle("Crear Cliente");
    } else if (op === 2 && cliente) {
      // Actualizar Proveedor
      setIdCliente(cliente.IdCliente);
      setTipoDocumento(cliente.TipoDocumento);
      setNroDocumento(cliente.NroDocumento);
      setNombreApellido(cliente.NombreApellido);
      setTelefono(cliente.Telefono);
      setDireccion(cliente.Direccion);
      setCorreo(cliente.Correo);
      setOperation(2);
      setTitle("Actualizar Datos");
    }
  };

  const guardarCliente = async () => {
    if (operation === 1) {
      // Crear Cliente
      await enviarSolicitud("POST", {
        TipoDocumento,
        NroDocumento,
        NombreApellido,
        Telefono,
        Direccion,
        Correo,
        Estado: "Activo",
      });
    } else if (operation === 2) {
      // Actualizar Cliente
      await enviarSolicitud("PUT", {
        IdCliente,
        TipoDocumento,
        NroDocumento,
        NombreApellido,
        Telefono,
        Direccion,
        Correo,
      });
    }
  };

  const validar = () => {
    if (!NroDocumento) {
      show_alerta("Escribe el número de documento", "warning");
      return false;
    }
    if (!NombreApellido) {
      show_alerta("Escribe el nombre y apellido", "warning");
      return false;
    }
    if (!Telefono) {
      show_alerta("Escribe el teléfono", "warning");
      return false;
    }
    if (!Direccion) {
      show_alerta("Escribe la dirección", "warning");
      return false;
    }
    if (!Correo) {
      show_alerta("Escribe el correo electrónico", "warning");
      return false;
    }
    if (!TipoDocumento) {
      show_alerta("Selecciona el tipo de documento", "warning");
      return false;
    }

    if (NroDocumento.length < 6 || NroDocumento.length > 10) {
      show_alerta(
        "El número de documento debe tener entre 6 y 10 dígitos",
        "warning"
      );
      return false;
    }
    if (Telefono.length !== 10) {
      show_alerta("El teléfono debe tener exactamente 10 dígitos", "warning");
      return false;
    }

    if (!/^\d+$/.test(NroDocumento)) {
      show_alerta(
        "El número de documento solo puede contener dígitos",
        "warning"
      );
      return false;
    }

    if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/.test(NombreApellido)) {
      show_alerta(
        "El nombre y apellido solo puede contener letras, tildes y la letra 'ñ'",
        "warning"
      );
      return false;
    }

    // Validar el formato del correo electrónico
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(Correo)) {
      show_alerta("El correo electrónico ingresado no es válido", "warning");
      return false;
    }

    return true;
  };

  const enviarSolicitud = async (metodo, parametros) => {
    let urlRequest =
      metodo === "PUT" || metodo === "DELETE"
        ? `${url}/${parametros.IdCliente}`
        : url;

    try {
      const respuesta = await axios({
        method: metodo,
        url: urlRequest,
        data: parametros,
      });
      var msj = respuesta.data.message;
      show_alerta(msj, "success");
      document.getElementById("btnCerrarCliente").click();
      getClientes();
      // Mostrar la alerta específica
      if (metodo === "POST") {
        show_alerta("Cliente creado con éxito", "success");
      }
    } catch (error) {
      if (error.response) {
        // Error en la respuesta del servidor
        show_alerta(error.response.data.message, "error");
      } else if (error.request) {
        // Error en la solicitud
        show_alerta("Error en la solicitud", "error");
      } else {
        // Otros errores
        show_alerta("Error desconocido", "error");
      }
      console.log(error);
    }
  };

  const deleteCliente = (IdCliente, NombreCliente) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar al cliente ${NombreCliente}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setIdCliente(IdCliente);
        enviarSolicitud("DELETE", { IdCliente: IdCliente });
      } else {
        show_alerta("El cliente NO fue eliminado", "info");
      }
    });
  };

  const cambiarEstadoCliente = async (IdCliente) => {
    try {
      const response = await axios.put(`${url}/${IdCliente}`);
      if (response.status === 200) {
        // Actualizar estado del cliente localmente
        setClientes((prevClientes) =>
          prevClientes.map((cliente) =>
            cliente.IdCliente === IdCliente
              ? {
                  ...cliente,
                  Estado: cliente.Estado === "Activo" ? "Inactivo" : "Activo",
                }
              : cliente
          )
        );
        // Actualizar estado del cliente en la base de datos
        await axios.put(`${url}/${IdCliente}`, {
          Estado:
            Clientes.find((cliente) => cliente.IdCliente === IdCliente)
              .Estado === "Activo"
              ? "Inactivo"
              : "Activo",
        });

        // Mostrar alerta de cambio de estado
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          title: "¡Estado cambiado!",
          text: "El estado del cliente ha sido actualizado correctamente.",
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Error updating state:", error);
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="modalCliente"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalClienteLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
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
                <div className="form-group">
                  <label htmlFor="tipoDocumentoCliente">
                    Tipo de Documento:
                  </label>
                  <select
                    className="form-control"
                    id="tipoDocumentoCliente"
                    value={TipoDocumento}
                    onChange={(e) => setTipoDocumento(e.target.value)}
                  >
                    <option value="Cédula">Cédula</option>
                    <option value="RUC">RUC</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="nroDocumentoCliente">
                    Número de Documento:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nroDocumentoCliente"
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
                  <label htmlFor="nombreCliente">Nombre del Cliente:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombreCliente"
                    placeholder="Ingrese el nombre del Cliente"
                    required
                    value={NombreApellido}
                    onChange={(e) => setNombreApellido(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefonoCliente">Teléfono:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="telefonoCliente"
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
                  <label htmlFor="direccionCliente">Dirección:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="direccionCliente"
                    placeholder="Ingrese la dirección"
                    required
                    value={Direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="correoCliente">Correo Electrónico:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="correoCliente"
                    placeholder="Ingrese el correo electrónico"
                    required
                    value={Correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                  <small className="form-text text-muted">
                    Ingrese un correo electrónico válido.
                  </small>
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
                  if (validar()) {
                    guardarCliente();
                  }
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
          <h1 className="h3 mb-4 text-center text-dark">Clientes</h1>
          <div className="text-right">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalCliente"
              onClick={() => openModal(1, "", "Cédula", "", "", "", "")}
            >
              <i className="fas fa-pencil-alt"></i> Crear Cliente
            </button>
          </div>
        </div>

        {/* <!-- Tabla de Clientes --> */}
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
                    <th>Tipo de Documento</th>
                    <th>Número de Documento</th>
                    <th>Nombre y Apellido</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Correo Electrónico</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Tipo de Documento</th>
                    <th>Número de Documento</th>
                    <th>Nombre y Apellido</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Correo Electrónico</th>
                    <th>Acciones</th>
                  </tr>
                </tfoot>
                <tbody>
                  {Clientes.map((cliente) => (
                    <tr key={cliente.NroDocumento}>
                      <td>{cliente.TipoDocumento}</td>
                      <td>{cliente.NroDocumento}</td>
                      <td>{cliente.NombreApellido}</td>
                      <td>{cliente.Telefono}</td>
                      <td>{cliente.Direccion}</td>
                      <td>{cliente.Correo}</td>
                      <td>
                        <div
                          className="btn-group"
                          role="group"
                          aria-label="Acciones"
                        >
                          {cliente.Estado === "Activo" && (
                            <button
                              className="btn btn-warning btn-sm mr-2"
                              title="Actualizar"
                              data-toggle="modal"
                              data-target="#modalCliente"
                              onClick={() => openModal(2, cliente)}
                            >
                              <i className="fas fa-sync-alt"></i>
                            </button>
                          )}
                          {cliente.Estado === "Activo" && (
                            <button
                              className="btn btn-danger btn-sm mr-2"
                              onClick={() =>
                                deleteCliente(
                                  cliente.IdCliente,
                                  cliente.NombreApellido
                                )
                              }
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          )}
                          <button
                            className={`btn btn-${
                              cliente.Estado === "Activo" ? "success" : "danger"
                            } btn-sm`}
                            onClick={() =>
                              cambiarEstadoCliente(cliente.IdCliente)
                            }
                          >
                            {cliente.Estado}
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
        {/* Fin tabla de clientes */}
      </div>
    </>
  );
};
