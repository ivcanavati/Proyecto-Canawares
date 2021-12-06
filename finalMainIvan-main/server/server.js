'use strict';
const fs = require('fs');
const express = require('express');
const app = express();
const randomize = require('randomatic');
const cors = require('cors');

//load middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(cors());

const usersRouter = require('./routes/usersRoutes');
const UsersController = require('./controllers/usersController');
const PORT = process.env.PORT || 3000;

function authentication(req, res, next) {
    let xauth = req.get('x-auth-user');
    if (xauth) {
        let id = xauth.split("-").pop();
        let userctrl = new UsersController();
        let user = userctrl.getUser(parseInt(id));
        if (user && user.token === xauth) {
            req.uid = user.uid;
            next();
        } else {
            res.status(401).send('Necesitas iniciar sesión para acceder a las tareas!');
        }
    } else {
        res.status(401).send('Necesitas iniciar sesión para acceder a las tareas!');
    }

}

/* app.post('/api/register', (req, res) => {
    if (req.body.email && req.body.password) {
        console.log(req.body);
        let uctrl = new UsersController();
        let user = uctrl.getUserByEmail(req.body.email);
        if (user) {
            
            res.status(400).send('El usuario ya existe');
        } else {
            uctrl.insertUser(user);
        }
    } else {
        res.status(400).send('Te faltaron datos por llenar');
    }
}); */

app.use('/api/users',authentication, usersRouter);

app.post('/api/register', (req, res) => {
    let b = req.body;
    let uctrl = new UsersController();
    if (b.nombre && b.apellidos && b.email && b.rol && b.fecha) {
        let u = uctrl.getUniqueUser(b.nombre, b.apellidos, b.email);
        console.log(u);
        if (u) {
            res.status(400).send('user already exists');
        } else {
            res.status(201).send(uctrl.insertUser(b));
        }
    } else {
        res.status(400).send('missing arguments');
    }
});


app.post('/api/login', (req, res) => {
    if (req.body.email && req.body.password) {
        console.log(req.body);
        let uctrl = new UsersController();
        let user = uctrl.getUserByCredentials(req.body.email, req.body.password);
        if (user) {
            let token = randomize('Aa0', '10') + "-" + user.uid;
            user.token = token;
            uctrl.updateUser(user);
            res.status(200).send({
                "token": token
            });
        } else {
            res.status(401).send('Necesitas iniciar sesión para acceder a las tareas!');
        }
    } else {
        res.status(400).send('Missing user/pass');
    }
});





app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
})