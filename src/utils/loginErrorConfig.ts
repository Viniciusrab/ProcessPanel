import { Users, Lock, Mail, AlertTriangle, LucideIcon } from 'lucide-react';

export interface ErrorConfig {
    icon: LucideIcon;
    bgColor: string;
    borderColor: string;
    iconColor: string;
    textColor: string;
    title: string;
    description: string;
}

export function getErrorConfig(code: string): ErrorConfig {
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
}
