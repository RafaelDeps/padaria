import React from 'react';

const MetricCard = ({ title, value, color }) => {
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '1.5rem', 
      borderRadius: '8px', 
      backgroundColor: color || '#fff',
      flex: '1',
      margin: '0.5rem',
      textAlign: 'center'
    }}>
      <h4 style={{ margin: 0, color: '#555' }}>{title}</h4>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{value}</p>
    </div>
  );
};

export default MetricCard;
