import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      login(response.data.user, response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Login - Padaria</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label>Usuário:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Senha:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
