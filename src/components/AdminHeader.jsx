import React from "react";
import { AdminFooter } from "./AdminFooter";
import { Link } from "react-router-dom";

export const AdminHeader = ({ children }) => {
  return (
    <>
      <div id="page-top">
        {/* <!-- Page Wrapper --> */}
        <div id="wrapper">
          {/* <!-- Sidebar --> */}
          <ul
            className="navbar-nav bg-gradient-success sidebar sidebar-dark accordion"
            id="accordionSidebar"
          >
            {/* <!-- Sidebar - Brand --> */}
            <a
              className="sidebar-brand d-flex align-items-center justify-content-center"
              href="index.html"
            >
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-laugh-wink"></i>
              </div>
              <div className="sidebar-brand-text mx-3">SOFT-SHIRT</div>
            </a>

            {/* <!-- Divider --> */}
            <hr className="sidebar-divider my-0" />

            {/* <!-- Nav Item - Dashboard --> */}
            <li className="nav-item active">
              <a className="nav-link" href="index.html">
                <i className="fas fa-fw fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </a>
            </li>

            {/* <!-- Divider --> */}
            <hr className="sidebar-divider" />

            {/* <!-- Heading --> */}
            <div className="sidebar-heading">Modulos</div>

            {/* <!-- Usuarios --> */}
            {/* Usuarios */}
            <li className="nav-item">
              <Link to={"/admin/usuarios"} className="nav-link">
                <i className="fas fa-fw fa-user"></i>
                <span>Usuarios</span>
              </Link>
            </li>


            {/* <!-- PROVEEDOR --> */}
            <li className="nav-item">
              <a className="nav-link" href="Proveedor.html">
                {/* <!-- <i className='bx bx-store-alt'></i> --> */}
                <i className="fas fa-solid fa-user"></i>
                <span>Proveedores</span>
              </a>
            </li>

            {/* <!-- COMPRAS --> */}
            <li className="nav-item">
              <a className="nav-link" href="Compras.html">
                {/* <!-- <i className='bx bx-store-alt'></i> --> */}
                <i className="fas fa-solid fa-cart-plus"></i>
                <span>Compras</span>
              </a>
            </li>

            {/* <!-- PRODUCTOS --> */}
            <li className="nav-item">
              <a className="nav-link" href="Productos.html">
                {/* <!-- <i className='bx bx-store-alt'></i> --> */}
                <i className="fas fa-fw fa-tshirt"></i>
                <span>Productos</span>
              </a>
            </li>

            {/* <!-- DISEÑOS --> */}
            <li className="nav-item">

              <a className="nav-link" href="Disenios.html">
                {/* <!-- <i className='bx bx-store-alt'></i> --> */}
                <i className="fas fa-fw fa-paint-brush"></i>
                <span>Diseños</span>
              </a>
            </li>

            {/* <!-- Clientes --> */}
            <li className="nav-item">
              <a className="nav-link" href="Clientes.html">
                {/* <!-- <i className='bx bx-store-alt'></i> --> */}
                <i className="fas fa-fw fa-user"></i>
                <span>Clientes</span>
              </a>
            </li>

            {/* <!-- VENTAS --> */}
            <li className="nav-item">
              <a className="nav-link" href="Ventas.html">
                {/* <!-- <i className='bx bx-store-alt'></i> --> */}
                <i className="fas fa-fw fa-store"></i>
                <span>Ventas</span>
              </a>
            </li>

            {/* <!-- PEDIDOS --> */}
            <li className="nav-item">
              <a className="nav-link" href="Pedidos.html">
                {/* <!-- <i className='bx bx-store-alt'></i> --> */}
                <i className="fas fa-shipping-fast"></i> <span>Pedidos</span>
              </a>
            </li>

            {/* <!-- Divider --> */}
            <hr className="sidebar-divider d-none d-md-block" />

            {/* <!-- Sidebar Toggler (Sidebar) --> */}
            <div className="text-center d-none d-md-inline">
              <button
                className="rounded-circle border-0"
                id="sidebarToggle"></button>
            </div>
          </ul>
          {/* <!-- End of Sidebar --> */}

          {/* <!-- Content Wrapper --> */}
          <div id="content-wrapper" className="d-flex flex-column">
            {/* <!-- Main Content --> */}
            <div id="content">
              {/* <!-- Topbar --> */}
              <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                {/* <!-- Sidebar Toggle (Topbar) --> */}
                <button
                  id="sidebarToggleTop"
                  className="btn btn-link d-md-none rounded-circle mr-3"
                >
                  <i className="fa fa-bars"></i>
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
                        Douglas McGee
                      </span>
                      <img
                        className="img-profile rounded-circle"
                        src="img/undraw_profile.svg"
                      />
                    </a>
                    {/* <!-- Dropdown - User Information --> */}
                    <div
                      className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="userDropdown"
                    >
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Profile
                      </a>
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                        Settings
                      </a>
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                        Activity Log
                      </a>
                      <div className="dropdown-divider"></div>
                      <a
                        className="dropdown-item"
                        href="#"
                        data-toggle="modal"
                        data-target="#logoutModal"
                      >
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        Logout
                      </a>
                    </div>
                  </li>
                </ul>
              </nav>
              {/* <!-- End of Topbar --> */}
            </div>

            {children}

            {/* <!-- Footer --> */}
            {<AdminFooter />}
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
                <a className="btn btn-primary" href="login.html">
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
