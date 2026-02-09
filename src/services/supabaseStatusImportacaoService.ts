import { mockImportacaoStatus } from './mockData';

export interface StatusImportacaoData {
    id: number;
    carteira_id: string;
    nome_carteira: string;
    status?: string;
    obs?: string | null;
    ultima_verificacao?: string;
}

export interface StatusImportacaoUpdate {
    carteira_id: string;
    status: 'CONCLUÍDA' | 'ERRO' | 'EM CURSO' | 'NÃO INICIADA';
    obs: string | null;
    ultima_verificacao: string;
}

export class SupabaseStatusImportacaoService {
    /**
     * Busca todos os dados de importação (MOCKADO)
     */
    static async getAllStatusImportacao(): Promise<StatusImportacaoData[]> {
        return mockImportacaoStatus;
    }

    /**
     * Busca dados de uma carteira específica (MOCKADO)
     */
    static async getStatusImportacaoByCarteiraId(carteiraId: string): Promise<StatusImportacaoData | null> {
        return mockImportacaoStatus.find(s => s.carteira_id === carteiraId) || null;
    }

    /**
     * Map nomes de carteira para IDs (MOCKADO)
     */
    static async getCarteiraIdMap(): Promise<{ [key: string]: string }> {
        const idMap: { [key: string]: string } = {};
        mockImportacaoStatus.forEach(item => {
            idMap[item.nome_carteira] = item.carteira_id;
        });
        return idMap;
    }

    /**
     * Atualiza o status de importação (MOCKADO - SEM EFEITO)
     */
    static async updateStatusImportacao(updates: StatusImportacaoUpdate[]): Promise<void> {
        console.log('UpdateStatusImportacao (MOCK):', updates);
        return Promise.resolve();
    }
}
