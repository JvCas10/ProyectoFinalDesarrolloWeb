const mongoose = require('mongoose');

const UsuarioEsquema = new mongoose.Schema({
    nombre: String,
    password: String,
    edad: Number,
    correo: String,
    role: {
        type: String,
        enum: ['user', 'admin', 'instructor'],
        default: 'user'
    }
});

module.exports = mongoose.model('Usuario', UsuarioEsquema);
