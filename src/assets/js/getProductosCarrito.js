import axios from "axios";

export const fetchCartItemsNav = async (auth) => {

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemDetails = await Promise.all(
      cart.map(item =>
        axios.get(`https://softshirt-1c3fad7d72e8.herokuapp.com/api/productos/${item.IdProd}`)
          .then(res => ({
            ...res.data,
            CantidadSeleccionada: item.CantidadSeleccionada
          }))
          .catch(() => null) // Manejo de error de fetch
      )
    );

    // Filtra los elementos que no sean null y que tengan Publicacion como 'Activo'
    const activeItems = itemDetails.filter(item => item && item.Publicacion === 'Activo' ||
      (item.Publicacion == "Inactivo" && item.IdUsuario == auth.idCliente)
    );
    
    const sumaCantidades = activeItems.reduce((acumulador, producto) => acumulador + producto.CantidadSeleccionada, 0);

    // setCantidad(sumaCantidades);
    console.log(itemDetails);
    
    console.log(activeItems);
    console.log(sumaCantidades);

    return sumaCantidades;
    // return activeItems;
  };