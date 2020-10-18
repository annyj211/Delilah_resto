function userName() {
    let userNameLocalStorage = localStorage.getItem("userName");
    let userName = document.getElementById("user_name_confirm_order");
    userName.innerHTML = userNameLocalStorage.split (" ")[0] + ", gracias por pedir a Delilah. "+
                                                "Puedes seguir tu pedido "+
                                                "para saber dónde está.";
}