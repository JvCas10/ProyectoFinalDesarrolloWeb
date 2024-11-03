import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/user-login', {
        correo,
        password,
      });

      const { token: tokenGenerado, role, userId } = response.data;
      console.log('userId recibido:', userId); // Verifica que `userId` se está recibiendo correctamente
      setToken(tokenGenerado);

      // Guardar token, rol y userId en localStorage
      localStorage.setItem('token', tokenGenerado);
      localStorage.setItem('role', role); // Guardar el rol del usuario
      localStorage.setItem('userId', userId);

      // Redirigir según el rol del usuario
      if (role === 'admin' || role === 'instructor') {
        navigate('/DashboardAdmin'); // Redirige a DashboardAdmin
      } else {
        navigate('/student'); // Redirige a la página de estudiantes
      }
    } catch (error) {
      console.error('Error al autenticar:', error.response ? error.response.data : error.message);
      alert('Error al autenticar, revisa tus credenciales');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Correo:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Ingresar</button>
      </form>

      {token && (
        <div className="token-container">
          <h3>Token generado:</h3>
          <p>{token}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
