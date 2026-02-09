import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification,
    setPersistence,
    browserLocalPersistence // Alterado para persistência local
} from 'firebase/auth';
import { initializeFirebase } from '../config/firebase';

// --- Modal simples para aviso de sessão expirada ---
function SessionExpiredModal({ visible, onConfirm }: { visible: boolean; onConfirm: () => void }) {
    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 8,
                maxWidth: 400,
                width: '90%',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                textAlign: 'center'
            }}>
                <h2>Sessão Expirada</h2>
                <p>Sua sessão expirou. Por favor, faça login novamente.</p>
                <button
                    onClick={onConfirm}
                    style={{
                        marginTop: 20,
                        padding: '8px 16px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                    }}
                >
                    Ok
                </button>
            </div>
        </div>
    );
}
// ----------------------------------------------------

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signup: (email: string, password: string, displayName: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    resendVerificationEmail: () => Promise<void>;
    isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState<any>(null);
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Check for mock session first
                const mockSession = localStorage.getItem('mockUser');
                if (mockSession) {
                    setUser(JSON.parse(mockSession));
                    setLoading(false);
                    // Still initialize firebase if possible, but we already have a user
                }

                const { auth: firebaseAuth } = await initializeFirebase();

                if (!firebaseAuth) {
                    if (!mockSession) setLoading(false);
                    return;
                }

                // Alterado para persistência local para manter a sessão após recarregar
                await setPersistence(firebaseAuth, browserLocalPersistence);
                setAuth(firebaseAuth);

                const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
                    if (!localStorage.getItem('mockUser')) {
                        setUser(currentUser);
                    }
                    setLoading(false);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error('Error initializing Firebase Auth:', error);
                if (!localStorage.getItem('mockUser')) setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Efeito para gerenciar o tempo de expiração da sessão
    useEffect(() => {
        let sessionTimer: NodeJS.Timeout;

        if (user) {
            const sessionExpiry = localStorage.getItem('sessionExpiry');
            if (sessionExpiry) {
                const expiryTime = parseInt(sessionExpiry, 10);
                const now = new Date().getTime();

                if (now > expiryTime) {
                    setSessionExpired(true);
                } else {
                    const remainingTime = expiryTime - now;
                    sessionTimer = setTimeout(() => {
                        setSessionExpired(true);
                    }, remainingTime);
                }
            } else {
                // Se não houver tempo de expiração, define um novo (pode acontecer em um login fresco)
                const newExpiry = new Date().getTime() + 3600 * 1000; // 1 hora
                localStorage.setItem('sessionExpiry', newExpiry.toString());
            }
        } else {
            localStorage.removeItem('sessionExpiry');
        }

        return () => clearTimeout(sessionTimer); // Limpa o timer ao desmontar ou quando o usuário muda
    }, [user]);


    const login = async (email: string, password: string) => {
        // Mock login check
        if (email === 'admin@admin' && password === 'admin123') {
            const mockUser = {
                uid: 'mock-admin-id',
                email: 'admin@admin',
                displayName: 'Administrador Mock',
                emailVerified: true,
            } as User;

            localStorage.setItem('mockUser', JSON.stringify(mockUser));
            const expiryTime = new Date().getTime() + 3600 * 1000; // 1 hora
            localStorage.setItem('sessionExpiry', expiryTime.toString());
            setUser(mockUser);
            return;
        }

        if (!auth) throw new Error('Serviço de autenticação offline. Use as credenciais de teste (admin/admin).');
        await signInWithEmailAndPassword(auth, email, password);
        // Define o tempo de expiração no login
        const expiryTime = new Date().getTime() + 3600 * 1000; // 1 hora
        localStorage.setItem('sessionExpiry', expiryTime.toString());
    };

    const logout = async () => {
        localStorage.removeItem('sessionExpiry'); // Limpa a expiração
        localStorage.removeItem('mockUser');
        setSessionExpired(false);
        setUser(null);
        if (auth) {
            await signOut(auth);
        }
    };

    const confirmSessionExpired = async () => {
        await logout();
    };

    const signup = async (email: string, password: string, displayName: string) => {
        if (!auth) throw new Error('Auth not initialized');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        await sendEmailVerification(userCredential.user);
    };

    const resetPassword = async (email: string) => {
        if (!auth) throw new Error('Auth not initialized');
        await sendPasswordResetEmail(auth, email);
    };

    const resendVerificationEmail = async () => {
        if (!auth || !user) throw new Error('User not authenticated');
        await sendEmailVerification(user);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        signup,
        resetPassword,
        resendVerificationEmail,
        isEmailVerified: user?.emailVerified ?? false,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            <SessionExpiredModal
                visible={sessionExpired}
                onConfirm={confirmSessionExpired}
            />
        </AuthContext.Provider>
    );
}