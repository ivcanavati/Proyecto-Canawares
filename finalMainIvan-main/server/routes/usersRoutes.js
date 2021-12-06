'use strict';
const express = require('express');
const UsersController = require('../controllers/usersController');

const gruposController = require('../controllers/gruposController');

const usersCtrl = new UsersController();

const gruposCtrl = new gruposController();

const router = express();

router.post('/', (req, res) => {
    let b = req.body;
    if (b.nombre && b.apellidos && b.email && b.sexo && b.fecha) {
        let u = usersCtrl.getUniqueUser(b.nombre, b.apellidos, b.email);
        console.log(u);
        if (u) {
            res.status(400).send('user already exists');
        } else {
            res.status(201).send(usersCtrl.insertUser(b));
        }
    } else {
        res.status(400).send('missing arguments');
    }
});

router.get('/', (req, res) => {
    let userCtrl = new gruposController();
    let users = userCtrl.getList();
    let tareas = userCtrl.getListTareas();
    console.table(users);
    console.table(tareas);
    let limit = (req.query.limit) ? parseInt(req.query.limit) : 5;
    let page = 1;
    console.log(req.query);
    let population = users.length;
    console.log(population);
    let totalPages = Math.ceil(population / limit);
    console.log(totalPages);
    if (req.query.page) {
        page = parseInt(req.query.page) * limit - limit;
        users = users.slice(page, page + limit);
    } else {
        users = users.slice(0, 0 + 5);
    }
    if (req.query.date) {
        users = users.filter(ele => new Date(ele.fecha).getTime() === new Date(req.query.date).getTime());
    }

    users = users.map((val, index, arra) => {
        return {
            "nombre": val.nombre,
            "profesor": val.profesor,
            "descripcion": val.descripcion

        }
    });

    tareas = tareas.map((val, index, arra) => {
        return {
            "nombreTarea": val.nombreTarea,
            "fechaLimite": val.fechaLimite,
            "descripcion": val.descripcion,
            "fechaDeEntrega": val.fechaDeEntrega,
            "puntaje": val.puntaje
        }
    });
    console.log(users);
    console.log(tareas);
    res.send({
        content: users,
        contentTareas: tareas,
        page: page,
        totalPages: totalPages
    });
});


/* router.get('/:nombreTarea', (req, res) => {
    let userCtrl = new gruposController();
    let users = userCtrl.getListTareas();
    console.log(users)
    if (req.params.nombreTarea) {
        console.log(req.params.nombreTarea)
        
        let tarea = users.find(ele => ele.nombreTarea === req.params.nombreTarea);
        
        if (tarea) {
            
            res.send(tarea);
        } else {
            res.set('Content-Type', 'application/json');
            res.status(204).send({});
        }
    } else {
        res.status(400).send('missing params');
    }
}); */


router.put('/:email', (req, res) => {
    let b = req.body;
    if (req.params.email && (b.nombre || b.apellidos || b.password || b.fecha)) {
        let u = usersCtrl.getUserByEmail(b.email);
        if (u) {
            b.uid = u.uid;
            Object.assign(u, b);
            res.status(200).send(usersCtrl.updateUser(u));
        } else {
            res.status(404).send('user does not exist');
        }
    } else {
        res.status(400).send('missing arguments');
    }
});

router.delete('/:email', (req, res) => {
    if (req.params.email) {
        let u = usersCtrl.getUserByEmail(req.params.email);
        if (u) {
            res.status(200).send({
                "deleted": usersCtrl.deleteUser(u)
            });
        } else {
            res.status(404).send('user does not exist');
        }
    } else {
        res.status(400).send('missing arguments');
    }
});
module.exports = router;