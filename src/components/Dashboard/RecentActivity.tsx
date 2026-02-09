import React from 'react';
import { Clock, Upload, Ticket } from 'lucide-react';
import { StatusImportacao } from '../../types';
import { TicketData } from '../../services/supabaseTicketsService';

interface RecentActivityProps {
  importacoes: StatusImportacao[];
  tickets: TicketData[];
  selectedCarteira?: string | null;
}

type ActivityItem = {
  id: string;
  type: 'importacao' | 'movimentacao' | 'ticket';
  title: string;
  description: string;
  time: string;
  status: string;
  icon: React.ReactNode;
};

export function RecentActivity({ importacoes, tickets, selectedCarteira }: RecentActivityProps) {
  // Função para formatar nomes de carteiras adequadamente
  const formatarNomeCarteira = (nomeArquivo: string) => {
    const mapeamentoNomes: { [key: string]: string } = {
      'GAMMA': 'GAMMA',
      'OMEGA': 'OMEGA',
      'DELTA': 'DELTA',
      'BETA': 'BETA'
    };

    // Retorna o nome formatado se existir no mapeamento, senão retorna o nome original
    return mapeamentoNomes[nomeArquivo] || nomeArquivo;
  };

  const statusColors = {
    sucesso: 'text-green-600 bg-green-100',
    erro: 'text-red-600 bg-red-100',
    processando: 'text-blue-600 bg-blue-100',
    pendente: 'text-yellow-600 bg-yellow-100',
    inclusao: 'text-green-600 bg-green-100',
    alteracao: 'text-blue-600 bg-blue-100',
    exclusao: 'text-red-600 bg-red-100',
    aberto: 'text-red-600 bg-red-100',
    em_andamento: 'text-blue-600 bg-blue-100',
    aguardando_cliente: 'text-yellow-600 bg-yellow-100',
    resolvido: 'text-green-600 bg-green-100',
    fechado: 'text-gray-600 bg-gray-100'
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sucesso':
        return 'Concluído';
      case 'erro':
        return 'Erro';
      case 'processando':
        return 'Em curso';
      case 'pendente':
        return 'Não iniciado';
      default:
        return status;
    }
  };

  const activities: ActivityItem[] = [
    ...(selectedCarteira
      ? importacoes.filter(imp => imp.carteiraId === selectedCarteira)
      : importacoes
    ).map(imp => {
      const upperCaseCarteira = formatarNomeCarteira(imp.arquivo).toUpperCase();
      const upperCaseStatus = imp.status.toUpperCase();
      let description = '';

      if (upperCaseCarteira === 'ALFA' && upperCaseStatus === 'PROCESSANDO' && imp.observacao) {
        description = `Centralizadora em curso: ${imp.observacao.substring(0, 3)}`;
      } else if ((upperCaseCarteira === 'OMEGA' || upperCaseCarteira === 'OMEGA') && upperCaseStatus === 'SUCESSO' && imp.observacao) {
        description = `Arquivos recepcionados: ${imp.observacao?.split(': ')[1] || ''}`;
      } else if (imp.observacao) {
        description = imp.observacao;
      }

      return {
        id: imp.id,
        type: 'importacao' as const,
        title: `Importação da carteira ${formatarNomeCarteira(imp.arquivo)}`,
        description,
        time: imp.dataImportacao || new Date().toISOString(),
        status: imp.status,
        icon: <Upload className="w-4 h-4" />
      };
    }),
    ...tickets.map(ticket => ({
      id: ticket.id,
      type: 'ticket' as const,
      title: ticket.assunto,
      description: `Operador: ${ticket.operador}`,
      time: new Date(Date.now() - ticket.alterado_em_segundos * 1000).toISOString(),
      status: ticket.status,
      icon: <Ticket className="w-4 h-4" />
    }))
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 6);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Atividade Recente</h3>
        </div>
        {selectedCarteira && (
          <span className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
            Filtrado por carteira
          </span>
        )}
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                {activity.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {activity.description}
              </p>
            </div>
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium flex-shrink-0
              ${statusColors[activity.status as keyof typeof statusColors] || 'text-gray-600 bg-gray-100'}
            `}>
              {getStatusText(activity.status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}