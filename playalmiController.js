
const bcrypt = require('bcrypt');

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
//REVISADO
exports.new = function(req, res) {
    var usuario = new Usuarios();
    usuario.nombre = req.body.nombre;
    // Hashear la contraseña antes de guardarla
    bcrypt.hash(req.body.clave, 10, function(err, hash) {
        if (err) {
            return res.status(500).json({
                message: "Error al hashear la contraseña",
                error: err.message
            });
        }
        usuario.clave = hash; // Guardar el hash en lugar de la contraseña sin hashear
        usuario.monedasTotal = 0;
        usuario.puntuacionTotal = 0;

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
    });
};

/*exports.new = function(req, res) {
    var usuario = new Usuarios();
    usuario.nombre = req.body.nombre;
    usuario.clave = req.body.clave; 
    usuario.monedasTotal = 0;
    usuario.puntuacionTotal = 0;

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
*/


exports.insertarPartida = function(req, res) {
    const { usuario_id, puntuacion, monedas } = req.body;

    if (!usuario_id || !puntuacion) {
        return res.status(400).json({
            status: "error",
            message: "Se deben proporcionar el ID del usuario y el puntuacionTotal de la partida"
        });
    }

    const nuevaPartida = new Partidas({
        usuario_id: usuario_id,
        puntuacion: puntuacion,
        monedas: monedas,
        fecha: Date.now()
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
    Partidas.find()
        .sort({ puntuacion: -1 })
        .limit(10)
        .then(partidas => {
            res.json({
                status: "success",
                message: "Los 10 usuarios con más puntos obtenidos",
                data: partidas
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


exports.incrementarpuntuacionTotalUsuario = function(req, res) {
    const usuarioId = req.params.usuario_id;
    const puntosParaIncrementar = req.body.puntos;

    if (!puntosParaIncrementar || puntosParaIncrementar <= 0) {
        return res.status(400).json({
            status: "error",
            message: "Se debe proporcionar un valor válido para los puntos a incrementar"
        });
    }

    Usuarios.findByIdAndUpdate(usuarioId, { $inc: { puntuacionTotal: puntosParaIncrementar } }, { new: true })
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


exports.incrementarpuntuacionTotalGeneral = function(req, res) {
    const puntosIncrementar = req.body.puntos;

    if (!puntosIncrementar || puntosIncrementar <= 0) {
        return res.status(400).json({
            status: "error",
            message: "Se debe proporcionar un valor válido para los puntos a incrementar"
        });
    }

    Usuarios.updateMany({}, { $inc: { puntuacionTotal: puntosIncrementar } })
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

exports.update = function(req, res) {
    Usuarios.findById(req.params.usuario_id).then(function(usuario) {
        usuario.nombre = req.body.nombre ? req.body.nombre : usuario.nombre;

        // Hashear la clave solo si se proporciona en la solicitud
        if (req.body.clave) {
            bcrypt.hash(req.body.clave, 10, function(err, hash) {
                if (err) {
                    return res.status(500).json({
                        message: "Error al hashear la contraseña",
                        error: err.message
                    });
                }
                usuario.clave = hash; // Guardar el hash en lugar de la contraseña sin hashear
                guardarUsuario(usuario, res);
            });
        } else {
            // Si no se proporciona la clave, guardamos el usuario sin modificarla
            guardarUsuario(usuario, res);
        }
    });
};

function guardarUsuario(usuario, res) {
    usuario.save().then(function(data) {
        res.json({
            message: "Usuario actualizado exitosamente",
            data: data
        });
    }).catch(function(err) {
        res.status(500).json({
            message: "Error al actualizar usuario",
            error: err.message
        });
    });
}


/*exports.update = function(req, res)
{
    Usuarios.findById(req.params.usuario_id).then(function(usuario)
    {
        usuario.nombre = req.body.nombre ? req.body.nombre : usuario.nombre;
        usuario.clave = req.body.clave ? req.body.clave : usuario.clave;
        usuario.puntuacionTotal = req.body.puntuacionTotal ? req.body.puntuacionTotal : usuario.puntuacionTotal;

        usuario.save().then(function(data)
        {
            res.json({
                message: "Usuarios actualizado exitosamente",
                data: data
            })
        });
    })
}*/


exports.login = function(req, res) {
    const { nombre, clave } = req.body;

    // Buscar el usuario por su nombre de usuario
    Usuarios.findOne({ nombre: nombre }).then(function(usuario) {
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Comparar la contraseña proporcionada con la contraseña almacenada (hasheada)
        bcrypt.compare(clave, usuario.clave, function(err, result) {
            if (err) {
                return res.status(500).json({ message: "Error al comparar contraseñas", error: err.message });
            }
            if (result) {
                return res.json({ message: "Inicio de sesión exitoso", data: usuario });
            } else {
                return res.status(401).json({ message: "Credenciales incorrectas" });
            }
        });
    }).catch(function(err) {
        return res.status(500).json({ message: "Error al buscar usuario", error: err.message });
    });
};












































