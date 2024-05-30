import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Pagination from "../../assets/js/Pagination";
import SearchBar from "../../assets/js/SearchBar";

export const Insumos = () => {
  const url = "http://localhost:3000/api/insumos";
  const [Insumos, setInsumos] = useState([]);
  const [Colores, setColores] = useState([]);
  const [Tallas, setTallas] = useState([]);
  const [IdInsumo, setIdInsumo] = useState("");
  const [IdColor, setIdColor] = useState("");
  const [IdTalla, setIdTalla] = useState("");
  const [Referencia, setReferencia] = useState("");
  const [Cantidad, setCantidad] = useState("0");
  const [ValorCompra, setValorCompra] = useState("0");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({
    IdColor: 0,
    IdTalla: 0,
    Referencia: "",
    Cantidad: 0,
    ValorCompra: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    getInsumos();
    getColores();
    getTallas(); // Obtener los colores cuando el componente se monta
  }, []);

  const getInsumos = async () => {
    const respuesta = await axios.get(url);
    setInsumos(respuesta.data);
    console.log(respuesta.data);
  };

  const getColores = async () => {
    const respuesta = await axios.get("http://localhost:3000/api/colores");
    setColores(respuesta.data);
    console.log(respuesta.data);
  };

  const getTallas = async () => {
    const respuesta = await axios.get("http://localhost:3000/api/tallas");
    setTallas(respuesta.data);
    console.log(respuesta.data);
  };

  const openModal = (op, insumo = null) => {
    if (op === 1) {
      // Crear cliente
      setIdInsumo("");
      setIdColor("");
      setIdTalla("");
      setReferencia("");
      setCantidad("0");
      setValorCompra("0");
      setOperation(1);
      setTitle("Crear Insumo");
    } else if (op === 2 && insumo) {
      // Actualizar Cliente
      setIdInsumo(insumo.IdInsumo);
      setIdColor(insumo.IdColor);
      setIdTalla(insumo.IdTalla);
      setReferencia(insumo.Referencia);
      setCantidad(insumo.Cantidad);
      setValorCompra(insumo.ValorCompra);
      setOperation(2);
      setTitle("Actualizar Datos");
      setErrors({
        IdColor: 0,
        IdTalla: 0,
        Referencia: "",
        Cantidad: 0,
        ValorCompra: 0,
      });
      const errors = {
        Referencia: validateReferencia(insumo.Referencia),
        // Cantidad: validateCantidad(insumo.Cantidad),
        // ValorCompra: validateValorCompra(insumo.ValorCompra),
      };
      setErrors(errors);
    }
  };

  const guardarInsumo = async () => {
    if (operation === 1) {
      // Crear Cliente
      await enviarSolicitud("POST", {
        IdColor,
        IdTalla,
        Referencia,
        Cantidad:0,
        ValorCompr:0,
      });
    } else if (operation === 2) {
      // Actualizar Cliente
      await enviarSolicitud("PUT", {
        IdInsumo,
        IdColor,
        IdTalla,
        Referencia,
        Cantidad,
        ValorCompra,
      });
    }
  };

  // Función para validar la referencia
  const validateReferencia = (value) => {
    if (!value) {
      return "Escribe la referencia";
    }
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return "La referencia solo puede contener letras y números";
    }
    return "";
  };

  // // Función para validar la cantidad
  // const validateCantidad = (value) => {
  //   if (!value) {
  //     return "Escribe la cantidad";
  //   }
  //   if (!/^\d+$/.test(value)) {
  //     return "La cantidad solo puede contener números";
  //   }
  //   return "";
  // };

  // const validateValorCompra = (value) => {
  //   if (!value) {
  //     return "Escribe el valor de compra";
  //   }
  //   if (!/^\d+(\.\d+)?$/.test(value)) {
  //     return "El valor de compra solo puede contener números y decimales";
  //   }
  //   return "";
  // };



  const handleChangeIdColor = (e) => {
    const value = e.target.value;
    setIdColor(value);
  };

  const handleChangeIdTalla = (e) => {
    const value = e.target.value;
    setIdTalla(value);
  };

  // Función para manejar cambios en el teléfono
  const handleChangeReferencia = (e) => {
    let value = e.target.value;
    // Limitar la longitud del valor ingresado a 10 caracteres
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setReferencia(value);
    const errorMessage = validateReferencia(value);
    setErrors((prevState) => ({
      ...prevState,
      Referencia: errorMessage,
    }));
  };

  // Función para manejar cambios en la dirección
  const handleChangeCantidad = (e) => {
    const value = e.target.value;
    setCantidad(value);
    const errorMessage = validateCantidad(value);
    setErrors((prevState) => ({
      ...prevState,
      Cantidad: errorMessage,
    }));
  };

  // Función para manejar cambios en el correo electrónico
  const handleChangeValorCompra = (e) => {
    const value = e.target.value;
    setValorCompra(value);
    const errorMessage = validateValorCompra(value);
    setErrors((prevState) => ({
      ...prevState,
      ValorCompra: errorMessage,
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
        ? `${url}/${parametros.IdInsumo}`
        : url;

    try {
      let respuesta;
      if (metodo === "POST") {
        respuesta = await axios.post(url, parametros);
      } else if (metodo === "PUT") {
        respuesta = await axios.put(urlRequest, parametros);
      } else if (metodo === "DELETE") {
        respuesta = await axios.delete(urlRequest);
      }

      const msj = respuesta.data.message;
      show_alerta(msj, "success");
      document.getElementById("btnCerrarCliente").click();
      getInsumos();
      if (metodo === "POST") {
        show_alerta("Insumo creado con éxito", "success", { timer: 2000 });
      } else if (metodo === "PUT") {
        show_alerta("Insumo actualizado con éxito", "success", {
          timer: 2000,
        });
      } else if (metodo === "DELETE") {
        show_alerta("Insumo eliminado con éxito", "success", { timer: 2000 });
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

  const deleteInsumo = (IdInsumo, Referencia) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar el insumo ${Referencia}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setIdInsumo(IdInsumo);
        enviarSolicitud("DELETE", { IdInsumo: IdInsumo });
      } else {
        show_alerta("El insumo NO fue eliminado", "info");
      }
    });
  };

  // const cambiarEstadoCliente = async (IdCliente) => {
  //   try {
  //     const cliente = Clientes.find(
  //       (cliente) => cliente.IdCliente === IdCliente
  //     );
  //     const nuevoEstado = cliente.Estado === "Activo" ? "Inactivo" : "Activo";

  //     await axios.put(`${url}/${IdCliente}`, { Estado: nuevoEstado });

  //     setClientes((prevClientes) =>
  //       prevClientes.map((cliente) =>
  //         cliente.IdCliente === IdCliente
  //           ? { ...cliente, Estado: nuevoEstado }
  //           : cliente
  //       )
  //     );

  //     show_alerta("Estado del cliente cambiado con éxito", "success", {
  //       timer: 2000,
  //     });
  //   } catch (error) {
  //     console.error("Error updating state:", error);
  //     show_alerta("Error cambiando el estado del cliente", "error");
  //   }
  // };
  const convertColorIdToName = (colorId) => {
    const color = Colores.find((color) => color.IdColor === colorId);
    return color ? color.Color : "";
  };

  const convertTallaIdToName = (tallaId) => {
    const talla = Tallas.find((talla) => talla.IdTalla === tallaId);
    return talla ? talla.Talla : "";
  };

  const handleSearchTermChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Resetear la página actual al cambiar el término de búsqueda
  };

  // Filtrar los insumos según el término de búsqueda
  const filteredInsumos = Insumos.filter((insumo) => {
    const colorName = convertColorIdToName(insumo.IdColor);
    const tallaName = convertTallaIdToName(insumo.IdTalla);
    const referencia = insumo.Referencia ? insumo.Referencia.toString() : '';
    const cantidad = insumo.Cantidad ? insumo.Cantidad.toString() : '';
    const valorCompra = insumo.ValorCompra ? insumo.ValorCompra.toString() : '';
  
    return (
      colorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tallaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cantidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      valorCompra.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  

  // Aplicar paginación a los insumos filtrados
  const totalPages = Math.ceil(filteredInsumos.length / itemsPerPage);
  const currentInsumos = filteredInsumos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  }
  

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
                  <label htmlFor="idColor">
                    Color del Insumo:
                  </label>
                  <select
                    className="form-control"
                    id="idColor"
                    value={IdColor}
                    onChange={(e) => handleChangeIdColor(e)}
                    required
                  >
                    <option value="">Seleccione un color</option>
                    {Colores.map((color) => (
                      <option key={color.IdColor} value={color.IdColor}>
                        {color.Color}
                      </option>
                    ))}
                  </select>

                  {IdColor === "" && (
                    <p className="text-danger">
                      Por favor, seleccione un color.
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="idTalla">
                    Talla del insumo:
                  </label>
                  <select
                    className="form-control"
                    id="idTalla"
                    value={IdTalla}
                    onChange={(e) => handleChangeIdTalla(e)}
                    required
                  >
                    <option value="">Seleccione una talla</option>
                    {Tallas.map((talla) => (
                      <option key={talla.IdTalla} value={talla.IdTalla}>
                        {talla.Talla}
                      </option>
                    ))}
                  </select>

                  {IdTalla === "" && (
                    <p className="text-danger">
                      Por favor, seleccione una talla.
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="nroDocumentoCliente">
                    Referencia del insumo:
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.Referencia ? "is-invalid" : ""
                      }`}
                    id="nroDocumentoCliente"
                    placeholder="Ingrese la referencia del insumo"
                    required
                    value={Referencia}
                    onChange={handleChangeReferencia}
                  />
                  {renderErrorMessage(errors.Referencia)}

                </div>
                <div className="form-group">
                  <label htmlFor="nombreCliente">Cantidad:</label>
                  <input
                    type="text"
                    className={`form-control ${errors.Cantidad ? "is-invalid" : ""
                      }`}
                    id="nombreCliente"
                    placeholder="Ingrese la cantidad del insumo"
                    required
                    value="0" // Establecer valor en 0
                    onChange={handleChangeCantidad}
                    disabled
                  />
                  {renderErrorMessage(errors.Cantidad)}
                </div>
                <div className="form-group">
                  <label htmlFor="direccionCliente">Valor de de la compra del insumo:</label>
                  <input
                    type="text"
                    className={`form-control ${errors.ValorCompra ? "is-invalid" : ""
                      }`}
                    id="direccionCliente"
                    placeholder="Ingrese el valor de la compra"
                    required
                    value="0" // Establecer valor en 0
                    onChange={handleChangeValorCompra}
                    disabled
                  />
                  {renderErrorMessage(errors.ValorCompra)}
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
                  guardarInsumo();
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
          <h1 className="h3 mb-4 text-center text-dark">Gestión de Insumos</h1>
          <div className="text-right">
            <button
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalCliente"
              onClick={() => openModal(1, "", "", "", "", "", "")}
            >
              <i className="fas fa-pencil-alt"></i> Crear Insumo
            </button>
          </div>
        </div>

        {/* <!-- Tabla de Clientes --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Insumos</h6>
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
                    <th>Color</th>
                    <th>Talla</th>
                    <th>Referencia</th>
                    <th>Cantidad</th>
                    <th>Valor de la Compra</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInsumos.map((insumo) => (
                    <tr key={insumo.IdInsumo}>
                      <td>{convertColorIdToName(insumo.IdColor)}</td>
                      <td>{convertTallaIdToName(insumo.IdTalla)}</td>
                      <td>{insumo.Referencia}</td>
                      <td>{insumo.Cantidad}</td>
                      <td>{formatCurrency(insumo.ValorCompra)}</td>

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
                            data-target="#modalCliente"
                            onClick={() => openModal(2, insumo)}
                          // disabled={cliente.Estado != "Activo"}
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm mr-2"
                            onClick={() =>
                              deleteInsumo(
                                insumo.IdInsumo,
                                insumo.Referencia
                              )
                            }
                          // disabled={cliente.Estado != "Activo"}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                          {/* <button
                            className={`btn btn-${insumo.Estado === "Activo" ? "success" : "danger"
                              } btn-sm`}
                            onClick={() =>
                              cambiarEstadoCliente(cliente.IdCliente)
                            }
                          >
                            {insumo.Estado}
                          </button> */}
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
        {/* Fin tabla de clientes */}
      </div>
    </>
  );
};
