import { mockTicketsData } from './mockData';

export interface TicketData {
    id: string;
    assunto: string;
    operador: string;
    status: string;
    alterado_ha: string;
    alterado_em_segundos: number;
}

export class SupabaseTicketsService {
    /**
     * Busca todos os tickets (MOCKADO)
     */
    static async getTickets(limit: number = 1000): Promise<TicketData[]> {
        return mockTicketsData.slice(0, limit);
    }

    /**
     * Busca tickets por carteira específica (MOCKADO)
     */
    static async getTicketsByCarteira(carteiraId: string): Promise<TicketData[]> {
        console.log('GetTicketsByCarteira (MOCK):', carteiraId);
        return mockTicketsData;
    }

    /**
     * Busca tickets por status (MOCKADO)
     */
    static async getTicketsByStatus(status: string[]): Promise<TicketData[]> {
        return mockTicketsData.filter(t => status.includes(t.status));
    }

    /**
     * Insere um novo ticket (MOCKADO - SEM EFEITO)
     */
    static async insertTicket(ticket: Omit<TicketData, 'id'>): Promise<TicketData> {
        return {
            id: Math.random().toString(),
            ...ticket
        };
    }

    /**
     * Atualiza um ticket existente (MOCKADO - SEM EFEITO)
     */
    static async updateTicket(id: string, updates: Partial<Omit<TicketData, 'id'>>): Promise<TicketData> {
        return {
            id,
            assunto: '',
            operador: '',
            status: '',
            alterado_ha: '',
            alterado_em_segundos: 0,
            ...updates
        };
    }

    /**
     * Remove um ticket (MOCKADO - SEM EFEITO)
     */
    static async deleteTicket(id: string): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Limpa todos os tickets (MOCKADO - SEM EFEITO)
     */
    static async clearAllTickets(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Conta o número total de tickets (MOCKADO)
     */
    static async countTickets(): Promise<number> {
        return mockTicketsData.length;
    }
}
