import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DashboardAdmin.css';

const DashboardAdmin = () => {
  const [cursos, setCursos] = useState([]);
  const [instructores, setInstructores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cursoFormValues, setCursoFormValues] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'Programación',
    instructor: '',
    lecciones: []
  });
  const [usuarioFormValues, setUsuarioFormValues] = useState({
    nombre: '',
    password: '',
    edad: '',
    correo: '',
    role: 'user'
  });
  const [cursoEditando, setCursoEditando] = useState(null);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [leccionFormValues, setLeccionFormValues] = useState({
    titulo: '',
    evaluacion: '',
    materialLeccion: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error

  const categorias = ['Programación', 'Desarrollo Web', 'Ciencia de Datos', 'Tecnología'];
  const navigate = useNavigate();

  // Recuperar el token de localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCursos();
    fetchUsuarios();
    fetchInstructores();
  }, []);

  const handleError = (error, defaultMessage) => {
    console.error(error);
    const message = error.response?.data?.mensaje || defaultMessage;
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 5000); // Limpia el mensaje de error después de 5 segundos
  };

  const fetchCursos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/cursos', {
        headers: { Authorization: `${token}` }
      });
      setCursos(response.data);
    } catch (error) {
      handleError(error, 'Error al cargar los cursos');
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/usuarios', {
        headers: { Authorization: `${token}` }
      });
      setUsuarios(response.data);
    } catch (error) {
      handleError(error, 'Error al cargar usuarios');
    }
  };

  const fetchInstructores = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/instructores', {
        headers: { Authorization: `${token}` }
      });
      setInstructores(response.data);
    } catch (error) {
      handleError(error, 'Error al cargar los instructores');
    }
  };

  const handleCursoInputChange = (e) => {
    const { name, value } = e.target;
    setCursoFormValues({ ...cursoFormValues, [name]: value });
  };

  const handleUsuarioInputChange = (e) => {
    const { name, value } = e.target;
    setUsuarioFormValues({ ...usuarioFormValues, [name]: value });
  };

  const handleLeccionInputChange = (e) => {
    const { name, value } = e.target;
    setLeccionFormValues({ ...leccionFormValues, [name]: value });
  };

  const handleCursoFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (cursoEditando) {
        await axios.put(`http://localhost:3001/api/curso/${cursoEditando._id}`, cursoFormValues, {
          headers: { Authorization: `${token}` }
        });
        setCursoEditando(null);
      } else {
        await axios.post('http://localhost:3001/api/curso', cursoFormValues, {
          headers: { Authorization: `${token}` }
        });
      }
      fetchCursos();
      resetCursoForm();
    } catch (error) {
      handleError(error, 'Error al agregar o editar curso');
    }
  };

  const handleUsuarioFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (usuarioEditando) {
        await axios.put(`http://localhost:3001/api/usuario/${usuarioEditando._id}`, usuarioFormValues, {
          headers: { Authorization: `${token}` }
        });
        setUsuarioEditando(null);
      } else {
        await axios.post('http://localhost:3001/api/usuario', usuarioFormValues, {
          headers: { Authorization: `${token}` }
        });
      }
      fetchUsuarios();
      resetUsuarioForm();
    } catch (error) {
      handleError(error, 'Error al agregar o editar usuario');
    }
  };

  const handleEditCurso = (curso) => {
    setCursoEditando(curso);
    setCursoFormValues(curso);
  };

  const handleDeleteCurso = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/curso/${id}`, {
        headers: { Authorization: `${token}` }
      });
      fetchCursos();
    } catch (error) {
      handleError(error, 'Error al eliminar el curso');
    }
  };

  const handleEditUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setUsuarioFormValues(usuario);
  };

  const handleDeleteUsuario = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/usuario/${id}`, {
        headers: { Authorization: `${token}` }
      });
      fetchUsuarios();
    } catch (error) {
      handleError(error, 'Error al eliminar usuario');
    }
  };

  const handleAddLeccion = () => {
    if (leccionFormValues.titulo && leccionFormValues.evaluacion) {
      setCursoFormValues({
        ...cursoFormValues,
        lecciones: [...cursoFormValues.lecciones, leccionFormValues]
      });
      setLeccionFormValues({ titulo: '', evaluacion: '', materialLeccion: '' });
    } else {
      setErrorMessage('Por favor, complete todos los campos de la lección.');
    }
  };

  const handleRemoveLeccion = (index) => {
    const updatedLecciones = cursoFormValues.lecciones.filter((_, i) => i !== index);
    setCursoFormValues({ ...cursoFormValues, lecciones: updatedLecciones });
  };

  const resetCursoForm = () => {
    setCursoFormValues({
      titulo: '',
      descripcion: '',
      categoria: 'Programación',
      instructor: '',
      lecciones: []
    });
    setCursoEditando(null);
    setLeccionFormValues({ titulo: '', evaluacion: '', materialLeccion: '' });
  };

  const resetUsuarioForm = () => {
    setUsuarioFormValues({
      nombre: '',
      password: '',
      edad: '',
      correo: '',
      role: 'user'
    });
    setUsuarioEditando(null);
  };

  // Verificar si el rol del usuario es 'admin'
  const isAdmin = localStorage.getItem('role') === 'admin';

  // Manejar la navegación al progreso de estudiantes
  const navigateToProgresoEstudiantes = () => {
    navigate('/progreso-estudiantes');
  };

  return (
    <div className="dashboard-admin">
      <h1>Gestión de Cursos</h1>

      {/* Mostrar mensaje de error */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Botón para ver el progreso de estudiantes, visible solo para admins */}
      {isAdmin && (
        <button onClick={navigateToProgresoEstudiantes} className="btn-progreso">
          Ver Progreso de Estudiantes
        </button>
      )}

      <form onSubmit={handleCursoFormSubmit} className="form-curso">
        <input
          type="text"
          name="titulo"
          value={cursoFormValues.titulo}
          onChange={handleCursoInputChange}
          placeholder="Título del curso"
          required
        />
        <textarea
          name="descripcion"
          value={cursoFormValues.descripcion}
          onChange={handleCursoInputChange}
          placeholder="Descripción del curso"
          required
        ></textarea>
        <select
          name="categoria"
          value={cursoFormValues.categoria}
          onChange={handleCursoInputChange}
          required
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          name="instructor"
          value={cursoFormValues.instructor}
          onChange={handleCursoInputChange}
          required
        >
          <option value="">Selecciona un Instructor</option>
          {instructores.map((instructor) => (
            <option key={instructor._id} value={instructor._id}>
              {instructor.nombre}
            </option>
          ))}
        </select>
        
        <h3>Lecciones</h3>
        {cursoFormValues.lecciones.map((leccion, index) => (
          <div key={index} className="leccion-item">
            <span>{leccion.titulo}</span>
            <button type="button" onClick={() => handleRemoveLeccion(index)}>Eliminar</button>
          </div>
        ))}
        <input
          type="text"
          name="titulo"
          value={leccionFormValues.titulo}
          onChange={handleLeccionInputChange}
          placeholder="Título de la lección"
        />
        <input
          type="text"
          name="evaluacion"
          value={leccionFormValues.evaluacion}
          onChange={handleLeccionInputChange}
          placeholder="URL de la evaluación"
        />
        <input
          type="text"
          name="materialLeccion"
          value={leccionFormValues.materialLeccion}
          onChange={handleLeccionInputChange}
          placeholder="URL del material de la lección"
        />
        <button type="button" onClick={handleAddLeccion} className="btn-add">Agregar Lección</button>
        
        <div className="button-container">
          <button type="submit" className={cursoEditando ? 'btn-update' : 'btn-add'}>
            {cursoEditando ? 'Actualizar Curso' : 'Agregar Curso'}
          </button>
          {cursoEditando && (
            <button type="button" className="btn-cancel" onClick={resetCursoForm}>
              Cancelar Edición
            </button>
          )}
        </div>
      </form>

      <h2>Cursos Existentes</h2>
      <div className="cursos-list">
        {cursos.map((curso) => (
          <div className="curso-item" key={curso._id}>
            <span><strong>{curso.titulo}</strong> - {curso.categoria}</span>
            <div className="button-group">
              <button onClick={() => handleEditCurso(curso)}>Editar</button>
              <button onClick={() => handleDeleteCurso(curso._id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <h1>Gestión de Usuarios</h1>
      <form onSubmit={handleUsuarioFormSubmit} className="form-usuario">
        <input
          type="text"
          name="nombre"
          value={usuarioFormValues.nombre}
          onChange={handleUsuarioInputChange}
          placeholder="Nombre"
          required
        />
        <input
          type="password"
          name="password"
          value={usuarioFormValues.password}
          onChange={handleUsuarioInputChange}
          placeholder="Contraseña"
          required
          autoComplete="new-password"
        />
        <input
          type="number"
          name="edad"
          value={usuarioFormValues.edad}
          onChange={handleUsuarioInputChange}
          placeholder="Edad"
          required
        />
        <input
          type="email"
          name="correo"
          value={usuarioFormValues.correo}
          onChange={handleUsuarioInputChange}
          placeholder="Correo"
          required
        />
        <select name="role" value={usuarioFormValues.role} onChange={handleUsuarioInputChange} required>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
          <option value="instructor">Instructor</option>
        </select>
        <div className="button-container">
          <button type="submit" className={usuarioEditando ? 'btn-update' : 'btn-add'}>
            {usuarioEditando ? 'Actualizar Usuario' : 'Agregar Usuario'}
          </button>
          {usuarioEditando && (
            <button type="button" className="btn-cancel" onClick={resetUsuarioForm}>
              Cancelar Edición
            </button>
          )}
        </div>
      </form>

      <h2>Usuarios Existentes</h2>
      <div className="usuarios-list">
        {usuarios.map((usuario) => (
          <div className="usuario-item" key={usuario._id}>
            <span><strong>{usuario.nombre}</strong> - {usuario.role}</span>
            <div className="button-group">
              <button onClick={() => handleEditUsuario(usuario)}>Editar</button>
              <button onClick={() => handleDeleteUsuario(usuario._id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardAdmin;
