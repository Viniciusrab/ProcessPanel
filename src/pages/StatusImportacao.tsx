import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Clock, AlertCircle, Search, Filter, RefreshCw } from 'lucide-react';
import { useImportacaoStatus } from '../hooks/useImportacaoStatus';
import { useIsMobile } from '../hooks/useIsMobile';

export interface StatusImportacaoProps { }

export function StatusImportacao() {
  const { importacaoStatus, loading, error, refetch } = useImportacaoStatus();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const isMobile = useIsMobile();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONCLUÍDA':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'ERRO':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'EM CURSO':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'NÃO INICIADA':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONCLUÍDA':
        return 'bg-green-100 text-green-800';
      case 'ERRO':
        return 'bg-red-100 text-red-800';
      case 'EM CURSO':
        return 'bg-blue-100 text-blue-800';
      case 'NÃO INICIADA':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredImportacoes = importacaoStatus.filter((importacao) => {
    const matchesSearch = importacao.nome_carteira.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || importacao.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: importacaoStatus.length,
    'CONCLUÍDA': importacaoStatus.filter(i => i.status === 'CONCLUÍDA').length,
    'ERRO': importacaoStatus.filter(i => i.status === 'ERRO').length,
    'EM CURSO': importacaoStatus.filter(i => i.status === 'EM CURSO').length,
    'NÃO INICIADA': importacaoStatus.filter(i => i.status === 'NÃO INICIADA').length
  };

  const statusLabels = {
    all: 'Total',
    'CONCLUÍDA': 'Concluída',
    'ERRO': 'Erro',
    'EM CURSO': 'Em curso',
    'NÃO INICIADA': 'Não iniciada'
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      {isMobile ? (
        // Mobile view: "Total" button, then 2x2 grid for other statuses
        <div className="space-y-4">
          {/* Total button */}
          <div
            className={`p-4 rounded-lg border cursor-pointer transition-all ${statusFilter === 'all'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            onClick={() => setStatusFilter('all')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {statusLabels['all']}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{statusCounts['all']}</p>
              </div>
              <div className="text-gray-400 dark:text-gray-500">
                {getStatusIcon('all')}
              </div>
            </div>
          </div>

          {/* 2x2 grid for other statuses */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(statusCounts)
              .filter(([status]) => status !== 'all')
              .map(([status, count]) => (
                <div
                  key={status}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${statusFilter === status
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  onClick={() => setStatusFilter(status)}
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-gray-400 dark:text-gray-500 mb-2">
                      {getStatusIcon(status)}
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {statusLabels[status as keyof typeof statusLabels]}
                    </p>
                    <p className="text-xl font-bold text-gray-800 dark:text-white">{count}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        // Desktop/Tablet view: existing responsive grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${statusFilter === status
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              onClick={() => setStatusFilter(status)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {statusLabels[status as keyof typeof statusLabels]}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{count}</p>
                </div>
                <div className="text-gray-400 dark:text-gray-500">
                  {getStatusIcon(status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por carteira..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="all">Todos os Status</option>
            <option value="CONCLUÍDA">Concluída</option>
            <option value="ERRO">Erro</option>
            <option value="EM CURSO">Em curso</option>
            <option value="NÃO INICIADA">Não iniciada</option>
          </select>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Atualizando...' : 'Atualizar Status'}</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            Carregando status das importações...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="text-lg font-medium">{error}</p>
        </div>
      )}

      {/* Importações List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredImportacoes.map((importacao) => (
            <div
              key={importacao.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(importacao.status)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      {importacao.nome_carteira}
                    </h3>
                    {(() => {
                      const upperCaseCarteira = importacao.nome_carteira.toUpperCase();
                      const upperCaseStatus = importacao.status.toUpperCase();

                      if (upperCaseCarteira === 'ALFA' && upperCaseStatus === 'EM CURSO' && importacao.obs) {
                        return (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            Centralizadora em curso: {importacao.obs.substring(0, 3)}
                          </p>
                        );
                      }

                      if ((upperCaseCarteira === 'OMEGA' || upperCaseCarteira === 'OMEGA') && upperCaseStatus === 'CONCLUÍDA' && importacao.obs) {
                        return (
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            Arquivos recepcionados: {importacao.obs?.split(': ')[1] || ''}
                          </p>
                        );
                      }

                      return (
                        <>
                          {importacao.obs && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {importacao.obs}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Última verificação: {formatDate(importacao.ultima_verificacao)}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(importacao.status)}`}>
                  {importacao.status}
                </span>
              </div>
            </div>
          ))}

          {filteredImportacoes.length === 0 && (
            <div className="text-center py-12">
              <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                Nenhuma importação encontrada
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                Tente ajustar os filtros ou termos de busca
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Não precisa do export default aqui, já está exportando a função nomeada