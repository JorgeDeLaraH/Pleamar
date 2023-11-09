const mysql = require('mysql2');
//creamos la conexión a la BD
const connectionDB = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "Jorjais-12",
    database: "basetoxi"
});
//nos conectamos a la BD
connectionDB.connect((err) => {
    if (err) {
        //en caso de tener algún error lanzamos un comentario que lo contenga.
        console.error(err);
        return;
    } else {
        console.log("Conexión a la Base de Datos exitosa.");
    }
});
//exportamos la variable de la conexión para poder trabajarla en "application.js"
exports.connectionDB = connectionDB;