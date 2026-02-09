import { useState, useEffect, useCallback } from 'react';
import { Carteira, DashboardMetrics, StatusImportacao } from '../types';
import { SupabaseStatusImportacaoService } from '../services/supabaseStatusImportacaoService';
import { useImportacaoStatus } from './useImportacaoStatus';
import { ImportacaoStatusData } from '../services/supabaseImportacaoService';

// Cores para as carteiras
const coresCarteiras: { [id: string]: string } = {
  '5': '#DC2626',   // Amigável
  '6': '#7C2D12',   // OMEGA
  '7': '#365314',   // OMEGA
  '8': '#1E3A8A',   // GAMMA
  '19': '#0891B2',  // GAMMA
  '10': '#166534',  // Banestes
  '11': '#7F1D1D',  // BETA
  '12': '#0F172A',  // OMEGA
  '18': '#7C3AED',  // OMEGA
  '13': '#581C87',  // BETA
  '17': '#059669',  // ALFA
  '15': '#7C2D12',  // BETA PF
  '16': '#14532D',  // Use
};

// Mapear status do Supabase para o formato da aplicação
const mapearStatus = (status: string): StatusImportacao['status'] => {
  const statusMap: { [key: string]: StatusImportacao['status'] } = {
    'CONCLUÍDA': 'sucesso',
    'EM CURSO': 'processando',
    'ERRO': 'erro',
    'PENDENTE': 'pendente',
    'NÃO INICIADA': 'pendente'
  };
  return statusMap[status.toUpperCase()] || status as StatusImportacao['status'];
};

// Converter ImportacaoStatusData para StatusImportacao
const converterParaStatusImportacao = (data: ImportacaoStatusData): StatusImportacao => ({
  id: String(data.id),
  carteiraId: data.carteira_id,
  arquivo: data.nome_carteira,
  status: mapearStatus(data.status),
  observacao: data.obs || undefined,
  dataImportacao: data.ultima_verificacao,
  totalLinhas: 0,
  linhasProcessadas: 0,
  erros: []
});

export function useDashboardData() {
  const [carteiras, setCarteiras] = useState<Carteira[]>([]);
  const [selectedCarteira, setSelectedCarteira] = useState<string | null>(null);
  const [loadingCarteiras, setLoadingCarteiras] = useState(false);
  const { importacaoStatus, loading: loadingImportacoes, refetch } = useImportacaoStatus();

  // Carregar dados das carteiras do Supabase
  const loadCarteiras = useCallback(async () => {
    try {
      setLoadingCarteiras(true);
      const statusData = await SupabaseStatusImportacaoService.getAllStatusImportacao();

      // Converter dados do Supabase para o formato da aplicação
      const carteirasData = statusData
        .filter(status => status.nome_carteira !== 'BETA') // Filtrar a carteira "BETA"
        .map(status => ({
          id: status.carteira_id,
          nome: status.nome_carteira,
          cor: coresCarteiras[status.carteira_id] || '#000000', // Usa a cor mapeada ou preto como fallback
          totalRegistros: 0, // Inicializado como 0, pode ser atualizado depois se necessário
          status: 'ativa' as const
        }));

      setCarteiras(carteirasData);
    } catch (error) {
      console.error('Erro ao carregar carteiras:', error);
    } finally {
      setLoadingCarteiras(false);
    }
  }, []);

  // Carregar carteiras e atualizar periodicamente
  useEffect(() => {
    loadCarteiras();
    const interval = setInterval(loadCarteiras, 60000); // Atualizar a cada minuto
    return () => clearInterval(interval);
  }, [loadCarteiras]);

  // Converter os dados de importação para o formato esperado
  const importacoes = importacaoStatus.map(converterParaStatusImportacao);

  // Calcular métricas do dashboard
  const metrics: DashboardMetrics = {
    totalImportacoes: importacoes.length,
    importacoesSucesso: importacoes.filter(i => i.status === 'sucesso').length,
    importacoesErro: importacoes.filter(i => i.status === 'erro').length,
    totalMovimentacoes: 0, // Gerenciado em outro lugar
    totalTickets: 0, // Gerenciado por useTicketsData
    carteiraAtiva: carteiras.find(c => c.id === selectedCarteira) || null
  };

  return {
    carteiras,
    importacoes,
    metrics,
    selectedCarteira,
    setSelectedCarteira,
    loadingImportacoes,
    loadingCarteiras,
    loadCarteiras,
    executeImportScript: refetch // Usar refetch do useImportacaoStatus
  };
}