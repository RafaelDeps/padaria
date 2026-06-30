import React, { useState, useEffect } from 'react';
import api from '../services/api';

const History = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState({});
  const [users, setUsers] = useState({});

  const fetchMovements = async () => {
    try {
      const response = await api.get('/movimentacoes');
      setMovements(response.data);
    } catch (err) {
      console.error("Erro ao buscar histórico", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/produtos');
      const productMap = {};
      response.data.forEach(p => { productMap[p.id] = p.nome; });
      setProducts(productMap);
    } catch (err) {
      console.error("Erro ao buscar produtos", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/usuarios');
      const userMap = {};
      response.data.forEach(u => { userMap[u.id] = u.nome; });
      setUsers(userMap);
    } catch (err) {
      console.error("Erro ao buscar usuários", err);
    }
  };

  useEffect(() => {
    fetchMovements();
    fetchProducts();
    fetchUsers();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '-' : date.toLocaleString();
  };

  return (
    <div className="history-container">
      <h2>Histórico de Movimentações</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Produto</th>
              <th>Usuário</th>
              <th>Tipo</th>
              <th>Qtd</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {movements.map(m => (
              <tr key={m.id}>
                <td>{formatDate(m.data_hora)}</td>
                <td>{products[m.produto_id] || `ID ${m.produto_id}`}</td>
                <td>{users[m.usuario_id] || `ID ${m.usuario_id}`}</td>
                <td>
                  <span className={m.tipo === 'ENTRADA' ? 'text-success' : 'text-danger'}>
                    {m.tipo}
                  </span>
                </td>
                <td>{m.quantidade}</td>
                <td>{m.observacao || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
