import { useState, useEffect, useCallback } from 'react';
import { SupabaseCarteirasService, CarteiraStatusData } from '../services/supabaseCarteirasService';

export const useCarteirasStatus = () => {
    const [carteiras, setCarteiras] = useState<CarteiraStatusData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCarteirasStatus = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const carteirasData = await SupabaseCarteirasService.getCarteirasStatus();
            setCarteiras(carteirasData);
        } catch (err) {
            console.error('Erro ao buscar status das carteiras:', err);
            setError('Erro ao carregar status das carteiras');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCarteirasStatus();
    }, [fetchCarteirasStatus]);

    const refetch = useCallback(() => {
        return fetchCarteirasStatus();
    }, [fetchCarteirasStatus]);

    return {
        carteiras,
        loading,
        error,
        refetch
    };
};
