import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export interface LoginFormData {
    email: string;
    password: string;
    displayName: string;
    isSignup: boolean;
    error: string;
    errorCode: string;
    loading: boolean;
    success: string;
    showPassword: boolean;
}

export interface LoginActions {
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setDisplayName: (displayName: string) => void;
    setIsSignup: (isSignup: boolean) => void;
    setError: (error: string) => void;
    setErrorCode: (errorCode: string) => void;
    setLoading: (loading: boolean) => void;
    setSuccess: (success: string) => void;
    setShowPassword: (showPassword: boolean) => void;
    handleResetPassword: () => Promise<void>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useLoginLogic(): LoginFormData & LoginActions {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState('');
    const [errorCode, setErrorCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const { login, signup, resetPassword } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            setError('Digite seu email para redefinir a senha');
            setErrorCode('custom/missing-email');
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await resetPassword(email);
            setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
        } catch (error) {
            console.error('Reset password error:', error);
            let errorMessage = 'Erro ao enviar email de recuperação';

            if (error && typeof error === 'object' && 'code' in error) {
                const err = error as { code: string; message?: string };

                switch (err.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'Email não encontrado em nossa base de dados';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Email inválido';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
                        break;
                    default:
                        if (err.message) errorMessage = err.message;
                        break;
                }
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const isValidCompanyEmail = (email: string): boolean => {
        return email.includes('@');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setErrorCode('');
        setSuccess('');
        setLoading(true);

        try {
            if (isSignup) {
                if (!isValidCompanyEmail(email)) {
                    setError('E-mail inválido.');
                    setErrorCode('auth/invalid-domain');
                    setLoading(false);
                    return;
                }

                await signup(email, password, displayName);
                setSuccess('Conta criada com sucesso! Um e-mail de verificação foi enviado para sua caixa de entrada. Verifique seu e-mail antes de fazer login.');
            } else {
                await login(email, password);
                setSuccess('Login realizado com sucesso! Redirecionando...');
            }

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            console.error('Auth error:', error);
            let errorMessage = 'Erro ao fazer login';
            let errorCodeValue = '';

            if (error && typeof error === 'object' && 'code' in error) {
                const err = error as { code: string; message?: string };
                errorCodeValue = err.code;

                switch (err.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'Usuário não encontrado';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Senha incorreta';
                        break;
                    case 'auth/invalid-credential':
                        errorMessage = 'Email ou senha incorretos';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Email inválido';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Senha muito fraca (mínimo 6 caracteres)';
                        break;
                    case 'auth/email-already-in-use':
                        errorMessage = 'Este email já está cadastrado';
                        break;
                    default:
                        if (err.message) errorMessage = err.message;
                        break;
                }
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            setError(errorMessage);
            setErrorCode(errorCodeValue);
        } finally {
            setLoading(false);
        }
    };

    return {
        // State
        email,
        password,
        displayName,
        isSignup,
        error,
        errorCode,
        loading,
        success,
        showPassword,
        // Actions
        setEmail,
        setPassword,
        setDisplayName,
        setIsSignup,
        setError,
        setErrorCode,
        setLoading,
        setSuccess,
        setShowPassword,
        handleResetPassword,
        handleSubmit,
    };
}
