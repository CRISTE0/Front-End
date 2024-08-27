import React, { useEffect, useState } from "react";
import camisetas from "../../assets/img/camisetas";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthProvider";

import axios from "axios";

export const Carrito = () => {
  const { auth } = useAuth();
  let timeoutId = null;
  const [inputValues, setInputValues] = useState({});
  const { triggerRender } = useAuth();
  const url = "http://localhost:3000/api/pedidos";

  console.log(auth);

  // validar si no se estropea sin el filtro

  const [cartItems, setCartItems] = useState([]);
  const [Cliente, setCliente] = useState("");

  // const [totalPedido, setTotalPedido] = useState(null);

  const getCliente = async () => {
    console.log(auth.idCliente);

    let respuesta = await axios.get(
      `http://localhost:3000/api/clientes/${auth.idCliente}`
    );

    setCliente(respuesta.data);
    // console.log(respuesta);
  };

  const fetchCartItems = async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemDetails = await Promise.all(
      cart.map(
        (item) =>
          axios
            .get(`http://localhost:3000/api/productos/${item.IdProd}`)
            .then((res) => ({
              ...res.data,
              CantidadSeleccionada: item.CantidadSeleccionada,
            }))
            .catch(() => null) // Manejo de error de fetch
      )
    );

    // Filtra los elementos que no sean null y que tengan Publicacion como 'Activo'
    const activeItems = itemDetails.filter(
      (item) => item && item.Publicacion === "Activo"
    );
    setCartItems(activeItems);

    console.log(itemDetails);

    console.log(activeItems);
  };

  useEffect(() => {
    getCliente();
    fetchCartItems();
  }, []);

  const show_alerta = (message, type) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: message,
      icon: type,
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
      didOpen: () => {
        // Selecciona la barra de progreso y ajusta su estilo
        const progressBar = MySwal.getTimerProgressBar();
        if (progressBar) {
          progressBar.style.backgroundColor = "black";
          progressBar.style.height = "6px";
        }
      },
    });
  };

  const incrementarCantidad = (
    idProductoSeleccionado,
    cantidadProductoDisponible
  ) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Encuentra el índice del producto en el carrito
    const productIndex = cart.findIndex(
      (item) => item.IdProd === idProductoSeleccionado
    );

    if (productIndex !== -1) {
      if (
        cart[productIndex].CantidadSeleccionada >= cantidadProductoDisponible
      ) {
        show_alerta("Cantidad maxima del producto alcanzada", "error");
        return;
      }
      
      // Incrementa la cantidad del producto en el carrito
      cart[productIndex].CantidadSeleccionada += 1;
      
      
            const newCantidad = cart[productIndex].CantidadSeleccionada;
            setInputValues(prev => ({...prev, [idProductoSeleccionado]: newCantidad.toString()}));
            
      // Actualiza el carrito en el localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Actualiza el estado del carrito en React
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.id === idProductoSeleccionado
            ? { ...item, CantidadSeleccionada: item.CantidadSeleccionada + 1 }
            : item
        )
      );

      fetchCartItems();
      triggerRender();
    }
  };

  const disminuirCantidad = (idProductoSeleccionado, NombreDisenio) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Encuentra el índice del producto en el carrito
    const productIndex = cart.findIndex(
      (item) => item.IdProd === idProductoSeleccionado
    );

    if (productIndex !== -1) {
      if (cart[productIndex].CantidadSeleccionada > 1) {
        // Reduce la cantidad del producto si es mayor que 1
        cart[productIndex].CantidadSeleccionada -= 1;

        const newCantidad = cart[productIndex].CantidadSeleccionada;
        setInputValues(prev => ({...prev, [idProductoSeleccionado]: newCantidad.toString()}));
        

        // Actualiza el carrito en el localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Actualiza el estado del carrito en React
        setCartItems((prevCartItems) =>
          prevCartItems.map((item) =>
            item.id === idProductoSeleccionado
              ? { ...item, CantidadSeleccionada: item.CantidadSeleccionada - 1 }
              : item
          )
        );

        fetchCartItems();
        triggerRender();


        console.log(cart);
      } else {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          title: `¿Seguro de eliminar el producto ${NombreDisenio} del carrito  ?`,
          icon: "question",
          text: "No se podrá dar marcha atrás",
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
          showClass: {
            popup: "swal2-show",
            backdrop: "swal2-backdrop-show",
            icon: "swal2-icon-show",
          },
          hideClass: {
            popup: "swal2-hide",
            backdrop: "swal2-backdrop-hide",
            icon: "swal2-icon-hide",
          },
        }).then((result) => {
          // Si se confirma eliminar el producto
          if (result.isConfirmed) {
            // Elimina el producto del carrito si la cantidad es 1 y se intenta reducir más
            cart.splice(productIndex, 1);
            localStorage.setItem("cart", JSON.stringify(cart));

            // Actualiza el estado del carrito en React
            setCartItems((prevCartItems) =>
              prevCartItems.filter((item) => item.id !== idProductoSeleccionado)
            );
           triggerRender();


            console.log(JSON.parse(localStorage.getItem("cart")));

            fetchCartItems();
            show_alerta("El producto fue eliminado del carrito", "success");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            show_alerta("El producto NO fue eliminado del carrito", "info");
          } else if (
            result.dismiss === Swal.DismissReason.backdrop ||
            result.dismiss === Swal.DismissReason.esc
          ) {
            show_alerta("El producto NO fue eliminado del carrito", "info");
          }
        });
      }
    }
  };


  const handleCantidadChange = (e, idProductoSeleccionado, cantidadMaxima, nombreProducto) => {
    let newValue = e.target.value;
    
    // Permitir campo vacío o números positivos
    if (newValue === '' || /^[1-9]\d*$/.test(newValue)) {
      let numericValue = newValue === '' ? '' : parseInt(newValue, 10);
      
      if (numericValue !== '' && numericValue > cantidadMaxima) {
        numericValue = cantidadMaxima;
        newValue = cantidadMaxima.toString();
      }
      
      setInputValues(prev => ({...prev, [idProductoSeleccionado]: newValue}));
      
      if (numericValue !== '') {
        updateCartAndState(idProductoSeleccionado, numericValue);
      }
    }
  };
  
  const updateCartAndState = (idProductoSeleccionado, newCantidad) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productIndex = cart.findIndex(item => item.IdProd === idProductoSeleccionado);
  
    if (productIndex !== -1) {
      cart[productIndex].CantidadSeleccionada = newCantidad;
      localStorage.setItem("cart", JSON.stringify(cart));
  
      setCartItems(prevCartItems =>
        prevCartItems.map(item =>
          item.id === idProductoSeleccionado
            ? { ...item, CantidadSeleccionada: newCantidad }
            : item
        )
      );
  
      fetchCartItems();
      triggerRender();
    }
  };
  
  const handleInputBlur = (idProductoSeleccionado, cantidadMaxima) => {
    const currentValue = inputValues[idProductoSeleccionado];
    if (currentValue === '' || parseInt(currentValue, 10) < 1) {
      setInputValues(prev => ({...prev, [idProductoSeleccionado]: '1'}));
      updateCartAndState(idProductoSeleccionado, 1);
    } else if (parseInt(currentValue, 10) > cantidadMaxima) {
      setInputValues(prev => ({...prev, [idProductoSeleccionado]: cantidadMaxima.toString()}));
      updateCartAndState(idProductoSeleccionado, cantidadMaxima);
    }
  };
  
  const totalPedido = cartItems.reduce((total, item) => {
    return total + (item.CantidadSeleccionada * item.ValorVenta || 0);
  }, 0);

  // Funcion para formatear el precio
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };

  const obtenerFechaActual = () => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses van de 0 a 11
    const dia = String(fecha.getDate()).padStart(2, "0"); // Obtiene el día del mes

    return `${año}/${mes}/${dia}`;
  };

  const obtenerSubtotal = (cantidad, precio) => {
    return cantidad * precio;
  };

  const obtenerDetalles = (productos) => {
    return productos.map((producto) => ({
      IdProducto: producto.IdProducto,
      cantidad: producto.CantidadSeleccionada,
      precio: producto.ValorVenta,
      subtotal: obtenerSubtotal(
        producto.CantidadSeleccionada,
        producto.ValorVenta
      ),
    }));
  };

  console.log(obtenerFechaActual());

  const enviarSolicitud = async () => {
    try {
      let parametros = {
        IdCliente: auth.idCliente,
        Detalles: obtenerDetalles(cartItems),
        TipoPago:"Transferencia",
        Fecha: obtenerFechaActual(),
        Total: totalPedido,
        idImagenComprobante:"0",
        imagenComprobante:"0",
        intentos:3,
        IdEstadoPedido: 1,
      };

      console.log(parametros);
      console.log(obtenerFechaActual());

      // return;

      const respuesta = await axios({
        method: "POST",
        url: url,
        data: parametros,
      });

      console.log(respuesta);

      show_alerta(respuesta.data.message, "success");

      // document.getElementById("btnCerrar").click();
      // getPedidos();
      // getProductos();
    } catch (error) {
      console.log(error);

      if (error.response) {
        show_alerta(error.response.data.message, "error");
      } else if (error.request) {
        show_alerta("Error en la solicitud", "error");
      } else {
        show_alerta("Error desconocido", "error");
      }
    }
  };

  return (
    <>
      <div
        className="container my-3 p-3 bg-light "
        style={{ borderRadius: "10px" }}
      >
        <div className="row">
          <div className="col-lg-6">

            {/* productos cliente */}
            {cartItems.map((item) => (
              <div key={item.IdProducto} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex flex-row align-items-center">
                      {/* Imagen del producto */}
                      <div>
                        <img
                          src={item.Disenio.ImagenReferencia}
                          className="img-fluid rounded "
                          alt="Shopping item"
                          style={{ width: "65px" }}
                        />
                      </div>

                      <div className="mx-3">
                        {/* nombre producto */}
                        <h5>{item.Disenio.NombreDisenio}</h5>

                        {/* precio producto */}
                        <p className="small mb-0">
                          {formatCurrency(item.ValorVenta)}
                        </p>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-center">
                      {/* Eliminar producto del carrito */}
                      {item.CantidadSeleccionada == 1 && (
                        <button
                          className="m-3"
                          onClick={() =>
                            disminuirCantidad(
                              item.IdProducto,
                              item.Disenio.NombreDisenio
                            )
                          }
                          style={{
                            width: "30px",
                            border: "none",
                            background: "transparent",
                          }}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      )}

                      {/* Disminuir cantidad del producto */}
                      {item.CantidadSeleccionada > 1 && (
                        <button
                          className="m-3"
                          onClick={() =>
                            disminuirCantidad(
                              item.IdProducto,
                              item.Disenio.NombreDisenio
                            )
                          }
                          style={{
                            width: "30px",
                            color: "black",
                            border: "none",
                            background: "transparent",
                          }}
                        >
                          <i className="fas fa-minus-circle"></i>
                        </button>
                      )}

                      <div style={{ width: "auto" }}>

                      <input
                        // min="0"
                        // min="0" 
                        type="text"
                        className="form-control form-control-dm"
                        style={{ width: "45px", "textAlign":"center" }}
                        value={inputValues[item.IdProducto] ?? item.CantidadSeleccionada}
                        onChange={(e) =>
                          handleCantidadChange(
                            e,
                            item.IdProducto,
                            item.Cantidad,
                            item.Disenio.NombreDisenio
                          )
                        }

                        onBlur={() => handleInputBlur(item.IdProducto, item.Cantidad)}

                      />                 
                      
                       </div>

                      {/* Aumentar cantidad del producto */}
                      <button
                        className=""
                        onClick={() =>
                          incrementarCantidad(item.IdProducto, item.Cantidad)
                        }
                        style={{ border: "none", background: "transparent" }}
                      >
                        <i className="fas fa-plus-circle"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* informacion cliente */}
          <div className="col-lg-6">
            <div className="card  -dark rounded-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Confirma tus datos</h5>
                </div>

                <div className="mt-4">
                  <div className="form-outline form-white mb-4">
                    <label className="form-label" htmlFor="Nombre">
                      Nombre Completo
                    </label>

                    <input
                      type="text"
                      id="Nombre"
                      disabled
                      className="form-control form-control-lg"
                      defaultValue={Cliente.NombreApellido}
                    />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <label className="form-label" htmlFor="Telefono">
                      Teléfono
                    </label>

                    <input
                      type="text"
                      id="Telefono"
                      disabled
                      className="form-control form-control-lg"
                      defaultValue={Cliente.Telefono}
                    />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <label className="form-label" htmlFor="typeExpp">
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="typeExpp"
                      disabled
                      className="form-control form-control-lg"
                      placeholder=""
                      defaultValue={Cliente.Direccion}
                    />
                  </div>

                  <div className="form-outline form-white">
                    <label className="form-label" htmlFor="Correo">
                      Correo
                    </label>
                    <input
                      type="text"
                      id="Correo"
                      disabled
                      className="form-control form-control-lg"
                      placeholder=""
                      defaultValue={Cliente.Correo}
                    />
                  </div>
                </div>

                <hr className="my-4" />

                <div className="d-flex justify-content-between">
                  <p className="mb-2">Subtotal</p>
                  <p className="mb-2">{formatCurrency(totalPedido)}</p>
                </div>

                {/* <div className="d-flex justify-content-between">
                  <p className="mb-2">Shipping</p>
                  <p className="mb-2">$20.00</p>
                </div> */}

                <div className="d-flex justify-content-between mb-4">
                  <p className="mb-2">Total</p>
                  <p className="mb-2">{formatCurrency(totalPedido)}</p>
                </div>

                <button
                  type="button"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-success btn-block btn-lg"
                >
                  <div
                    className="d-flex justify-content-between"
                    onClick={enviarSolicitud}
                  >
                    <span>Realizar Pedido</span>
                    <span>
                      <i className="fas fa-shopping-basket ms-2"></i>
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
