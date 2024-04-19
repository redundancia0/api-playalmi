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
    puntuacion: {
        type: Number,
        default: 0
    }
}, { collection: 'usuarios' });

var Usuarios = mongoose.model('usuarios', usuarioSchema);

module.exports = Usuarios;

var Usuarios = module.exports = mongoose.model('usuarios', usuarioSchema)

module.exports.get = function()
{
    return Usuarios.find().exec();
}