import { Upload, RefreshCw, Ticket, CheckCircle, Database, Server } from 'lucide-react';
import { MetricCard } from '../components/Dashboard/MetricCard';
import { CarteiraSelector } from '../components/Dashboard/CarteiraSelector';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { DashboardMetrics, Carteira, StatusImportacao } from '../types';
import { useTicketsData } from '../hooks/useTicketsData';

interface HomeProps {
  metrics: DashboardMetrics;
  carteiras: Carteira[];
  importacoes: StatusImportacao[];
  // movimentacoes: MovimentacaoBase[];
  // tickets: TicketVirtua[];
  selectedCarteira: string | null;
  onCarteiraSelect: (carteiraId: string | null) => void;
  onPageChange: (page: string) => void;
}

export function Home({
  metrics,
  carteiras,
  importacoes,
  // movimentacoes,
  // tickets,
  selectedCarteira,
  onCarteiraSelect,
  onPageChange
}: HomeProps) {
  const { tickets } = useTicketsData();
  const sucessRate = metrics.totalImportacoes > 0
    ? ((metrics.importacoesSucesso / metrics.totalImportacoes) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Taxa de Sucesso"
          value={`${sucessRate}%`}
          change={metrics.importacoesErro > 0 ? `${metrics.importacoesErro} carteiras com erro` : 'Sem erros'}
          changeType={metrics.importacoesErro > 0 ? 'negative' : 'positive'}
          icon={CheckCircle}
          color="#059669"
          onClick={() => onPageChange('importacao')}
        />

        <MetricCard
          title="Movimentações"
          value="Em desenvolvimento"
          change="Disponível em breve"
          changeType="neutral"
          icon={RefreshCw}
          color="#EA580C"
          onClick={() => onPageChange('movimentacao')}
        />

        <MetricCard
          title="Tickets Virtua"
          value={tickets.length}
          change={tickets.length > 30 ? 'Atenção necessária' : 'Dentro do normal'}
          changeType={tickets.length > 30 ? 'negative' : 'positive'}
          icon={Ticket}
          color="#7C3AED"
          onClick={() => onPageChange('tickets')}
        />

        <MetricCard
          title="Sistema de Backups"
          value="Em desenvolvimento"
          change="Disponível em breve"
          changeType="neutral"
          icon={Database}
          color="#10B981"
          onClick={() => onPageChange('backups')}
        />

        <MetricCard
          title="Status das APIs"
          value="Monitoramento"
          change="Acompanhe o status das API REST das carteiras"
          changeType="neutral"
          icon={Server}
          color="#06B6D4"
          onClick={() => onPageChange('statuscarteiras')}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CarteiraSelector
            carteiras={carteiras}
            selectedCarteira={selectedCarteira}
            onSelect={onCarteiraSelect}
          />
        </div>

        <div className="lg:col-span-2">
          <RecentActivity
            importacoes={importacoes}
            tickets={tickets}
            selectedCarteira={selectedCarteira}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => onPageChange('importacao')}
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
          >
            <Upload className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800 dark:text-white">Importações</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Acompanhar importação de dados</p>
            </div>
          </button>

          <button
            onClick={() => onPageChange('movimentacao')}
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-200"
          >
            <RefreshCw className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800 dark:text-white">Ver Movimentações</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Histórico de alterações</p>
            </div>
          </button>

          <button
            onClick={() => onPageChange('tickets')}
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-200"
          >
            <Ticket className="w-6 h-6 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800 dark:text-white">Consultar Tickets</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Acompanhar solicitações no Virtua</p>
            </div>
          </button>

          <button
            onClick={() => onPageChange('backups')}
            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-all duration-200"
          >
            <Database className="w-6 h-6 text-teal-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800 dark:text-white">Backups</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerenciar sistema de backups</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;