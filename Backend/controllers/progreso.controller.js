// progreso.controller.js

const Progreso = require('../models/progreso.model');
const mongoose = require('mongoose');

// Función para registrar acceso a una lección
exports.registrarAcceso = async (req, res) => {
    const { cursoId } = req.params;
    const { userId, leccionId } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(cursoId) || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(leccionId)) {
            return res.status(400).json({ mensaje: 'Uno o más IDs no son válidos' });
        }

        let progreso = await Progreso.findOne({ estudiante: userId, curso: cursoId });

        if (!progreso) {
            progreso = new Progreso({ estudiante: userId, curso: cursoId, leccionesCompletadas: [] });
        }

        if (!progreso.leccionesCompletadas.includes(leccionId)) {
            progreso.leccionesCompletadas.push(leccionId);
        }

        await progreso.save();
        res.status(200).json({ mensaje: 'Progreso actualizado', progreso });
    } catch (error) {
        console.error('Error al registrar acceso:', error);
        res.status(500).json({ mensaje: 'Error al registrar acceso', error: error.message });
    }
};

// Función para obtener el progreso de un estudiante en un curso
exports.obtenerProgreso = async (req, res) => {
    const { cursoId, estudianteId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(cursoId) || !mongoose.Types.ObjectId.isValid(estudianteId)) {
            return res.status(400).json({ mensaje: 'Uno o más IDs no son válidos' });
        }

        const progreso = await Progreso.findOne({ curso: cursoId, estudiante: estudianteId }).populate('leccionesCompletadas', 'titulo');

        if (!progreso) {
            return res.status(404).json({ mensaje: 'Progreso no encontrado' });
        }

        res.status(200).json(progreso);
    } catch (error) {
        console.error('Error al obtener progreso:', error);
        res.status(500).json({ mensaje: 'Error al obtener progreso', error: error.message });
    }
};

// Función para obtener el progreso de todos los estudiantes con rol 'user'
exports.obtenerProgresoEstudiantes = async (req, res) => {
    try {
        const progresos = await Progreso.find()
            .populate('estudiante', 'nombre correo role')
            .populate('curso', 'titulo lecciones') // Incluimos 'lecciones' en el curso
            .populate('leccionesCompletadas', 'titulo');

        const estudiantesConProgreso = progresos.filter(progreso => progreso.estudiante && progreso.estudiante.role === 'user');
        res.status(200).json(estudiantesConProgreso);
    } catch (error) {
        console.error('Error al obtener el progreso de los estudiantes:', error);
        res.status(500).json({ mensaje: 'Error al obtener el progreso de los estudiantes', error: error.message });
    }
};

// Función para obtener el progreso de un usuario en todos los cursos
exports.obtenerProgresoGeneralUsuario = async (req, res) => {
    const { usuarioId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return res.status(400).json({ mensaje: 'ID de usuario no válido' });
        }

        const progreso = await Progreso.find({ estudiante: usuarioId })
            .populate('curso', 'titulo lecciones')
            .populate('leccionesCompletadas', 'titulo');

        const cursosConProgreso = progreso.map(cursoProgreso => {
            const totalLecciones = cursoProgreso.curso?.lecciones?.length || 0;
            const leccionesCompletadasCount = cursoProgreso.leccionesCompletadas.length;
            const progresoPorcentaje = totalLecciones > 0 ? (leccionesCompletadasCount / totalLecciones) * 100 : null;

            return {
                cursoId: cursoProgreso.curso?._id || null,
                titulo: cursoProgreso.curso?.titulo || 'Curso no disponible',
                totalLecciones: totalLecciones,
                leccionesCompletadas: cursoProgreso.leccionesCompletadas.map(leccion => leccion.titulo || 'Lección no disponible'),
                progresoPorcentaje: progresoPorcentaje !== null ? progresoPorcentaje.toFixed(2) : 'No disponible'
            };
        });

        res.status(200).json({ cursos: cursosConProgreso });
    } catch (error) {
        console.error('Error al obtener progreso general del usuario:', error);
        res.status(500).json({ mensaje: 'Error al obtener progreso general del usuario' });
    }
};

