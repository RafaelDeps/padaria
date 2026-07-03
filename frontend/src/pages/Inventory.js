import React, { useState, useEffect } from 'react';
import api, { produceProduct, addRecipeIngredient, syncRecipe } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
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
    const { recipeList, ...productData } = formData;
    try {
      let productId;
      if (editingProduct) {
        await api.put(`/produtos/${editingProduct.id}`, productData);
        productId = editingProduct.id;
      } else {
        const res = await api.post('/produtos', productData);
        productId = res.data.id;
      }

      // Sync recipe if product is manufactured
      if (productId && recipeList && recipeList.length > 0) {
        await syncRecipe(productId, recipeList);
      }

      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
      toast.success(editingProduct ? "Produto atualizado!" : "Produto criado com sucesso!");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Erro ao salvar produto";
      toast.error(Array.isArray(errorMsg) ? errorMsg.map((e) => e.msg).join(', ') : errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir este produto?")) {
      try {
        await api.delete(`/produtos/${id}`);
        fetchProducts();
        toast.success("Produto excluído!");
      } catch (err) {
        toast.error("Erro ao excluir produto");
      }
    }
  };

  const handleMovement = async (movementData) => {
    try {
      await api.post('/movimentacoes', movementData);
      setMovingProduct(null);
      fetchProducts();
      toast.success("Movimentação registrada!");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Erro ao registrar movimentação";
      toast.error(errorMsg);
    }
  };

  const handleProduce = async (product) => {
    const qtyStr = window.prompt(`Quantidade de "${product.nome}" a produzir:`);
    if (!qtyStr) return;
    const qty = parseFloat(qtyStr);
    if (isNaN(qty) || qty <= 0) {
      alert("Quantidade inválida");
      return;
    }
    try {
      await produceProduct(product.id, qty);
      toast.success(`Produzido ${qty} unidades de ${product.nome}`);
      fetchProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Erro ao produzir";
      alert(errorMsg);
    }
  };

  return (
    <div className="inventory-container">
      <div className="page-header">
        <h2>Gestão de Estoque</h2>
        {user?.cargo === 'gerente' && (
          <button className="btn-primary" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
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
        onProduce={handleProduce}
        userRole={user?.cargo}
      />
    </div>
  );
};

export default Inventory;
