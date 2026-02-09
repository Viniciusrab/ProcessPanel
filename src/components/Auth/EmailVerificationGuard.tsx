import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, AlertTriangle, CheckCircle, RefreshCw, Clock } from 'lucide-react';

interface EmailVerificationGuardProps {
    children: React.ReactNode;
    requireVerification?: boolean;
}

export function EmailVerificationGuard({ children, requireVerification = false }: EmailVerificationGuardProps) {
    const { user, isEmailVerified, resendVerificationEmail } = useAuth();
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);
    const [countdown, setCountdown] = useState(40); // Start with 40 seconds countdown
    const [showVerifyButton, setShowVerifyButton] = useState(true); // Show verify button immediately

    // Timer countdown effect
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleResendEmail = async () => {
        if (!user) return;

        setResending(true);
        try {
            await resendVerificationEmail();
            setResent(true);
            setCountdown(40); // Reset countdown to 40 seconds
            setShowVerifyButton(true); // Keep verify button visible
        } catch (error) {
            console.error('Error resending verification email:', error);
        } finally {
            setResending(false);
        }
    };

    const handleVerifyCheck = () => {
        window.location.reload(); // Reload the page to check verification status
    };

    // If verification is not required, just render children
    if (!requireVerification) {
        return <>{children}</>;
    }

    // If user is not logged in, don't render anything
    if (!user) {
        return null;
    }

    // If email is verified, render children
    if (isEmailVerified) {
        return <>{children}</>;
    }

    // Show verification required screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Verifique seu e-mail
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    Enviamos um e-mail de verificação para <strong>{user.email}</strong>.
                    Clique no link do e-mail para verificar sua conta e continuar usando o sistema.
                </p>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Verificação necessária
                        </span>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Você precisa verificar seu e-mail antes de acessar o sistema.
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleResendEmail}
                        disabled={resending || countdown > 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                        {resending ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Enviando...
                            </>
                        ) : countdown > 0 ? (
                            <>
                                <Clock className="w-4 h-4 mr-2" />
                                Aguarde {countdown}s para reenviar
                            </>
                        ) : (
                            <>
                                <Mail className="w-4 h-4 mr-2" />
                                Reenviar e-mail de verificação
                            </>
                        )}
                    </button>

                    {showVerifyButton && (
                        <button
                            onClick={handleVerifyCheck}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Já verifiquei
                        </button>
                    )}

                    {resent && countdown === 0 && (
                        <div className="flex items-center justify-center text-green-600 dark:text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            E-mail reenviado com sucesso!
                        </div>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Não recebeu o e-mail? Verifique sua caixa de spam ou lixo eletrônico.
                    </p>
                </div>
            </div>
        </div>
    );
}
