import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../assets/js/Pagination";
import SearchBar from "../../assets/js/SearchBar";

export const Proveedores = () => {
  let url = "http://localhost:3000/api/proveedores";
  const [Proveedores, setProveedores] = useState([]);
  const [IdProveedor, setIdProveedor] = useState("");
  const [TipoDocumento, setTipoDocumento] = useState("");
  const [NroDocumento, setNroDocumento] = useState("");
  const [NombreApellido, setNombreApellido] = useState("");
  const [Contacto, setContacto] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [Direccion, setDireccion] = useState("");
  const [Correo, setCorreo] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({
    nroDocumento: "",
    nombreApellido: "",
    contacto: "",
    telefono: "",
    direccion: "",
    correo: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [NombreApellidoLabel, setNombreApellidoLabel] = useState(
    "Nombre del Proveedor"
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

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
      setContacto("");
      setTelefono("");
      setDireccion("");
      setCorreo("");
      setOperation(1);
      setTitle("Crear Proveedor");
      setNombreApellidoLabel("Nombre del Proveedor");
    } else if (op === 2 && proveedor) {
      // Actualizar Proveedor
      setIdProveedor(proveedor.IdProveedor);
      setTipoDocumento(proveedor.TipoDocumento);
      setNroDocumento(proveedor.NroDocumento);
      setNombreApellido(proveedor.NombreApellido);
      setContacto(
        proveedor.TipoDocumento === "CC" || proveedor.TipoDocumento === "CE"
          ? proveedor.NombreApellido
          : proveedor.Contacto
      );
      setTelefono(proveedor.Telefono);
      setDireccion(proveedor.Direccion);
      setCorreo(proveedor.Correo);
      setOperation(2);
      setTitle("Actualizar Datos");
      setErrors({
        nroDocumento: "",
        nombreApellido: "",
        contacto: "",
        telefono: "",
        direccion: "",
        correo: "",
      });
      const errors = {
        nroDocumento: validateNroDocumento(proveedor.NroDocumento),
        nombreApellido: validateNombreApellido(proveedor.NombreApellido),
        contacto: validateContacto(proveedor.Contacto),
        telefono: validateTelefono(proveedor.Telefono),
        direccion: validateDireccion(proveedor.Direccion),
        correo: validateCorreo(proveedor.Correo),
      };
      setErrors(errors);
      setNombreApellidoLabel(
        proveedor.TipoDocumento === "NIT"
          ? "Nombre de la Empresa"
          : "Nombre del Proveedor"
      );
    }
  };

  const guardarProveedor = async () => {
    const cleanedNombreApellido = NombreApellido.trim().replace(/\s+/g, ' '); // Elimina los espacios múltiples y los extremos
    const cleanedDireccion = Direccion.trim().replace(/\s+/g, ' '); // Elimina los espacios múltiples y los extremos
  
    if (operation === 1) {
      // Crear Proveedor
      await enviarSolicitud("POST", {
        TipoDocumento,
        NroDocumento,
        NombreApellido: cleanedNombreApellido,
        Contacto,
        Telefono,
        Direccion: cleanedDireccion,
        Correo,
        Estado: "Activo",
      });
    } else if (operation === 2) {
      // Actualizar Proveedor
      await enviarSolicitud("PUT", {
        IdProveedor,
        TipoDocumento,
        NroDocumento,
        NombreApellido: cleanedNombreApellido,
        Contacto,
        Telefono,
        Direccion: cleanedDireccion,
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
    if (TipoDocumento === "NIT" && (value.length < 9 || value.length > 10)) {
      return "El NIT debe tener entre 9 y 10 dígitos";
    }
    if (
      (TipoDocumento === "CC" || TipoDocumento === "CE") &&
      (value.length < 6 || value.length > 10)
    ) {
      return "El número de documento debe tener entre 6 y 10 dígitos";
    }
    return "";
  };

  // Función para validar el nombre y apellido
  const validateNombreApellido = (value) => {
    if (!value) {
      return "Escribe el nombre y apellido";
    }
    if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ]+( [A-Za-zñÑáéíóúÁÉÍÓÚ]+)*$/.test(value)) {
      return "El nombre y apellido solo puede contener letras, tildes y la letra 'ñ' con un solo espacio entre palabras";
    }
    return "";
  };

  const validateContacto = (value) => {
    if (!value) {
      return "Escribe el Contacto";
    }
    if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/.test(value)) {
      return "El contacto solo puede contener letras, tildes y la letra 'ñ'";
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

  const validateDireccion = (value) => {
    if (!value) {
        return "Escribe la dirección";
    }
    if (!/^[a-zA-Z0-9#\-_\s]+(?:[a-zA-Z0-9#\-_\s])*[^\s]$/.test(value)) {
        return "La dirección solo puede contener letras, números, espacios, # y -";
    }
    return ""; // La dirección es válida
};



  // Función para validar el correo electrónico
  const validateCorreo = (value) => {
    if (!value) {
      return "Ingresa tu correo electrónico";
    }

    // Expresión regular para validar correo electrónico sin espacios
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verifica si el correo contiene espacios
    if (/\s/.test(value)) {
      return "El correo electrónico no puede contener espacios";
    }

    // Verifica si el correo sigue el formato estándar
    if (!emailRegex.test(value)) {
      return "Ingresa un correo electrónico válido";
    }

    // Si pasa todas las validaciones, retorna una cadena vacía
    return "";
  };

  const handleChangeTipoDocumento = (e) => {
    const value = e.target.value;
    setTipoDocumento(value);
    if (value === "NIT") {
      setNombreApellidoLabel("Nombre de la Empresa");
    } else {
      setNombreApellidoLabel("Nombre del Proveedor");
    }
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
    const value = e.target.value.replace(/\s+/g, ' '); // Reemplaza múltiples espacios con un solo espacio
    setNombreApellido(value);

    // Validar el nombre y apellido
    const errorMessage = validateNombreApellido(value);
    setErrors((prevState) => ({
      ...prevState,
      nombreApellido: errorMessage,
    }));

    // Rellenar Contacto si TipoDocumento es "CC" o "CE"
    if (TipoDocumento === "CC" || TipoDocumento === "CE") {
      setContacto(value);
    }
  };

  const handleChangeContacto = (e) => {
    const value = e.target.value;
    setContacto(value);

    // Validar el contacto
    const errorMessage = validateContacto(value);
    setErrors((prevState) => ({
      ...prevState,
      contacto: errorMessage,
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
    const value = e.target.value.replace(/\s+/g, ' '); // Reemplaza múltiples espacios con un solo espacio
    setDireccion(value);

    // Validar la dirección
    const errorMessage = validateDireccion(value);
    setErrors((prevState) => ({
        ...prevState,
        direccion: errorMessage,
    }));
};
;

  
  
  // Función para manejar cambios en el correo electrónico
  const handleChangeCorreo = (e) => {
    const value = e.target.value;
    setCorreo(value); // Actualiza el estado del correo electrónico

    // Valida el correo electrónico y obtiene el mensaje de error
    const errorMessage = validateCorreo(value);

    // Actualiza el estado de los errores con el mensaje de error correspondiente
    setErrors((prevState) => ({
      ...prevState,
      correo: errorMessage, // Actualiza el error de correo con el mensaje de error obtenido
    }));
  };

  const show_alerta = (message, type) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: message,
      icon: type,
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: () => {
        // Selecciona la barra de progreso y ajusta su estilo
        const progressBar = MySwal.getTimerProgressBar();
        if (progressBar) {
          progressBar.style.backgroundColor = "black";
          progressBar.style.height = "6px";
        }
      },
    });
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
      if (metodo === "POST") {
        show_alerta("Proveedor creado con éxito", "success", { timer: 2000 });
      } else if (metodo === "PUT") {
        show_alerta("Proveedor actualizado con éxito", "success", {
          timer: 2000,
        });
      } else if (metodo === "DELETE") {
        show_alerta("Proveedor eliminado con éxito", "success", {
          timer: 2000,
        });
      }
    } catch (error) {
      if (error.response) {
        show_alerta(error.response.data.message, "error");
      } else if (error.request) {
        show_alerta("Error en la solicitud", "error");
      } else {
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
        enviarSolicitud("DELETE", { IdProveedor }).then(() => {
          // Calcular el índice del proveedor eliminado en la lista filtrada
          const index = filteredProveedores.findIndex(
            (proveedor) => proveedor.IdProveedor === IdProveedor
          );

          // Determinar la página en la que debería estar el proveedor después de la eliminación
          const newPage =
            Math.ceil((filteredProveedores.length - 1) / itemsPerPage) || 1;

          // Establecer la nueva página como la página actual
          setCurrentPage(newPage);
        });
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

      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `¿Seguro de cambiar el estado del proveedor ${proveedor.NombreApellido}?`,
        icon: "question",
        text: `El estado actual del proveedor es: ${proveedor.Estado}. ¿Desea cambiarlo a ${nuevoEstado}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, cambiar estado",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.put(`${url}/${IdProveedor}`, { Estado: nuevoEstado });

          setProveedores((prevProveedores) =>
            prevProveedores.map((proveedor) =>
              proveedor.IdProveedor === IdProveedor
                ? { ...proveedor, Estado: nuevoEstado }
                : proveedor
            )
          );

          show_alerta("Estado del proveedor cambiado con éxito", "success", {
            timer: 2000,
          });
        } else {
          show_alerta("No se ha cambiado el estado del proveedor", "info");
        }
      });
    } catch (error) {
      console.error("Error updating state:", error);
      show_alerta("Error cambiando el estado del proveedor", "error");
    }
  };

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Resetear la página actual al cambiar el término de búsqueda
  };

  // Filtrar los proveedores según el término de búsqueda
  const filteredProveedores = Proveedores.filter((proveedor) =>
    Object.values(proveedor).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Aplicar paginación a los proveedores filtrados
  const totalPages = Math.ceil(filteredProveedores.length / itemsPerPage);
  const currentProveedores = filteredProveedores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div
        className="modal fade"
        id="modalProveedor"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalProveedorLabel"
        aria-hidden="true"
        data-backdrop="static"
        data-keyboard="false"
      >
        <div className="modal-dialog modal-lg" role="document">
          {/* Cambiado a modal-lg para un modal más ancho */}
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
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="tipoDocumentoProveedor">
                      Tipo de Documento:
                    </label>
                    <select
                      className="form-control"
                      id="tipoDocumentoProveedor"
                      value={TipoDocumento}
                      onChange={(e) => handleChangeTipoDocumento(e)}
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
                  <div className="form-group col-md-6">
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
                    />
                    {renderErrorMessage(errors.nroDocumento)}
                    <small className="form-text text-muted">
                      Ingrese un documento válido (entre 6 y 10 dígitos
                      numéricos).
                    </small>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="nombreProveedor">
                      {NombreApellidoLabel}:
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.nombreApellido ? "is-invalid" : ""
                      }`}
                      id="nombreProveedor"
                      placeholder={`Ingrese ${NombreApellidoLabel.toLowerCase()}`}
                      required
                      value={NombreApellido}
                      onChange={handleChangeNombreApellido}
                    />
                    {renderErrorMessage(errors.nombreApellido)}
                    <small className="form-text text-muted">
                      Ingrese un{" "}
                      {TipoDocumento === "NIT"
                        ? "nombre de la empresa"
                        : "nombre y apellido"}{" "}
                      válido.
                    </small>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="contactoProveedor">Contacto:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.contacto ? "is-invalid" : ""
                      }`}
                      id="contactoProveedor"
                      placeholder="Ingrese el contacto"
                      value={Contacto}
                      onChange={handleChangeContacto}
                      disabled={
                        TipoDocumento === "CC" || TipoDocumento === "CE"
                      }
                    />
                    {renderErrorMessage(errors.contacto)}
                    <small className="form-text text-muted">
                      Ingrese{" "}
                      {TipoDocumento === "NIT"
                        ? "nombre y apellido"
                        : "un contacto"}{" "}
                      válido.
                    </small>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
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
                  <div className="form-group col-md-6">
                    <label htmlFor="direccionCliente">Dirección:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.direccion ? "is-invalid" : ""
                      }`}
                      id="direccionCliente"
                      placeholder="Ingrese la dirección"
                      required
                      value={Direccion}
                      onChange={handleChangeDireccion}
                    />
                    {renderErrorMessage(errors.direccion)}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label htmlFor="correoProveedor">Correo Electrónico:</label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.correo ? "is-invalid" : ""
                      }`}
                      id="correoProveedor"
                      placeholder="Ingrese el correo Electrónico"
                      required
                      value={Correo}
                      onChange={handleChangeCorreo}
                    />
                    {renderErrorMessage(errors.correo)}
                  </div>
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
          <h1 className="h3 mb-4 text-center text-dark">
            Gestión de Proveedores
          </h1>
          <div className="text-right">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalProveedor"
              onClick={() => openModal(1, "", "", "", "", "", "", "", "")}
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
            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
            />
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
                    <th>Proveedor</th>
                    <th>Contacto</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Correo Electrónico</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProveedores.map((proveedor) => (
                    <tr key={proveedor.NroDocumento}>
                      <td>{proveedor.TipoDocumento}</td>
                      <td>{proveedor.NroDocumento}</td>
                      <td>{proveedor.NombreApellido}</td>
                      <td>{proveedor.Contacto}</td>
                      <td>{proveedor.Telefono}</td>
                      <td>{proveedor.Direccion}</td>
                      <td>{proveedor.Correo}</td>
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
                            data-target="#modalProveedor"
                            onClick={() => openModal(2, proveedor)}
                            disabled={proveedor.Estado !== "Activo"}
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
                            disabled={proveedor.Estado !== "Activo"}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={proveedor.Estado === "Activo"}
                              onChange={() =>
                                cambiarEstadoProveedor(proveedor.IdProveedor)
                              }
                              className={
                                proveedor.Estado === "Activo"
                                  ? "switch-green"
                                  : "switch-red"
                              }
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
        {/* Fin tabla proveedores */}
      </div>
    </>
  );
};
