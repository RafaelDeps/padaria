import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import EstoqueDataTable from '../components/EstoqueDataTable';
import ProductForm from '../components/ProductForm';
import MovimentacaoForm from '../components/MovimentacaoForm';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [movingProduct, setMovingProduct] = useState(null);
  const { user } = useAuth();

  const fetchProducts = async () => {
    try {
      const response = await api.get('/produtos');
      setProducts(response.data);
    } catch (err) {
      console.error("Erro ao buscar produtos", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingProduct) {
        await api.put(`/produtos/${editingProduct.id}`, formData);
      } else {
        await api.post('/produtos', formData);
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert("Erro ao salvar produto");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir este produto?")) {
      try {
        await api.delete(`/produtos/${id}`);
        fetchProducts();
      } catch (err) {
        alert("Erro ao excluir produto");
      }
    }
  };

  const handleMovement = async (movementData) => {
    try {
      await api.post('/movimentacoes', movementData);
      setMovingProduct(null);
      fetchProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Erro ao registrar movimentação";
      alert(errorMsg);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>Gestão de Estoque</h2>
        {user?.cargo === 'GERENTE' && (
          <button onClick={() => { setEditingProduct(null); setShowForm(true); }}>
            + Novo Produto
          </button>
        )}
      </div>

      {showForm && (
        <ProductForm 
          onSubmit={handleCreateOrUpdate} 
          initialData={editingProduct} 
          onCancel={() => { setShowForm(false); setEditingProduct(null); }} 
        />
      )}

      {movingProduct && (
        <MovimentacaoForm 
          product={movingProduct}
          onSubmit={handleMovement}
          onCancel={() => setMovingProduct(null)}
        />
      )}

      <EstoqueDataTable 
        products={products} 
        onEdit={(p) => { setEditingProduct(p); setShowForm(true); }}
        onDelete={handleDelete}
        onMove={(p) => setMovingProduct(p)}
        userRole={user?.cargo}
      />
    </div>
  );
};

export default Inventory;
