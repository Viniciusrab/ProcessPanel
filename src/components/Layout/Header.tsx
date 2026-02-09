import { useState } from 'react';
import { Bell, User, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthContext';
import { useNotificationsContext } from '../../contexts/NotificationsContext';
import { NotificationsPanel } from '../NotificationsPanel';
import { ConfirmModal } from '../ConfirmModal';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onLogout?: () => void;
}

export function Header({ title, subtitle, onLogout }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { notificacoesNaoLidas } = useNotificationsContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 pl-16 pr-6 py-3 lg:px-6 transition-colors duration-200">
        <div className="flex items-center justify-between max-w-full">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-xs lg:text-sm">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 group"
              title={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-yellow-500 transition-colors" />
              )}
            </button>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 group"
              title="Notificações"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              {notificacoesNaoLidas.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {notificacoesNaoLidas.length > 9 ? '9+' : notificacoesNaoLidas.length}
                </span>
              )}
            </button>

            {onLogout && (
              <button
                onClick={() => setLogoutModalOpen(true)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors group"
                title="Sair do sistema"
              >
                <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
              </button>
            )}

            <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-gray-300 dark:border-gray-600">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Olá, {user?.displayName ? user.displayName.split(' ')[0] : 'Usuário'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      </div>

      {onLogout && (
        <ConfirmModal
          isOpen={isLogoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={onLogout}
          title="Confirmar Saída"
          confirmText="Sair"
        >
          <p>Você tem certeza que deseja sair do sistema?</p>
        </ConfirmModal>
      )}
    </>
  );
}
