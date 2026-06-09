import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterModal from './RegisterModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-links">
        <h2 className="navbar-brand">Padaria Gestão</h2>
        {user?.cargo === 'gerente' && (
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        )}
        <Link to="/inventory" className="nav-link">Estoque</Link>
        <Link to="/history" className="nav-link">Histórico</Link>
      </div>
      <div className="user-info">
        <span>Olá, <strong>{user.nome}</strong> ({user.cargo})</span>
        
        {/* Botão visível apenas para gerentes */}
        {user && user.cargo === 'gerente' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-secondary"
            style={{ 
              marginLeft: '1rem', 
              backgroundColor: 'var(--accent-gold)', 
              color: 'var(--dark-brown)' 
            }}
          >
            Cadastrar Funcionário
          </button>
        )}

        <button 
          onClick={handleLogout}
          className="btn-danger"
          style={{ marginLeft: '1rem' }}
        >
          Sair
        </button>
      </div>
      <RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
