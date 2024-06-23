import React from "react";
import { Link, useLocation } from "react-router-dom";

export const SideBar = ({ isActive }) => {
  const location = useLocation();

  return (
    <div className="sidebarAdmin">
      <ul
        className={`navbar-nav bg-gradient-success sidebar sidebar-dark accordion ${
          isActive ? "" : "toggled"
        } `}
        id="sidebarAdmin"
        style={{}}
      >
        <div className="scrollBox">
          <div className="scrollBox-inner">
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

            <li
              className={`nav-item ${
                location.pathname === "/admin/" ? "active" : ""
              }`}
            >
              <Link to={"/admin/"} className="nav-link">
                <i className="fas fa-fw fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </Link>
            </li>

            {/* <!-- Divider --> */}
            <hr className="sidebar-divider" />

            {/* <!-- Heading --> */}
            <div className="sidebar-heading">Modulos</div>

            {/* <!-- Configuracion --> */}
            <li
              className={`nav-item ${
                location.pathname === "/admin/Configuracion" ? "active" : ""
              }`}
            >
              <Link to={"/admin/Configuracion"} className="nav-link">
                <i className="fas fa-fw fa-cog"></i>
                <span>Configuración</span>
              </Link>
            </li>

            {/* <!-- Usuarios --> */}
            <li
              className={`nav-item ${
                location.pathname === "/admin/Usuarios" ? "active" : ""
              }`}
            >
              <Link to={"/admin/Usuarios"} className="nav-link">
                <i className="fas fa-fw fa-user"></i>
                <span>Usuarios</span>
              </Link>
            </li>

            {/* <!-- PROVEEDOR --> */}
            <li
              className={`nav-item ${
                location.pathname === "/admin/Proveedores" ? "active" : ""
              }`}
            >
              <Link to={"/admin/Proveedores"} className="nav-link">
                <i className="fas fa-solid fa-user"></i>
                <span>Proveedores</span>
              </Link>
            </li>

            {/* <!-- INSUMOS --> */}
            <li
              className={`nav-item ${
                location.pathname === "/admin/Insumos" ? "active" : ""
              }`}
            >
              <Link to={"/admin/Insumos"} className="nav-link">
                <i className="fas fa-solid fa-box-open"></i>
                <span>Insumos</span>
              </Link>
            </li>

            {/* <!-- COLORES --> */}
            <li
              className={`nav-item ${
                location.pathname === "/admin/Colores" ? "active" : ""
              }`}
            >
              <Link to={"/admin/Colores"} className="nav-link">
                <i className="fas fa-palette "></i>
                <span>Colores</span>
              </Link>
            </li>

            {/* <!-- TALLAS --> */}
            <li
              className={`nav-item ${
                location.pathname === "/admin/Tallas" ? "active" : ""
              }`}
            >
              <Link to={"/admin/Tallas"} className="nav-link">
                <i className="fas fa-sort-alpha-down "></i>
                <span>Tallas</span>
              </Link>
            </li>

            {/* <!-- COMPRAS --> */}
            <li
              className={`nav-item ${
                location.pathname === "/admin/Compras" ? "active" : ""
              }`}
            >
              <Link to={"/admin/Compras"} className="nav-link">
                <i className="fas fa-solid fa-cart-plus"></i>
                <span>Compras</span>
              </Link>
            </li>

            {/* <!-- PRODUCTOS --> */}
            <li
              className={`nav-item ${
                location.pathname === "/admin/Productos" ? "active" : ""
              }`}
            >
              <Link to={"/admin/Productos"} className="nav-link">
                <i className="fas fa-fw fa-tshirt"></i>
                <span>Productos</span>
              </Link>
            </li>

            {/* <!-- DISEÑOS --> */}
            <li
              className={`nav-item ${
                location.pathname === "/admin/Disenios" ? "active" : ""
              }`}
            >
              <Link to={"/admin/Disenios"} className="nav-link">
                <i className="fas fa-fw fa-paint-brush"></i>
                <span>Diseños</span>
              </Link>
            </li>

            {/* <!-- Clientes --> */}
            <li
              className={`nav-item ${
                location.pathname === "/admin/Clientes" ? "active" : ""
              }`}
            >
              <Link to={"/admin/Clientes"} className="nav-link">
                <i className="fas fa-fw fa-user"></i>
                <span>Clientes</span>
              </Link>
            </li>

            {/* <!-- VENTAS --> */}
            <li
              className={`nav-item ${
                location.pathname === "/admin/Ventas" ? "active" : ""
              }`}
            >
              <Link to={"/admin/Ventas"} className="nav-link">
                <i className="fas fa-fw fa-store"></i>
                <span>Ventas</span>
              </Link>
            </li>

            {/* <!-- PEDIDOS --> */}
            <li
              className={`nav-item ${
                location.pathname === "/admin/Pedidos" ? "active" : ""
              }`}
            >
              <Link
                to={"/admin/Pedidos"}
                className="nav-link"
                href="Pedidos.html"
              >
                <i className="fas fa-shipping-fast"></i> <span>Pedidos</span>
              </Link>
            </li>

            {/* <!-- Divider --> */}
            <hr className="sidebar-divider d-none d-md-block" />
          </div>
        </div>
      </ul>
    </div>
  );
};
