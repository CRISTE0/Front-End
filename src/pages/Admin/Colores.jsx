import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alerta } from "../../assets/js/functions";
import { ChromePicker } from "react-color";

export const Colores = () => {
  let url = "http://localhost:3000/api/colores";
  const [Colores, setColores] = useState([]);
  const [IdColor, setIdColor] = useState("");
  const [Color, setColor] = useState("");
  const [Referencia, setReferencia] = useState("");
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getColores();
  }, []);

  const getColores = async () => {
    const respuesta = await axios.get(url);
    setColores(respuesta.data);
  };

  const openModal = (op, idColor, color, referencia) => {
    setIdColor("");
    setColor("");
    setReferencia("");
    setOperation(op);
    setErrors({});

    if (op === 1) {
      setTitle("Registrar Colores");
    } else if (op === 2) {
      setTitle("Editar Color");
      setIdColor(idColor);
      setColor(color);
      setReferencia(referencia);
    }
  };

  const validateColores = (value) => {
    if (!value) {
      return "Escribe el color";
    }
    if (!/^[A-Za-záéíóúÁÉÍÓÚ\s]+$/.test(value)) {
      return "El color solo puede contener letras y tildes";
    }
    return "";
  };

  const handleChangeColor = (e) => {
    const value = e.target.value;
    setColor(value);

    const errorMessage = validateColores(value);
    setErrors((prevState) => ({
      ...prevState,
      colores: errorMessage,
    }));
  };

  const renderErrorMessage = (errorMessage) => {
    return errorMessage ? (
      <div className="invalid-feedback">{errorMessage}</div>
    ) : null;
  };

  const validar = () => {
    const errorMessage = validateColores(Color);
    setErrors({ colores: errorMessage });

    if (!errorMessage) {
      let parametros, metodo;
      if (operation === 1) {
        parametros = { Color, Referencia };
        metodo = "POST";
      } else {
        parametros = { IdColor, Color, Referencia };
        metodo = "PUT";
      }
      enviarSolicitud(metodo, parametros);
    }
  };

  const enviarSolicitud = async (metodo, parametros) => {
    try {
      let urlRequest = url;
      if (metodo === "PUT" || metodo === "DELETE") {
        urlRequest = `${url}/${parametros.IdColor}`;
      }
      const respuesta = await axios({ method: metodo, url: urlRequest, data: parametros });
      console.log(respuesta);
      Swal.fire("Éxito", respuesta.data.message, "success");
      document.getElementById("btnCerrar").click();
      getColores();
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

  const deleteColor = (id, color) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: `¿Seguro de eliminar el color ${color}?`,
      icon: "question",
      text: "No se podrá dar marcha atrás",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        enviarSolicitud("DELETE", { IdColor: id });
      } else {
        Swal.fire("Cancelado", "El color NO fue eliminado", "info");
      }
    });
  };

  return (
    <>
      <div className="modal fade" id="modalColores" tabIndex="-1" role="dialog" aria-labelledby="ModalAñadirColorLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalAñadirColorLabel">{title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <input type="hidden" id="Color"></input>
              <div className="form-group">

                <input
                  type="text"
                  className={`form-control ${errors.colores ? "is-invalid" : ""}`}
                  id="nombreProveedor"
                  placeholder="Ingrese el color"
                  required
                  value={Color}
                  onChange={handleChangeColor}
                />
                {renderErrorMessage(errors.colores)}
              </div>
              <label className="d-flex justify-content-">Seleciona la referencia del color: </label>
              <div className="input-group mb-3 d-flex justify-content-center" style={{
                }}>
                <ChromePicker
                  color={Referencia}
                  onChange={(color) => setReferencia(color.hex)}
                />
              </div>


              <div className="text-right">
                <button type="button" id="btnCerrar" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                <button onClick={() => validar()} className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk"></i>
                  Guardar Color
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
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

        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Colores</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered" id="" width="100%" cellSpacing="0">
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
                        <div className="d-flex">
                          <button
                            onClick={() => openModal(2, color.IdColor, color.Color, color.Referencia)}
                            className="btn btn-warning mr-1"
                            data-toggle="modal"
                            data-target="#modalColores"
                          >
                            <i className="fas fa-sync-alt"></i>
                          </button>
                          <button
                            onClick={() => deleteColor(color.IdColor, color.Color)}
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
      </div>
    </>
  );
};
