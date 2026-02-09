import { useState } from 'react';
import { Plus, Trash2, Bell, AlertTriangle, Info, AlertCircle, Wrench, Send } from 'lucide-react';
import { useNotificationsContext } from '../contexts/NotificationsContext';

export function GerenciarNotificacoes() {
    const {
        notificacoes,
        loading,
        criarNotificacao,
        deletarNotificacao,
        isAdmin
    } = useNotificationsContext();

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        conteudo: '',
        prioridade: 'media' as 'baixa' | 'media' | 'alta' | 'critica',
        tipo: 'informacao' as 'informacao' | 'aviso' | 'alerta' | 'manutencao'
    });
    const [submitting, setSubmitting] = useState(false);

    // Verificar se usuário é admin
    if (!isAdmin) {
        return (
            <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Acesso Negado
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Você não tem permissão para acessar esta página.
                </p>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.titulo.trim() || !formData.conteudo.trim()) return;

        setSubmitting(true);
        try {
            await criarNotificacao(formData);
            setFormData({
                titulo: '',
                conteudo: '',
                prioridade: 'media',
                tipo: 'informacao'
            });
            setShowForm(false);
        } catch (error) {
            console.error('Erro ao criar notificação:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const getIconByType = (tipo: string) => {
        switch (tipo) {
            case 'informacao':
                return <Info className="w-5 h-5 text-blue-500" />;
            case 'aviso':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'alerta':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'manutencao':
                return <Wrench className="w-5 h-5 text-purple-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const getPriorityColor = (prioridade: string) => {
        switch (prioridade) {
            case 'critica':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'alta':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
            case 'media':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'baixa':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };

      return (
        <div className="space-y-6">            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Gerenciar Notificações
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Crie e gerencie notificações para todos os usuários
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nova Notificação</span>
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowForm(false)} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Criar Nova Notificação
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    placeholder="Digite o título da notificação"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Conteúdo
                                </label>
                                <textarea
                                    value={formData.conteudo}
                                    onChange={(e) => setFormData(prev => ({ ...prev, conteudo: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    rows={4}
                                    placeholder="Digite o conteúdo da notificação"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Prioridade
                                    </label>
                                    <select
                                        value={formData.prioridade}
                                        onChange={(e) => setFormData(prev => ({ ...prev, prioridade: e.target.value as any }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="baixa">Baixa</option>
                                        <option value="media">Média</option>
                                        <option value="alta">Alta</option>
                                        <option value="critica">Crítica</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Tipo
                                    </label>
                                    <select
                                        value={formData.tipo}
                                        onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as any }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="informacao">Informação</option>
                                        <option value="aviso">Aviso</option>
                                        <option value="alerta">Alerta</option>
                                        <option value="manutencao">Manutenção</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    {submitting ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    <span>{submitting ? 'Criando...' : 'Criar Notificação'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notifications List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        Carregando notificações...
                    </div>
                ) : notificacoes.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Nenhuma notificação criada ainda.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {notificacoes.map((notificacao) => (
                            <div key={notificacao.id} className="p-6">
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className="flex-shrink-0">
                                            {getIconByType(notificacao.tipo)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {notificacao.titulo}
                                                </h3>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notificacao.prioridade)}`}>
                                                    {notificacao.prioridade}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                                {notificacao.conteudo}
                                            </p>
                                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500">
                                                <span>Criado em: {formatDate(notificacao.dataCriacao)}</span>
                                                <span>Por: {notificacao.criadoPor}</span>
                                                <span>Lida por: {notificacao.usuariosQueLerem.length} usuários</span>
                                            </div>
                                        </div>
                                    </div>
                                                                         <div className="flex items-center space-x-2">
                                                                            <button
                                                                                onClick={async () => {
                                                                                try {
                                                                                    await deletarNotificacao(notificacao.id);
                                                                                    alert('Notificação deletada com sucesso!');
                                                                                } catch (error: any) {
                                                                                    alert(`Erro ao deletar notificação: ${error.message}`);
                                                                                }
                                                                            }}
                                                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                                title="Deletar notificação"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </div>                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GerenciarNotificacoes;
