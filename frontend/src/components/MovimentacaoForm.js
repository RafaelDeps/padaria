import React, { useState } from 'react';

const MovimentacaoForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    tipo: 'ENTRADA',
    quantidade: 1,
    observacao: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, produto_id: product.id });
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '1rem', backgroundColor: '#f9f9f9' }}>
      <h4>Movimentar: {product.nome}</h4>
      <div>
        <label>Tipo:</label><br />
        <select name="tipo" value={formData.tipo} onChange={handleChange}>
          <option value="ENTRADA">Entrada</option>
          <option value="SAIDA">Saída</option>
        </select>
      </div>
      <div>
        <label>Quantidade:</label><br />
        <input type="number" name="quantidade" min="1" value={formData.quantidade} onChange={handleChange} required />
      </div>
      <div>
        <label>Observação:</label><br />
        <textarea name="observacao" value={formData.observacao} onChange={handleChange} />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button type="submit">Confirmar</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: '0.5rem' }}>Cancelar</button>
      </div>
    </form>
  );
};

export default MovimentacaoForm;
