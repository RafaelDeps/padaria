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
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <h3>{initialData ? 'Editar Produto' : 'Novo Produto'}</h3>
      <div>
        <label>Nome:</label><br />
        <input name="nome" value={formData.nome} onChange={handleChange} required />
      </div>
      <div>
        <label>Categoria:</label><br />
        <input name="categoria" value={formData.categoria} onChange={handleChange} required />
      </div>
      <div>
        <label>Estoque Mínimo:</label><br />
        <input type="number" name="estoque_minimo" value={formData.estoque_minimo} onChange={handleChange} required />
      </div>
      <div>
        <label>Preço Unitário:</label><br />
        <input type="number" step="0.01" name="preco_unitario" value={formData.preco_unitario} onChange={handleChange} required />
      </div>
      <div>
        <label>Data de Validade:</label><br />
        <input type="date" name="data_validade" value={formData.data_validade} onChange={handleChange} required />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button type="submit">Salvar</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: '0.5rem' }}>Cancelar</button>
      </div>
    </form>
  );
};

export default ProductForm;
