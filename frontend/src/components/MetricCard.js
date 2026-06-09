import React from 'react';

const MetricCard = ({ title, value, icon }) => {
  return (
    <div className="metric-card">
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h4 style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h4>
      <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--accent-color)' }}>{value}</p>
    </div>
  );
};

export default MetricCard;
