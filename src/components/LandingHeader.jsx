import React from "react";
import imagenesLanding from "../assets/img/imagenesLanding/imagenesLanding";


// import "../assets/css/bootstrap.min.css"
// import "../assets/css/templatemo.css"
// import "../assets/css/custom.css"
// import "../assets/css/fontawesome.min.css"


export const LandingHeader = () => {
  return (
    <>


      {/* <!-- inicio Top Nav --> */}
      <nav
        className="navbar navbar-expand-lg bg-dark navbar-light d-none d-lg-block"
        id="templatemo_nav_top"
      >
        <div className="container text-light">
          <div className="w-100 d-flex justify-content-between">
            <div>
              <i className="fa fa-envelope mx-2"></i>
              <a
                className="navbar-sm-brand text-light text-decoration-none"
                href="mailto:info@company.com"
              >
                info@company.com
              </a>
              <i className="fa fa-phone mx-2"></i>
              <a
                className="navbar-sm-brand text-light text-decoration-none"
                href="tel:010-020-0340"
              >
                010-020-0340
              </a>
            </div>
            <div>
              <a
                className="text-light"
                href="https://fb.com/templatemo"
                target="_blank"
                rel="sponsored"
              >
                <i className="fab fa-facebook-f fa-sm fa-fw me-2"></i>
              </a>
              <a
                className="text-light"
                href="https://www.instagram.com/"
                target="_blank"
              >
                <i className="fab fa-instagram fa-sm fa-fw me-2"></i>
              </a>
              <a
                className="text-light"
                href="https://twitter.com/"
                target="_blank"
              >
                <i className="fab fa-twitter fa-sm fa-fw me-2"></i>
              </a>
              <a
                className="text-light"
                href="https://www.linkedin.com/"
                target="_blank"
              >
                <i className="fab fa-linkedin fa-sm fa-fw"></i>
              </a>
            </div>
          </div>
        </div>
      </nav>
      {/* <!-- Close Top Nav --> */}

      {/* <!-- Header --> */}
      
      <nav class="navbar navbar-expand-lg navbar-light shadow">
    <div class="container d-flex justify-content-between align-items-center">
      <a class="navbar-brand text-success logo h1 align-self-center" href="index.html">
      <img src={imagenesLanding[0]} alt="LogoSoftShirt" width="120"/>      </a>

      <button
        class="navbar-toggler border-0"
        type="button"
        data-toggle="collapse"
        data-target="#templatemo_main_nav"
        aria-controls="templatemo_main_nav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="templatemo_main_nav">
        <div class="flex-fill">
          <ul class="nav navbar-nav d-flex justify-content-between mx-lg-auto">
            <li class="nav-item">
              <a class="nav-link" href="index.html">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="LandingPage/shop.html">Productos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="LandingPage/contact.html">Contáctenos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="LandingPage/diseñador.html">Diseñador</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="LandingPage/login.html">Login</a>
            </li>
          </ul>
        </div>

        {/* <!-- Iconos nav --> */}
        <div class="navbar align-self-center" style={{flexWrap:"inherit"}}>
          <div class="d-lg-none flex-sm-fill mt-3 mb-4 col-7 col-sm-auto pr-3"></div>

          {/* <!-- Modal carrito --> */}
          <a class="nav-icon text-decoration-none btn" href="#" data-toggle="modal" data-target="#exampleModal">
            <i class="fa fa-fw fa-cart-arrow-down text-black mr-1"></i>
            <span class="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark">1</span>
          </a>

          <a class="nav-icon text-decoration-none" href="#">
            <i class="fa fa-fw fa-user text-black mr-3"></i>
          </a>
        </div>
        {/* <!-- Iconos nav --> */}
      </div>
    </div>
  </nav>



      {/* <!-- Close Header --> */}
    </>
  );
};
