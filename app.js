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


//CREATE READ UPDATE DELETE

//Read
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


//DELETE

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