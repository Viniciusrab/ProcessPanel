import { useState, useEffect, useCallback } from 'react';
import { SupabaseImportacaoService, ImportacaoStatusData } from '../services/supabaseImportacaoService';

export const useImportacaoStatus = () => {
    const [importacaoStatus, setImportacaoStatus] = useState<ImportacaoStatusData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchImportacaoStatus = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const statusData = await SupabaseImportacaoService.getStatusImportacao();

            const processedData = statusData.map(item => {
                const newItem = { ...item };

                // Ajuste de fuso horário
                const date = new Date(newItem.ultima_verificacao);
                date.setHours(date.getHours() + 3); // Adiciona 3 horas
                newItem.ultima_verificacao = date.toISOString();

                // Lógica de exibição de obs
                const carteira = newItem.nome_carteira.toUpperCase();
                const status = newItem.status.toUpperCase();

                if (carteira === 'ALFA' || carteira === 'BETA') {
                    if (status !== 'EM CURSO') {
                        newItem.obs = null;
                    }
                } else if (carteira === 'OMEGA' || carteira === 'OMEGA') {
                    if (status !== 'CONCLUÍDA') {
                        newItem.obs = null;
                    }
                } else {
                    newItem.obs = null;
                }

                return newItem;
            });

            setImportacaoStatus(processedData);
        } catch (err) {
            console.error('Erro ao buscar status de importação:', err);
            setError('Erro ao carregar status de importação');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImportacaoStatus();
    }, [fetchImportacaoStatus]);

    const refetch = useCallback(() => {
        return fetchImportacaoStatus();
    }, [fetchImportacaoStatus]);

    return {
        importacaoStatus,
        loading,
        error,
        refetch
    };
};