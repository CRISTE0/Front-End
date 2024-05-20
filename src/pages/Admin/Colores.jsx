import "@fortawesome/fontawesome-free/css/all.min.css";

// Importación de módulos y componentes de React
import React, { useEffect, useState } from "react";
import axios from "axios"; // Biblioteca para realizar solicitudes HTTP
import Swal from "sweetalert2"; // Biblioteca para mensajes de alerta
import withReactContent from "sweetalert2-react-content"; // SweetAlert2 con soporte para React
import { show_alerta } from "../../assets/js/functions"; // Función personalizada
import { ChromePicker } from "react-color"; // Componente de react-color

export const Colores = () => {
  let url = "http://localhost:3000/api/colores";
  const [Colores, setColores] = useState([]);
  const [IdColor, setIdColor] = useState("");
  const [Color, setColor] = useState("");
  const [Referencia, setReferencia] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");

  // useEffect para realizar acciones después de la renderización
  useEffect(() => {
    getColores(); // Llama a la función getColores al montar el componente
  }, []);

  // Función asíncrona para obtener los colores desde el servidor
  const getColores = async () => {
    const respuesta = await axios.get(url); // Realiza una solicitud GET utilizando axios
    setColores(respuesta.data); // Actualiza el estado con los datos recibidos
    console.log(respuesta.data); // Imprime los datos recibidos en la consola
  };
  // Función para abrir el modal de registro o edición de colores
  const openModal = (op, idColor, color, referencia) => {
    // Actualiza el estado con los valores necesarios para el modal
    setIdColor("");
    setColor("");
    setReferencia("");
    setOperation(op);
    if (op === 1) {
      setTitle("Registrar Colores");
    } else if (op === 2) {
      setTitle("Editar Color");
      setIdColor(idColor);
      setColor(color);
      setReferencia(referencia);
    }
  };

  // Función para validar y enviar la solicitud al servidor
  const validar = () => {
    // Definición de expresiones regulares para validar entradas
    // Expresión regular para validar solo letras y espacios
    const letrasRegex = /^[A-Za-z\s]+$/;
    const colorHexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/; // Color hexadecimal

    if (Color === "") {
      show_alerta("Escribe el color", "warning");
    } else if (!letrasRegex.test(Color)) {
      show_alerta("El color solo puede contener letras", "warning");
    } else if (Referencia === "") {
      show_alerta("Escribe la referencia", "warning");
    } else if (!colorHexRegex.test(Referencia)) {
      show_alerta(
        "La referencia debe ser un color hexadecimal válido",
        "warning"
      );
    } else {
      // Construcción de los parámetros y método HTTP según la operación
      let parametros, metodo;
      if (operation === 1) {
        parametros = {
          Color: Color,
          Referencia: Referencia,
        };
        metodo = "POST";
      } else {
        parametros = {
          IdColor: IdColor,
          Color: Color,
          Referencia: Referencia,
        };
        metodo = "PUT";
      }
      enviarSolicitud(metodo, parametros); // Llama a la función para enviar la solicitud
    }
  };

  // Función para enviar la solicitud al servidor
  const enviarSolicitud = async (metodo, parametros) => {
    // Lógica para manejar diferentes métodos HTTP
    if (metodo === "PUT") {
      // Construye la URL para la solicitud PUT
      let urlPut = `${url}/${parametros.IdColor}`;
      // Realiza la solicitud PUT utilizando axios
      await axios({ method: metodo, url: urlPut, data: parametros })
        .then(function (respuesta) {
          // Manejo de la respuesta del servidor
          console.log(respuesta);
          var tipo = respuesta.data[0];
          var msj = respuesta.data.message;
          show_alerta(msj, "success");
          document.getElementById("btnCerrar").click(); // Cierra el modal
          getColores(); // Actualiza la lista de colores
        })
        .catch(function (error) {
          show_alerta("Error en la solicitud", "error");
          console.log(error);
        });
    } else if (metodo === "DELETE") {
      // Construye la URL para la solicitud DELETE
      let urlDelete = `${url}/${parametros.IdColor}`;
      // Realiza la solicitud DELETE utilizando axios
      await axios({ method: metodo, url: urlDelete, data: parametros })
        .then(function (respuesta) {
          // Manejo de la respuesta del servidor
          console.log(respuesta);
          var tipo = respuesta.data[0];
          var msj = respuesta.data.message;
          show_alerta(msj, "success");
          document.getElementById("btnCerrar").click(); // Cierra el modal
          getColores(); // Actualiza la lista de colores
        })
        .catch(function (error) {
          show_alerta("Error en la solicitud", "error");
          console.log(error);
        });
    } else {
      // Realiza la solicitud POST utilizando axios
      await axios({ method: metodo, url: url, data: parametros })
        .then(function (respuesta) {
          // Manejo de la respuesta del servidor
          console.log(respuesta);
          var tipo = respuesta.data[0];
          var msj = respuesta.data.message;
          show_alerta(msj, "success");
          document.getElementById("btnCerrar").click(); // Cierra el modal
          getColores(); // Actualiza la lista de colores
        })
        .catch(function (error) {
          show_alerta("Error en la solicitud", "error");
          console.log(error);
        });
    }
  };

  // Función para eliminar un color
  const deleteColor = (id, color) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      // Crea un modal de confirmación utilizando SweetAlert2
      title: `¿Seguro de eliminar el color ${color}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        enviarSolicitud("DELETE", { IdColor: id }); // Si se confirma, llama a la función para eliminar el color
      } else {
        show_alerta("El color NO fue eliminado", "info");
      }
    });
  };

  return (
    <>
      {/* <!-- Modal para crear colores --> */}

      <div
        className="modal fade"
        id="modalColores"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ModalAñadirColorLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalAñadirColorLabel">
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
              <input type="hidden" id="IdColor"></input>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa fa-paint-brush" aria-hidden="true"></i>
                </span>
                <input
                  type="text"
                  id="color"
                  className="form-control"
                  placeholder="Color"
                  value={Color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa fa-hashtag" aria-hidden="true"></i>
                </span>
                <ChromePicker
                  color={Referencia}
                  onChange={(color) => setReferencia(color.hex)}
                />
              </div>
              <div className="text-right">
                <button
                  type="button"
                  id="btnCerrar"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Cerrar
                </button>
                <button onClick={() => validar()} className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk"></i>
                  Guardar Color
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fin modal crear colores */}

      {/* <!-- Inicio de Colores --> */}
      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-4 text-center text-dark">Colores</h1>

          <div className="text-center p-3">
            <button
              onClick={() => openModal(1)}
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalColores"
            >
              <i className="fas fa-pencil-alt"></i> Crear Color
            </button>
          </div>
        </div>

        {/* <!-- Tabla Color --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Colores</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table
                className="table table-bordered"
                id=""
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>Color</th>
                    <th>Referencia</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tfoot>
                  <tr>
                    <th>Color</th>
                    <th>Referencia</th>
                    <th>Acciones</th>
                  </tr>
                </tfoot>
                <tbody>
                  {Colores.map((color) => (
                    <tr key={color.IdColor}>
                      <td>{color.Color}</td>
                      <td>
                        {color.Referencia}
                        {/* Muestra un cuadro de color con el valor hexadecimal */}
                        <div
                          style={{
                            backgroundColor: color.Referencia,
                            width: "20px",
                            height: "20px",
                            display: "inline-block",
                            marginLeft: "5px",
                          }}
                        ></div>
                      </td>
                      <td>
                        {/* Contenedor para los botones de editar y eliminar */}
                        <div className="d-flex">
                          {/* Botón para editar un color */}
                          <button
                            onClick={() =>
                              openModal(
                                2,
                                color.IdColor,
                                color.Color,
                                color.Referencia
                              )
                            }
                            className="btn btn-warning mr-1"
                            data-toggle="modal"
                            data-target="#modalColores"
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>
                          {/* Botón para eliminar un color */}
                          <button
                            onClick={() =>
                              deleteColor(color.IdColor, color.Color)
                            }
                            className="btn btn-danger"
                          >
                            <i className="fas fa-trash-alt"></i>
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
