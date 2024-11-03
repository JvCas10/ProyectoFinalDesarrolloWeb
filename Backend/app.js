const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3001;

// Importar rutas
const usuarioRoutes = require('./routes/usuario.routes');
const cursoRoutes = require('./routes/curso.routes');
const progresoRoutes = require('./routes/progreso.routes'); // Asegúrate de que este está incluido

// Middleware para habilitar CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para parsear JSON
app.use(express.json());

// Registrar las rutas
app.use('/api', usuarioRoutes);
app.use('/api', cursoRoutes);
app.use('/api', progresoRoutes); // Asegúrate de que este está registrado

// Conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/miBaseDeDatos')
    .then(() => {
        console.log('Conexión a MongoDB exitosa');

        // Iniciar el servidor después de conectarse a la base de datos
        app.listen(port, () => {
            console.log(`El servidor está listo en el puerto ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
    });

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('Error no capturado:', err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
});
