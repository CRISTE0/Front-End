import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alerta } from "../../assets/js/functions";

export const Tallas = () => {
  let url = "http://localhost:3000/api/tallas";

  const [Tallas, setTallas] = useState([]);
  const [IdTalla, setIdTalla] = useState("");
  const [Talla, setTalla] = useState([]);
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getTallas();
  }, []);

  const getTallas = async () => {
    const respuesta = await axios.get(url);
    setTallas(respuesta.data);
    console.log(respuesta.data);
  };

  const openModal = (op, IdTalla, Talla) => {
    setIdTalla("");
    setTalla("");
    setOperation(op);
    if (op === 1) {
      setTitle("Registrar talla");
    } else if (op === 2) {
      setTitle("Editar talla");
      setIdTalla(IdTalla);
      setTalla(Talla);
    }
    // window.setTimeout(function () {
    //   document.getElementById("nombre").focus();
    // }, 500);
  };

  const validar = () => {
    var parametros;
    var metodo;
    if (Talla === "") {
      show_alerta("Escribe el nombre de la talla ", "warning");
    } else {
      console.log(Talla);
      if (operation === 1) {
        parametros = {
          Talla: Talla.trim(),
        };
        metodo = "POST";
      } else {
        parametros = {
          IdTalla: IdTalla,
          Talla: Talla,
        };
        metodo = "PUT";
      }
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    if (metodo === "PUT") {
      let urlPut = `${url}/${parametros.IdTalla}`;

      console.log(parametros);
      console.log(url);
      await axios({ method: metodo, url: urlPut, data: parametros })
        .then(function (respuesta) {
          console.log(respuesta);
          var tipo = respuesta.data[0];
          var msj = respuesta.data.message;
          show_alerta(msj, "success");
          // if (jtipo === "success") {
          document.getElementById("btnCerrar").click();
          getTallas();
          // }
        })
        .catch(function (error) {
          if (!error.response.data.error) {
            let mensaje = error.response.data.message;

            show_alerta(mensaje, "error");
          } else {
            show_alerta(error.response.data.error, "error");
          }

          console.log(error);
        });
    } else if (metodo === "DELETE") {
      console.log(parametros);
      let urlDelete = `${url}/${parametros.IdTalla}`;

      await axios({ method: metodo, url: urlDelete, data: parametros })
        .then(function (respuesta) {
          console.log(respuesta);
          var tipo = respuesta.data[0];
          var msj = respuesta.data.message;
          show_alerta(msj, "success");
          // if (tipo === "success") {
          document.getElementById("btnCerrar").click();
          getTallas();
          // }
        })
        .catch(function (error) {
          show_alerta("Error en la solicitud", "error");
          console.log(error);
        });
    } else {
      //POST
      await axios({ method: metodo, url: url, data: parametros })
        .then(function (respuesta) {
          console.log(respuesta);
          var tipo = respuesta.data[0];
          var msj = respuesta.data.message;
          console.log(Talla);

          show_alerta(msj, "success");
          // if (jtipo === "success") {
          document.getElementById("btnCerrar").click();
          getTallas();
          // }
        })
        .catch(function (error) {
          if (!error.response.data.error) {
            let mensaje = error.response.data.message;

            show_alerta(mensaje, "error");
          } else {
            show_alerta(error.response.data.error, "error");
          }
          console.log(error);
          console.log(error.response.data.error);
        });
    }
  };

  const deletetalla = (IdTalla, Talla) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: "¿Seguro de eliminar la talla  " + Talla + " ?",
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setIdTalla(IdTalla);
        enviarSolicitud("DELETE", { IdTalla: IdTalla });
      } else {
        show_alerta("La talla NO fue eliminada", "info");
      }
    });
  };

  return (
    <>
      {/* <!-- Modal para crear talla --> */}

      <div
        className="modal fade"
        id="modalTallas"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalAñadirTallaLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalAñadirTallaLabel">
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
              <input
                type="hidden"
                id="id"
                value={IdTalla}
                onChange={(e) => setIdTalla(e.target.value)}
              ></input>

              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-toggle-on"></i>
                </span>
                <input
                  type="text"
                  id="precio"
                  className="form-control"
                  placeholder="Talla"
                  value={Talla}
                  onChange={(e) => setTalla(e.target.value)}
                ></input>
              </div>

              <div className="modal-footer">
                <div className="text-right">
                  <button
                    type="button"
                    id="btnCerrar"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancelar
                  </button>

                  <button onClick={() => validar()} className="btn btn-success">
                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fin modal crear proveedor */}

      {/* <!-- Inicio de tallas --> */}
      <div className="container-fluid">
        {/* <!-- Page Heading --> */}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="h3 mb-4 text-center text-dark">Tallas</h1>

          <div className="text-center p-3">
            <button
              onClick={() => openModal(1)}
              type="button"
              className="btn btn-dark"
              data-toggle="modal"
              data-target="#modalTallas"
            >
              <i className="fas fa-pencil-alt"></i> Crear talla
            </button>
          </div>
        </div>

        {/* <!-- Tabla Proveedor --> */}
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Tallas</h6>
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
                    <th>#</th>
                    <th>Talla</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {Tallas.map((talla, i) => (
                    <tr key={talla.IdTalla}>
                      <td>{i + 1}</td>

                      <td>{talla.Talla}</td>

                      <td>
                        <button
                          onClick={() =>
                            openModal(2, talla.IdTalla, talla.Talla)
                          }
                          className="btn btn-warning"
                          data-toggle="modal"
                          data-target="#modalTallas"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        &nbsp;
                        <button
                          onClick={() =>
                            deletetalla(talla.IdTalla, talla.Talla)
                          }
                          className="btn btn-danger"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Fin tabla tallas */}
      </div>
    </>
  );
};
