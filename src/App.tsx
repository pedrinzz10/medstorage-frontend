import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PedidosPage } from './pages/PedidosPage';
import { EstoquePage } from './pages/EstoquePage';
import { AbcCurvePage } from './pages/AbcCurvePage';
import { ProdutosPage } from './pages/ProdutosPage';
import { ClientesPage } from './pages/ClientesPage';
import { ConsignacaoPage } from './pages/ConsignacaoPage';
import { CalendarioPage } from './pages/CalendarioPage';
import { HistoricoContagensPage } from './pages/HistoricoContagensPage';
import { ComissoesPage } from './pages/ComissoesPage';
import { DevolucoesPage } from './pages/DevolucoesPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/"           element={<LandingPage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/dashboard"  element={<DashboardPage />} />
            <Route path="/pedidos"    element={<PedidosPage />} />
            <Route path="/estoque"    element={<EstoquePage />} />
            <Route path="/curva-abc"  element={<AbcCurvePage />} />
            <Route path="/produtos"   element={<ProdutosPage />} />
            <Route path="/clientes"   element={<ClientesPage />} />
            <Route path="/consignacao" element={<ConsignacaoPage />} />
            <Route path="/calendario"  element={<CalendarioPage />} />
            <Route path="/contagens"   element={<HistoricoContagensPage />} />
            <Route path="/comissoes"  element={<ComissoesPage />} />
            <Route path="/devolucoes" element={<DevolucoesPage />} />
            <Route path="/admin"      element={<AdminPage />} />
            <Route path="*"           element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
