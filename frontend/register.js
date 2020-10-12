// REGISTER 

function register(){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let userRegister = document.getElementById("register_user").value;
    let nameRegister = document.getElementById("register_name").value;
    let emailRegister = document.getElementById("register_email").value;
    let phoneRegister = document.getElementById("register_phone").value;
    let addressRegister = document.getElementById("register_address").value;
    let passwordRegister = document.getElementById("register_password").value;
    let user = {user_name:userRegister, full_name:nameRegister, email: emailRegister, phone: phoneRegister, address:addressRegister, password: passwordRegister}
        
    var raw = JSON.stringify(user);
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://localhost:3010/usuarios", requestOptions)
      .then(response => {
        console.log (response)
        return response.json();
      })
      .then(dataJson => {
          console.log("Esta es la respuesta json");
          console.log(dataJson);
          alert ("El usuario "+ dataJson.full_name + " ha sido creado exitosamente")
          window.location.href = "/frontend/login.html";
      })
      .catch(error => console.log('error', error));
    }