/* LISTADO DE MÓDULOS */
const bcrypt = require('bcrypt');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });
const { model } = require('mongoose');

/* MODELOS */
Usuarios = require('./playalmiModel').Usuarios;
Partidas = require('./playalmiModel').Partidas;

/* FUNCIÓN -> OBTENER TODOS LOS USUARIOS [IMPLEMENTADO - WEB] */
exports.obtenerUsuarios = function(req, res) {        
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

/* FUNCIÓN -> CREAR UN NUEVO USUARIO (ALTA) [IMPLEMENTADO - WEB] */
exports.crearUsuario = function(req, res) {
    Usuarios.findOne({ $or: [{ nombre: req.body.nombre }, { correo: req.body.correo }] })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({
                    message: "El nombre de usuario o el correo electrónico ya están en uso"
                });
            }

            var usuario = new Usuarios();
            usuario.nombre = req.body.nombre;
            usuario.correo = req.body.correo;
            if (req.body.puntuacion !== undefined) {
                usuario.puntuacion = req.body.puntuacion;
            } 
            if (req.body.monedas !== undefined) {
                usuario.monedas = req.body.monedas;
            } 
            if (req.body.rango !== undefined) {
                usuario.rango = 0;
            } 
            if (req.body.avatar !== undefined) {
                usuario.avatar = "-";
            } else {
                usuario.puntuacion = 0;
                usuario.monedas = 0;
            }

            bcrypt.hash(req.body.clave, 10)
                .then(hash => {
                    usuario.clave = hash;

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
                })
                .catch(err => {
                    res.status(500).json({
                        message: "Error al hashear la contraseña",
                        error: err.message
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                message: "Error al buscar usuario existente",
                error: err.message
            });
        });
};

/* FUNCIÓN -> RECIBIR ARCHIVOS BACKUPS (.ZIP) [IMPLEMENTADO EN VPS]*/
exports.backupReceiver = function(req, res) {
    upload.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err.message)
            return res.status(500).json({ error: err.message });
        } else if (err) {
            console.log(err.message)
            return res.status(500).json({ error: 'Unknown error occurred' });
        }
        
        res.status(200).json({ message: 'File uploaded successfully' });
    });
};

/* FUNCIÓN -> OBTENER ÚLTIMAS 5 PARTIDAS DE UN USUARIO ORDENADAS POR FECHA [IMPLEMENTADO - WEB] */
exports.ultimasPartidas = function(req, res) {
    const { usuario_id } = req.params;

    Partidas.find({ usuario_id: usuario_id })
        .sort({ fecha: -1 })
        .limit(5)
        .then(partidas => {
            res.json({
                status: "success",
                message: `Las últimas 5 partidas del usuario ${usuario_id} obtenidas exitosamente`,
                data: partidas
            });
        })
        .catch(err => {
            res.status(500).json({
                status: "error",
                message: "Error al obtener las últimas partidas del usuario",
                error: err.message
            });
        });
};

/* FUNCIÓN -> INSERTAR PARTIDA .ZIP [EN IMPLEMENTACIÓN...] */
exports.insertarPartida = function(req, res) {
    const { usuario_id, puntuacion, monedas } = req.body;

    if (!usuario_id || !puntuacion) {
        return res.status(400).json({
            status: "error",
            message: "Se deben proporcionar el ID del usuario y la puntuación de la partida"
        });
    }

    const parsedPuntuacion = parseInt(puntuacion);
    const parsedMonedas = parseInt(monedas);

    if (isNaN(parsedPuntuacion) || isNaN(parsedMonedas)) {
        return res.status(400).json({
            status: "error",
            message: "La puntuación y las monedas deben ser valores numéricos"
        });
    }

    const nuevaPartida = new Partidas({
        usuario_id: usuario_id,
        puntuacion: parsedPuntuacion,
        monedas: parsedMonedas,
        fecha: Date.now()
    });

    nuevaPartida.save()
        .then(async partidaGuardada => {
            try {
                const usuario = await Usuarios.findById(usuario_id);
                if (!usuario) {
                    return res.status(404).json({
                        status: "error",
                        message: "Usuario no encontrado"
                    });
                }
                usuario.puntuacion += parsedPuntuacion;
                usuario.monedas += parsedMonedas;
                await usuario.save();
                
                res.json({
                    status: "success",
                    message: "Partida guardada exitosamente. Puntuación y monedas del usuario actualizadas",
                    data: partidaGuardada
                });
            } catch (error) {
                res.status(500).json({
                    status: "error",
                    message: "Error al guardar la partida o actualizar puntuación y monedas del usuario",
                    error: error.message
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                status: "error",
                message: "Error al guardar la partida",
                error: error.message
            });
        });
};


/* FUNCIÓN -> VER INFORMACIÓN DE UN USUARIO MEDIANTE ID [IMPLEMENTADO - WEB] */
exports.verUsuario = function(req, res)
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

/* FUNCIÓN -> ELIMINAR UN USUARIO POR ID [IMPLEMENTADO - WEB] */
exports.eliminarUsuario = function(req, res)
{
    Usuarios.deleteOne({_id: req.params.usuario_id}).then(function(usuario)
    {
        res.json({
            status: "Usuarios eliminado exitosamente",
            data: usuario
        })
    });
}

/* FUNCIÓN -> ELIMINAR TODOS LOS USUARIOS [PARA DEBUGUEAR] */
exports.eliminarUsuarios = function(req, res) {
    Usuarios.deleteMany({}).then(function(result) {
        res.json({
            status: "Todos los usuarios han sido eliminados exitosamente",
            data: result
        });
    }).catch(function(err) {
        res.status(500).json({
            status: "Error al eliminar usuarios",
            error: err
        });
    });
};

/* FUNCIÓN -> ELIMINAR TODAS LAS PARTIDAS [PARA DEBUGUEAR] */
exports.eliminarPartidas = function(req, res) {
    Partidas.deleteMany({}).then(function(result) {
        res.json({
            status: "Todos las partidas han sido eliminadas exitosamente",
            data: result
        });
    }).catch(function(err) {
        res.status(500).json({
            status: "Error al eliminar las partidas",
            error: err
        });
    });
};

/* FUNCIÓN -> MOSTRAR TOP MEJORES USUARIOS [IMPLEMENTADO - WEB - JUEGO] */
exports.topUsuarios = async function(req, res) {
    try {
        const partidas = await Partidas.find()
            .sort({ puntuacion: -1 })
            .limit(10)
            .populate('usuario_id');

        const usuariosSet = new Set();
        const topUsuarios = [];

        partidas.forEach(partida => {
            if (partida.usuario_id && partida.usuario_id._id) {
                const usuario = partida.usuario_id;
                if (!usuariosSet.has(usuario._id)) {
                    usuariosSet.add(usuario._id);
                    topUsuarios.push({
                        usuario_id: usuario._id,
                        nombre: usuario.nombre,
                        correo: usuario.correo,
                        puntuacion: partida.puntuacion
                    });
                }
            }
        });

        res.json({
            status: "success",
            message: "Los 10 usuarios con más puntos obtenidos (sin repetir)",
            data: topUsuarios
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener los usuarios con más puntos",
            error: error.message
        });
    }
};

/* FUNCIÓN -> INCREMENTAR PUNTUACIÓN DE UN USUARIO [NO IMPLEMENTADO] */
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

/* FUNCIÓN -> INCREMENTAR PUNTUACIÓN GENERAL DE TODOS LOS USUARIOS [NO IMPLEMENTADO] */
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

/* FUNCIÓN -> MODIFICAR INFORMACIÓN DE UN USUARIO [IMPLEMENTADO - WEB] */
exports.actualizarUsuario = function(req, res) {
    Usuarios.findById(req.params.usuario_id).then(function(usuario) {
        usuario.nombre = req.body.nombre ? req.body.nombre : usuario.nombre;
        usuario.rango = req.body.rango ? req.body.rango : usuario.rango;
        usuario.puntuacion = req.body.puntuacion ? req.body.puntuacion : usuario.puntuacion;
        usuario.monedas = req.body.monedas ? req.body.monedas : usuario.monedas;


        if (req.body.clave) {
            bcrypt.hash(req.body.clave, 10, function(err, hash) {
                if (err) {
                    return res.status(500).json({
                        message: "Error al hashear la contraseña",
                        error: err.message
                    });
                }
                usuario.clave = hash; 
                guardarUsuario(usuario, res);
            });
        } else {
            guardarUsuario(usuario, res);
        }
    });
};

/* FUNCIÓN -> GUARDAR UN USUARIO -> [IMPLEMENTADO EN .CREARUSUARIO] */
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

/* FUNCIÓN -> COMPROBAR SI USUARIO/CONTRASEÑA HASHEADA SON CORRECTOS [IMPLEMENTADO - WEB - JUEGO] */
exports.login = function(req, res) {
    const { nombre, clave } = req.body;

    Usuarios.findOne({ nombre: nombre }).then(function(usuario) {
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        bcrypt.compare(clave, usuario.clave, function(err, result) {
            if (err) {
                return res.status(500).json({ message: "Error al comparar contraseñas", error: err.message });
            }
            if (result) {
                const userData = {
                    _id: usuario._id,
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    monedas: usuario.monedas,
                    avatar: usuario.avatar,
                    rango: usuario.rango,
                    puntuacion: usuario.puntuacion,
                    fecha_registro: usuario.fecha_registro
                };
                return res.json({ message: "Inicio de sesión exitoso", data: userData });
            } else {
                return res.status(401).json({ message: "Credenciales incorrectas" });
            }
        });
    }).catch(function(err) {
        return res.status(500).json({ message: "Error al buscar usuario", error: err.message });
    });
};













































