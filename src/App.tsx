import { NotificationsProvider } from './contexts/NotificationsContext';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDashboardData } from './hooks/useDashboardData';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { LoginPage } from './pages/Login';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { EmailVerificationGuard } from './components/Auth/EmailVerificationGuard';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const StatusImportacao = lazy(() => import('./pages/StatusImportacao').then(module => ({ default: module.StatusImportacao })));
const StatusCarteiras = lazy(() => import('./pages/StatusCarteiras').then(module => ({ default: module.StatusCarteiras })));
const MovimentacaoBase = lazy(() => import('./pages/MovimentacaoBase'));
const ConsultaTicketsVirtua = lazy(() => import('./pages/ConsultaTicketsVirtua').then(module => ({ default: module.ConsultaTicketsVirtua })));
const Backups = lazy(() => import('./pages/Backups'));
const GerenciarNotificacoes = lazy(() => import('./pages/GerenciarNotificacoes').then(module => ({ default: module.GerenciarNotificacoes })));

function AppContent() {
  const { logout } = useAuth();
  const [currentPage, setCurrentPage] = useLocalStorage('dashboard-page', 'home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

      const {
    carteiras,
    importacoes,
    metrics,
    selectedCarteira,
    setSelectedCarteira
  } = useDashboardData();  const pageConfig = {
    home: {
      title: 'Dashboard',
      subtitle: 'Visão geral das operações do departamento de processamento'
    },
    importacao: {
      title: 'Status de Importação',
      subtitle: 'Acompanhe o status de todas as importações de dados'
    },
    statuscarteiras: {
      title: 'Status das APIs',
      subtitle: 'Monitoramento do status das APIs REST das carteiras'
    },
    movimentacao: {
      title: 'Movimentação da Base',
      subtitle: 'Histórico de alterações e movimentações na base de dados'
    },
    tickets: {
      title: 'Consulta de Tickets Virtua',
      subtitle: 'Acompanhe o status de solicitações e tickets da plataforma Virtua'
    },
    backups: {
      title: 'Sistema de Backups',
      subtitle: 'Acompanhe o status e histórico de backups das carteiras'
    },
    notificacoes: {
      title: 'Gerenciar Notificações',
      subtitle: 'Criar e gerenciar notificações do sistema'
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            metrics={metrics}
            carteiras={carteiras}
            importacoes={importacoes}
            selectedCarteira={selectedCarteira}
            onCarteiraSelect={setSelectedCarteira}
            onPageChange={setCurrentPage}
          />
        );
      case 'importacao':
        return (
          <StatusImportacao />
        );
      case 'statuscarteiras':
        return (
          <StatusCarteiras />
        );
      case 'movimentacao':
        return (
          <MovimentacaoBase />
        );
      case 'tickets':
        return (
          <ConsultaTicketsVirtua />
        );
      case 'backups':
        return (
          <Backups />
        );
      case 'notificacoes':
        return (
          <GerenciarNotificacoes />
        );
      default:
        return <div>Página não encontrada</div>;
    }
  };

  const config = pageConfig[currentPage as keyof typeof pageConfig] || pageConfig.home;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col">
        <Header
          title={config.title}
          subtitle={config.subtitle}
          onLogout={logout}
        />
        <main className="mt-4 p-4 lg:p-6 flex-1 overflow-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
              </div>
            </div>
          }>
            {renderPage()}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <EmailVerificationGuard requireVerification={true}>
                  <NotificationsProvider>
                    <AppContent />
                  </NotificationsProvider>
                </EmailVerificationGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <EmailVerificationGuard requireVerification={true}>
                  <NotificationsProvider>
                    <AppContent />
                  </NotificationsProvider>
                </EmailVerificationGuard>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;