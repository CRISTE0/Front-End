import React from "react";

export const Login = () => {
  return (
    <>
      {/* formulario */}

      <div className="container p-5">
        <div className="row">
          <h2 className="fw-bold text-center py-5">Login</h2>
          <form action="#">
            <div className="mb-4 text-center">
              <label htmlFor="" className="form-label">
                Usuario
              </label>
              <div className="col-12 col-md-3 mx-auto">
                <input
                  type="text"
                  className="form-control"
                  name="Usuario"
                  placeholder="Usuario"
                />
              </div>
            </div>
            <div className="mb-4 text-center">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="col-12 col-md-3 mx-auto">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Contraseña"
                />
              </div>
            </div>

            <div className="d-grid text-center">
              <div className="col-12 col-md-3 mx-auto">
                <button type="submit" className="btn btn-success">
                  <a
                    className="text-white"
                    style={{textDecoration:null}}
                    href="../Admin/index.html"
                  >
                    Iniciar sesión
                  </a>
                </button>
              </div>
            </div>

            <div className="my-3 text-center">
              <samp>
                No tienes cuenta? <a>Regístrate aquí</a>
              </samp>
              <br />
              <samp>
                ¿Perdiste tu contraseña? <a>Recuperar contraseña</a>
              </samp>
            </div>
          </form>
        </div>
      </div>

      {/* FIN formulario */}
    </>
  );
};
