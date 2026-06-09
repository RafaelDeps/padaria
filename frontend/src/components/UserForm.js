import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const UserForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    username: '',
    password: '',
    cargo: 'funcionario',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      toast.success('Funcionário cadastrado com sucesso!');
      onCancel();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Erro ao cadastrar funcionário';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onCancel}>&times;</button>
        <h3>Cadastrar Novo Usuário</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome Completo:</label>
            <input name="nome" value={formData.nome} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Usuário (username):</label>
            <input name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Senha:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Cargo:</label>
            <select name="cargo" value={formData.cargo} onChange={handleChange}>
              <option value="funcionario">Funcionário</option>
              <option value="gerente">Gerente</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Cadastrar</button>
            <button type="button" onClick={onCancel} className="btn-outline">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
