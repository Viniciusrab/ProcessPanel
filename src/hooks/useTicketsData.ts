import { useState, useEffect, useCallback } from 'react';
import { SupabaseTicketsService, TicketData } from '../services/supabaseTicketsService';

export const useTicketsData = () => {
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Buscar tickets do Supabase
            const ticketsData = await SupabaseTicketsService.getTickets(1000);

            // Ordenar tickets por tempo (mais recentes primeiro) como backup
            ticketsData.sort((a, b) => a.alterado_em_segundos - b.alterado_em_segundos);

            setTickets(ticketsData);
        } catch (err) {
            console.error('Erro ao buscar tickets:', err);
            setError('Erro ao carregar tickets');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const refetch = useCallback(() => {
        return fetchTickets();
    }, [fetchTickets]);

    return {
        tickets,
        loading,
        error,
        refetch
    };
};
