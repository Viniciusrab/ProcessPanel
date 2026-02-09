import {
  Home,
  Upload,
  RefreshCw,
  Ticket,
  Database,
  Menu,
  X,
  Briefcase,
  Bell,
  Server
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'importacao', label: 'Status Importação', icon: Upload },
  { id: 'movimentacao', label: 'Movimentação Base', icon: RefreshCw },
  { id: 'tickets', label: 'Consulta Tickets Virtua', icon: Ticket },
  { id: 'backups', label: 'Backups', icon: Database },
  { id: 'statuscarteiras', label: 'Status APIs', icon: Server },
];

export function Sidebar({ currentPage, onPageChange, isOpen, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const isAdmin = user?.email === 'admin@admin';
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar (fixed overlay; visible on large screens) */}
      <div className={`
        fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">ProcessPanel</h1>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={`
                  w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors duration-200
                  ${isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}

          {isAdmin && (
            <button
              onClick={() => {
                onPageChange('notificacoes');
                if (window.innerWidth < 1024) onToggle();
              }}
              className={`
                w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors duration-200
                ${currentPage === 'notificacoes'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                }
              `}
            >
              <Bell className={`w-5 h-5 ${currentPage === 'notificacoes' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
              <span className="font-medium">Gerenciar Notificações</span>
            </button>
          )}
        </nav>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-2 border-blue-400 dark:border-light-blue-700"
      >
        <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>
    </>
  );
}