import React from 'react';
import './ListaCursos.css';

const ListaCursos = ({ courses, onEnroll }) => {
  return (
    <div className="courses-container">
      {courses.map(course => (
        <div key={course._id} className="course-card">
          <span className="course-category">{course.categoria}</span>
          <h2 className="course-title">{course.titulo}</h2>
          <p className="course-description">{course.descripcion}</p>
          <button className="enroll-button" onClick={() => onEnroll(course._id)}>
            Inscribirse
          </button>
        </div>
      ))}
    </div>
  );
};

export default ListaCursos;
