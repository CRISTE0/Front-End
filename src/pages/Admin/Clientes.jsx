import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
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

  const openModal = (
    op,
    IdCliente,
    TipoDocumento,
    NroDocumento,
    NombreApellido,
    Telefono,
    Direccion,
    Correo
  ) => {
    setIdCliente("");
    setTipoDocumento("Cédula");
    setNroDocumento("");
    setNombreApellido("");
    setTelefono("");
    setDireccion("");
    setCorreo("");
    setOperation(op);
    if (op === 1) {
      setTitle("Registrar cliente");
    } else if (op === 2) {
      setTitle("Editar cliente");
      setIdCliente(IdCliente);
      setTipoDocumento(TipoDocumento);
      setNroDocumento(NroDocumento);
      setNombreApellido(NombreApellido);
      setTelefono(Telefono);
      setDireccion(Direccion);
      setCorreo(Correo);
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

    let parametros;
    let metodo;
    if (operation === 1) {
      parametros = {
        TipoDocumento,
        NroDocumento,
        NombreApellido,
        Telefono,
        Direccion,
        Correo,
        Estado: "Activo",
      };
      metodo = "POST";
    } else {
      parametros = {
        IdCliente,
        TipoDocumento,
        NroDocumento,
        NombreApellido,
        Telefono,
        Direccion,
        Correo,
      };
      metodo = "PUT";
    }
    enviarSolicitud(metodo, parametros);
  };


  const enviarSolicitud = async (metodo, parametros) => {
    if (metodo === "PUT") {
      let urlPut = `${url}/${parametros.IdCliente}`;
      await axios({ method: metodo, url: urlPut, data: parametros })
        .then(function (respuesta) {
          const msj = respuesta.data.message;
          show_alerta(msj, "success");
          document.getElementById("btnCerrar").click();
          getClientes();
        })
        .catch(function (error) {
          show_alerta("Error en la solicitud", "error");
          console.log(error);
        });
    } else if (metodo === "DELETE") {
      let urlDelete = `${url}/${parametros.IdCliente}`;
      await axios({ method: metodo, url: urlDelete, data: parametros })
        .then(function (respuesta) {
          const msj = respuesta.data.message;
          show_alerta(msj, "success");
          document.getElementById("btnCerrar").click();
          getClientes();
        })
        .catch(function (error) {
          show_alerta("Error en la solicitud", "error");
          console.log(error);
        });
    } else {
      await axios({ method: metodo, url: url, data: parametros })
        .then(function (respuesta) {
          const msj = respuesta.data.message;
          show_alerta(msj, "success");
          document.getElementById("btnCerrar").click();
          getClientes();
        })
        .catch(function (error) {
          show_alerta("Error en la solicitud", "error");
          console.log(error);
        });
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
      {/* Modal para crear cliente */}
      <div className="modal fade" id="modalClientes" tabIndex="-1" role="dialog" aria-labelledby="ModalAñadirClienteLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalAñadirClienteLabel">{title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
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
                  <label htmlFor="direccionCliente">Dirección del Cliente:</label>
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
                  <label htmlFor="documentoCliente">Documento del Cliente:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="documentoCliente"
                    placeholder="Ingrese el documento del cliente"
                    required
                    pattern="[0-9]{7,10}"
                  />
                  <small className="form-text text-muted">
                    Ingrese un documento válido (entre 7 y 10 dígitos numéricos).
                  </small>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar Cliente
              </button>
            </div>
          </div>
        </div>
      </div>
  
      {/* Contenido principal */}
      <div className="container-fluid">
        {/* Encabezado */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-4 text-center text-dark">Clientes</h1>
          <div className="text-center p-3">
            <button
              onClick={() => openModal(1)}
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalClientes"
            >
              <i className="fas fa-pencil-alt"></i> Crear Cliente
            </button>
          </div>
        </div>
  
        {/* Tabla de clientes */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Clientes</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered" id="" width="100%" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Documento</th>
                    <th>Acciones</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Documento</th>
                    <th>Acciones</th>
                    <th>Estado</th>
                  </tr>
                </tfoot>
                <tbody>
                  {/* Lógica para mostrar los clientes */}
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
                      <div className="btn-group" role="group" aria-label="Acciones">
                        <button
                          id="toggleClienteButton"
                          className="btn btn-success mr-1"
                          //onclick="toggleEstadoCliente()"
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
                          <div className="dropdown-menu" aria-labelledby="estadoClienteDropdown">
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
                  {/* Más filas de clientes */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
};
