let productTitle = document.getElementById("product_title");
let productPrice = document.getElementById("product_price");
let valorTotal = document.getElementById("valor_total");
let address = document.getElementById("address");

//obtener del token y almacenar en el local storage
//con token 

//Servicio get a productos

function orders(){

var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("http://localhost:3010/orders", requestOptions)
    .then(response => {
        console.log (response)
        return response.json();
    })
    .then(dataJson => {
        console.log("Esta es la respuesta json");
        console.log(dataJson);
    })
    .catch(error => console.log('error', error));

    //guardar info en local storage 

}