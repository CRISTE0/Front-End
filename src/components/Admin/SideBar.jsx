import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import imagenesLanding from "../../assets/img/imagenesHome";


export const SideBar = ({ isActive }) => {
  const location = useLocation();
  const { auth } = useAuth();

  const menuItems = [
    {
      path: "/admin/Dashboard",
      icon: "fas fa-fw fa-tachometer-alt",
      text: "Dashboard",
      permission: "Dashboard",
    },
    {
      path: "/admin/Configuracion",
      icon: "fas fa-fw fa-cog",
      text: "Configuración",
      permission: "Configuración",
    },
    {
      path: "/admin/Usuarios",
      icon: "fas fa-fw fa-user",
      text: "Usuarios",
      permission: "Usuarios",
    },
    {
      path: "/admin/Proveedores",
      icon: "fas fa-solid fa-user",
      text: "Proveedores",
      permission: "Proveedores",
    },
    {
      path: "/admin/Insumos",
      icon: "fas fa-solid fa-box-open",
      text: "Insumos",
      permission: "Insumos",
    },
    {
      path: "/admin/Colores",
      icon: "fas fa-palette",
      text: "Colores",
      permission: "Colores",
    },
    {
      path: "/admin/Tallas",
      icon: "fas fa-sort-alpha-down",
      text: "Tallas",
      permission: "Tallas",
    },
    {
      path: "/admin/Compras",
      icon: "fas fa-solid fa-cart-plus",
      text: "Compras",
      permission: "Compras",
    },
    {
      path: "/admin/Productos",
      icon: "fas fa-fw fa-tshirt",
      text: "Productos",
      permission: "Productos",
    },
    {
      path: "/admin/Disenios",
      icon: "fas fa-fw fa-paint-brush",
      text: "Diseños",
      permission: "Diseños",
    },
    {
      path: "/admin/Clientes",
      icon: "fas fa-fw fa-user",
      text: "Clientes",
      permission: "Clientes",
    },
    {
      path: "/admin/Ventas",
      icon: "fas fa-fw fa-store",
      text: "Ventas",
      permission: "Ventas",
    },
    {
      path: "/admin/Pedidos",
      icon: "fas fa-shipping-fast",
      text: "Pedidos",
      permission: "Pedidos",
    },
  ];

  const dashboardItem = menuItems[0];
  const otherItems = menuItems.slice(1);

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
            <Link to={"/admin/Dashboard"}
              className="sidebar-brand d-flex align-items-center justify-content-center"
            >
              <div className="sidebar-brand-icon rotate-n-15">
                {/* <i className="fas fa-user"></i> */}
                <img src={imagenesLanding[0]} alt="LogoSoftShirt" width="120"/>     
                  
              </div>
              {/* <div className="sidebar-brand-text mx-3">SOFT-SHIRT</div> */}
            </Link>

            {/* Render Dashboard if user has permission */}
            {auth.permissions.includes(dashboardItem.permission) && (
              <>
                <hr className="sidebar-divider" />

                <li
                  className={`nav-item ${
                    location.pathname === dashboardItem.path ? "active" : ""
                  }`}
                >
                  <Link to={dashboardItem.path} className="nav-link">
                    <i className={dashboardItem.icon}></i>
                    <span>{dashboardItem.text}</span>
                  </Link>
                </li>
              </>
            )}
            
            <hr className="sidebar-divider" />

            {/* <!-- Heading --> */}
            <div className="sidebar-heading">Modulos</div>

            {/* Render other menu items */}
            {otherItems.map((item, index) => (
              auth.permissions.includes(item.permission) && (
              <li
                key={index}
                className={`nav-item ${
                  location.pathname == item.path ? "active" : ""
                }`}
              >
                <Link to={item.path} className="nav-link">
                  <i className={item.icon}></i>
                  <span>{item.text}</span>
                </Link>
              </li>
              )
            ))}

            {/* <!-- Divider --> */}
            <hr className="sidebar-divider d-none d-md-block" />
          </div>
        </div>
      </ul>
    </div>
  );
};
