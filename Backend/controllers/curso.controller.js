const Curso = require('../models/curso.model');

// Obtener todos los cursos
exports.getAllCursos = async (req, res) => {
    try {
        const cursos = await Curso.find().populate('instructor', 'nombre correo');
        res.status(200).json(cursos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener cursos', error: error.message });
    }
};

// Crear un curso
exports.addCurso = async (req, res) => {
    try {
        const { titulo, descripcion, categoria, instructor, lecciones } = req.body;

        if (!titulo || !descripcion || !categoria || !instructor) {
            return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
        }

        const nuevoCurso = new Curso({
            titulo,
            descripcion,
            categoria,
            instructor,
            lecciones,
            fechaCreacion: new Date() // Agregamos la fecha de creación
        });

        await nuevoCurso.save();
        res.status(201).json(nuevoCurso);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el curso', error: error.message });
    }
};

// Obtener un curso por ID
exports.getCursoPorID = async (req, res) => {
    try {
        const curso = await Curso.findById(req.params.id).populate('instructor', 'nombre');
        if (!curso) return res.status(404).json({ mensaje: 'Curso no encontrado' });
        res.status(200).json(curso);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// Actualizar un curso
exports.updateCurso = async (req, res) => {
    try {
        const cursoActualizado = await Curso.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Asegúrate de incluir runValidators
        );
        if (!cursoActualizado) return res.status(404).json({ mensaje: 'Curso no encontrado' });
        res.status(200).json(cursoActualizado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el curso', error: error.message });
    }
};

// Eliminar un curso por ID
exports.deleteCurso = async (req, res) => {
    try {
        const cursoEliminado = await Curso.findByIdAndDelete(req.params.id);
        if (!cursoEliminado) return res.status(404).json({ mensaje: 'Curso no encontrado' });
        res.status(200).json({ mensaje: 'Curso eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el curso', error: error.message });
    }
};

// Agregar una lección a un curso
exports.agregarLeccion = async (req, res) => {
    const { titulo, evaluacion, materialLeccion } = req.body;
    try {
        const curso = await Curso.findById(req.params.id);
        if (!curso) return res.status(404).json({ mensaje: 'Curso no encontrado' });

        curso.lecciones.push({ titulo, evaluacion, materialLeccion });
        await curso.save();
        res.status(200).json(curso);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al agregar lección', error: error.message });
    }
};

// Obtener una lección específica por ID dentro de un curso
exports.getLeccionPorID = async (req, res) => {
    const { cursoId, leccionId } = req.params;

    try {
        const curso = await Curso.findById(cursoId);
        if (!curso) return res.status(404).json({ mensaje: 'Curso no encontrado' });

        const leccion = curso.lecciones.id(leccionId);
        if (!leccion) return res.status(404).json({ mensaje: 'Lección no encontrada' });

        res.status(200).json(leccion);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// Inscribir un usuario en un curso
exports.inscribirUsuario = async (req, res) => {
    const { cursoId } = req.params;
    const { userId } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({ mensaje: 'Falta el ID del usuario' });
        }

        const curso = await Curso.findById(cursoId);
        if (!curso) return res.status(404).json({ mensaje: 'Curso no encontrado' });

        if (curso.estudiantesInscritos.includes(userId)) {
            return res.status(409).json({ mensaje: 'Usuario ya inscrito en el curso' });
        }

        curso.estudiantesInscritos.push(userId);
        await curso.save();

        res.status(200).json({ mensaje: 'Usuario inscrito correctamente' });
    } catch (error) {
        console.error('Error al inscribir usuario:', error);
        res.status(500).json({ mensaje: 'Error al inscribir usuario', error: error.message });
    }
};
