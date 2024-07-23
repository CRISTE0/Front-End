import React from "react";
import { Link } from "react-router-dom";

export const Register = () => {
  return (
    <>
      {/* formulario */}
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="row w-100">
          <div className="col-12 text-center">
            <h2 className="fw-bold my-4">Register</h2>
          </div>
          <form action="#" className="w-100">
            <div className="row">
              <div className="col-md-6">
                {/* Tipo doc */}
                <div className="mb-3">
                  <label htmlFor="tipoDocumento" className="form-label">
                    Tipo Documento
                  </label>
                  <select
                    className="form-control"
                    name="tipoDocumento"
                    id="tipoDocumento"
                  >
                    <option value="cedula">Cédula</option>
                    <option value="cedulaExtranjeria">Cédula Extranjería</option>
                  </select>
                </div>
                {/* Fin doc */}

                {/* Documento */}
                <div className="mb-3">
                  <label htmlFor="nroDocumento" className="form-label">
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="nroDocumento"
                    id="nroDocumento"
                    placeholder="Número de Documento"
                  />
                </div>
                {/*Fin Documento */}

                {/* Nombre y Apellido */}
                <div className="mb-3">
                  <label htmlFor="nombreApellido" className="form-label">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombreApellido"
                    id="nombreApellido"
                    placeholder="Nombre y Apellido"
                  />
                </div>
                {/* fin Nombre y Apellido */}

                {/* validar contra */}
                <div className="mb-3">
                  <label htmlFor="validarcontraseña" className="form-label">
                    Validar Contraseña
                  </label>
                  <input
                    type=""
                    className="form-control"
                    name="validarcontraseña"
                    id="validarcontraseña"
                    placeholder="Validar Contraseña"
                  />
                </div>
              </div>
              {/* fin Telefono */}

              {/* Direccion */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="direccion"
                    id="direccion"
                    placeholder="Dirección"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Correo"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Contraseña"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="telefono"
                    id="telefono"
                    placeholder="Teléfono"
                  />
                </div>
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
                    Registrar
                  </a>
                </button>
              </div>
            </div>
            <div className="my-3 text-center">
              <samp>
                ¿Tienes cuenta? <a href="/Login">Ingresa aquí</a>
              </samp>
            </div>
          </form>
        </div>
      </div>
      {/* FIN formulario */}
    </>
  );
};






