import React from 'react';
import { Construction, AlertTriangle, Clock } from 'lucide-react';

const Backups: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-3">
                    <Construction className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Sistema de Backups
                </h1>
                <p className="text-base text-gray-600 dark:text-gray-400">
                    Sistema em desenvolvimento pela equipe técnica
                </p>
            </div>

            {/* Construction Elements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">
                        Em Construção
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Funcionalidades sendo implementadas
                    </p>
                </div>

                <div className="text-center p-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-2">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">
                        Breve Lançamento
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Aguarde as próximas atualizações
                    </p>
                </div>

                <div className="text-center p-4 sm:col-span-2 lg:col-span-1">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full mb-2">
                        <Construction className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">
                        Equipe Técnica
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Trabalhando intensamente no projeto
                    </p>
                </div>
            </div>

            {/* Footer Message */}
            <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Esta página estará disponível em breve com todas as funcionalidades implementadas.
                </p>
            </div>
        </div>
    );
};

export default Backups;
