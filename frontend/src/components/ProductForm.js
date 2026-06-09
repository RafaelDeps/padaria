import React, { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    estoque_minimo: 0,
    preco_unitario: 0,
    data_validade: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h3>{initialData ? 'Editar Produto' : 'Novo Produto'}</h3>
        <div className="form-group">
          <label>Nome:</label>
          <input name="nome" value={formData.nome} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Categoria:</label>
          <input name="categoria" value={formData.categoria} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Estoque Mínimo:</label>
          <input type="number" name="estoque_minimo" value={formData.estoque_minimo} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Preço Unitário:</label>
          <input type="number" step="0.01" name="preco_unitario" value={formData.preco_unitario} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Data de Validade:</label>
          <input type="date" name="data_validade" value={formData.data_validade} onChange={handleChange} required />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary">Salvar</button>
          <button type="button" onClick={onCancel} className="btn-outline">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
