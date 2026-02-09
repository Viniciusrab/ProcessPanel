import React, { useState, useMemo } from 'react';
import {
    Ticket,
    Clock,
    Search,
    Loader2,
    User,
    MessageSquare
} from 'lucide-react';
import { useTicketsData } from '../hooks/useTicketsData';

export function ConsultaTicketsVirtua() {
    const { tickets, loading } = useTicketsData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Filtrar tickets baseado na busca e status - otimizado
    const filteredTickets = useMemo(() => {
        if (!searchTerm.trim() && statusFilter === 'all') {
            return tickets;
        }

        return tickets.filter(ticket => {
            const matchesSearch = !searchTerm.trim() ||
                ticket.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.operador.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [tickets, searchTerm, statusFilter]);

    // Obter status únicos para o filtro - otimizado
    const uniqueStatuses = useMemo(() => {
        const statusSet = new Set(tickets.map(ticket => ticket.status));
        return Array.from(statusSet).sort();
    }, [tickets]);

    // Contar tickets por status - otimizado
    const statusCounts = useMemo(() => {
        const counts: { [key: string]: number } = { all: tickets.length };
        const statusMap = new Map<string, number>();

        // Contar cada status
        tickets.forEach(ticket => {
            const count = statusMap.get(ticket.status) || 0;
            statusMap.set(ticket.status, count + 1);
        });

        // Preencher counts
        statusMap.forEach((count, status) => {
            counts[status] = count;
        });

        return counts;
    }, [tickets]);

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {

            case 'esperando sua resposta':
                return <MessageSquare className="w-5 h-5 text-red-600" />;
            case 'aguardando desenvolvimento':
            case 'aguardando analise':
            case 'aguarde resposta':
                return <Clock className="w-5 h-5 text-blue-600" />;
            default:
                return <Ticket className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'esperando sua resposta':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'aguardando desenvolvimento':
            case 'aguardando analise':
            case 'aguarde resposta':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

      return (
        <div className="space-y-6">            {/* Status Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                <div
                    onClick={() => setStatusFilter('all')}
                    className={`p-2 md:p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${statusFilter === 'all'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                >
                    <div className="text-center">
                        <p className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">{statusCounts.all}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                    </div>
                </div>
                {uniqueStatuses.map(status => (
                    <div
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`p-2 md:p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${statusFilter === status
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                    >
                        <div className="text-center">
                            <p className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">{statusCounts[status]}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-full">{status}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar por assunto ou operador..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white w-full sm:w-auto"
                        >
                            <option value="all">Todos os Status</option>
                            {uniqueStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
                    <span className="text-lg text-gray-600 dark:text-gray-400">Carregando tickets...</span>
                </div>
            )}

            {/* Tickets List */}
            {!loading && (
                <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                        <div key={ticket.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className="flex-shrink-0">
                                        {getStatusIcon(ticket.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 break-words">
                                            {ticket.assunto}
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            <div className="flex items-center space-x-2 min-w-0">
                                                <User className="w-4 h-4" />
                                                <span className="truncate"><span className="font-medium">Operador:</span> {ticket.operador}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 min-w-0">
                                                <Clock className="w-4 h-4" />
                                                <span className="truncate"><span className="font-medium">Alterado há:</span> {ticket.alterado_ha}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start sm:items-end space-y-2 ml-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredTickets.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <Ticket className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                                {tickets.length === 0 ? 'Nenhum ticket encontrado' : 'Nenhum ticket corresponde aos filtros'}
                            </p>
                            <p className="text-gray-500 dark:text-gray-500">
                                {tickets.length === 0 ? 'Os dados dos tickets serão carregados automaticamente' : 'Tente ajustar os filtros ou termos de busca'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ConsultaTicketsVirtua; 