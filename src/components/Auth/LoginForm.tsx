import React from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { LoginFormData, LoginActions } from '../../hooks/useLoginLogic';
import { getErrorConfig } from '../../utils/loginErrorConfig';

interface LoginFormProps extends LoginFormData, LoginActions {
    variant: 'desktop' | 'mobile';
    onToggleSignup?: () => void;
}

export function LoginForm({
    email,
    password,
    displayName,
    isSignup,
    error,
    errorCode,
    loading,
    success,
    showPassword,
    setEmail,
    setPassword,
    setDisplayName,
    setShowPassword,
    handleSubmit,
    variant
}: LoginFormProps) {
    const isMobile = variant === 'mobile';

    return (
        <form onSubmit={handleSubmit} className={`space-y-${isMobile ? '4' : '6'}`}>
            {success && (
                <div className="flex items-center space-x-2 p-3 bg-green-100/80 dark:bg-green-900/40 border border-green-300/50 dark:border-green-700/50 rounded-lg animate-slide-in">
                    <LogIn className={`w-5 h-5 text-green-600 dark:text-green-400 ${isMobile ? 'flex-shrink-0' : ''}`} />
                    <span className="text-green-800 dark:text-green-300 text-sm">{success}</span>
                </div>
            )}

            {error && (() => {
                const errorConfig = getErrorConfig(errorCode);
                const ErrorIcon = errorConfig.icon;
                return (
                    <div className={`flex items-start space-x-3 p-4 border rounded-lg animate-slide-in ${errorConfig.bgColor} ${errorConfig.borderColor}`}>
                        <ErrorIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${errorConfig.iconColor}`} />
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${errorConfig.textColor}`}>
                                {errorConfig.title || 'Erro de autenticação'}
                            </p>
                            <p className={`text-sm mt-1 ${errorConfig.textColor}`}>
                                {errorConfig.description || error}
                            </p>
                        </div>
                    </div>
                );
            })()}

            {isSignup && (
                <div className="relative group">
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Nome Completo
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required={isSignup}
                            className={`block w-full pl-10 pr-3 py-3 bg-${isMobile ? 'white/70' : 'white/50'} dark:bg-gray-${isMobile ? '700/70' : '700/50'} border border-gray-200/50 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${isMobile ? 'shadow-sm' : 'shadow-sm hover:shadow-md'}`}
                            placeholder="Seu nome completo"
                        />
                    </div>
                </div>
            )}

            <div className="relative group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Email
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={`block w-full pl-10 pr-3 py-3 bg-${isMobile ? 'white/70' : 'white/50'} dark:bg-gray-${isMobile ? '700/70' : '700/50'} border border-gray-200/50 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${isMobile ? 'shadow-sm' : 'shadow-sm hover:shadow-md'}`}
                        placeholder="seu@email.com"
                    />
                </div>
            </div>

            <div className="relative group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Senha
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className={`block w-full pl-10 pr-${isMobile ? '12' : '10'} py-3 bg-${isMobile ? 'white/70' : 'white/50'} dark:bg-gray-${isMobile ? '700/70' : '700/50'} border border-gray-200/50 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${isMobile ? 'shadow-sm' : 'shadow-sm hover:shadow-md'}`}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-500 transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg font-medium text-sm hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${isMobile ? 'shadow-lg' : 'shadow-lg hover:shadow-xl transform hover:-translate-y-1'}`}
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {isSignup ? 'Criando conta...' : 'Entrando...'}
                    </>
                ) : (
                    <>
                        <LogIn className="w-5 h-5 mr-2" />
                        {isSignup ? 'Criar Conta' : 'Entrar'}
                    </>
                )}
            </button>
        </form>
    );
}
