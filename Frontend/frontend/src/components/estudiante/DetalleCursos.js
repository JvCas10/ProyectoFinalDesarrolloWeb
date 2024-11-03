import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DetalleCursos.css';

const DetalleCursos = () => {
  const { id } = useParams(); // Obtiene el ID del curso desde los parámetros de la URL
  const [curso, setCurso] = useState(null); // Estado para almacenar los datos del curso
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando
  const userId = localStorage.getItem('userId'); // Obtén el userId desde localStorage
  const token = localStorage.getItem('token'); // Obtén el token desde localStorage

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/curso/${id}`, {
          headers: { Authorization: `${token}` }
        });
        setCurso(response.data); // Establece el estado del curso con los datos obtenidos
      } catch (error) {
        console.error('Error al cargar el curso:', error);
      } finally {
        setLoading(false); // Cambia el estado de loading a false cuando la carga haya terminado
      }
    };

    fetchCurso();
  }, [id, token]);

  const handleInscribirse = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/curso/${id}/inscribirse`,
        { userId: userId },
        { headers: { Authorization: `${token}` } } // Incluye el token en los encabezados
      );
      alert(response.data.mensaje); // Muestra un mensaje de éxito
    } catch (error) {
      console.error('Error al inscribir usuario:', error);
      alert('Usuario ya inscrito', error);
    }
  };

  const handleLeccionAcceso = async (leccionId) => {
    try {
      await axios.post(
        `http://localhost:3001/api/curso/${id}/acceso`,
        { userId: userId, leccionId: leccionId },
        { headers: { Authorization: `${token}` } } // Incluye el token en los encabezados
      );
      alert('Acceso registrado correctamente');
    } catch (error) {
      console.error('Error al registrar acceso:', error);
      alert('No se pudo registrar el acceso a la lección');
    }
  };

  const handleVerProgreso = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/curso/${id}/progreso/${userId}`,
        { headers: { Authorization: `${token}` } } // Incluye el token en los encabezados
      );
      alert(`Progreso en este curso: ${response.data.leccionesCompletadas.length} lecciones completadas.`);
    } catch (error) {
      console.error('Error al obtener progreso:', error);
      alert('Usuario ya inscrito');
    }
  };

  if (loading) return <p>Cargando...</p>;

  if (!curso) return <p>Error al cargar los datos del curso.</p>;

  return (
    <div className="detalle-curso-container">
      <div className="detalle-curso-header">
        <h1>{curso.titulo}</h1>
        <p>{curso.descripcion}</p>
      </div>

      <div className="lecciones-container">
        {curso.lecciones.map((leccion) => (
          <div key={leccion._id} className="leccion-item">
            <span className="leccion-title">{leccion.titulo}</span>
            <div className="leccion-links">
              {leccion.evaluacion && (
                <a
                  href={leccion.evaluacion.startsWith("http") ? leccion.evaluacion : `https://${leccion.evaluacion}`}
                  className="leccion-evaluacion-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLeccionAcceso(leccion._id)}
                >
                  Ir a la evaluación
                </a>
              )}
              {leccion.materialLeccion && (
                <a
                  href={leccion.materialLeccion.startsWith("http") ? leccion.materialLeccion : `https://${leccion.materialLeccion}`}
                  className="leccion-material-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver material
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="inscribirse-btn" onClick={handleInscribirse}>Inscribirse</button>
      <button className="ver-progreso-btn" onClick={handleVerProgreso}>Ver Progreso</button>
    </div>
  );
};

export default DetalleCursos;
