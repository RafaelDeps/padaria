import React from 'react';

const CategoryChart = ({ products }) => {
  const categories = products.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + p.quantidade_atual;
    return acc;
  }, {});

  const total = Object.values(categories).reduce((a, b) => a + b, 0);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>Distribuição por Categoria</h3>
      {Object.entries(categories).map(([cat, count]) => (
        <div key={cat} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{cat}</span>
            <span>{count} un.</span>
          </div>
          <div style={{ height: '10px', backgroundColor: '#eee', borderRadius: '5px' }}>
            <div style={{ 
              height: '100%', 
              backgroundColor: '#4caf50', 
              borderRadius: '5px',
              width: `${(count / total) * 100}%` 
            }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryChart;
