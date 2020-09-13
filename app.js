let express = require ("express");
let Sequelize = require ("sequelize");
let jwt = require ("jsonwebtoken");
let server = express ();
const secretKey = "secret"; //password dificild e descifrar

server.use(express.json());

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