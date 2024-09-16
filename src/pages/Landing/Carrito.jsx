import React, { useEffect, useState } from "react";
import imagenes from "../../assets/img/imagenesHome";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthProvider";
import show_alerta from "../../components/Show_Alerta/show_alerta";
import Loader from "../../components/Loader/loader";

import axios from "axios";
import { useNavigate } from "react-router";

export const Carrito = () => {
  const { auth } = useAuth();
  let timeoutId = null;
  const [inputValues, setInputValues] = useState({});
  const { triggerRender } = useAuth();
  const url = "https://softshirt-1c3fad7d72e8.herokuapp.com/api/pedidos";
  const navigate = useNavigate();

  const [showMessage, setShowMessage] = useState(null);

  // console.log(auth);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [cartItems, setCartItems] = useState([]);
  const [Cliente, setCliente] = useState("");

  // const [totalPedido, setTotalPedido] = useState(null);

  const getCliente = async () => {
    setLoading(true); // Mostrar el loader antes de realizar la solicitud
    try {
      console.log(auth.idCliente);

      let respuesta = await axios.get(
        `https://softshirt-1c3fad7d72e8.herokuapp.com/api/clientes/${auth.idCliente}`
      );

      setCliente(respuesta.data);
      // console.log(respuesta);
    } catch (error) {
      console.error("Error al obtener el cliente:", error);
      show_alerta({
        message: "Error al cargar los datos del cliente",
        type: "error",
      });
    }finally{
    setLoading(false); // Mostrar el loader antes de realizar la solicitud
    }
  };

  const fetchCartItems = async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setLoading(true); // Mostrar el loader antes de realizar la solicitud

    try {
      const itemDetails = await Promise.all(
        cart.map(
          (item) =>
            axios
              .get(`https://softshirt-1c3fad7d72e8.herokuapp.com/api/productos/${item.IdProd}`)
              .then((res) => {
                // Filtrar el ProductoInsumos para mantener solo el insumo con el IdIns seleccionado
                const insumoSeleccionado = res.data.ProductoInsumos.find(
                  (insumo) => insumo.IdInsumo == item.IdIns
                );

                // Devolver el objeto del producto con el insumo seleccionado y la cantidad
                return {
                  ...res.data,
                  ProductoInsumos: insumoSeleccionado
                    ? [insumoSeleccionado] // Si el insumo fue encontrado, mantenlo en el array
                    : [], // Si no se encontró, devuelve un array vacío
                  CantidadSeleccionada: item.CantidadSeleccionada,
                };
              })
              .catch(() => null) // Manejo de error de fetch para cada producto
        )
      );

      // Filtra los elementos que no sean null y que tengan Publicacion como 'Activo'
      const activeItems = itemDetails.filter(
        (item) =>
          (item && item.Publicacion == "Activo") ||
          (item.Publicacion == "Inactivo" && item.IdUsuario == auth.idCliente)
      );
      setCartItems(activeItems);

      if (activeItems.length == 0) {
        setShowMessage(true);
      } else {
        setShowMessage(false);
      }

      console.log(itemDetails);
      console.log(activeItems);
    } catch (error) {
      console.error("Error al obtener los elementos del carrito:", error);
      show_alerta({
        message: "Error al cargar los productos del carrito",
        type: "error",
      });
    }finally {
      setLoading(false); // Mostrar el loader antes de realizar la solicitud
    }
  };

  useEffect(() => {
    getCliente();
    fetchCartItems();
  }, []);

  const incrementarCantidad = (
    idInsumoProductoSeleccionado,
    cantidadProductoDisponible
  ) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Encuentra el índice del producto en el carrito
    const productIndex = cart.findIndex(
      (item) => item.IdIns == idInsumoProductoSeleccionado
    );

    // si encuentra el producto
    if (productIndex !== -1) {
      if (
        cart[productIndex].CantidadSeleccionada >= cantidadProductoDisponible
      ) {
        show_alerta({
          message: "Cantidad máxima del producto alcanzada",
          type: "error",
        });
        return;
      }

      // Incrementa la cantidad del producto en el carrito
      cart[productIndex].CantidadSeleccionada += 1;

      const newCantidad = cart[productIndex].CantidadSeleccionada;
      setInputValues((prev) => ({
        ...prev,
        [idInsumoProductoSeleccionado]: newCantidad.toString(),
      }));

      // Actualiza el carrito en el localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Actualiza el estado del carrito en React
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.ProductoInsumos[0].IdInsumo == idInsumoProductoSeleccionado
            ? { ...item, CantidadSeleccionada: item.CantidadSeleccionada + 1 }
            : item
        )
      );

      fetchCartItems();
      triggerRender();
    }
  };

  const disminuirCantidad = (idInsumoProductoSeleccionado, NombreDisenio) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Encuentra el índice del producto en el carrito
    const productIndex = cart.findIndex(
      (item) => item.IdIns == idInsumoProductoSeleccionado
    );

    if (productIndex !== -1) {
      if (cart[productIndex].CantidadSeleccionada > 1) {
        // Reduce la cantidad del producto si es mayor que 1
        cart[productIndex].CantidadSeleccionada -= 1;

        const newCantidad = cart[productIndex].CantidadSeleccionada;
        setInputValues((prev) => ({
          ...prev,
          [idInsumoProductoSeleccionado]: newCantidad.toString(),
        }));

        // Actualiza el carrito en el localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Actualiza el estado del carrito en React
        setCartItems((prevCartItems) =>
          prevCartItems.map((item) =>
            item.ProductoInsumos[0].IdInsumo == idInsumoProductoSeleccionado
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
              prevCartItems.filter(
                (item) => item.id !== idInsumoProductoSeleccionado
              )
            );
            triggerRender();

            console.log(JSON.parse(localStorage.getItem("cart")));

            fetchCartItems();
            show_alerta({
              message: "El producto fue eliminado del carrito",
              type: "success",
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            show_alerta({
              message: "El producto NO fue eliminado del carrito",
              type: "info",
            });
          } else if (
            result.dismiss === Swal.DismissReason.backdrop ||
            result.dismiss === Swal.DismissReason.esc
          ) {
            show_alerta({
              message: "El producto NO fue eliminado del carrito",
              type: "info",
            });
          }
        });
      }
    }
  };

  const handleCantidadChange = (
    e,
    idInsumoProductoSeleccionado,
    cantidadMaxima
  ) => {
    let newValue = e.target.value;

    // Permitir campo vacío o números positivos
    if (newValue === "" || /^[1-9]\d*$/.test(newValue)) {
      let numericValue = newValue === "" ? "" : parseInt(newValue, 10);

      if (numericValue !== "" && numericValue > cantidadMaxima) {
        numericValue = cantidadMaxima;
        newValue = cantidadMaxima.toString();
        show_alerta({
          message: "Cantidad máxima del producto alcanzada",
          type: "warning",
        });
      }

      setInputValues((prev) => ({
        ...prev,
        [idInsumoProductoSeleccionado]: newValue,
      }));

      if (numericValue !== "") {
        updateCartAndState(idInsumoProductoSeleccionado, numericValue);
      }
    }
  };

  const updateCartAndState = (idInsumoProductoSeleccionado, newCantidad) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productIndex = cart.findIndex(
      (item) => item.IdIns == idInsumoProductoSeleccionado
    );

    if (productIndex !== -1) {
      cart[productIndex].CantidadSeleccionada = newCantidad;
      localStorage.setItem("cart", JSON.stringify(cart));

      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.ProductoInsumos[0].IdInsumo == idInsumoProductoSeleccionado
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
    if (currentValue === "" || parseInt(currentValue, 10) < 1) {
      setInputValues((prev) => ({ ...prev, [idProductoSeleccionado]: "1" }));
      updateCartAndState(idProductoSeleccionado, 1);
    } else if (parseInt(currentValue, 10) > cantidadMaxima) {
      setInputValues((prev) => ({
        ...prev,
        [idProductoSeleccionado]: cantidadMaxima.toString(),
      }));
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
      Precio: producto.ValorVenta,
      SubTotal: obtenerSubtotal(
        producto.CantidadSeleccionada,
        producto.ValorVenta
      ),
      // Mapeo de los insumos utilizados en el producto
      InsumosUtilizados: producto.ProductoInsumos.map((insumo) => ({
        IdInsumo: insumo.InsumoProd.IdInsumo,
        CantidadUtilizada: producto.CantidadSeleccionada,
      })),
    }));
  };

  console.log(obtenerFechaActual());

  const enviarSolicitud = async () => {
    try {
      if (cartItems == 0) {
        show_alerta({
          message: "Agrega al menos un producto al carrito",
          type: "warning",
        });
        return;
      }

      const MySwal = withReactContent(Swal);
      Swal.fire({
        title: `¿Seguro que desea confirmar el pago?`,
        // icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, confirmar pago",
        cancelButtonText: "Cancelar",
        html: `<p> Por favor, confirme que desea realizar el pago. Para completar la transacción, escanee el código QR y envíe el monto       correspondiente, guarda el comprobante lo necesitaremos mas adelante.</p>
              <p>Escanee el código QR para realizar el pago.</p>
               <img src=${imagenes[9]} alt="Código QR para pago" style="max-width: 200px; margin-top: 10px;" />`
      }).then(async (result) => { 
        if (result.isConfirmed) {
          try {
            // console.log(parametros);

            setIsSubmitting(true);

            let parametros = {
              IdCliente: auth.idCliente,
              Detalles: obtenerDetalles(cartItems),
              TipoPago: "Transferencia",
              Fecha: obtenerFechaActual(),
              Total: totalPedido,
              idImagenComprobante: "0",
              imagenComprobante: "0",
              intentos: 3,
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
      


            if (respuesta.status == 200) {
            
              show_alerta({
                message: respuesta.data.message,
                type: "success",
              });
        
              localStorage.removeItem("cart");
              navigate("/admin/Pedidos");

            } else {
              console.log(respuesta.data);
              show_alerta({
                message: respuesta.data?.message || "Error desconocido",
                type: "error",
              });
            }
          } catch (error) {
            console.error("Error al cambiar el estado del producto:", error);
            show_alerta({
              message:
                error.response?.data?.message ||
                "Error al intentar cambiar el estado del producto",
              type: "error",
            });
          }
        } else {
          show_alerta({
            message: "No se ha realizado el pedido",
            type: "info",
          });
        }
      });

     
    } catch (error) {
      console.log(error);

      if (error.response) {
        show_alerta({
          message: error.response.data.message,
          type: "error",
        });
      } else if (error.request) {
        show_alerta({
          message: "Error en la solicitud",
          type: "error",
        });
      } else {
        show_alerta({
          message: "Error desconocido",
          type: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

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
              <div
                key={`${item.IdProducto}-${item.ProductoInsumos[0].IdInsumo}`}
                className="card mb-3"
              >
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
                        <h5>
                          {item.Disenio.NombreDisenio}{" "}
                          <small style={{ fontSize: "11px" }}>
                            {item.ProductoInsumos[0].InsumoProd.Color.Color} -{" "}
                            {item.ProductoInsumos[0].InsumoProd.Talla.Talla}
                          </small>
                        </h5>

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
                          className="m-"
                          onClick={() =>
                            disminuirCantidad(
                              item.ProductoInsumos[0].IdInsumo,
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
                          className="m-"
                          onClick={() =>
                            disminuirCantidad(
                              item.ProductoInsumos[0].IdInsumo,
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

                      {/* input cantidad */}
                      <div style={{ width: "auto" }}>
                        <input
                          // min="0"
                          // min="0"
                          type="text"
                          className="form-control form-control-dm"
                          style={{
                            width: "45px",
                            textAlign: "center",
                            border: "none",
                          }}
                          value={
                            inputValues[item.ProductoInsumos[0].IdInsumo] ??
                            item.CantidadSeleccionada
                          }
                          onChange={(e) =>
                            handleCantidadChange(
                              e,
                              item.ProductoInsumos[0].IdInsumo,
                              item.ProductoInsumos[0].CantidadProductoInsumo,
                              item.Disenio.NombreDisenio
                            )
                          }
                          onBlur={() =>
                            handleInputBlur(
                              item.ProductoInsumos[0].IdInsumo,
                              item.ProductoInsumos[0].CantidadProductoInsumo
                            )
                          }
                        />
                      </div>

                      {/* Aumentar cantidad del producto */}
                      <button
                        className=""
                        onClick={() =>
                          incrementarCantidad(
                            item.ProductoInsumos[0].IdInsumo,
                            item.ProductoInsumos[0].CantidadProductoInsumo
                          )
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

            {showMessage && (
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-center">
                    <div className="mx-3">
                      {/* nombre producto */}
                      <h4 className="text-dark">
                        Aún no haz agregado productos al carrito :)
                      </h4>

                      {/* precio producto */}
                      <p className="small mb-0">
                        {/* {formatCurrency(item.ValorVenta)} */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

                <div className="d-flex justify-content-between mb-4">
                  <p className="mb-2">Total</p>
                  <p className="mb-2">{formatCurrency(totalPedido)}</p>
                </div>

                <button
                  type="button"
                  id="botonRealizarPedido"
                  disabled={isSubmitting}
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
