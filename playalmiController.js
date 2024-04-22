const { model } = require('mongoose');
Usuarios = require('./playalmiModel').Usuarios;
Partidas = require('./playalmiModel').Partidas;

exports.index = function(req, res) {        
    Usuarios.get().then((usuario) => {
        res.json({
            status: "success",
            message: "Usuarios obtenidos",
            data: usuario
        });
    }).catch(function(error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener el usuario",
            error: error.message
        });
    });
};

exports.new = function(req, res) {
    var usuario = new Usuarios();
    usuario.nombre = req.body.nombre;
    usuario.clave = req.body.clave;
    usuario.puntuacion = 0;

    usuario.save().then(function(usuario) {
        res.json({
            message: "Nuevo usuario creado",
            data: usuario
        });
    }).catch(function(err) {
        res.status(500).json({
            message: "Error al crear nuevo usuario",
            error: err.message
        });
    });
};


exports.guardarPartida = function(req, res) {
    const { usuario_id, puntuacion } = req.body;

    if (!usuario_id || !puntuacion) {
        return res.status(400).json({
            status: "error",
            message: "Se deben proporcionar el ID del usuario y el puntuacion de la partida"
        });
    }

    const nuevaPartida = new Partidas({
        usuario_id: usuario_id,
        puntuacion: puntuacion
    });

    nuevaPartida.save()
        .then(partidaGuardada => {
            res.json({
                status: "success",
                message: "Partida guardada exitosamente",
                data: partidaGuardada
            });
        })
        .catch(error => {
            res.status(500).json({
                status: "error",
                message: "Error al guardar la partida",
                error: error.message
            });
        });
};

exports.view = function(req, res)
{
    Usuarios.findById(req.params.usuario_id).then(function(usuario)
    {
        console.log(req.params.usuario_id)
        res.json({
            message: "Datos del usuario obtenidos exitosamente",
            data: usuario
        })
    });
}

exports.delete = function(req, res)
{
    Usuarios.deleteOne({_id: req.params.usuario_id}).then(function(usuario)
    {
        res.json({
            status: "Usuarios eliminado exitosamente",
            data: usuario
        })
    });
}

exports.topUsers = function(req, res) {
    Usuarios.find()
        .sort({ puntuacion: -1 })
        .limit(10)
        .then(users => {
            res.json({
                status: "success",
                message: "Los 10 usuarios con más puntos obtenidos",
                data: users
            });
        })
        .catch(error => {
            res.status(500).json({
                status: "error",
                message: "Error al obtener los usuarios con más puntos",
                error: error.message
            });
        });
};


exports.incrementarPuntuacionUsuario
 = function(req, res) {
    const usuarioId = req.params.usuario_id;
    const puntosParaIncrementar = req.body.puntos;

    if (!puntosParaIncrementar || puntosParaIncrementar <= 0) {
        return res.status(400).json({
            status: "error",
            message: "Se debe proporcionar un valor válido para los puntos a incrementar"
        });
    }

    Usuarios.findByIdAndUpdate(usuarioId, { $inc: { puntuacion: puntosParaIncrementar } }, { new: true })
        .then(usuarioActualizado => {
            if (!usuarioActualizado) {
                return res.status(404).json({
                    status: "error",
                    message: "Usuario no encontrado"
                });
            }
            res.json({
                status: "success",
                message: "Puntuación del usuario incrementada exitosamente",
                data: usuarioActualizado
            });
        })
        .catch(error => {
            res.status(500).json({
                status: "error",
                message: "Error al incrementar la puntuación del usuario",
                error: error.message
            });
        });
};


exports.incrementarPuntuacionGeneral = function(req, res) {
    const puntosIncrementar = req.body.puntos;

    if (!puntosIncrementar || puntosIncrementar <= 0) {
        return res.status(400).json({
            status: "error",
            message: "Se debe proporcionar un valor válido para los puntos a incrementar"
        });
    }

    Usuarios.updateMany({}, { $inc: { puntuacion: puntosIncrementar } })
        .then(result => {
            res.json({
                status: "success",
                message: "Puntuación de todos los usuarios incrementada exitosamente",
                data: result
            });
        })
        .catch(error => {
            res.status(500).json({
                status: "error",
                message: "Error al incrementar la puntuación de todos los usuarios",
                error: error.message
            });
        });
};


exports.update = function(req, res)
{
    Usuarios.findById(req.params.usuario_id).then(function(usuario)
    {
        usuario.nombre = req.body.nombre ? req.body.nombre : usuario.nombre;
        usuario.clave = req.body.clave ? req.body.clave : usuario.clave;
        usuario.puntuacion = req.body.puntuacion ? req.body.puntuacion : usuario.puntuacion;

        usuario.save().then(function(data)
        {
            res.json({
                message: "Usuarios actualizado exitosamente",
                data: data
            })
        });
    })
}













































