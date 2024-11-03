const mongoose = require('mongoose');
const Usuario = require('./usuario.model');  // Importar el modelo de Usuario

const LeccionEsquema = new mongoose.Schema({
    titulo: String,
    evaluacion: String,  // Cambiado de contenidoVideo a evaluacion
    materialLeccion: String  // Cambiado de materialDescargable a materialLeccion
});

const CursoEsquema = new mongoose.Schema({
    titulo: String,
    descripcion: String,
    categoria: String,
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    lecciones: [LeccionEsquema],
    estudiantesInscritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
    fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Curso', CursoEsquema);
