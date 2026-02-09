export interface Carteira {
  id: string;
  nome: string;
  cor: string;
  totalRegistros: number;
  status: 'ativa' | 'inativa' | 'manutencao';
}

export interface StatusImportacao {
  id: string;
  carteiraId: string;
  arquivo: string;
  dataImportacao: string;
  status: 'sucesso' | 'erro' | 'processando' | 'pendente' | 'CONCLUÍDA' | 'ERRO' | 'EM CURSO' | 'NÃO INICIADA';
  totalLinhas: number;
  linhasProcessadas: number;
  erros: string[];
  observacao?: string; // Campo para exibição de detalhes específicos como centralização, arquivos, etc.
  centralizadora?: string; // Código da centralizadora (ex: "120", "135", etc.)
  arquivosImportados?: string[];
}

export interface MovimentacaoBase {
  id: string;
  carteiraId: string;
  tipo: 'inclusao' | 'alteracao' | 'exclusao';
  quantidade: number;
  data: string;
  usuario: string;
  detalhes: string;
}

export interface TicketVirtua {
  id: string;
  carteiraId: string;
  numeroTicket: string;
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'aberto' | 'em_andamento' | 'aguardando_cliente' | 'resolvido' | 'fechado';
  categoria: 'suporte' | 'bug' | 'melhoria' | 'duvida' | 'outros';
  dataCriacao: string;
  dataAtualizacao: string;
  responsavel: string;
  tempoResolucao?: string;
  tags: string[];
}

export interface DashboardMetrics {
  totalImportacoes: number;
  importacoesSucesso: number;
  importacoesErro: number;
  totalMovimentacoes: number;
  totalTickets: number;
  carteiraAtiva: Carteira | null;
}

export interface Notificacao {
  id: string;
  titulo: string;
  conteudo: string;
  dataCriacao: string;
  criadoPor: string;
  status: 'ativo' | 'inativo';
  usuariosQueLerem: string[]; // Array de userIds que já leram
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  tipo: 'informacao' | 'aviso' | 'alerta' | 'manutencao';
}

export interface NotificacaoUsuario {
  notificacaoId: string;
  userId: string;
  lida: boolean;
  dataLeitura?: string;
}