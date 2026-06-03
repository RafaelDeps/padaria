import React from 'react';

const EstoqueDataTable = ({ products, onEdit, onDelete, onMove, userRole }) => {
  const isGerente = userRole === 'GERENTE';

  const getStatusStyle = (p) => {
    const today = new Date();
    const expiry = new Date(p.data_validade);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return { backgroundColor: '#ffcccc' }; // Expiry alert
    if (p.quantidade_atual <= p.estoque_minimo) return { backgroundColor: '#fff3cd' }; // Low stock alert
    return {};
  };

  return (
    <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Categoria</th>
          <th>Qtd Atual</th>
          <th>Mínimo</th>
          <th>Preço</th>
          <th>Validade</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.id} style={getStatusStyle(p)}>
            <td>{p.id}</td>
            <td>{p.nome}</td>
            <td>{p.categoria}</td>
            <td>{p.quantidade_atual}</td>
            <td>{p.estoque_minimo}</td>
            <td>R$ {p.preco_unitario}</td>
            <td>{p.data_validade}</td>
            <td>
              <button onClick={() => onMove(p)}>Movimentar</button>
              {isGerente && (
                <>
                  <button onClick={() => onEdit(p)} style={{ marginLeft: '5px' }}>Editar</button>
                  <button onClick={() => onDelete(p.id)} style={{ marginLeft: '5px' }}>Excluir</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EstoqueDataTable;
