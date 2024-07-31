import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Inicio} from "../pages/Landing/Inicio";
import {Productos} from "../pages/Landing/Productos";
import {Contactenos} from "../pages/Landing/Contactenos";
import { Diseniador } from "../pages/Landing/Diseniador";
import { Login } from "../pages/Landing/Login";
import { Register } from "../pages/Landing/Register";
import { RecuperarContraseña } from "../pages/Landing/RecuperarContraseña";
import { LandingLayout } from "../layouts/LandingLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { Dashboard } from "../pages/Admin/Dashboard";
import { Configuracion } from "../pages/Admin/Configuracion";
import { Usuarios } from "../pages/Admin/Usuarios";
import { Proveedores } from "../pages/Admin/Proveedores";
import { Compras } from "../pages/Admin/Compras";
import { Catalogo} from "../pages/Admin/Productos";
import { Disenios } from "../pages/Admin/Disenios";
import { Clientes } from "../pages/Admin/Clientes";
import { Ventas } from "../pages/Admin/Ventas";
import { Pedidos } from "../pages/Admin/Pedidos";
import { Tallas } from "../pages/Admin/Tallas";
import { Colores } from "../pages/Admin/Colores";
import { Carrito } from "../pages/Landing/Carrito";
import { Insumos } from "../pages/Admin/Insumos"
import { ProductoSolo } from "../pages/Landing/ProductoSolo";
import { LoginAdmin } from "../pages/Landing/LoginAdmin";

export const Rutas = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exat path="/" Component={()=> <LandingLayout> <Inicio /> </LandingLayout> } />
        <Route path="/Productos" Component={()=> <LandingLayout> <Productos /> </LandingLayout>  } />
        <Route path="/ProductoSolo/:id" Component={()=> <LandingLayout> <ProductoSolo /> </LandingLayout>  } />
        <Route path="/Carrito" Component={()=> <LandingLayout> <Carrito /> </LandingLayout>  } />
        <Route path="/Contactenos" Component={()=> <LandingLayout> <Contactenos /> </LandingLayout> } />
        <Route path="/Diseniador" Component={()=> <LandingLayout> <Diseniador /> </LandingLayout> } />
        <Route path="/Login" Component={()=> <LandingLayout> <Login /> </LandingLayout> } />
        <Route path="/Register" Component={()=> <LandingLayout> <Register /> </LandingLayout> } />
        <Route path="/RecuperarContraseña" Component={()=> <LandingLayout> <RecuperarContraseña /> </LandingLayout> } />
        
        <Route path="/admin" Component={()=> <AdminLayout> <Dashboard /> </AdminLayout>  } />
        <Route path="/admin/Configuracion" Component={()=> <AdminLayout> <Configuracion /> </AdminLayout> } />
        <Route path="/admin/Usuarios" Component={()=> <AdminLayout> <Usuarios /> </AdminLayout> } />
        <Route path="/admin/Proveedores" Component={()=> <AdminLayout> <Proveedores /> </AdminLayout> } />
        <Route path="/admin/Insumos" Component={()=> <AdminLayout> <Insumos /> </AdminLayout> } />
        <Route path="/admin/Tallas" Component={()=> <AdminLayout> <Tallas /> </AdminLayout> } />
        <Route path="/admin/Colores" Component={()=> <AdminLayout> <Colores /> </AdminLayout> } />
        <Route path="/admin/Compras" Component={()=> <AdminLayout> <Compras /> </AdminLayout> } />
        <Route path="/admin/Productos" Component={()=> <AdminLayout> <Catalogo /> </AdminLayout> } />
        <Route path="/admin/Disenios" Component={()=> <AdminLayout> <Disenios /> </AdminLayout> } />
        <Route path="/admin/Clientes" Component={()=> <AdminLayout> <Clientes /> </AdminLayout> } />
        <Route path="/admin/Ventas" Component={()=> <AdminLayout> <Ventas /> </AdminLayout> } />
        <Route path="/admin/Pedidos" Component={()=> <AdminLayout> <Pedidos /> </AdminLayout> } />
        <Route path="/admin/login" Component={()=> <LandingLayout> < LoginAdmin/> </LandingLayout> } />


        <Route path="*" Component={() => <h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
};


