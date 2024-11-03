// progreso.model.js
const mongoose = require('mongoose');

const progresoSchema = new mongoose.Schema({
    estudiante: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    curso: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso', required: true },
    leccionesCompletadas: [{ type: mongoose.Schema.Types.ObjectId }] // Solo almacena los IDs
}, { timestamps: true });

// Índice compuesto para evitar duplicados de progreso por estudiante y curso
progresoSchema.index({ estudiante: 1, curso: 1 }, { unique: true });

module.exports = mongoose.model('Progreso', progresoSchema);
