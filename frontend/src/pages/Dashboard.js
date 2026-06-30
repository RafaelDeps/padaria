import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/MetricCard';
import CategoryChart from '../components/CategoryChart';

const Dashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    // Se não for gerente, não tenta carregar as métricas financeiras/dashboard
    if (user?.cargo !== 'gerente') return;

    const fetchData = async () => {
      try {
        const statsRes = await api.get('/dashboard/stats');
        setMetrics(statsRes.data);
        const productsRes = await api.get('/produtos');
        setAlertas(productsRes.data);
      } catch (err) {
        console.error("Erro ao carregar dashboard", err);
      }
    };
    fetchData();
  }, [user]);

  if (user?.cargo === 'funcionario') {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--dark-brown)' }}>
        <h2>Bem-vindo, {user?.nome || 'Usuário'}!</h2>
        <p>Acesse a aba <strong>Estoque</strong> no menu superior para consultar produtos e registrar saídas/vendas.</p>
      </div>
    );
  }

  // Proteção extrema contra undefined para o gerente
  if (!metrics || !alertas) {
    return <div style={{padding: '2rem'}}>Carregando Dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2 style={{ color: 'var(--accent-color)', marginBottom: '2rem' }}>Dashboard Gerencial</h2>
      
      <div className="metrics-grid">
        <MetricCard 
          title="Valor em Risco (Validade)" 
          value={`R$ ${metrics?.total_valor_risco?.toFixed(2) || '0.00'}`} 
          icon="📅"
        />
        <MetricCard 
          title="Custo Desperdício" 
          value={`R$ ${metrics?.custo_desperdicio?.toFixed(2) || '0.00'}`} 
          icon="🗑️"
        />
        <MetricCard 
          title="Produto Mais Vendido" 
          value={metrics?.produto_mais_vendido || 'N/A'} 
          icon="⭐"
        />
      </div>

      <div className="chart-alerts-container">
        <div className="chart-panel">
          {/* Garantindo que alertas seja tratado como array */}
          <CategoryChart products={alertas || []} />
        </div>
        <div className="alerts-panel">
          <h3 style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: '0.5rem' }}>Alertas Críticos</h3>
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem', borderRadius: '4px', backgroundColor: '#fff5f5' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>⚠️</span>
              <div>
                <strong style={{ color: 'var(--danger-color)' }}>{metrics?.alertas_vencimento || 0} produtos</strong>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>Próximos ao vencimento (7 dias)</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem', borderRadius: '4px', backgroundColor: '#fff9e6' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>📉</span>
              <div>
                <strong style={{ color: '#d4a017' }}>{metrics?.alertas_estoque_baixo || 0} produtos</strong>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>Com estoque abaixo do mínimo</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem', borderRadius: '4px', backgroundColor: '#f0f4f8' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>📦</span>
              <div>
                <strong style={{ color: 'var(--primary-color)' }}>{metrics?.alertas_inatividade || 0} produtos</strong>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>Sem movimentação há 15 dias</p>
              </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <a href="/inventory" style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem' }}>
                Ver todos os alertas detalhados →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
