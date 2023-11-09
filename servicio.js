var express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const BD = require('./database');
const aplicacion = express();
aplicacion.set('view engine', 'ejs');

aplicacion.use(express.json());
aplicacion.use(cors());
aplicacion.use(express.static('public'));
var database = BD.connectionDB;

aplicacion.get('/login', (req, res) => {
    res.render('pages/login');
});
aplicacion.get('/', (req, res) => {
    res.render('pages/index');
});
aplicacion.get('/principal', (req, res) => {
    res.render('pages/callToAction');
});
aplicacion.get('/video', (req, res) => {
    res.render('pages/videoPage');
});

aplicacion.get('/index', (req, res) => {
    respuesta = {};
    database.query('select * from curso;', (error, rows, fields) => {
        if (error) {
            respuesta.status = false;
            respuesta.message = error;
            res.json(respuesta);
            console.log(respuesta);
        } else {
            res.json(rows);
            console.log("Consulta Ok");
        }
    });
});

aplicacion.post('/login', (req, res) => {
    const reqData = {};
    var login = req.body.login;
    var passwd = req.body.password;
    database.query('select * from usuarios where login=? and password=sha1(?)', [login, passwd], (err, rows, fields) => {
        if (!err) {
            const hash = crypto.createHash('sha1').update(passwd).digest('hex');
            if (rows.length == 1 && rows[0].login == login && rows[0].password == hash) {
                const user = rows[0];
                jwt.sign({ user: user }, 'accessKey', { expiresIn: '1h' }, (err, token, name, email) => {
                    var name = rows[0].login;
                    var email = rows[0].email;

                    res.json({ token: token, name: name, email: email });
                });
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(503);
        }

    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        console.log(bearerToken);
        next();
    } else {
        res.sendStatus(403)
    }
}
aplicacion.post("/nuevoUser", (req, res) => {
    var Email = req.body.email;
    var User = req.body.login;
    var Password = req.body.password;
    var resultado = {};

    database.query("insert into usuarios(login,password,email) values(?,sha1(?),?);", [User, Password, Email], (error, rows, fields) => {
        if (error) {
            resultado.estado = false;
            resultado.mensaje = error;
            res.json(resultado);
        } else {
            resultado.estatus = true;
            resultado.mensaje = "Registro exitoso";
            console.log(resultado);
            resultado.filas = rows.affectedRows;
            res.json(resultado);
        }
    });
});

aplicacion.get('/register', (req, res) => {
    res.render('pages/register');
});
aplicacion.get('/profile', (req, res) => {
    res.render('pages/profile');
});

aplicacion.post('/auth', (req, res) => {
    console.log("auth1");
    console.log("Hola desde auth");

    var token = req.body.token;
    console.log("Token= " + token);
    var decoded = jwt.verify(token, 'accessKey');
    try {
        var decoded = jwt.verify(token, 'accessKey');
        console.log("Decoded " + decoded);
        jwt.verify(token, 'accessKey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                res.sendStatus(200);
            }
        });
    } catch (error) {
        res.sendStatus(500);
    }
});

aplicacion.listen(5000);
console.log("Esta el puerto 8080 escuchando");