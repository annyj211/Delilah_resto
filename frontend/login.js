// API LOGIN

function login (){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let userLogin = document.getElementById ("fuser"); // 1 declarar variable login traerla de html
    let userPassword = document.getElementById ("fpassword"); // 2 declarar variable password traerla de html
    let user = {user_name:userLogin.value, password:userPassword.value}; //3 declarar variable usuario que contiene el objeto que tiene info de usuario y contraseñay escribir el .value
    var raw = JSON.stringify(user); //4 convertir el objeto a json se hace llamando el user como parametro dentro del JSON.stringify

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://localhost:3010/login", requestOptions)
    .then(response => { //5 abrir llaves 
        console.log(response) //6 Escribir el console.log y poner como parametro response
        return response.json(); // 7 escribir palabra reservada return antes del response.json para que lo retorne
    })
    .then(dataJson => { //8 cambiar el nombre de la arrow function que se llamaba result y se cambia por dataJson
        console.log("Esta es la respuesta json"); //9 se escribe dentro el del console.log "Esta es la respuesta json"
        console.log(dataJson);//10cambiar el parametro result por dataJson
        let token = dataJson.token; //11 crear variable para guardar el dataJson.data
        localStorage.setItem ("token",token);
        let user = parseJwt(token);
        console.log(user);
        localStorage.setItem("userName", user.full_name);
        localStorage.setItem("userId", user.id);
        window.location.href = "explorer.html"
    })
    .catch(error => console.json('error', error));
}

// How to decode jwt token in javascript without using a library?
//FUENTE DE INFORMACIÓN: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

//