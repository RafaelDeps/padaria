import React from 'react';

const CategoryChart = ({ products }) => {
  const categories = products.reduce((acc, p) => {
    const cat = p.categoria.toLowerCase();
    acc[cat] = (acc[cat] || 0) + p.quantidade_atual;
    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(categories), 1);

  const getBarClass = (cat) => {
    if (cat.includes('pão') || cat.includes('pao')) return 'pao-bar';
    if (cat.includes('bolo')) return 'bolos-bar';
    if (cat.includes('salgado')) return 'salgados-bar';
    if (cat.includes('bebida')) return 'bebidas-bar';
    return '';
  };

  return (
    <div className="table-container" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginTop: 0, borderBottom: '2px solid var(--secondary-color)', paddingBottom: '0.5rem' }}>
        Distribuição por Categoria
      </h3>
      <div style={{ marginTop: '1.5rem' }}>
        {Object.entries(categories).map(([cat, count]) => (
          <div key={cat} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontWeight: '600' }}>
              <span style={{ textTransform: 'capitalize' }}>{cat}</span>
              <span style={{ color: 'var(--text-light)' }}>{count} un.</span>
            </div>
            <div className="category-bar">
              <div 
                className={getBarClass(cat)} 
                style={{ 
                  height: '100%', 
                  width: `${(count / maxCount) * 100}%`,
                  transition: 'width 1s ease-in-out'
                }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
