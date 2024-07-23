import React from "react";
import { Link } from "react-router-dom";

export const Login = () => {
  return (
    <>
      {/* formulario */}
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="row w-100">
          <div className="col-12 text-center">
            <h2 className="fw-bold my-4">Login</h2>
          </div>
          <form action="#" className="w-100">
            <div className="mb-3 text-center">
              <label htmlFor="usuario" className="form-label">
                Usuario
              </label>
              <div className="col-12 col-md-3 mx-auto">
                <input
                  type="text"
                  className="form-control"
                  name="Usuario"
                  id="usuario"
                  placeholder="Usuario"
                />
              </div>
            </div>
            <div className="mb-3 text-center">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <div className="col-12 col-md-3 mx-auto">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  id="password"
                  placeholder="Contraseña"
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
                    Iniciar sesión
                  </a>
                </button>
              </div>
            </div>
            <div className="my-3 text-center">
              <samp>
                No tienes cuenta? <Link to={"/Register"} >Regístrate aquí</Link>
              </samp>
              <br />
              <samp>
                ¿Perdiste tu contraseña? <Link to={"/RecuperarContraseña"}>Recuperar contraseña</Link>
              </samp>
            </div>
          </form>
        </div>
      </div>
      {/* FIN formulario */}
    </>
  );
};





