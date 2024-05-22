import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alerta } from "../../assets/js/functions";

export const Proveedores = () => {
  let url = "http://localhost:3000/api/proveedores";
  const [Proveedores, setProveedores] = useState([]);
  const [IdProveedor, setIdProveedor] = useState("");
  const [TipoDocumento, setTipoDocumento] = useState("");
  const [NroDocumento, setNroDocumento] = useState("");
  const [NombreApellido, setNombreApellido] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [Direccion, setDireccion] = useState("");
  const [Correo, setCorreo] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({
    nroDocumento: "",
    nombreApellido: "",
    telefono: "",
    direccion: "",
    correo: "",
  });

  useEffect(() => {
    getProveedores();
  }, []);

  const getProveedores = async () => {
    const respuesta = await axios.get(url);
    setProveedores(respuesta.data);
  };

  const openModal = (op, proveedor = null) => {
    if (op === 1) {
      // Crear Proveedor
      setIdProveedor("");
      setTipoDocumento("");
      setNroDocumento("");
      setNombreApellido("");
      setTelefono("");
      setDireccion("");
      setCorreo("");
      setOperation(1);
      setTitle("Crear Proveedor");
    } else if (op === 2 && proveedor) {
      // Actualizar Proveedor
      setIdProveedor(proveedor.IdProveedor);
      setTipoDocumento(proveedor.TipoDocumento);
      setNroDocumento(proveedor.NroDocumento);
      setNombreApellido(proveedor.NombreApellido);
      setTelefono(proveedor.Telefono);
      setDireccion(proveedor.Direccion);
      setCorreo(proveedor.Correo);
      setOperation(2);
      setTitle("Actualizar Datos");
      setErrors({
        nroDocumento: "",
        nombreApellido: "",
        telefono: "",
        direccion: "",
        correo: "",
      });
      const errors = {
        nroDocumento: validateNroDocumento(proveedor.NroDocumento),
        nombreApellido: validateNombreApellido(proveedor.NombreApellido),
        telefono: validateTelefono(proveedor.Telefono),
        direccion: validateDireccion(proveedor.Direccion),
        correo: validateCorreo(proveedor.Correo),
      };
      setErrors(errors);
    }
  };

  const guardarProveedor = async () => {
    if (operation === 1) {
      // Crear Proveedor
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
      // Actualizar Proveedor
      await enviarSolicitud("PUT", {
        IdProveedor,
        TipoDocumento,
        NroDocumento,
        NombreApellido,
        Telefono,
        Direccion,
        Correo,
      });
    }
  };

  // Función para validar el número de documento
  const validateNroDocumento = (value) => {
    if (!value) {
      return "Escribe el número de documento";
    }
    if (!/^\d+$/.test(value)) {
      return "El número de documento solo puede contener dígitos";
    }
    if (value.length < 6 || value.length > 10) {
      return "El número de documento debe tener entre 6 y 10 dígitos";
    }
    return "";
  };

  // Función para validar el nombre y apellido
  const validateNombreApellido = (value) => {
    if (!value) {
      return "Escribe el nombre y apellido";
    }
    if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/.test(value)) {
      return "El nombre y apellido solo puede contener letras, tildes y la letra 'ñ'";
    }
    return "";
  };

  // Función para validar el teléfono
  const validateTelefono = (value) => {
    if (!value) {
      return "Escribe el teléfono";
    }
    if (!/^\d+$/.test(value)) {
      return "El teléfono solo puede contener dígitos";
    }
    if (value.length !== 10) {
      return "El teléfono debe tener exactamente 10 dígitos";
    }
    return "";
  };

  // Función para validar la dirección
  const validateDireccion = (value) => {
    if (!value) {
      return "Escribe la dirección";
    }
    if (!/^[a-zA-Z0-9#-\s]*$/.test(value)) {
      return "La dirección solo puede contener letras, números, # y -";
    }
    return "";
  };

  // Función para validar el correo electrónico
  const validateCorreo = (value) => {
    if (!value) {
      return "Ingresa tu correo electrónico";
    }
    // Expresión regular para validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Ingresa un correo electrónico válido";
    }
    return "";
  };

  const handleChangeTipoDocumento = (e) => {
    const value = e.target.value;
    setTipoDocumento(value);
  };
  

  // Función para manejar cambios en el número de documento
  const handleChangeNroDocumento = (e) => {
    let value = e.target.value;
    // Limitar la longitud del valor ingresado a entre 6 y 10 caracteres
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setNroDocumento(value);
    const errorMessage = validateNroDocumento(value);
    setErrors((prevState) => ({
      ...prevState,
      nroDocumento: errorMessage,
    }));
  };

  const handleChangeNombreApellido = (e) => {
    const value = e.target.value;
    setNombreApellido(value);

    // Validar el nombre y apellido
    const errorMessage = validateNombreApellido(value);
    setErrors((prevState) => ({
      ...prevState,
      nombreApellido: errorMessage,
    }));
  };

  // Función para manejar cambios en el teléfono
  const handleChangeTelefono = (e) => {
    let value = e.target.value;
    // Limitar la longitud del valor ingresado a 10 caracteres
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setTelefono(value);
    const errorMessage = validateTelefono(value);
    setErrors((prevState) => ({
      ...prevState,
      telefono: errorMessage,
    }));
  };

  // Función para manejar cambios en la dirección
  const handleChangeDireccion = (e) => {
    const value = e.target.value;
    setDireccion(value);
    const errorMessage = validateDireccion(value);
    setErrors((prevState) => ({
      ...prevState,
      direccion: errorMessage,
    }));
  };

  // Función para manejar cambios en el correo electrónico
  const handleChangeCorreo = (e) => {
    const value = e.target.value;
    setCorreo(value);
    const errorMessage = validateCorreo(value);
    setErrors((prevState) => ({
      ...prevState,
      correo: errorMessage,
    }));
  };

  // Función para renderizar los mensajes de error
  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  const enviarSolicitud = async (metodo, parametros) => {
    let urlRequest =
      metodo === "PUT" || metodo === "DELETE"
        ? `${url}/${parametros.IdProveedor}`
        : url;

    try {
      const respuesta = await axios({
        method: metodo,
        url: urlRequest,
        data: parametros,
      });
      var msj = respuesta.data.message;
      show_alerta(msj, "success");
      document.getElementById("btnCerrar").click();
      getProveedores();
      // Mostrar la alerta específica
      if (metodo === "POST") {
        show_alerta("Proveedor creado con éxito", "success");
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
      <div
        className="modal fade"
        id="modalProveedor"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalProveedorLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalProveedorLabel">
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
                    onChange={(e) => handleChangeTipoDocumento(e)} // Llama a la función handleChangeTipoDocumento
                    disabled={operation === 2}
                    required
                  >
                    <option value="">Seleccione un tipo de documento</option>
                    <option value="CC">Cédula</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="NIT">NIT</option>
                  </select>

                  {TipoDocumento === "" && (
                    <p className="text-danger">
                      Por favor, seleccione un tipo de documento.
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="nroDocumentoProveedor">
                    Número de Documento:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.nroDocumento ? "is-invalid" : ""
                    }`}
                    id="nroDocumentoProveedor"
                    placeholder="Ingrese el número de documento"
                    required
                    value={NroDocumento}
                    onChange={handleChangeNroDocumento}
                    disabled={operation === 2}
                  />
                  {renderErrorMessage(errors.nroDocumento)}
                  <small className="form-text text-muted">
                    Ingrese un documento válido (entre 6 y 10 dígitos
                    numéricos).
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="nombreProveedor">Nombre del Proveedor:</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.nombreApellido ? "is-invalid" : ""
                    }`}
                    id="nombreProveedor"
                    placeholder="Ingrese el nombre del Proveedor"
                    required
                    value={NombreApellido}
                    onChange={handleChangeNombreApellido}
                  />
                  {renderErrorMessage(errors.nombreApellido)}
                </div>
                <div className="form-group">
                  <label htmlFor="telefonoProveedor">Teléfono:</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.telefono ? "is-invalid" : ""
                    }`}
                    id="telefonoProveedor"
                    placeholder="Ingrese el teléfono"
                    required
                    value={Telefono}
                    onChange={handleChangeTelefono}
                  />
                  {renderErrorMessage(errors.telefono)}
                  <small className="form-text text-muted">
                    Ingrese un número de teléfono válido (10 dígitos).
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="direccionProveedor">Dirección:</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.direccion ? "is-invalid" : ""
                    }`}
                    id="direccionProveedor"
                    placeholder="Ingrese la dirección"
                    required
                    value={Direccion}
                    onChange={handleChangeDireccion}
                  />
                  {renderErrorMessage(errors.direccion)}
                </div>

                <div className="form-group">
                  <label htmlFor="correoProveedor">Correo:</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.correo ? "is-invalid" : ""
                    }`}
                    id="correoProveedor"
                    placeholder="Ingrese el correo"
                    required
                    value={Correo}
                    onChange={handleChangeCorreo}
                  />
                  {renderErrorMessage(errors.correo)}
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
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  guardarProveedor();
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Fin modal crear/actualizar proveedor --> */}

      {/* Botón para abrir el modal de crear proveedor */}
      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-4 text-center text-dark">Proveedores</h1>
          <div className="text-right">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalProveedor"
              onClick={() => openModal(1, "", "", "", "", "", "", "")}
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
                    <th>Correo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Proveedores.map((proveedor) => (
                    <tr key={proveedor.NroDocumento}>
                      <td>{proveedor.TipoDocumento}</td>
                      <td>{proveedor.NroDocumento}</td>
                      <td>{proveedor.NombreApellido}</td>
                      <td>{proveedor.Telefono}</td>
                      <td>{proveedor.Direccion}</td>
                      <td>{proveedor.Correo}</td>
                      <td>
                        <div
                          className="btn-group"
                          role="group"
                          aria-label="Acciones"
                        >
                          {/* Botón de actualizar */}
                          <button
                            className="btn btn-warning btn-sm mr-2"
                            title="Actualizar"
                            data-toggle="modal"
                            data-target="#modalProveedor"
                            onClick={() => openModal(2, proveedor)}
                            disabled={proveedor.Estado != "Activo"}
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>
                          {/* Botón de eliminar */}
                          <button
                            className="btn btn-danger btn-sm mr-2"
                            onClick={() =>
                              deleteProveedor(
                                proveedor.IdProveedor,
                                proveedor.NombreApellido
                              )
                            }
                            disabled={proveedor.Estado != "Activo"}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                          {/* Botón de cambio de estado */}
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
