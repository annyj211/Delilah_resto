//onload

let listaProductosGlobal = [];

function initializeExplorer(){
    let shoppingCar = localStorage.getItem ("thiIsTheShoppingCar");
    if (shoppingCar==undefined){
        localStorage.setItem("thiIsTheShoppingCar", "[]");
    }
}

//SERVICIO GET PRODUCTOS
function productos (){
    initializeExplorer();
    let sugestMenuImg = document.getElementById ("sugest_menu_image");
    let imgTitle = document.getElementById ("title_image");
    let imgPrice = document.getElementById ("precio_image");
    // let arrayProducts = 
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch("http://localhost:3010/productos", requestOptions)
        .then(response => {
            console.log(response)
            return response.json();
        })
        .then(dataJson => {
            listaProductosGlobal = dataJson;
            console.log("Esta es la respuesta json");
            console.log(dataJson);
            let arrayProducts = dataJson;
            for (let indice = 0 ; indice <4; indice++){
                sugestMenuImg.src = arrayProducts[indice].image_url;
                sugestMenuImg.width = 200;
                sugestMenuImg.heigth = 200;
                imgTitle.innerHTML = arrayProducts[indice].product_name;
                imgPrice.innerHTML = arrayProducts[indice].price;
            }

            let listaProductos = document.getElementById("listaProductos");
            listaProductos.innerHTML = "";

            for (let indice = 0 ; indice <arrayProducts.length; indice++){
        //   <div class="product_item">
                let  divPrincipal = document.createElement("div");
                divPrincipal.className = "product_item";
        //     <img src="./assets/images/Ensalada veggie.png" alt="Ensalada veggie" class="img_menu_item">
                let imgProducto = document.createElement("img");
                imgProducto.src = arrayProducts[indice].image_url;
                imgProducto.alt = arrayProducts[indice].product_name;
                imgProducto.className = "img_menu_item";
                divPrincipal.appendChild(imgProducto);
        //     <div class="product_features">
                let divProdFeatures = document.createElement("div");
                divProdFeatures.className = "product_features";
                divPrincipal.appendChild(divProdFeatures);
        //         <label id="product_title" class="product_title_class">
                    let labelTitle = document.createElement("label");
                    labelTitle.className="product_title_class";
        //         hola mundo
                    labelTitle.innerText = arrayProducts[indice].product_name;
                    divProdFeatures.appendChild(labelTitle);
        //         </label>
        //         <label id="product_price" class="product_price_class">
                    let labelPrice = document.createElement("label");
                    labelPrice.className="product_price_class";
        //             precio
                    labelPrice.innerText = "$"+arrayProducts[indice].price;
                    divProdFeatures.appendChild(labelPrice);
        //         </label>
        //     </div>
        //     <button style="color: #fc885c; font-size: 30px; background-color:white; cursor: pointer;">
                let button = document.createElement("button");
                button.name = arrayProducts[indice].product_id;
                button.style = "color: #fc885c; font-size: 30px; background-color:white; cursor: pointer;"
                button.onclick = addProduct;
                divPrincipal.appendChild(button);
        //         <i class="fas fa-plus-circle"></i>
                    let icon = document.createElement("i");
                    icon.className = "fas fa-plus-circle";
                    icon.id = arrayProducts[indice].product_id;
                    button.appendChild(icon);
            listaProductos.appendChild(divPrincipal);
        //     </button>
        // </div>

            }
        })
        //innertext
        .catch(error => console.log('error', error));
}

function addProduct(event){
    console.log(event.target)
    let producto = listaProductosGlobal.find(element => element.product_id == event.target.id) //find se utiliza para 
    console.log(producto)
}

//

