import React from "react";
import camisetas from "../../assets/img/camisetas";

export const Carrito = () => {
  return (
    <>
      <div className="container my-3 p-3 bg-light " style={{"borderRadius":"10px"}}>
        <div className="row">
          <div className="col-lg-7">
            {/* productos cliente */}

            <div className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-row align-items-center">
                    <div>
                      <img
                        src={camisetas[0]}
                        className="img-fluid rounded "
                        alt="Shopping item"
                        style={{"width": "65px"}}
                      />
                    </div>
                    <div className="mx-3">
                    {/* nombre producto */}
                      <h5>Camiseta Espacio</h5>
                    {/* precio producto */}

                      <p className="small mb-0">$ 4.000</p>
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <div style={{ "width": "40px" , "color":"black"}}>
                    <i className="fas fa-trash-alt"></i>
                    </div>
                    <div style={{"width": "40px"}}>
                      <h5 className="mb-0">2</h5>
                    </div>
                    <a href="#!" style={{"color":"black"}}>
                      <i className="fas fa-plus-circle"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* informacion cliente */}
          <div className="col-lg-5">
            <div className="card  text-dark rounded-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Ingresa tus datos</h5>
                  
                </div>

                <form className="mt-4">
                  <div
                    data-mdb-input-init
                    className="form-outline form-white mb-4"
                  >
                    <input
                      type="text"
                      id="typeName"
                      className="form-control form-control-lg"
                      size="17"
                      placeholder=""
                    />
                    <label className="form-label" htmlFor="typeName">
                      Nombre Completo
                    </label>
                  </div>

                  <div
                    data-mdb-input-init
                    className="form-outline form-white mb-4"
                  >
                    <input
                      type="text"
                      id="typeText"
                      className="form-control form-control-lg"
                      size="17"
                      placeholder=""
                      minLength="19"
                      maxLength="19"
                    />
                    <label className="form-label" htmlFor="typeText">
                      Teléfono
                    </label>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div
                        data-mdb-input-init
                        className="form-outline form-white"
                      >
                        <input
                          type="text"
                          id="typeExp"
                          className="form-control form-control-lg"
                          placeholder=""
                          size="7"
                          minLength="7"
                          maxLength="7"
                        />
                        <label className="form-label" htmlFor="typeExp">
                          Dirección
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        data-mdb-input-init
                        className="form-outline form-white"
                      >
                        <input
                          type="password"
                          id="typeText"
                          className="form-control form-control-lg"
                          placeholder=""
                          size="1"
                          minLength="3"
                          maxLength="3"
                        />
                        <label className="form-label" htmlFor="typeText">
                          Correo
                        </label>
                      </div>
                    </div>
                  </div>
                </form>

                <hr className="my-4" />

                <div className="d-flex justify-content-between">
                  <p className="mb-2">Subtotal</p>
                  <p className="mb-2">$4.000.00</p>
                </div>

                {/* <div className="d-flex justify-content-between">
                  <p className="mb-2">Shipping</p>
                  <p className="mb-2">$20.00</p>
                </div> */}

                <div className="d-flex justify-content-between mb-4">
                  <p className="mb-2">Total</p>
                  <p className="mb-2">$4.000.00</p>
                </div>

                <button
                  type="button"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-info btn-block btn-lg"
                >
                  <div className="d-flex justify-content-between">
                    <span>$4000.00</span>
                    <span>
                      Realizar Pedido{" "}
                      <i className="fas fa-long-arrow-alt-right ms-2"></i>
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
