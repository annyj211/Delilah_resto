//onload



function productos (){
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
        })

        //innertext
        .catch(error => console.log('error', error));
}