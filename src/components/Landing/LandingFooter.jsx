

// import "../assets/js/jquery-1.11.0.min.js"
// import "../assets/js/jquery-migrate-1.2.1.min.js"
// import "../assets/js/bootstrap.bundle.min.js"
// import "../assets/js/slick.min.js"
// import "../assets/js/templatemo.js"
// import "../assets/js/custom.js"
// import "../assets/js/jquery-1.11.0.min.js"

import React from "react";
import { HashLink as Link } from 'react-router-hash-link';
export const LandingFooter = () => {
  return (
    <>
      {/* inicio Footer */}
      <footer className="bg-black" id="tempaltemo_footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4 pt-5">
              <h2 className="h2 text-success border-bottom pb-3 border-light logo">
                SoftShirt
              </h2>
              <ul className="list-unstyled text-light footer-link-list ">
                <li>
                  <i className="fas fa-map-marker-alt fa-fw mx-1"></i>
                  Calle 99B #35A – 48
                </li>
                <li>
                  <i className="fa fa-phone fa-fw mx-1"></i>
                  <a className="text-decoration-none" href="tel:3122942574">
                    312 2942574
                  </a>
                </li>
                <li>
                  <i className="fa fa-envelope fa-fw mx-1"></i>
                  <a
                    className="text-decoration-none"
                    href="mailto:softshirt0@gmail.com"
                  >
                    softshirt0@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-md-4 pt-5">
              <h2 className="h2 text-light border-bottom pb-3 border-light">
                Productos
              </h2>
              <ul className="list-unstyled text-light footer-link-list">
                <li>
                  <Link  to={"/Productos"} className="text-decoration-none" >
                    Camisetas estampadas
                  </Link>
                </li>

                <li>
                  <Link  to={"/Diseniador"} className="text-decoration-none" >
                    Crea tu camiseta
                  </Link>
                </li>
               
              </ul>
            </div>

            <div className="col-md-4 pt-5">
              <h2 className="h2 text-light border-bottom pb-3 border-light">
                Información
              </h2>
              <ul className="list-unstyled text-light footer-link-list">
                <li>
                  <Link to={"/"} className="text-decoration-none" >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to={"/#sobreNosotros"} className="text-decoration-none" >
                    Sobre nosotros
                  </Link>
                </li>
                <li>
                  <Link to={"/#servicios"} className="text-decoration-none" >
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link to={"/Contactenos"} className="text-decoration-none" >
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link to={"/#FAQs"} className="text-decoration-none" >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div className="w-100 bg-black py-3">
          <div className="container">
            <div className="row pt-2">
              <div className="col-12">
                <p className="text-center text-light">
                  Copyright &copy; 2024 SoftShirt
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* <!-- fin Footer --> */}

      

      {/* Modal  */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog p-5 ">
          <div className="modal-content d-flex">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Contenido del Carrito
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body ">
              <div className="d-flex align-items-center">
                {/* <img src="../vista/assets/img/camisetas/camisa5.jpg" alt="" height="250"> */}
                <div className="margin-left-20 p-3">
                  <p>
                    <b>Camiseta Chapo</b>{" "}
                  </p>
                  {/* <br> */}
                  <p>
                    <strong>precio:</strong>35.000
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Seguir Comprando
              </button>
              <button type="button" className="btn btn-primary">
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
