import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const RegisterModal = ({ isOpen, onClose }) => {
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
      toast.success('Usuário cadastrado com sucesso!');
      setFormData({
        nome: '',
        username: '',
        password: '',
        cargo: 'funcionario',
      });
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Erro ao cadastrar funcionário';
      toast.error(errorMsg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h3 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', color: 'var(--accent-color)' }}>
          Cadastrar Novo Funcionário
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome Completo:</label>
            <input 
              type="text" 
              name="nome" 
              value={formData.nome} 
              onChange={handleChange} 
              placeholder="Ex: João da Silva"
              required 
            />
          </div>
          <div className="form-group">
            <label>Usuário:</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Ex: joao.silva"
              required 
            />
          </div>
          <div className="form-group">
            <label>Senha:</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="••••••••"
              required 
            />
          </div>
          <div className="form-group">
            <label>Cargo:</label>
            <select name="cargo" value={formData.cargo} onChange={handleChange}>
              <option value="funcionario">Funcionário</option>
              <option value="gerente">Gerente</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Salvar Cadastro</button>
            <button type="button" onClick={onClose} className="btn-outline">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
