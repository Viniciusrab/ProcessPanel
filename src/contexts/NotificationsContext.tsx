import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { collection, addDoc, updateDoc, doc, query, orderBy, onSnapshot, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Notificacao } from '../types';
import { useAuth } from './AuthContext';
import { Howl } from 'howler';

interface NotificationsContextType {
    notificacoes: Notificacao[];
    notificacoesNaoLidas: Notificacao[];
    loading: boolean;
    criarNotificacao: (dados: {
        titulo: string;
        conteudo: string;
        prioridade: 'baixa' | 'media' | 'alta' | 'critica';
        tipo: 'informacao' | 'aviso' | 'alerta' | 'manutencao';
    }) => Promise<string>;
    marcarComoLida: (notificacaoId: string) => Promise<void>;
    desmarcarComoLida: (notificacaoId: string) => Promise<void>;
    inativarNotificacao: (notificacaoId: string) => Promise<void>;
    deletarNotificacao: (notificacaoId: string) => Promise<void>;
    foiLida: (notificacao: Notificacao) => boolean;
    isAdmin: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function useNotificationsContext() {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotificationsContext must be used within a NotificationsProvider');
    }
    return context;
}

interface NotificationsProviderProps {
    children: React.ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
    const { user } = useAuth();
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [loading, setLoading] = useState(true);

    const lastProcessedIdsRef = useRef<Set<string>>(new Set()); // Armazenar IDs das notificações já processadas para evitar duplicação de alerta
    const unsubscribeRef = useRef<(() => void) | null>(null); // Armazenar a função de unsubscribe

    const foiLida = useCallback((notificacao: Notificacao) => {
        return user ? notificacao.usuariosQueLerem.includes(user.uid) : false;
    }, [user]);

    const tocarSomNotificacao = () => {
        const sound = new Howl({
            src: ['https://nbayaygqkootkrxhcgut.supabase.co/storage/v1/object/public/resources/new-notification-3-398649.mp3'],
            volume: 1.0,
            html5: true,
        });
        sound.play();
    };

    const mostrarNotificacaoNavegador = (titulo: string, options: NotificationOptions) => {
        if (!('Notification' in window)) {
            console.log('Este navegador não suporta notificações de desktop.');
            return;
        }

        if (Notification.permission === 'granted') {
            new Notification(titulo, options);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(titulo, options);
                }
            });
        }
    };

    useEffect(() => {
        if (!user) {
            setNotificacoes([]);
            setLoading(false);
            // Certifica-se de que qualquer listener anterior seja desinscrito
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
            return;
        }

        // Desinscreve qualquer listener anterior antes de criar um novo
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
        }

        if (!db) {
            setLoading(false);
            return;
        }

        const unsubscribe = onSnapshot(
            query(
                collection(db, 'notificacoes'),
                orderBy('dataCriacao', 'desc')
            ),
            (snapshot) => {
                const notificacoesData = (snapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        dataCriacao: doc.data().dataCriacao?.toDate?.()?.toISOString() || doc.data().dataCriacao
                    })) as Notificacao[])
                    .filter((notificacao: Notificacao) => notificacao.status === 'ativo');

                setNotificacoes(notificacoesData);
                setLoading(false);

                const timestamp = new Date().toLocaleTimeString();
                console.log(`[${timestamp}] DEBUG: onSnapshot callback fired.`);
                console.log(`[${timestamp}] DEBUG: notificacoesData (${notificacoesData.length} items):`, notificacoesData.map(n => n.id));
                console.log(`[${timestamp}] DEBUG: lastProcessedIdsRef.current (before filter):`, Array.from(lastProcessedIdsRef.current));

                // Captura os IDs atuais do snapshot
                const currentSnapshotIds = new Set(notificacoesData.map(n => n.id));

                // Identifica notificações que são novas no snapshot atual e não foram processadas antes
                const novasNotificacoesParaAlerta = notificacoesData.filter(
                    n => !lastProcessedIdsRef.current.has(n.id)
                );
                console.log(`[${timestamp}] DEBUG: novasNotificacoesParaAlerta (${novasNotificacoesParaAlerta.length} items):`, novasNotificacoesParaAlerta.map(n => n.id));

                // Atualiza o ref com os IDs do snapshot atual para a próxima comparação
                lastProcessedIdsRef.current = currentSnapshotIds;
                console.log(`[${timestamp}] DEBUG: lastProcessedIdsRef.current (after update):`, Array.from(lastProcessedIdsRef.current));


                // Tocar som e mostrar notificação no navegador APENAS para as realmente novas e não lidas
                const novasNaoLidasParaAlerta = novasNotificacoesParaAlerta.filter(n => !foiLida(n));
                console.log(`[${timestamp}] DEBUG: novasNaoLidasParaAlerta (${novasNaoLidasParaAlerta.length} items):`, novasNaoLidasParaAlerta.map(n => n.id));

                if (novasNaoLidasParaAlerta.length > 0) {
                    console.log(`[${timestamp}] DEBUG: Triggering sound and browser notification for ${novasNaoLidasParaAlerta.length} new unread notifications.`);
                    tocarSomNotificacao();
                    // Mostrar notificação no navegador para a mais recente
                    const maisRecente = novasNaoLidasParaAlerta.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())[0];
                    mostrarNotificacaoNavegador(maisRecente.titulo, {
                        body: maisRecente.conteudo,
                        icon: '/favicon.ico' // Opcional: adicione um ícone
                    });
                } else {
                    console.log(`[${timestamp}] DEBUG: No new unread notifications to trigger alert.`);
                }
            },
            (err) => {
                console.error('Erro ao carregar notificações:', err);
                setLoading(false);
            }
        );

        unsubscribeRef.current = unsubscribe; // Armazena a função de unsubscribe

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
        };
    }, [user, foiLida]);

    const criarNotificacao = useCallback(async (dados: {
        titulo: string;
        conteudo: string;
        prioridade: 'baixa' | 'media' | 'alta' | 'critica';
        tipo: 'informacao' | 'aviso' | 'alerta' | 'manutencao';
    }) => {
        if (!user || !db) throw new Error('Usuário não autenticado ou Banco de dados offline');

        try {
            const novaNotificacao = {
                ...dados,
                dataCriacao: Timestamp.now(),
                criadoPor: user.email,
                status: 'ativo',
                usuariosQueLerem: []
            };

            const docRef = await addDoc(collection(db, 'notificacoes'), novaNotificacao);
            return docRef.id;
        } catch (err) {
            console.error('Erro ao criar notificação:', err);
            throw new Error('Erro ao criar notificação');
        }
    }, [user]);

    const marcarComoLida = useCallback(async (notificacaoId: string) => {
        if (!user || !db) return;

        try {
            const notificacaoRef = doc(db, 'notificacoes', notificacaoId);
            const notificacao = notificacoes.find(n => n.id === notificacaoId);

            if (notificacao) {
                await updateDoc(notificacaoRef, {
                    usuariosQueLerem: [...(notificacao.usuariosQueLerem || []), user.uid]
                });
            }
        } catch (err) {
            console.error('Erro ao marcar notificação como lida:', err);
        }
    }, [user, notificacoes]);

    const desmarcarComoLida = useCallback(async (notificacaoId: string) => {
        if (!user || !db) return;

        try {
            const notificacaoRef = doc(db, 'notificacoes', notificacaoId);
            const notificacao = notificacoes.find(n => n.id === notificacaoId);

            if (notificacao) {
                const usuariosQueLerem = notificacao.usuariosQueLerem.filter(id => id !== user.uid);

                await updateDoc(notificacaoRef, {
                    usuariosQueLerem
                });
            }
        } catch (err) {
            console.error('Erro ao desmarcar notificação como lida:', err);
        }
    }, [user, notificacoes]);

    const inativarNotificacao = useCallback(async (notificacaoId: string) => {
        if (!user || !db) return;

        try {
            const notificacaoRef = doc(db, 'notificacoes', notificacaoId);
            await updateDoc(notificacaoRef, {
                status: 'inativo'
            });
        } catch (err) {
            console.error('Erro ao inativar notificação:', err);
        }
    }, [user]);

    const deletarNotificacao = useCallback(async (notificacaoId: string) => {
        if (!user || !db) return;

        try {
            const notificacaoRef = doc(db, 'notificacoes', notificacaoId);
            await deleteDoc(notificacaoRef);
        } catch (err) {
            console.error('Erro ao deletar notificação:', err.message);
            throw err;
        }
    }, [user]);

    const notificacoesNaoLidas = notificacoes.filter(notificacao => !foiLida(notificacao));
    const isAdmin = user?.email === 'admin@admin';

    const value = {
        notificacoes,
        notificacoesNaoLidas,
        loading,
        criarNotificacao,
        marcarComoLida,
        desmarcarComoLida,
        inativarNotificacao,
        deletarNotificacao,
        foiLida,
        isAdmin
    };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
}
