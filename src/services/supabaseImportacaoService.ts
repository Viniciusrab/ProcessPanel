import { mockImportacaoStatus } from './mockData';

export interface ImportacaoStatusData {
    id: number;
    carteira_id: string;
    nome_carteira: string;
    status: string;
    obs: string | null;
    ultima_verificacao: string;
}

export interface ImportacaoStatusUpdate {
    carteira_id: string;
    status: string;
    obs?: string | null;
    ultima_verificacao: string;
}

export class SupabaseImportacaoService {
    /**
     * Busca todos os status de importação (MOCKADO)
     */
    static async getStatusImportacao(): Promise<ImportacaoStatusData[]> {
        return mockImportacaoStatus;
    }

    /**
     * Busca status de importação de uma carteira específica (MOCKADO)
     */
    static async getStatusImportacaoByCarteira(carteiraId: string): Promise<ImportacaoStatusData | null> {
        return mockImportacaoStatus.find(s => s.carteira_id === carteiraId) || null;
    }

    /**
     * Atualiza o status de importação (MOCKADO - SEM EFEITO)
     */
    static async updateStatusImportacao(updates: ImportacaoStatusUpdate[]): Promise<void> {
        console.log('UpdateStatusImportacao (MOCK):', updates);
        return Promise.resolve();
    }
}
