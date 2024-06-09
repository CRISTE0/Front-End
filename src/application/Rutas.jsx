import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Inicio} from "../pages/Landing/Inicio";
import {Productos} from "../pages/Landing/Productos";
import {Contactenos} from "../pages/Landing/Contactenos";
import { Diseniador } from "../pages/Landing/Diseniador";
import { Login } from "../pages/Landing/Login";
import { LandingLayout } from "../layouts/LandingLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { Dashboard } from "../pages/Admin/Dashboard";
import { Usuarios } from "../pages/Admin/Usuarios";
import { Proveedores } from "../pages/Admin/Proveedores";
import { Compras } from "../pages/Admin/Compras";
import { ProductosA } from "../pages/Admin/Productos";
import { Disenios } from "../pages/Admin/Disenios";
import { Clientes } from "../pages/Admin/Clientes";
import { Ventas } from "../pages/Admin/Ventas";
import { Pedidos } from "../pages/Admin/Pedidos";
import { Tallas } from "../pages/Admin/Tallas";
import { Colores } from "../pages/Admin/Colores";
import { Carrito } from "../pages/Landing/Carrito";

export const Rutas = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exat path="/" Component={()=> <LandingLayout> <Inicio /> </LandingLayout> } />
        <Route path="/Productos" Component={()=> <LandingLayout> <Productos /> </LandingLayout>  } />
        <Route path="/Carrito" Component={()=> <LandingLayout> <Carrito /> </LandingLayout>  } />
        <Route path="/Contactenos" Component={()=> <LandingLayout> <Contactenos /> </LandingLayout> } />
        <Route path="/Diseniador" Component={()=> <LandingLayout> <Diseniador /> </LandingLayout> } />
        <Route path="/Login" Component={()=> <LandingLayout> <Login /> </LandingLayout> } />

        
        <Route path="/admin" Component={()=> <AdminLayout> <Dashboard /> </AdminLayout>  } />
        <Route path="/admin/Usuarios" Component={()=> <AdminLayout> <Usuarios /> </AdminLayout> } />
        <Route path="/admin/Proveedores" Component={()=> <AdminLayout> <Proveedores /> </AdminLayout> } />
        <Route path="/admin/Tallas" Component={()=> <AdminLayout> <Tallas /> </AdminLayout> } />
        <Route path="/admin/Colores" Component={()=> <AdminLayout> <Colores /> </AdminLayout> } />
        <Route path="/admin/Compras" Component={()=> <AdminLayout> <Compras /> </AdminLayout> } />
        <Route path="/admin/Productos" Component={()=> <AdminLayout> <ProductosA /> </AdminLayout> } />
        <Route path="/admin/Disenios" Component={()=> <AdminLayout> <Disenios /> </AdminLayout> } />
        <Route path="/admin/Clientes" Component={()=> <AdminLayout> <Clientes /> </AdminLayout> } />
        <Route path="/admin/Ventas" Component={()=> <AdminLayout> <Ventas /> </AdminLayout> } />
        <Route path="/admin/Pedidos" Component={()=> <AdminLayout> <Pedidos /> </AdminLayout> } />


        <Route path="*" Component={() => <h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
};


