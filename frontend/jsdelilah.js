let tableAdminOrders = document.getElementById("adminOrders");

function getAdminOrders() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch("http://localhost:3010/orders", requestOptions)
        .then(response => response.json())
        .then((data) => {
            
            tableAdminOrders.innerHTML = "";

            data.forEach((order) => {
                let fila = document.createElement("tr");

                let colEstado = document.createElement("td");
                colEstado.innerText = order.status;

                let colhora = document.createElement("td");
                colhora.innerText = order.time;

                let colNumero = document.createElement("td");
                colNumero.innerText = order.order_id;

                let colDesctipcion = document.createElement("td");
                colDesctipcion.innerText = order.description;

                let colPago = document.createElement("td");
                let imagePaymentMethod = document.createElement("img"); 
                if(order.payment_method === "EFECTIVO"){
                    imagePaymentMethod.src="./assets/images/cash.png";
                }
                else{
                    imagePaymentMethod.src="./assets/images/credit.png";
                }
                colPago.appendChild(imagePaymentMethod)


                let colValor = document.createElement("td");
                colValor.innerText = order.total;

                let colUsuario = document.createElement("td");
                colUsuario.innerText = order.full_name;

                let colDireccion = document.createElement("td");
                colDireccion.innerText = order.address;
                
                fila.appendChild(colEstado);
                fila.appendChild(colhora);
                fila.appendChild(colNumero);
                fila.appendChild(colDesctipcion);
                fila.appendChild(colPago);
                fila.appendChild(colValor);
                fila.appendChild(colUsuario);
                fila.appendChild(colDireccion)

                tableAdminOrders.appendChild(fila);
            });
            console.log(data)
        })
        .catch((error) => {
            console.log('error', error)
        });
}