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

let db = new Sequelize (
    "mysql://root:1234@localhost:3306/delilah_resto"
)

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

//Middleware
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


//CREATE READ UPDATE DELETE PRODUCTOS

//READ
server.get ("/productos",(req, res, next)=>{
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
server.post ("/productos",validaProducto, (req, res, next)=>{
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
server.put ("/productos/:id",validaProducto,(req, res, next)=>{
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

server.delete ("/productos/:id",(req, res, next)=>{
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


//Middleware Usuario Nuevo

function validaUsuario (req, res, next){
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

//CREATE READ UPDATE DELETE USUARIOS

//READ
server.get ("/usuarios",(req, res, next)=>{
    db.query ("SELECT * FROM delilah_resto.user;", 
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

server.post ("/usuarios", validaUsuario,  (req, res, next)=>{
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
        return db.query ('SELECT * FROM user WHERE user_id =:uid' , { //seleccione TODOS los campos de la tabla product donde produc_id es igual a pid
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

// LOGIN 

server.post ("/login",loginUsuario, (req, res, next)=>{
    let usuario = req.body.user_name;
    let contrasena = req.body.password;
    db.query ("SELECT * FROM delilah_resto.user "+
    "WHERE (user_name = :un OR email= :un) AND password =  :p", {
        type: Sequelize.QueryTypes.SELECT,
            replacements: {
                un: usuario,
                p: contrasena
        }
    })
    .then((data)=>{
        res.status(200).json (data[0])
    })
    .catch ((error)=>{
        res.status(500);
        res.json (error)
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