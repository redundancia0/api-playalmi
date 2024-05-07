const mongoose = require('mongoose');

/* ESQUEMA DE LA COLECCIÓN USUARIOS */
const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
    },
    clave: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    rango: {
        type: Number,
        enum: [0, 1], 
        default: 0
    },
    estadisticas: {
        monedas: {
            type: Number,
            default: 0,
            required: true
        },
        puntuacion: {
            type: Number,
            default: 0
        }
    },
    fecha_registro: {
        type: Date,
        default: Date.now
    },
    fecha_inicioSesion: {
        type: Date,
        default: Date.now
    }

}, { collection: 'usuarios' });

const Usuarios = mongoose.model('usuarios', usuarioSchema);

Usuarios.get = function() {
    return Usuarios.find().exec();
}

module.exports.Usuarios = Usuarios;

/* ESQUEMA DE LA COLECCIÓN PARTIDAS */
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
