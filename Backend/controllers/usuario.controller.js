const Usuario = require('../models/usuario.model');  // Importa el modelo de Usuario
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'mysecretkey';  // Define la clave secreta para JWT

// Obtener todos los usuarios
exports.getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).send({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// Crear un nuevo usuario
exports.addUsuario = async (req, res) => {
    try {
        const nuevoUsuario = await Usuario.create(req.body);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).send({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// Obtener un usuario por ID
exports.getUsuarioPorID = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) return res.status(404).send({ mensaje: 'Usuario no encontrado' });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).send({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// Actualizar un usuario por ID
exports.updateUser = async (req, res) => {
    try {
        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!usuarioActualizado) return res.status(404).send({ mensaje: 'Usuario no encontrado' });
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        res.status(500).send({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// Eliminar un usuario por ID
exports.deleteUser = async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuarioEliminado) return res.status(404).send({ mensaje: 'Usuario no encontrado' });
        res.status(200).json({ mensaje: 'Usuario eliminado con éxito' });
    } catch (error) {
        res.status(500).send({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// Autenticar usuario y generar token JWT
exports.authenticateUser = async (req, res) => {
    const { correo, password } = req.body;

    try {
        // Buscar usuario por correo
        const user = await Usuario.findOne({ correo });

        // Verificar si el usuario existe
        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(400).send('Correo inválido');
        }

        // Verificar si la contraseña es correcta
        if (user.password !== password) {
            console.log('Contraseña incorrecta para el usuario:', correo);
            return res.status(400).send('Contraseña inválida');
        }

        // Autenticación exitosa, crear y enviar token JWT con rol y userId
        const token = jwt.sign(
            { nombre: user.nombre, correo: user.correo, role: user.role },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.send({ token, role: user.role, userId: user._id });  // Incluye userId en la respuesta
    } catch (error) {
        console.error('Error en el servidor durante la autenticación:', error.message);
        res.status(500).send({ mensaje: 'Error en el servidor', error: error.message });
    }
};

// Cambiar el rol de un usuario
exports.putUserRole = async (req, res) => {
    const { role } = req.body;

    try {
        const user = await Usuario.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user) return res.status(404).send('Usuario no encontrado');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
};

// Obtener todos los instructores
exports.getInstructores = async (req, res) => {
    try {
        const instructores = await Usuario.find({ role: 'instructor' }).select('nombre');
        res.status(200).json(instructores);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener instructores', error: error.message });
    }
};
