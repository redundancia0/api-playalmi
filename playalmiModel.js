const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    clave: {
        type: String,
        required: true
    },
    monedasTotal: {
        type: Number,
        default: 0
    },
    puntuacionTotal: {
        type: Number,
        default: 0
    }

}, { collection: 'usuarios' });

const Usuarios = mongoose.model('usuarios', usuarioSchema);

Usuarios.get = function() {
    return Usuarios.find().exec();
}

module.exports.Usuarios = Usuarios;

const partidaSchema = mongoose.Schema({
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true
    },
    puntuacion: {
        type: Number,
        default: 0,
        required: true
    },
    monedas: {
        type: Number,
        default: 0
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, { collection: 'partidas' });

const Partidas = mongoose.model('partidas', partidaSchema);

module.exports.Partidas = Partidas;
