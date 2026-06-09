import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const MovimentacaoForm = ({ product, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    tipo: 'ENTRADA',
    quantidade: 1,
    observacao: '',
  });

  useEffect(() => {
    if (user?.cargo === 'funcionario') {
      setFormData(prev => ({ ...prev, tipo: 'SAIDA' }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, produto_id: product.id });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h4>Movimentar: {product.nome}</h4>
        <div className="form-group">
          <label>Tipo:</label>
          <select 
            name="tipo" 
            value={formData.tipo} 
            onChange={handleChange}
            disabled={user?.cargo === 'funcionario'}
          >
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
          </select>
        </div>
        <div className="form-group">
          <label>Quantidade:</label>
          <input type="number" name="quantidade" min="1" value={formData.quantidade} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Observação:</label>
          <textarea name="observacao" value={formData.observacao} onChange={handleChange} rows="3" />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">Confirmar</button>
          <button type="button" onClick={onCancel} className="btn-outline">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default MovimentacaoForm;
