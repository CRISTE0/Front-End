import React, { useState } from "react";
import { AdminFooter } from "./AdminFooter";
import { Link, useNavigate } from "react-router-dom";
import { SideBar } from "./SideBar";
import { useAuth } from "../../context/AuthProvider";
import { useLocation } from "react-router-dom";

export const AdminHeader = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  // const [TituloDinamico, setTituloDinamico] = useState(null);

  let TituloDinamico;

  const changeClass = () => {
    setIsActive(!isActive);
  };

  const { logout } = useAuth();

  const { auth } = useAuth();

  switch (location.pathname) {
    case "/admin/Dashboard":
      TituloDinamico = "Dashboard";
      break;
    case "/admin/Configuracion":
      TituloDinamico = "Gestión de configuración";
      break;
    case "/admin/Proveedores":
      TituloDinamico = "Gestión de proveedores";
      break;
    case "/admin/Usuarios":
      TituloDinamico = "Gestión de usuarios";
      break;
    case "/admin/Insumos":
      TituloDinamico = "Gestión de insumos";
      break;
    case "/admin/Colores":
      TituloDinamico = "Gestión de colores";
      break;
    case "/admin/Tallas":
      TituloDinamico = "Gestión de tallas";
      break;
    case "/admin/Compras":
      TituloDinamico = "Gestión de compras";
      break;

    case "/admin/Productos":
      TituloDinamico = "Gestión de productos";
      break;

    case "/admin/Disenios":
      TituloDinamico = "Gestión de diseños";
      break;

    case "/admin/Clientes":
      TituloDinamico = "Gestión de clientes";
      break;

    case "/admin/Ventas":
      TituloDinamico = "Gestión de ventas";
      break;

    case "/admin/Pedidos":
      TituloDinamico = "Gestión de pedidos";
      break;
  }

  return (
    <>
      <div id="page-top">
        {/* <!-- Page Wrapper --> */}
        <div id="wrapper">
          {/* <!-- Sidebar --> */}

          <SideBar isActive={isActive} />

          {/* <!-- End of Sidebar --> */}

          {/* <!-- Content Wrapper --> */}
          <div id="content-wrapper" className="d-flex flex-column">
            {/* <!-- Main Content --> */}
            <div id="content">
              {/* <!-- Topbar --> */}
              <nav className="navbar navbar-expand navbar-light bg-white topbar mb-1 static-top shadow">
                {/* <!-- Sidebar Toggle (Topbar) --> */}

                <h1 className="text-dark">{TituloDinamico}</h1>

                <button
                  id="sidebarToggleTop"
                  className="btn btn-link d-md-none rounded-circle mr-3"
                  onClick={changeClass}
                >
                  <i className="fas fa-bars" style={{ color: "black" }}></i>
                </button>

                {/* <!-- Topbar Search --> */}

                {/* <!-- Topbar Navbar --> */}
                <ul className="navbar-nav ml-auto">
                  {/* <!-- Nav Item - Alerts --> */}

                  <div className="topbar-divider d-none d-sm-block"></div>

                  {/* <!-- Nav Item - User Information --> */}
                  <li className="nav-item dropdown no-arrow">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="userDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                        {auth.user}
                      </span>
                      <i className="fas fa-user-circle fa-lg"></i>
                      {/* <img
                        className="img-profile rounded-circle"
                        src=""
                        alt="User"
                      /> */}
                    </a>

                    {/* <!-- Dropdown - User Information --> */}
                    <div
                      className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="userDropdown"
                    >
                      {auth.idUsuario && (
                        <Link to={"/admin"} className="dropdown-item">
                          <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                          Centro Personal
                        </Link>
                      )}

                      {/* Renderizar solo si es un cliente  */}
                      {auth.idCliente && (
                        <>
                          <Link to={"/"} className="dropdown-item">
                            <i className="fas fa-home fa-sm fa-fw mr-2 text-gray-400"></i>
                            Inicio
                          </Link>

                          <Link
                            to={`/ActualizarDatos/${auth.idCliente}`}
                            className="dropdown-item"
                          >
                            <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                            Ajustes
                          </Link>
                        </>
                      )}

                      <div className="dropdown-divider"></div>
                      {auth.idUsuario ? (
                        <Link className="dropdown-item"  to={"/admin/login"} onClick={logout}>
                          <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                          Cerrar Sesión
                        </Link>
                      ):(  
                        <Link className="dropdown-item"  to={"/login"} onClick={logout}>
                          <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                          Cerrar Sesión
                        </Link>
  
                      )}
                      
                    </div>
                  </li>
                </ul>
              </nav>
              {/* <!-- End of Topbar --> */}

              {children}
              {/* {<AdminFooter />} */}
            </div>

            {/* <!-- Footer --> */}
            {/* <!-- End of Footer --> */}
          </div>
          {/* <!-- End of Content Wrapper --> */}
        </div>
        {/* <!-- End of Page Wrapper --> */}

        {/* <!-- Scroll to Top Button--> */}
        <a className="scroll-to-top rounded" href="#page-top">
          <i className="fas fa-angle-up"></i>
        </a>

        {/* <!-- Logout Modal--> */}
        <div
          className="modal fade"
          id="logoutModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Ready to Leave?
                </h5>
                <button
                  className="close"
                  type="button"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                Select "Logout" below if you are ready to end your current
                session.
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  type="button"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <a className="btn btn-primary" onClick={logout}>
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
