import React from "react";
import { Link } from "react-router-dom";

export const RecuperarContraseña = () => {
  const [Correo, setCorreo] = useState("");
  return (
    <>
      {/* formulario */}
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="row w-100">
          <div className="col-12 text-center">
            <h2 className="fw-bold my-4">Recuperar Contraseña</h2>
          </div>
          <form action="#" className="w-100">
            <div className="mb-3 text-center">
              <label htmlFor="correo" className="form-label">
                Correo
              </label>
              <div className="col-12 col-md-3 mx-auto">
                <input
                  type="text"
                  className="form-control"
                  name="Correo"
                  id="Correo"
                  placeholder="Correo"
                />
              </div>
            </div>

            <div className="d-grid text-center">
              <div className="col-12 col-md-3 mx-auto">
                <button type="submit" className="btn btn-success">
                  <a
                    className="text-white"
                    style={{ textDecoration: 'none' }}
                    href="../Admin/index.html"
                  >
                    Recuperar
                  </a>
                </button>
              </div>
            </div>
            <div className="my-3 text-center">
            </div>
          </form>
        </div>
      </div>
      {/* FIN formulario */}
    </>
  );
};