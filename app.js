let express = require ("express");
let Sequelize = require ("sequelize");
let jwt = require ("jsonwebtoken");
let server = express ();
const secretKey = "secret"; //password dificild e descifrar

server.use(express.json());

//server.use(cors());

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//


let db = new Sequelize (
    "mysql://root:1234@localhost:3306/delilah_resto"
)

//Middleware validate token

function validateTokenAdmin (req, res, next) {
    try {
        let token = req.headers["authorization"];
        console.log(token)
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        console.log(bearerToken);
        let validUser = jwt.verify(bearerToken, secretKey);
        console.log (validUser);
        if (validUser){
            if (validUser.role == "Admin"){
                next ();
            }else {
                res.status(403);
                res.json({message:"No es role administrador, no autorizado"})
            }           
        }else {
            res.status (401);
            res.json({message:"No autorizado"})
        }
    }
    catch(error){
        res.status (401);
        res.json({message:"No autorizado"})
    }
}


//Middleware Login

function loginUsuario (req, res, next){
    let usuario = req.body.user_name;
    let contrasena = req.body.password;
    if(usuario&&contrasena){
        next();
    }
    else{
        res.status(400);
        res.json({message: "Por favor, ingrese todos los campos requeridos"})
    }
}

//MIDDLEWARE PASSWORD


//validacion que lo que venga en el campo email sea email


//Middleware validaProducto
function validaProducto (req, res, next){
    let nombreProducto = req.body.product_name;
    let descripcionProducto = req.body.product_description;
    let precio = req.body.price;
    let urlImagen= req.body.image_url;
    if(nombreProducto&&descripcionProducto&&precio&&urlImagen){
        next();
    }
    else{
        res.status(400);
        res.json({message: "Por favor, ingrese todos los campos requeridos"})
    }
}


//Middleware Usuario Nuevo

function validaCreacionUsuario (req, res, next){
    let usuario = req.body.user_name;
    let nombreUsuario = req.body.full_name;
    let correoElectronico = req.body.email;
    let telefono= req.body.phone;
    let direccion = req.body.address;
    let contrasena = req.body.password;
    if(usuario&&nombreUsuario&&correoElectronico&&telefono&&direccion&&contrasena){
        next();
    }
    else{
        res.status(400);
        res.json({message: "Por favor, ingrese todos los campos requeridos"})
    }
}


function validaEdicionUsuario (req, res, next){
    let usuario = req.body.user_name;
    let nombreUsuario = req.body.full_name;
    let correoElectronico = req.body.email;
    let telefono= req.body.phone;
    let direccion = req.body.address;
    if(usuario&&nombreUsuario&&correoElectronico&&telefono&&direccion){
        next();
    }
    else{
        res.status(400);
        res.json({message: "Por favor, ingrese todos los campos requeridos"})
    }
}


//ORDERS

server.get ("/orders", (req, res, next)=>{
    db.query ("SELECT s.status,"+ 
	"DATE_FORMAT(o.creation_date, '%h:%i %p') AS time,"+ 
    "o.order_id,"+ 
    "o.description,"+
    "pm.payment_method,"+
    "(SELECT SUM(od.total_product_price) as total "+
        "FROM order_detail AS od "+
        "WHERE od.order_id = o.order_id ) AS total,"+
    "u.full_name,"+
    "u.address "+
    "FROM delilah_resto.order AS o "+
    "INNER JOIN delilah_resto.status AS s "+
        "ON o.status_id = s.status_id "+ 
    "INNER JOIN delilah_resto.payment_method AS pm "+
        "ON o.payment_method_id = pm.payment_method_id "+
    "INNER JOIN delilah_resto.user AS u "+
        "ON o.user_id = u.user_id",
        {
            type: Sequelize.QueryTypes.SELECT,
        }
    )
    .then ((data)=>{
        res.json(data);
    })
    .catch ((error)=>{
        res.status(500);
        res.json({message: error})
    })
})

//PRODUCTOS


//CREATE READ UPDATE DELETE PRODUCTOS

//READ
server.get ("/productos", (req, res, next)=>{
    db.query ("SELECT * FROM delilah_resto.product;", 
    {
        type: Sequelize.QueryTypes.SELECT,
    })
    .then ((data)=>{
        res.json(data);
    })
    .catch ((error)=>{
        res.status(500);
        res.json({message: error})
    })
})

//CREATE
server.post ("/productos", validateTokenAdmin, validaProducto, (req, res, next)=>{
    let nombreProducto = req.body.product_name;
    let descripcionProducto = req.body.product_description;
    let precio = req.body.price;
    let urlImagen= req.body.image_url;
    db.query ("INSERT INTO `delilah_resto`.`product` "+
    "(`product_name`, `product_description`, `price`, `image_url`) "+
    "VALUES (:pn, :pd, :p, :u); ", 
    {
        type: Sequelize.QueryTypes.INSERT,
        replacements:{
            pn: nombreProducto,
            pd: descripcionProducto,
            p: precio,
            u: urlImagen
        }
    })
    .then ((data)=>{
        const id = data [0];
        return db.query ('SELECT * FROM product WHERE product_id =:pid' , { //seleccione TODOS los campos de la tabla product donde produc_id es igual a pid
            type: Sequelize.QueryTypes.SELECT,
            replacements: {pid: id}
        })
    })
    .then ((data)=>{
        res.status(201).json (data[0])//201 significa CREATED
    })
    .catch ((error)=>{
        res.status(500);
        res.json ({message: error})
    })
})

//UPDATE
server.put ("/productos/:id", validateTokenAdmin, validaProducto,(req, res, next)=>{
    let nombreProducto = req.body.product_name;
    let descripcionProducto = req.body.product_description;
    let precio = req.body.price;
    let urlImagen = req.body.image_url;
    let id = req.params.id;

    db.query ("UPDATE `delilah_resto`.`product` SET "+
    "`product_name` = :pn, "+
    "`product_description` = :pd, "+
    "`price` = :p, "+
    "`image_url` = :u "+
    "WHERE (`product_id` = :pid);",
    {
        type: Sequelize.QueryTypes.UPDATE,
        replacements:{
            pn: nombreProducto,
            pd: descripcionProducto,
            p: precio,
            u: urlImagen,
            pid: id
        }
    })
    .then ((data)=>{
        res.status(200).json ()//200 significa OK
    })
    .catch ((error)=>{
        res.status(500);
        res.json ({message: error})
    })
})

//DELETE

server.delete ("/productos/:id",validateTokenAdmin,(req, res, next)=>{
    let id = req.params.id;
    db.query("DELETE FROM `delilah_resto`.`product` WHERE (`product_id` = :pid);",
    {
        type: Sequelize.QueryTypes.DELETE,
        replacements:{
            pid: id
        }
    })
    .then ((data)=>{
        res.json (data)
    })
    .catch ((error)=>{
        res.status(500);
        res.json ({message: error})
    })
})

//USUARIOS


//CREATE READ UPDATE DELETE USUARIOS

//READ
server.get ("/usuarios",(req, res, next)=>{
    db.query ("SELECT "+
    "user_id, "+
    "role_id, "+
    "user_name, "+
    "full_name, "+
    "email, "+
    "phone, "+
    "address, "+
    "creation_date FROM delilah_resto.user;", 
    {
        type: Sequelize.QueryTypes.SELECT,
    })
    .then ((data)=>{
        res.json(data);
    })
    .catch ((error)=>{
        res.status(500);
        res.json({message: error})
    })
})

//CREATE USUARIO NUEVO

server.post ("/usuarios", validaCreacionUsuario,  (req, res, next)=>{
    let usuario = req.body.user_name;
    let nombreUsuario = req.body.full_name;
    let correoElectronico = req.body.email;
    let telefono= req.body.phone;
    let direccion = req.body.address;
    let contrasena = req.body.password;
    db.query ("INSERT INTO `delilah_resto`.`user` "+
    "(`user_name`, `full_name`, `email`, `phone`, `address`, `password`) "+
    "VALUES (:un, :fn, :e, :ph, :a, :p); ", 
    {
        type: Sequelize.QueryTypes.INSERT,
        replacements:{
            un: usuario,
            fn: nombreUsuario,
            e: correoElectronico,
            ph: telefono,
            a:direccion,
            p:contrasena
        }
    })
    .then ((data)=>{
        const id = data [0];
        return db.query ("SELECT "+
        "user_id, "+
        "user_name, "+
        "full_name, "+
        "email, "+
        "phone, "+
        "address, "+
        "creation_date FROM user WHERE user_id =:uid ", { //seleccione TODOS los campos de la tabla product donde produc_id es igual a pid
            type: Sequelize.QueryTypes.SELECT,
            replacements: {uid: id}
        })
    })
    .then ((data)=>{
        res.status(201).json (data[0])//201 significa CREATED
    })
    .catch ((error)=>{
        res.status(500);
        res.json (error)
    })
})

//UPDATE USUARIO

server.put ("/usuarios/:id",validaEdicionUsuario ,(req, res, next)=>{
    let usuario = req.body.user_name;
    let nombreUsuario = req.body.full_name;
    let correoElectronico = req.body.email;
    let telefono= req.body.phone;
    let direccion = req.body.address;
    let id = req.params.id;

    db.query ("UPDATE `delilah_resto`.`user` SET "+
    "`user_name` = :un, "+
    "`full_name` = :fn, "+
    "`email` = :e, "+
    "`phone` = :ph, "+
    "`address` = :a "+
    "WHERE (`user_id` = :uid);",
    {
        type: Sequelize.QueryTypes.UPDATE,
        replacements:{
            un: usuario,
            fn: nombreUsuario,
            e: correoElectronico,
            ph: telefono,
            a: direccion,
            uid: id
        }
    })
    .then ((data)=>{
        res.status(200).json ()//200 significa OK
    })
    .catch ((error)=>{
        console.log(error);
        res.status(500);
        res.json ({message: error})
    })
})

//DELETE

server.delete ("/usuarios/:id",(req, res, next)=>{
    let id = req.params.id;
    db.query("DELETE FROM `delilah_resto`.`user` WHERE (`user_id` = :uid);",
    {
        type: Sequelize.QueryTypes.DELETE,
        replacements:{
            uid: id
        }
    })
    .then ((data)=>{
        res.json (data)
    })
    .catch ((error)=>{
        res.status(500);
        res.json ({message: error})
    })
})

//Middleware editar contraseña

function validateToken (req, res, next) {
    try {
        let token = req.headers["authorization"];
        console.log(token)
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        console.log(bearerToken);
        let validUser = jwt.verify(bearerToken, secretKey);
        console.log (validUser);
        if (validUser){
            req.body.user_id = validUser.id; // se le agrega el user id desde el token
            next ();                
        }else {
            res.status (401);
            res.json({message:"No autorizado"})
        }
    }
    catch(error){
        res.status (401);
        res.json({message:"No autorizado"})
    }
}

//Middleware campos completos

function validaCamposContrasena (req, res, next){
    let contrasena = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    if(contrasena&&confirmPassword){
        next();
    }
    else{
        res.status(400);
        res.json({message: "Por favor, ingrese todos los campos requeridos"})
    }
}

//Middleware Logitud
function passwordLength (req, res, next){
    let password= req.body.password;
    if (password.length <12){
        res.status(400);
        res.json({message:"Please enter a password between 6-12 characters (no spaces)."})
    }
    else{
        next();
    }
}
//

//Middleware confirmacion contraseña
function passwordMatch (req, res, next){
    let password=req.body.password;
    let confirmPassword=req.body.confirmPassword;
    if (password!=confirmPassword){
        res.status(400);
        res.json({message:"The passwords you entered do not match. Please fix to continue."})
    }
    else{
        next();
    }
}
//




//Editar Contraseña
server.put ("/usuarios/password/:id",validateToken, validaCamposContrasena, passwordLength, passwordMatch, (req, res, next)=>{
    let password = req.body.password;
    let paramId = req.params.id;
    let tokenId = req.body.user_id;
    console.log(tokenId);
       if(paramId ==tokenId){
        db.query("UPDATE `delilah_resto`.`user` SET `password` = :ps WHERE (`user_id` = :pi)", {
            type: Sequelize.QueryTypes.UPDATE,
            replacements:{
            ps: password,
            pi: paramId
            }
        }).then(
            (data)=>{
                res.json({message:"Contraseña actualizada correctamente"})
            }
        ).catch(
            (error)=>{
            console.log(error)
            res.status(500);
            res.json(error)
            }
        )
    } else {
        res.status(403);//Forbidden
        res.json({message:"Su usuario no corresponde a la información ingresada"})
    }


})


// LOGIN 

server.post ("/login", loginUsuario, (req, res, next)=>{
    let usuario = req.body.user_name;
    let contrasena = req.body.password;
    db.query ("SELECT u.*, r.role FROM delilah_resto.user as u  "+
    "INNER JOIN delilah_resto.role AS r "+
    "ON u.role_id=r.role_id "+
    "WHERE (user_name = :un OR email= :un) AND password =  :p", {
        type: Sequelize.QueryTypes.SELECT,
            replacements: {
                un: usuario,
                p: contrasena
        }
    })
    .then((data)=>{
        if(data.length == 0){
            res.status(401) // 401 unauthorized
            res.json({message : "Verifique usuario o email y contraseña"})
        }else{
            let user = {
                id:data[0].user_id,
                role: data[0].role,//el primer name equivale a el primer elemento del array con nombre name (se verifica el nombre en jwt)
                full_name: data[0].full_name                
            }
            const token = jwt.sign(user, secretKey);
            res.json({token});
        }       
    })
    .catch ((error)=>{
        res.status(500);
        res.json (error)
    })
})

//

//ORDER


//CREATE READ UPDATE DELETE

//Middleware validacion datos completos Orden

function validacionOrden (req, res, next){
    let id = req.body.user_id;
    let payment_method = req.body.payment_method_id;
    let detail = req.body.detail;
    if (id&&payment_method&&Array.isArray(detail)&&detail.length>0){
        next();
    }
    else{
        res.status(400);
        res.json({message:"No completo"})
    }
}

//Middleware detalleOrden

function validacionProductosOrden (req, res, next){
    let detail = req.body.detail;
    detail.forEach(product => {
        let producto = product.product_id;
        let nombre = product.product_name;
        let precio = product.price;
        let cantidad = product.quantity;
        if (producto&&nombre&&precio&&cantidad){
        }
        else {
            res.status(400);
            res.json({message:"la información de los productos es incompleta"})
        }
    })
    next();
}
//

//CREATE
server.post("/ordenes",(req, res, next) =>{
    let idUsuario = req.body.user_id;
    let metodoPago = req.body.payment_method_id;
    let detail = req.body.detail;
    let descripcion = "";
    detail.forEach(product => {
        descripcion = descripcion + product.quantity+"x"+product.product_name+" ";
    })
    db.query ("INSERT INTO `delilah_resto`.`status` (`user_id`, `payment_method_id`, `description`) "+
    "VALUES (:uid, :pmi, :d); ",{
        type: Sequelize.QueryTypes.INSERT,
        replacements:{
            uid: idUsuario,
            pmi: metodoPago,
            d: descripcion,
        }
    }).then ((data)=>{

        /// inserta detalle orden

        
        res.json(data)
    }
    )
    .catch((error)=>{
        res.status(500)
        res.json({message:error})
    })
})


// READ Status
server.get ("/status",(req, res, next)=>{
    db.query ("SELECT "+
    "status_id, "+
    "status, "+
    "description FROM delilah_resto.status;", 
    {
        type: Sequelize.QueryTypes.SELECT,
    })
    .then ((data)=>{
        res.json(data);
    })
    .catch ((error)=>{
        console.log(error);
        res.status(500);
        res.json({message: error})
    })
})
//

//UpPDATE Status

server.put ("/status",validaEdicionUsuario ,(req, res, next)=>{
    let usuario = req.body.user_name;
    let nombreUsuario = req.body.full_name;
    let correoElectronico = req.body.email;
    let telefono= req.body.phone;
    let direccion = req.body.address;
    let id = req.params.id;

    db.query ("UPDATE `delilah_resto`.`user` SET "+
    "`user_name` = :un, "+
    "`full_name` = :fn, "+
    "`email` = :e, "+
    "`phone` = :ph, "+
    "`address` = :a "+
    "WHERE (`user_id` = :uid);",
    {
        type: Sequelize.QueryTypes.UPDATE,
        replacements:{
            un: usuario,
            fn: nombreUsuario,
            e: correoElectronico,
            ph: telefono,
            a: direccion,
            uid: id
        }
    })
    .then ((data)=>{
        res.status(200).json ()//200 significa OK
    })
    .catch ((error)=>{
        console.log(error);
        res.status(500);
        res.json ({message: error})
    })
})

//

//Get Payment Method
server.get ("/metodospago",(req, res, next)=>{
    db.query ("SELECT "+
    "payment_method_id, "+
    "payment_method FROM delilah_resto.payment_method;", 
    {
        type: Sequelize.QueryTypes.SELECT,
    })
    .then ((data)=>{
        res.json(data);
    })
    .catch ((error)=>{
        console.log(error);
        res.status(500);
        res.json({message: error})
    })
})


//

server.listen (3010,()=>{
    console.log ("el servidor express empezo a escuchar por el puerto 3010")
    db.authenticate()
    .then (()=>{
        console.log ("Base de datos conectada ok")
    })
    .catch
    ((error)=>{
        console.log (error)
    })
})