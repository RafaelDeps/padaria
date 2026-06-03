import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MetricCard from '../components/MetricCard';
import CategoryChart from '../components/CategoryChart';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/dashboard/stats');
        setStats(statsRes.data);
        const productsRes = await api.get('/produtos');
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Erro ao carregar dashboard", err);
      }
    };
    fetchData();
  }, []);

  if (!stats) return <div>Carregando Dashboard...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard Gerencial</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <MetricCard title="Valor em Risco (Validade)" value={`R$ ${stats.total_valor_risco.toFixed(2)}`} color="#ffebee" />
        <MetricCard title="Custo Desperdício" value={`R$ ${stats.custo_desperdicio.toFixed(2)}`} color="#f3e5f5" />
        <MetricCard title="Produto Mais Vendido" value={stats.produto_mais_vendido} color="#e8f5e9" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, marginRight: '1rem' }}>
          <CategoryChart products={products} />
        </div>
        <div style={{ flex: 1, marginLeft: '1rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h3>Alertas Críticos</h3>
          <p>⚠️ {stats.alertas_vencimento} produtos próximos ao vencimento</p>
          <p>📉 {stats.alertas_estoque_baixo} produtos com estoque baixo</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
