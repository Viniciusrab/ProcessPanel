import { Carteira, Notificacao } from '../types';

// Matching SupabaseCarteirasService.ts: CarteiraStatusData
export const mockCarteiraStatus = [
    { id: '1', nome_carteira: 'Carteira Alfa', status: 'Operacional', observacao: 'Nenhuma intercorrência', verificado_em: new Date().toISOString() },
    { id: '2', nome_carteira: 'Carteira Beta', status: 'Operacional', observacao: null, verificado_em: new Date().toISOString() },
    { id: '3', nome_carteira: 'Carteira Gamma', status: 'Manutenção', observacao: 'Aguardando resposta do webservice', verificado_em: new Date().toISOString() },
    { id: '4', nome_carteira: 'Carteira Delta', status: 'Operacional', observacao: 'Estável', verificado_em: new Date().toISOString() },
];

// Matching SupabaseImportacaoService.ts: ImportacaoStatusData
export const mockImportacaoStatus = [
    { id: 1, carteira_id: '1', nome_carteira: 'Carteira Alfa', status: 'CONCLUÍDA', obs: 'Importação realizada com sucesso', ultima_verificacao: new Date().toISOString() },
    { id: 2, carteira_id: '2', nome_carteira: 'Carteira Beta', status: 'EM CURSO', obs: '850/1200 linhas processadas', ultima_verificacao: new Date().toISOString() },
    { id: 3, carteira_id: '3', nome_carteira: 'Carteira Gamma', status: 'NÃO INICIADA', obs: null, ultima_verificacao: new Date().toISOString() },
    { id: 4, carteira_id: '4', nome_carteira: 'Carteira Delta', status: 'ERRO', obs: 'Erro no layout do arquivo', ultima_verificacao: new Date().toISOString() },
];

// Matching SupabaseTicketsService.ts: TicketData
export const mockTicketsData = [
    { id: 'tick-1', assunto: 'Erro no processamento da fila Alfa', operador: 'Suporte Técnico', status: 'Aguardando Desenvolvimento', alterado_ha: '2 horas', alterado_em_segundos: 7200 },
    { id: 'tick-2', assunto: 'Dúvida sobre layout de exportação Beta', operador: 'Usuário Analista', status: 'Esperando sua resposta', alterado_ha: '5 horas', alterado_em_segundos: 18000 },
    { id: 'tick-3', assunto: 'Solicitação de novo acesso Delta', operador: 'Gerente Operacional', status: 'Aguardando Analise', alterado_ha: '1 dia', alterado_em_segundos: 86400 },
];

// Generic types for other components
export const mockCarteiras: Carteira[] = [
    { id: '1', nome: 'Carteira Alfa', cor: '#3b82f6', totalRegistros: 1500, status: 'ativa' },
    { id: '2', nome: 'Carteira Beta', cor: '#10b981', totalRegistros: 2300, status: 'ativa' },
    { id: '3', nome: 'Carteira Gamma', cor: '#f59e0b', totalRegistros: 850, status: 'manutencao' },
    { id: '4', nome: 'Carteira Delta', cor: '#ef4444', totalRegistros: 4200, status: 'ativa' },
];

export const mockNotificacoes: Notificacao[] = [
    {
        id: 'not-1',
        titulo: 'Manutenção Programada',
        conteudo: 'O sistema passará por uma manutenção preventiva no próximo domingo às 02:00.',
        dataCriacao: new Date().toISOString(),
        criadoPor: 'admin@example.com',
        status: 'ativo',
        usuariosQueLerem: [],
        prioridade: 'alta',
        tipo: 'manutencao'
    },
    {
        id: 'not-2',
        titulo: 'Nova Funcionalidade',
        conteudo: 'Agora você pode exportar relatórios diretamente para PDF.',
        dataCriacao: new Date(Date.now() - 172800000).toISOString(),
        criadoPor: 'admin@example.com',
        status: 'ativo',
        usuariosQueLerem: ['user-1'],
        prioridade: 'baixa',
        tipo: 'informacao'
    }
];
