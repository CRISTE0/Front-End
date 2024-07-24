import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';

export const ProductoSolo = () => {
  
    const { id } = useParams();

    const [Producto, setProducto] = useState([]);
  
    const url = `http://localhost:3000/api/productos/${id}`;
    
  
    
    useEffect(()=>{
        const getProducto = async () => {
            const respuesta = await axios.get(url);

            setProducto(respuesta.data);
            let prod = respuesta.data;
            console.log(prod);
        };

        getProducto();

    },[id]);

    if (!Producto.Disenio) {
        return <h1>Loading...</h1>;
    }
  

    return (
    <>
  
        {/* <!-- Open Content --> */}
        <section className="bg-light">
            <div className="container pb-5">
                <div className="row">
                    <div className="col-lg-5 mt-5">
                        <div className="card mb-3">
                            {Producto.Disenio &&(
                                <img className="card-img img-fluid" src={Producto.Disenio.ImagenReferencia} alt="Card image cap" id="product-detail"/>
                            )}

                        </div>
                        
                    </div>
                    {/* <!-- col end --> */}
                    <div className="col-lg-7 mt-5">
                        <div className="card">
                            <div className="card-body">

                                {Producto.Disenio &&(
                                    <h1 className="h1">{Producto.Disenio.NombreDisenio}</h1>
                                )}
                                
                                <small className="">
                                    Referencia: {Producto.Referencia}
                                </small>
                                <p className="h4 py-2">{Producto.ValorVenta}</p>
                            
                            

                                <h6>Detalles:</h6>
                                <ul className="list-unstyled pb-3">
                                    <li>Producto:  Camiseta Estampada</li>
                                    <li>Técnica:  Sublimación</li>
                                    <li>Material: Algodón FTPt</li>
                                    <li>Sensación: Ultra Suave</li>
                                    <li>Genero: Unisex</li>
                                    
                                </ul>

                                <div>
                                    <input type="hidden" name="product-title" value=""/>
                                    <div className="row">

                                        {/* Color del producto */}
                                        <div className="col-auto">
                                            <ul className="list-inline pb-3" id="color-options">
                                                <li className="list-inline-item">Color:</li>
                                                <li className="list-inline-item">
                                                    <input type="radio" name="product-color" id="color-negro" value="Negro"/>
                                                    <label htmlFor="color-negro" className="btn btn-dark btn-color">Negro</label>
                                                </li>
                                                <li className="list-inline-item">
                                                    <input type="radio" name="product-color" id="color-blanco" value="Blanco"/>
                                                    <label htmlFor="color-blanco" className="btn btn-light btn-color">Blanco</label>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Talla del producto */}
                                        <div className="col-12">
                                            <ul className="list-inline pb-3" id="size-options">
                                                <li className="list-inline-item">Talla:</li>
                                                <li className="list-inline-item">
                                                    <input type="radio" name="product-size" id="size-s" value="S"/>
                                                    <label htmlFor="size-s" className="btn btn-success">S</label>
                                                </li>
                                                
                                            </ul>
                                        </div>

                                        {/* Cantidad del producto */}
                                        <div className="col-12">
                                            <ul className="list-inline pb-3">
                                                <li className="list-inline-item text-right">
                                                    Cantidad :
                                                    <input type="hidden" name="product-quanity" id="product-quanity" value="1"/>
                                                </li>
                                                <li className="list-inline-item"><span className="btn btn-success d-flex align-items-center" id="btn-minus">-</span></li>
                                                <li className="list-inline-item"><span className="badge bg-secondary rounded" id="var-value">1</span></li>
                                                <li className="list-inline-item"><span className="btn btn-success d-flex align-items-center" id="btn-plus">+</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex justify-content-around pb-3">
                                        <div className="">
                                            <button type="submit" className="btn btn-success btn-lg" name="submit" value="buy">Comprar</button>
                                        </div>
                                        <div className="">
                                            <button type="submit" className="btn btn-success btn-lg" name="submit" value="addtocard">Agrega al carrito</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/* <!-- Close Content --> */}



    </>
  )
}

