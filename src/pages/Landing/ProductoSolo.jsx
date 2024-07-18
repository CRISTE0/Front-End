import React from 'react'

export const ProductoSolo = () => {
  return (
    <>
  
   {/* <!-- Open Content --> */}
    <section class="bg-light">
        <div class="container pb-5">
            <div class="row">
                <div class="col-lg-5 mt-5">
                    <div class="card mb-3">
                        <img class="card-img img-fluid" src="../assets/img/camisetas/camisa1.jfif" alt="Card image cap" id="product-detail"/>
                    </div>
                    
                </div>
                {/* <!-- col end --> */}
                <div class="col-lg-7 mt-5">
                    <div class="card">
                        <div class="card-body">
                            <h1 class="h2">Camiseta Espacio</h1>
                            <p class="h3 py-2">$30.000</p>
                           
                        

                            <h6>Detalles:</h6>
                            <ul class="list-unstyled pb-3">
                                <li>Producto:  Camiseta Estampada</li>
                                <li>Técnica:  Sublimación</li>
                                <li>Material: Algodón FTPt</li>
                                <li>Sensación: Ultra Suave</li>
                                <li>Genero: Unisex</li>
                                
                            </ul>

                            <div>
                                <input type="hidden" name="product-title" value=""/>
                                <div class="row">

                                    {/* Color del producto */}
                                    <div class="col-auto">
                                        <ul class="list-inline pb-3" id="color-options">
                                            <li class="list-inline-item">Color:</li>
                                            <li class="list-inline-item">
                                                <input type="radio" name="product-color" id="color-negro" value="Negro"/>
                                                <label for="color-negro" class="btn btn-dark btn-color">Negro</label>
                                            </li>
                                            <li class="list-inline-item">
                                                <input type="radio" name="product-color" id="color-blanco" value="Blanco"/>
                                                <label for="color-blanco" class="btn btn-light btn-color">Blanco</label>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Talla del producto */}
                                    <div class="col-12">
                                        <ul class="list-inline pb-3" id="size-options">
                                            <li class="list-inline-item">Talla:</li>
                                            <li class="list-inline-item">
                                                <input type="radio" name="product-size" id="size-s" value="S"/>
                                                <label for="size-s" class="btn btn-success">S</label>
                                            </li>
                                            
                                        </ul>
                                    </div>

                                    {/* Cantidad del producto */}
                                    <div class="col-12">
                                        <ul class="list-inline pb-3">
                                            <li class="list-inline-item text-right">
                                                Cantidad :
                                                <input type="hidden" name="product-quanity" id="product-quanity" value="1"/>
                                            </li>
                                            <li class="list-inline-item"><span class="btn btn-success d-flex align-items-center" id="btn-minus">-</span></li>
                                            <li class="list-inline-item"><span class="badge bg-secondary rounded" id="var-value">1</span></li>
                                            <li class="list-inline-item"><span class="btn btn-success d-flex align-items-center" id="btn-plus">+</span></li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <div class="d-flex justify-content-around pb-3">
                                    <div class="">
                                        <button type="submit" class="btn btn-success btn-lg" name="submit" value="buy">Comprar</button>
                                    </div>
                                    <div class="">
                                        <button type="submit" class="btn btn-success btn-lg" name="submit" value="addtocard">Agrega al carrito</button>
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

