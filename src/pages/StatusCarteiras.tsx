import { useState, useMemo } from 'react';
import {
    Server,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Clock,
    Search,
    RefreshCw,
    Info
} from 'lucide-react';
import { useCarteirasStatus } from '../hooks/useCarteirasStatus';

export function StatusCarteiras() {
    const { carteiras, loading, error, refetch } = useCarteirasStatus();
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar carteiras baseado na busca
    const filteredCarteiras = useMemo(() => {
        if (!searchTerm.trim()) {
            return carteiras;
        }

        return carteiras.filter(carteira =>
            carteira.nome_carteira.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [carteiras, searchTerm]);

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
        switch (status.toLowerCase()) {
            case 'online':
                return <CheckCircle className="w-6 h-6 text-green-600" />;
            case 'indisponivel':
            case 'erro':
                return <XCircle className="w-6 h-6 text-gray-500" />;
            case 'API com lentidão':
            case 'atraso':
                return <Clock className="w-6 h-6 text-orange-500" />;
            case 'manutencao':
                return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
            default:
                return <Server className="w-6 h-6 text-gray-400" />;
        }
    };

    // Aqui a borda externa do card conforme status, destacando como pediu
    const getCardBorder = (status: string) => {
        switch (status.toLowerCase()) {
            case 'online':
                return 'border-2 border-green-500';
            case 'API com lentidão':
            case 'atraso':
                return 'border-2 border-orange-500';
            case 'indisponivel':
            case 'erro':
                return 'border-2 border-gray-400';
            default:
                return 'border border-gray-300 dark:border-gray-700';
        }
    };

    // Badge de status com cores mais suaves e consistentes
    const getStatusBadgeColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'funcionando':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'indisponivel':
            case 'erro':
                return 'bg-gray-200 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400';
            case 'API com lentidão':
            case 'atraso':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
            case 'manutencao':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

        return (

          <div className="space-y-6">            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                          
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-lg max-w-lg">
                          
                    </p>
                </div>
                <button
                    onClick={refetch}
                    disabled={loading}
                    className="flex items-center space-x-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Atualizar</span>
                </button>
            </div>

            {/* Search */}
            <div className="max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar carteira..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    />
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mr-4" />
                    <span className="text-xl text-gray-600 dark:text-gray-400 font-semibold">
                        Carregando status das carteiras...
                    </span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-5 flex items-center space-x-3 shadow">
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    <span className="text-red-800 dark:text-red-400 font-medium text-lg">{error}</span>
                </div>
            )}

            {/* Carteiras Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCarteiras.map((carteira) => (
                        <div
                            key={carteira.id}
                            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between ${getCardBorder(carteira.status)}`}
                        >
                            {/* Header */}
                            <div className="flex items-center space-x-4 mb-4">
                                {getStatusIcon(carteira.status)}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {carteira.nome_carteira}
                                    </h3>
                                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(carteira.status)}`}>
                                        {carteira.status}
                                    </span>
                                </div>
                            </div>

                            {/* Observação */}
                            {carteira.observacao && (
                                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg flex items-start space-x-3">
                                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                                            Observação
                                        </p>
                                        <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
                                            {carteira.observacao}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                Ultima verificação em: {formatDate(carteira.verificado_em)}
                            </div>
                        </div>
                    ))}

                    {filteredCarteiras.length === 0 && !loading && (
                        <div className="col-span-full text-center py-16">
                            <Server className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
                            <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                {carteiras.length === 0 ? 'Nenhuma carteira encontrada' : 'Nenhuma carteira corresponde à busca'}
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-lg">
                                {carteiras.length === 0 ? 'Os dados das carteiras serão carregados automaticamente' : 'Tente ajustar os termos de busca'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default StatusCarteiras;
