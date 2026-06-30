import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { PedidosPage } from './pages/PedidosPage';
import { EstoquePage } from './pages/EstoquePage';
import { AdminPage } from './pages/AdminPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

/**
 * Raiz da aplicação MedStorage.
 * Configura providers globais (tema + autenticação) e roteamento.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/"           element={<LandingPage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/pedidos"    element={<PedidosPage />} />
            <Route path="/estoque"    element={<EstoquePage />} />
            <Route path="/admin"      element={<AdminPage />} />
            <Route path="/dashboard"  element={<PlaceholderPage title="Dashboard" />} />
            <Route path="/clientes"   element={<PlaceholderPage title="Clientes" />} />
            <Route path="/comissoes"  element={<PlaceholderPage title="Comissões" />} />
            <Route path="/devolucoes" element={<PlaceholderPage title="Devoluções" />} />
            <Route path="*"           element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
