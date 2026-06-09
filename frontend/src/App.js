import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import History from './pages/History';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute allowedRoles={['gerente', 'funcionario']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/history" element={<History />} />
            </Route>

            {/* Redirecionamento da raiz para o Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
