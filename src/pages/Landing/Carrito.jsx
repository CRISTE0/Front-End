import React, { useEffect, useState } from "react";
import camisetas from "../../assets/img/camisetas";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import axios from "axios";

export const Carrito = () => {

  // validar si no se estropea sin el filtro
  
  const [cartItems, setCartItems] = useState([]);

  // const [totalPedido, setTotalPedido] = useState(null);


  const fetchCartItems = async () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemDetails = await Promise.all(
      cart.map(item =>
        axios.get(`http://localhost:3000/api/productos/${item.IdProd}`)
          .then(res => ({
            ...res.data,
            CantidadSeleccionada: item.CantidadSeleccionada
          }))
          .catch(() => null) // Manejo de error de fetch
      )
    );

    // Filtra los elementos que no sean null y que tengan Publicacion como 'Activo'
    const activeItems = itemDetails.filter(item => item && item.Publicacion === 'Activo');
    setCartItems(activeItems);
        
    console.log(itemDetails);
    
    console.log(activeItems);
    
  };
  
  useEffect(() => {
    
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


  const incrementarCantidad = (idProductoSeleccionado,cantidadProductoDisponible) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Encuentra el índice del producto en el carrito
    const productIndex = cart.findIndex(item => item.IdProd === idProductoSeleccionado);

    if (productIndex !== -1) {

      if (cart[productIndex].CantidadSeleccionada >= cantidadProductoDisponible) {
        show_alerta("Cantidad maxima del producto alcanzada","error")
        return;
      }
      // Incrementa la cantidad del producto en el carrito
      cart[productIndex].CantidadSeleccionada += 1;

      // Actualiza el carrito en el localStorage
      localStorage.setItem('cart', JSON.stringify(cart));


      // Actualiza el estado del carrito en React
      setCartItems(prevCartItems => 
        prevCartItems.map(item => 
          item.id === idProductoSeleccionado 
            ? { ...item, CantidadSeleccionada: item.CantidadSeleccionada + 1 } 
            : item
      ));
      
      fetchCartItems();
    }
  };



  const disminuirCantidad = (idProductoSeleccionado,NombreDisenio) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Encuentra el índice del producto en el carrito
    const productIndex = cart.findIndex(item => item.IdProd === idProductoSeleccionado);

    if (productIndex !== -1) {
      if (cart[productIndex].CantidadSeleccionada > 1) {

        // Reduce la cantidad del producto si es mayor que 1
        cart[productIndex].CantidadSeleccionada -= 1;

        // Actualiza el carrito en el localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Actualiza el estado del carrito en React
        setCartItems(prevCartItems => 
          prevCartItems.map(item => 
            item.id === idProductoSeleccionado 
              ? { ...item, CantidadSeleccionada: item.CantidadSeleccionada - 1 } 
              : item
        ));

        fetchCartItems();

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
            popup: 'swal2-show',
            backdrop: 'swal2-backdrop-show',
            icon: 'swal2-icon-show'
          },
          hideClass: {
            popup: 'swal2-hide',
            backdrop: 'swal2-backdrop-hide',
            icon: 'swal2-icon-hide'
          }
        }).then((result) => {

          // Si se confirma eliminar el producto 
          if (result.isConfirmed) {

            // Elimina el producto del carrito si la cantidad es 1 y se intenta reducir más
            cart.splice(productIndex, 1);
            localStorage.setItem('cart', JSON.stringify(cart));

            // Actualiza el estado del carrito en React
            setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== idProductoSeleccionado));

            console.log(JSON.parse(localStorage.getItem("cart")));


            fetchCartItems();
            show_alerta("El producto fue eliminado del carrito", "success");

          } else if (result.dismiss === Swal.DismissReason.cancel) {
            show_alerta("El producto NO fue eliminado del carrito", "info");
          } else if (result.dismiss === Swal.DismissReason.backdrop || result.dismiss === Swal.DismissReason.esc) {
            show_alerta("El producto NO fue eliminado del carrito", "info");
          }
        });
      };


      }
  };


  const totalPedido = cartItems.reduce((total, item) => {
    return total + (item.CantidadSeleccionada * item.ValorVenta || 0);
  }, 0);


  // Funcion para formatear el precio
  function formatCurrency(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  }

  return (
    <>
      <div className="container my-3 p-3 bg-light " style={{"borderRadius":"10px"}}>
        <div className="row">
          <div className="col-lg-7">

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
                          style={{"width": "65px"}}
                        />
                      </div>

                      <div className="mx-3">
                        {/* nombre producto */}
                        <h5>{item.Disenio.NombreDisenio}</h5>

                        {/* precio producto */}
                        <p className="small mb-0">{formatCurrency(item.ValorVenta) }</p>
                      </div>

                    </div>

                    <div className="d-flex flex-row align-items-center">

                      {/* Eliminar producto del carrito */}
                      {item.CantidadSeleccionada == 1 &&(
                        <button className="m-3" onClick={() => disminuirCantidad(item.IdProducto,item.Disenio.NombreDisenio) }
                         style={{ "width": "30px", "border" : "none" , "background": "transparent" }}>
                          <i className="fas fa-trash-alt"></i>
                        </button>

                      )}


                      {/* Disminuir cantidad del producto */}
                      {item.CantidadSeleccionada > 1 &&(
                        <button className="m-3" onClick={() => disminuirCantidad(item.IdProducto,item.Disenio.NombreDisenio) } 
                          style={{ "width": "30px" , "color":"black" , "border" : "none" , "background": "transparent"}}>
                          <i className="fas fa-minus-circle"></i>
                        </button>
                      )}


                      <div style={{"width": "40px"}}>
                        <h5 className="mb-0">{item.CantidadSeleccionada}</h5>
                      </div>

                      {/* Aumentar cantidad del producto */}
                      <button className="" onClick={() => incrementarCantidad(item.IdProducto, item.Cantidad)} style={{"border" : "none",     "background": "transparent" } }>
                        <i className="fas fa-plus-circle"></i>
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            ))}


          </div>

          {/* informacion cliente */}
          <div className="col-lg-5">
            <div className="card  text-dark rounded-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Ingresa tus datos</h5>
                  
                </div>

                <form className="mt-4">
                  <div
                    data-mdb-input-init
                    className="form-outline form-white mb-4"
                  >
                    <input
                      type="text"
                      id="typeName"
                      className="form-control form-control-lg"
                      size="17"
                      placeholder=""
                    />
                    <label className="form-label" htmlFor="typeName">
                      Nombre Completo
                    </label>
                  </div>

                  <div
                    data-mdb-input-init
                    className="form-outline form-white mb-4"
                  >
                    <input
                      type="text"
                      id="typeText"
                      className="form-control form-control-lg"
                      size="17"
                      placeholder=""
                      minLength="19"
                      maxLength="19"
                    />
                    <label className="form-label" htmlFor="typeText">
                      Teléfono
                    </label>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div
                        data-mdb-input-init
                        className="form-outline form-white"
                      >
                        <input
                          type="text"
                          id="typeExpp"
                          className="form-control form-control-lg"
                          placeholder=""
                          size="7"
                          minLength="7"
                          maxLength="7"
                        />
                        <label className="form-label" htmlFor="typeExpp">
                          Dirección
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        data-mdb-input-init
                        className="form-outline form-white"
                      >
                        <input
                          type="password"
                          id="typeTextll"
                          className="form-control form-control-lg"
                          placeholder=""
                          size="1"
                          minLength="3"
                          maxLength="3"
                        />
                        <label className="form-label" htmlFor="typeTextll">
                          Correo
                        </label>
                      </div>
                    </div>
                  </div>
                </form>

                <hr className="my-4" />

                <div className="d-flex justify-content-between">
                  <p className="mb-2">Subtotal</p>
                  <p className="mb-2">{ formatCurrency(totalPedido)}</p>

                </div>

                {/* <div className="d-flex justify-content-between">
                  <p className="mb-2">Shipping</p>
                  <p className="mb-2">$20.00</p>
                </div> */}

                <div className="d-flex justify-content-between mb-4">
                  <p className="mb-2">Total</p>
                  <p className="mb-2">{ formatCurrency(totalPedido)}</p>
                </div>

                <button
                  type="button"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-info btn-block btn-lg"
                >
                  <div className="d-flex justify-content-between">
                    <span>$4000.00</span>
                    <span>
                      Realizar Pedido{" "}
                      <i className="fas fa-long-arrow-alt-right ms-2"></i>
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
