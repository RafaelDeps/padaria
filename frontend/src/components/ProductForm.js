import React, { useState, useEffect } from 'react';
import api from '../services/api';

const formatDateForInput = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return '';
};

const ProductForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    estoque_minimo: 0,
    preco_unitario: 0,
    data_validade: '',
    is_manufactured: false,
  });
  const [allProducts, setAllProducts] = useState([]);
  const [recipeList, setRecipeList] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ ingredient_id: '', quantity: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/produtos');
        setAllProducts(res.data);
      } catch (err) {
        console.error('Error fetching products', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome ?? '',
        categoria: initialData.categoria ?? '',
        estoque_minimo: initialData.estoque_minimo ?? 0,
        preco_unitario: initialData.preco_unitario ?? 0,
        data_validade: formatDateForInput(initialData.data_validade),
        is_manufactured: initialData.is_manufactured ?? false,
      });

      // Fetch recipe if product is manufactured
      if (initialData.is_manufactured) {
        const fetchRecipe = async () => {
          try {
            const res = await api.get(`/produtos/${initialData.id}/receita`);
            setRecipeList(res.data);
          } catch (err) {
            console.error('Error fetching recipe', err);
          }
        };
        fetchRecipe();
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleRecipeChange = (e) => {
    const { name, value } = e.target;
    setNewIngredient({ ...newIngredient, [name]: value });
  };

  const addIngredient = () => {
    if (!newIngredient.ingredient_id || !newIngredient.quantity) return;
    const ingredient = allProducts.find(p => p.id === parseInt(newIngredient.ingredient_id));
    if (!ingredient) return;
    setRecipeList([...recipeList, { ingredient_id: parseInt(newIngredient.ingredient_id), quantity: parseFloat(newIngredient.quantity), ingredient_nome: ingredient.nome }]);
    setNewIngredient({ ingredient_id: '', quantity: '' });
  };

  const removeIngredient = (index) => {
    setRecipeList(recipeList.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      estoque_minimo: Number(formData.estoque_minimo),
      preco_unitario: Number(formData.preco_unitario),
      data_validade: formatDateForInput(formData.data_validade),
      recipeList: formData.is_manufactured ? recipeList : [],
    };
    onSubmit(data);
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
        <div className="form-group">
          <label>
            <input type="checkbox" name="is_manufactured" checked={formData.is_manufactured} onChange={handleChange} />
            {' '}Produto Fabricado
          </label>
        </div>
        {formData.is_manufactured && (
          <div className="form-group">
            <label>Ingredientes da Receita:</label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <select name="ingredient_id" value={newIngredient.ingredient_id} onChange={handleRecipeChange}>
                <option value="">Selecione...</option>
                {allProducts.filter(p => p.id !== initialData?.id).map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
              <input type="number" step="0.01" name="quantity" placeholder="Quantidade" value={newIngredient.quantity} onChange={handleRecipeChange} style={{ width: '100px' }} />
              <button type="button" onClick={addIngredient} className="btn-secondary">Adicionar</button>
            </div>
            {recipeList.length > 0 && (
              <ul>
                {recipeList.map((item, idx) => (
                  <li key={idx}>
                    {item.ingredient_nome}: {item.quantity}
                    <button type="button" onClick={() => removeIngredient(idx)} style={{ marginLeft: '10px' }}>X</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="form-actions">
          <button type="submit" className="btn-primary">Salvar</button>
          <button type="button" onClick={onCancel} className="btn-outline">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
