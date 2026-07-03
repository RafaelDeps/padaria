import React from 'react';

const EstoqueDataTable = ({ products, onEdit, onDelete, onMove, onProduce, userRole }) => {
  const isGerente = userRole === 'gerente';

  const getRowClass = (p) => {
    const today = new Date();
    const expiry = new Date(p.data_validade);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return 'row-danger';
    if (p.quantidade_atual <= p.estoque_minimo) return 'row-warning';
    return '';
  };

  return (
    <div className="table-container">
      <table>
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
            <tr key={p.id} className={getRowClass(p)}>
              <td>{p.id}</td>
              <td>{p.nome}</td>
              <td>{p.categoria}</td>
              <td>{p.quantidade_atual}</td>
              <td>{p.estoque_minimo}</td>
              <td>R$ {p.preco_unitario}</td>
              <td>{p.data_validade}</td>
              <td style={{ display: 'flex', gap: '5px' }}>
                <button className="btn-outline" onClick={() => onMove(p)}>Movimentar</button>
                {p.is_manufactured && (
                  <button className="btn-secondary" onClick={() => onProduce(p)}>Produzir</button>
                )}
                {isGerente && (
                  <>
                    <button className="btn-secondary" onClick={() => onEdit(p)}>Editar</button>
                    <button className="btn-danger" onClick={() => onDelete(p.id)}>Excluir</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EstoqueDataTable;
