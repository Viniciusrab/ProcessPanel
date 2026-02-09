import React from 'react';
import { X, Bell } from 'lucide-react';
import { useNotificationsContext } from '../contexts/NotificationsContext';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { notificacoesNaoLidas, marcarComoLida } = useNotificationsContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative w-80 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notificações</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {notificacoesNaoLidas.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>Nenhuma notificação não lida.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notificacoesNaoLidas.map((notificacao) => (
                <div
                  key={notificacao.id}
                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    marcarComoLida(notificacao.id);
                    onClose();
                  }}
                >
                  <p className="font-medium text-gray-900 dark:text-white">{notificacao.titulo}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notificacao.conteudo}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(notificacao.dataCriacao).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
