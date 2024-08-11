import axios from "axios";

export const fetchCartItemsNav = async () => {
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
    
    const sumaCantidades = activeItems.reduce((acumulador, producto) => acumulador + producto.CantidadSeleccionada, 0);

    // setCantidad(sumaCantidades);
    console.log(itemDetails);
    
    console.log(activeItems);
    console.log(sumaCantidades);

    return sumaCantidades;
    // return activeItems;
  };