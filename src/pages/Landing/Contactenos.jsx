import React from "react";

export const Contactenos = () => {
  return (
    <>
      {/* Start Content Page  */}

      {/* Start Contact  */}
      <div className="container d-flex justify-content-center py-5">
        <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "600px" }}>
          <div className="container-fluid  py-5">
            <div className="col-md-6 m-auto text-center">
              <h1 className="h1 text-dark">Contáctenos</h1>
            </div>
          </div>

          <div className="row py-5">
            <form className="col-md-9 m-auto" method="post" role="form">
              <div className="row">
                <div className="form-group col-md-6 mb-3">
                  <label htmlFor="inputname">Nombre</label>
                  <input
                    type="text"
                    className="form-control mt-1"
                    id="inputname"
                    name="name"
                    placeholder="Nombre"
                  />
                </div>
                <div className="form-group col-md-6 mb-3">
                  <label htmlFor="inputemail">Email</label>
                  <input
                    type="email"
                    className="form-control mt-1"
                    id="inputemail"
                    name="email"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="inputsubject">Asunto</label>
                <input
                  type="text"
                  className="form-control mt-1"
                  id="inputsubject"
                  name="subject"
                  placeholder="Asunto"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="inputmessage">Mensaje</label>
                <textarea
                  className="form-control mt-1"
                  id="inputmessage"
                  name="message"
                  placeholder="Mensaje"
                  rows="8"
                ></textarea>
              </div>
              <div className="row">
                <div className="col text-end mt-2">
                  <button type="submit" className="btn btn-success btn-lg px-3">
                    Enviar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* End Contact  */}
    </>
  );
};
