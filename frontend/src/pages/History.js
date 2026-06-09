import React, { useState, useEffect } from 'react';
import api from '../services/api';

const History = () => {
  const [movements, setMovements] = useState([]);

  const fetchMovements = async () => {
    try {
      const response = await api.get('/movimentacoes');
      setMovements(response.data);
    } catch (err) {
      console.error("Erro ao buscar histórico", err);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  return (
    <div className="history-container">
      <h2>Histórico de Movimentações</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Produto ID</th>
              <th>Usuário ID</th>
              <th>Tipo</th>
              <th>Qtd</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {movements.map(m => (
              <tr key={m.id}>
                <td>{new Date(m.data_hora).toLocaleString()}</td>
                <td>{m.produto_id}</td>
                <td>{m.usuario_id}</td>
                <td>
                  <span className={m.tipo === 'ENTRADA' ? 'text-success' : 'text-danger'}>
                    {m.tipo}
                  </span>
                </td>
                <td>{m.quantidade}</td>
                <td>{m.observacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
