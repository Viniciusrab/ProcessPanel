import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, Database, BarChart, Cpu, Network, User, Users, AlertTriangle, ArrowLeft } from 'lucide-react';

interface LoginMobileProps {
  onSwitchToDesktop?: () => void;
}

export function LoginMobile({ onSwitchToDesktop }: LoginMobileProps) {
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

  // Get error configuration for better error display
  const getErrorConfig = (code: string) => {
    switch (code) {
      case 'auth/user-not-found':
        return {
          icon: Users,
          bgColor: 'bg-orange-100/80 dark:bg-orange-900/40',
          borderColor: 'border-orange-300/50 dark:border-orange-700/50',
          iconColor: 'text-orange-600 dark:text-orange-400',
          textColor: 'text-orange-800 dark:text-orange-300',
          title: 'Conta não encontrada',
          description: 'Este email não está cadastrado em nossa base de dados. Verifique se digitou corretamente ou crie uma nova conta.'
        };
      case 'auth/wrong-password':
        return {
          icon: Lock,
          bgColor: 'bg-red-100/80 dark:bg-red-900/40',
          borderColor: 'border-red-300/50 dark:border-red-700/50',
          iconColor: 'text-red-600 dark:text-red-400',
          textColor: 'text-red-800 dark:text-red-300',
          title: 'Senha incorreta',
          description: 'A senha digitada está incorreta. Tente novamente ou clique em "Esqueci minha senha".'
        };
      case 'auth/invalid-credential':
        return {
          icon: Lock,
          bgColor: 'bg-red-100/80 dark:bg-red-900/40',
          borderColor: 'border-red-300/50 dark:border-red-700/50',
          iconColor: 'text-red-600 dark:text-red-400',
          textColor: 'text-red-800 dark:text-red-300',
          title: 'Credenciais inválidas',
          description: 'Email ou senha incorretos. Verifique se digitou corretamente.'
        };
      case 'auth/invalid-email':
        return {
          icon: Mail,
          bgColor: 'bg-yellow-100/80 dark:bg-yellow-900/40',
          borderColor: 'border-yellow-300/50 dark:border-yellow-700/50',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          textColor: 'text-yellow-800 dark:text-yellow-300',
          title: 'Email inválido',
          description: 'O formato do email digitado é inválido. Verifique e tente novamente.'
        };
      case 'auth/too-many-requests':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-red-100/80 dark:bg-red-900/40',
          borderColor: 'border-red-300/50 dark:border-red-700/50',
          iconColor: 'text-red-600 dark:text-red-400',
          textColor: 'text-red-800 dark:text-red-300',
          title: 'Muitas tentativas',
          description: 'Muitas tentativas de login falharam. Tente novamente em alguns minutos.'
        };
      case 'auth/user-disabled':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-gray-100/80 dark:bg-gray-900/40',
          borderColor: 'border-gray-300/50 dark:border-gray-700/50',
          iconColor: 'text-gray-600 dark:text-gray-400',
          textColor: 'text-gray-800 dark:text-gray-300',
          title: 'Conta desabilitada',
          description: 'Esta conta foi desabilitada. Entre em contato com o administrador.'
        };
      case 'auth/weak-password':
        return {
          icon: Lock,
          bgColor: 'bg-blue-100/80 dark:bg-blue-900/40',
          borderColor: 'border-blue-300/50 dark:border-blue-700/50',
          iconColor: 'text-blue-600 dark:text-blue-400',
          textColor: 'text-blue-800 dark:text-blue-300',
          title: 'Senha muito fraca',
          description: 'A senha deve ter pelo menos 6 caracteres.'
        };
      case 'auth/email-already-in-use':
        return {
          icon: Mail,
          bgColor: 'bg-purple-100/80 dark:bg-purple-900/40',
          borderColor: 'border-purple-300/50 dark:border-purple-700/50',
          iconColor: 'text-purple-600 dark:text-purple-400',
          textColor: 'text-purple-800 dark:text-purple-300',
          title: 'Email já cadastrado',
          description: 'Este email já está sendo usado por outra conta.'
        };
      case 'auth/invalid-domain':
        return {
          icon: Mail,
          bgColor: 'bg-pink-100/80 dark:bg-pink-900/40',
          borderColor: 'border-pink-300/50 dark:border-pink-700/50',
          iconColor: 'text-pink-600 dark:text-pink-400',
          textColor: 'text-pink-800 dark:text-pink-300',
          title: 'Domínio não permitido',
          description: 'Email não permitido para cadastro.'
        };
      case 'custom/missing-email':
        return {
          icon: Mail,
          bgColor: 'bg-yellow-100/80 dark:bg-yellow-900/40',
          borderColor: 'border-yellow-300/50 dark:border-yellow-700/50',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          textColor: 'text-yellow-800 dark:text-yellow-300',
          title: 'Email não informado',
          description: 'Por favor, digite seu email no campo acima e clique novamente em "Esqueci minha senha" para redefinir sua senha.'
        };
      default:
        return {
          icon: AlertTriangle,
          bgColor: 'bg-gray-100/80 dark:bg-gray-900/40',
          borderColor: 'border-gray-300/50 dark:border-gray-700/50',
          iconColor: 'text-gray-600 dark:text-gray-400',
          textColor: 'text-gray-800 dark:text-gray-300',
          title: 'Erro de autenticação',
          description: 'Ocorreu um erro durante a autenticação. Tente novamente.'
        };
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-32 h-32 bg-indigo-300/20 dark:bg-indigo-900/20 rounded-full filter blur-xl opacity-30 animate-float top-10 left-10" />
        <div className="absolute w-40 h-40 bg-purple-300/20 dark:bg-purple-900/20 rounded-full filter blur-xl opacity-30 animate-float-slow bottom-20 right-20" />
        <div className="absolute w-36 h-36 bg-blue-300/20 dark:bg-blue-900/20 rounded-full filter blur-xl opacity-30 animate-float-fast top-1/3 right-1/4" />
      </div>

      {/* Header with back button */}
      {/* <div className="relative z-10 p-4">
                <button
                    onClick={onSwitchToDesktop}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <span className="text-sm">Voltar</span>
                </button>
            </div> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
            Portal de Processamento
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {isSignup ? 'Crie sua conta' : 'Bem-vindo de volta'}
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <div className="flex items-center space-x-2 p-3 bg-green-100/80 dark:bg-green-900/40 border border-green-300/50 dark:border-green-700/50 rounded-lg animate-slide-in">
                <LogIn className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
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
                    className="block w-full pl-10 pr-3 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200/50 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm"
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
                  className="block w-full pl-10 pr-3 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200/50 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm"
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
                  className="block w-full pl-10 pr-12 py-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200/50 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm"
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
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-lg font-medium text-sm hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
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

          {/* Action buttons */}
          <div className="mt-6 text-center space-y-3">
            {!isSignup && (
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={loading}
                className="text-sm text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Esqueceu sua senha?
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="block w-full text-sm text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors duration-200 font-medium"
            >
              {isSignup
                ? 'Já tem uma conta? Faça login'
                : 'Não tem conta? Criar nova conta'
              }
            </button>
          </div>
        </div>

        {/* Floating icons for mobile */}
        <div className="absolute bottom-20 left-6 opacity-20">
          <Database className="w-8 h-8 text-indigo-400 animate-float-slow" />
        </div>
        <div className="absolute bottom-16 right-8 opacity-20">
          <BarChart className="w-8 h-8 text-purple-400 animate-float-fast" />
        </div>
        <div className="absolute top-20 right-6 opacity-20">
          <Cpu className="w-8 h-8 text-blue-400 animate-float" />
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 p-4 text-center">
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
          Sistema de Processamento
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Versão 1.2.1
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(3deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                @keyframes floatSlow {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-3deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                @keyframes floatFast {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-8px) rotate(2deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                .animate-slide-in {
                    animation: slideIn 0.5s ease-out;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-slow {
                    animation: floatSlow 8s ease-in-out infinite;
                }
                .animate-float-fast {
                    animation: floatFast 4s ease-in-out infinite;
                }
            `}</style>
    </div>
  );
}
