import { mockCarteiraStatus } from './mockData';

export interface CarteiraStatusData {
    id: string;
    nome_carteira: string;
    status: string;
    observacao: string | null;
    verificado_em: string;
}

export class SupabaseCarteirasService {
    /**
     * Busca todos os status das carteiras (MOCKADO)
     */
    static async getCarteirasStatus(): Promise<CarteiraStatusData[]> {
        return mockCarteiraStatus;
    }

    /**
     * Busca status de uma carteira específica (MOCKADO)
     */
    static async getCarteiraStatus(carteiraId: string): Promise<CarteiraStatusData | null> {
        return mockCarteiraStatus.find(c => c.id === carteiraId) || null;
    }
}
