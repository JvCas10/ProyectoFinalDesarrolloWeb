import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListaCursos from './ListaCursos';
import { useNavigate } from 'react-router-dom';
import './DashboardEstudiante.css';

const DashboardEstudiante = () => {
  const [courses, setCourses] = useState([]);
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Obtén el userId desde localStorage
    const token = localStorage.getItem('token'); // Obtén el token de autenticación

    if (!userId) {
      console.log("Error: No se encontró 'userId' en localStorage.");
    } else {
      console.log("userId encontrado en localStorage:", userId);
    }

    if (!token) {
      console.log("Error: No se encontró 'token' en localStorage.");
    } else {
      console.log("Token encontrado en localStorage:", token);
    }

    // Realiza la solicitud solo si el token está disponible
    if (token) {
      axios.get('http://localhost:3001/api/cursos', {
        headers: {
          Authorization: `${token}`,
        },
      })
        .then(response => {
          console.log("Cursos recibidos:", response.data); // Ver cursos recibidos
          setCourses(response.data);
        })
        .catch(error => {
          console.error('Error al obtener cursos:', error);
          if (error.response && error.response.status === 401) {
            console.error("No autorizado: el token podría ser inválido o haber expirado.");
          }
        });
    }
  }, []);

  const filteredCourses = courses.filter(course => 
    category === '' || course.categoria === category
  );

  const handleEnrollClick = (courseId) => {
    navigate(`/curso/${courseId}`);
  };

  return (
    <div className="dashboard-estudiante">
      <h1>Explora los Cursos</h1>
      <div className="filter">
        <label>Filtrar por categoría: </label>
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas</option>
          <option value="Programación">Programación</option>
          <option value="Desarrollo Web">Desarrollo Web</option>
          <option value="Ciencia de Datos">Ciencia de Datos</option>
          <option value="Tecnología">Tecnología</option>
        </select>
      </div>
      <ListaCursos courses={filteredCourses} onEnroll={handleEnrollClick} />
    </div>
  );
};

export default DashboardEstudiante;
