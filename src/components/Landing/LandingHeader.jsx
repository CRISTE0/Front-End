import React, { useEffect, useState } from "react";
import imagenesLanding from "../../assets/img/imagenesHome";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { fetchCartItemsNav } from "../../assets/js/getProductosCarrito";

// import "../assets/css/bootstrap.min.css"
// import "../assets/css/templatemo.css"
// import "../assets/css/custom.css"
// import "../assets/css/fontawesome.min.css"

export const LandingHeader = () => {
  const { auth } = useAuth();
  const {logout} = useAuth();

  const [cantidadTotal, setCantidadTotal] = useState(0);
  const { renderTrigger } = useAuth();

  let isClient;
  let isUser;

  if (auth) {
    isClient = auth.idCliente != null ? true : false;

    isUser = auth.idUsuario != null ? true : false;
  }

  
  
  useEffect(() => {
    const obtenerDatosCarrito = async () => {
      try {
        const sumaCantidades = await fetchCartItemsNav(auth);
        setCantidadTotal(sumaCantidades);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    if (isClient) {
      obtenerDatosCarrito();
    }

  }, [isClient,renderTrigger]); // renderTrigger como dependencia


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
                href="mailto:softshirt0@gmail.com"
              >
                softshirt0@gmail.com
              </a>
              <i className="fa fa-phone mx-2"></i>
              <a
                className="navbar-sm-brand text-light text-decoration-none"
                href="tel:3122942574"
              >
                312 2942574
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

      <nav className="navbar navbar-expand-lg navbar-light shadow">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to={"/"}
            className="navbar-brand text-success logo h1 align-self-center"
          >
            <img src={imagenesLanding[0]} alt="LogoSoftShirt" width="120" />{" "}
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-toggle="collapse"
            data-target="#templatemo_main_nav"
            aria-controls="templatemo_main_nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="templatemo_main_nav">
            <div className="flex-fill">
              <ul className="nav navbar-nav d-flex justify-content-between mx-lg-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={"/"}>
                    Inicio
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/Productos"}>
                    Productos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/Contactenos"}>
                    Contáctenos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/Diseniador"}>
                    Diseñador
                  </Link>
                </li>

                {!isClient && !isUser && (
                    <li className="nav-item">
                      <Link className="nav-link" to={"/Login"}>
                        Iniciar Sesión
                      </Link>
                    </li>
                  )}
              </ul>
            </div>

            {/* <!-- Iconos nav --> */}
            <div
              className="navbar align-self-center"
              style={{ flexWrap: "inherit" }}
            >
              <div className="d-lg-none flex-sm-fill mt-3 mb-4 col-7 col-sm-auto pr-3"></div>

              {/* <!-- Carrito --> */}
              {isClient && (
                <>
                  <Link
                    className="text-decoration-none btn"
                    to={"/Carrito"}
                  >
                    <i className="fa fa-fw fa-cart-arrow-down text-black mr-1"></i>
                    <span
                      className="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark"
                      id="carritoNav"
                    >
                      {cantidadTotal}
                    </span>
                  </Link>

                  <ul className="navbar-nav ">
                  {/* <!-- Nav Item - Alerts --> */}


                  {/* <!-- Nav Item - User Information --> */}
                  <li className="nav-item dropdown no-arrow">
                    <Link
                      className=" dropdown-toggle"
                      
                      id="userDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fas fa-user-circle fa-lg"></i>
                      
                    </Link>
                    
                    {/* <!-- Dropdown - User Information --> */}
                    <div
                      className="dropdown-menu dropdown-menu-right shadow animated--grow-in text-black"
                      aria-labelledby="userDropdown"
                    >
                      
                      <Link to={"/admin"} className="dropdown-item " >
                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Centro Personal
                      </Link>

                      <Link to={`/ActualizarDatos/${auth.idCliente}`} className="dropdown-item" >
                        <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                        Ajustes
                      </Link>

                      {/* <a className="dropdown-item text-decoration-none" href="#">
                        <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                        Activity Log
                      </a> */}
                      

                      <div className="dropdown-divider"></div>
                      <Link
                        className="dropdown-item"
                        onClick={logout}
                      >
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        Cerrar Sesión 
                      </Link>
                    </div>
                  </li>
                </ul>

                  {/* <Link
                    className="nav-icon text-decoration-none"
                    to={"/MAMAWEVO_EL_LOGIN"}
                  >
                    <i className="fa fa-fw fa-user text-black mr-3"></i>
                  </Link> */}
                </>
              )}
            </div>
            {/* <!-- Iconos nav --> */}
          </div>
        </div>
      </nav>

      {/* <!-- Close Header --> */}
    </>
  );
};
