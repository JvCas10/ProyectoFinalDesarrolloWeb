import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgresoEstudiantes.css';

const ProgresoEstudiantes = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuariosConProgreso = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtén el token del localStorage

        // Configura el encabezado de autorización con el token
        const config = {
          headers: {
            Authorization: `${token}`
          }
        };

        // Obtenemos solo estudiantes con rol 'user' y su progreso
        const response = await axios.get('http://localhost:3001/api/progreso-estudiantes', config);
        const estudiantesConProgreso = response.data
          .filter(usuario => usuario.estudiante.role === 'user')
          .reduce((acc, usuario) => {
            const estudiante = acc.find(e => e.estudiante._id === usuario.estudiante._id);
            if (estudiante) {
              estudiante.cursos.push(usuario);
            } else {
              acc.push({ estudiante: usuario.estudiante, cursos: [usuario] });
            }
            return acc;
          }, []);
        
        setUsuarios(estudiantesConProgreso);
      } catch (error) {
        console.error('Error al obtener el progreso de los estudiantes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuariosConProgreso();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="progreso-estudiantes-container">
      <h1>Progreso de Estudiantes</h1>
      {usuarios.length === 0 ? (
        <p>No hay estudiantes con progreso registrado.</p>
      ) : (
        usuarios.map((usuario) => (
          <div key={usuario.estudiante._id} className="usuario-card">
            <h2>{usuario.estudiante.nombre} ({usuario.estudiante.correo})</h2>
            {usuario.cursos.map((cursoInfo) => (
              <div key={cursoInfo.curso._id} className="curso-card">
                <h3>Curso: {cursoInfo.curso.titulo}</h3>
                <p>
                  Progreso: {cursoInfo.curso.lecciones && cursoInfo.curso.lecciones.length > 0 
                    ? ((cursoInfo.leccionesCompletadas.length / cursoInfo.curso.lecciones.length) * 100).toFixed(2) 
                    : 'No disponible'}%
                </p>
                <p>Lecciones completadas: {cursoInfo.leccionesCompletadas.length} de {cursoInfo.curso.lecciones?.length || 0}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ProgresoEstudiantes;
