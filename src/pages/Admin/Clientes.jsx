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
      <div
        className="modal fade"
        id="ModalCrearCliente"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalAñadirClienteLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalAñadirClienteLabel">
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
              <form id="crearClienteForm" className="justify-content-end">
                <div className="form-group">
                  <label htmlFor="nombreCliente">Nombre y Apellido:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombreCliente"
                    placeholder="Ingrese el nombre y apellido"
                    required
                    pattern="[A-Za-zÁ-ú\s]+"
                    title="Solo se permiten letras y espacios"
                    value={NombreApellido}
                    onChange={(e) => setNombreApellido(e.target.value)}
                  />
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
                    pattern="\d{10}"
                    title="El número de documento debe tener 10 dígitos"
                    value={NroDocumento}
                    onChange={(e) => setNroDocumento(e.target.value)}
                  />
                </div>
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
                  <label htmlFor="telefonoCliente">Teléfono:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="telefonoCliente"
                    placeholder="Ingrese el teléfono"
                    required
                    pattern="\d{10}"
                    title="El teléfono debe tener 10 dígitos"
                    value={Telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
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
                  <label htmlFor="correoCliente">Correo:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="correoCliente"
                    placeholder="Ingrese el correo"
                    required
                    value={Correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                id="btnCerrar"
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

      {/* Contenido principal */}
      <div className="container">
        <h1 className="my-4">Clientes</h1>
        <button
          className="btn btn-primary mb-4"
          data-toggle="modal"
          data-target="#ModalCrearCliente"
          onClick={() => openModal(1)}
        >
          Añadir Cliente
        </button>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Nro Documento</th>
              <th>Tipo Documento</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Clientes.map((cliente) => (
              <tr key={cliente.IdCliente}>
                <td>{cliente.IdCliente}</td>
                <td>{cliente.NombreApellido}</td>
                <td>{cliente.NroDocumento}</td>
                <td>{cliente.TipoDocumento}</td>
                <td>{cliente.Telefono}</td>
                <td>{cliente.Direccion}</td>
                <td>{cliente.Correo}</td>
                <td>{cliente.Estado}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() =>
                      openModal(
                        2,
                        cliente.IdCliente,
                        cliente.TipoDocumento,
                        cliente.NroDocumento,
                        cliente.NombreApellido,
                        cliente.Telefono,
                        cliente.Direccion,
                        cliente.Correo
                      )
                    }
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm ml-2"
                    onClick={() =>
                      deleteCliente(cliente.IdCliente, cliente.NombreApellido)
                    }
                  >
                    Eliminar
                  </button>
                  <button
                    className={`btn btn-sm ${
                      cliente.Estado === "Activo" ? "btn-success" : "btn-danger"
                    }`}
                    onClick={() => cambiarEstadoCliente(cliente.IdCliente)}
                  >
                    {cliente.Estado === "Activo" ? "Activo" : "Inactivo"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
