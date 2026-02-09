import { useState } from 'react';
import { Briefcase, Check, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Carteira } from '../../types';

interface CarteiraSelectorProps {
  carteiras: Carteira[];
  selectedCarteira: string | null;
  onSelect: (carteiraId: string | null) => void;
}

export function CarteiraSelector({ carteiras, selectedCarteira, onSelect }: CarteiraSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Carteiras filtradas pela busca
  const filteredCarteiras = carteiras.filter(carteira =>
    carteira.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Carteiras a serem exibidas (principais ou todas)
  const displayedCarteiras = showAll ? filteredCarteiras : filteredCarteiras.slice(0, 5);

  const statusColors = {
    ativa: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    inativa: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    manutencao: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Briefcase className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Selecionar Carteira</h3>
      </div>

      <div className="space-y-3">
        {/* Botão "Todas as Carteiras" */}
        <button
          onClick={() => onSelect(null)}
          className={`
            w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200
            ${selectedCarteira === null
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
            }
          `}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-gray-800 dark:text-white">Todas as Carteiras</span>
          </div>
          {selectedCarteira === null && (
            <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          )}
        </button>

        {/* Campo de busca */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar carteira..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Lista de carteiras */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {searchTerm ? `Carteiras encontradas (${filteredCarteiras.length})` : 'Principais Carteiras'}
            </p>
            {filteredCarteiras.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
              >
                <span>{showAll ? 'Mostrar menos' : 'Ver todas'}</span>
                {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>

          {displayedCarteiras.map((carteira) => (
            <button
              key={carteira.id}
              onClick={() => onSelect(carteira.id)}
              className={`
                w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                ${selectedCarteira === carteira.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: carteira.cor }}
                />
                <div className="text-left">
                  <span className="font-medium text-gray-800 dark:text-white block">{carteira.nome}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[carteira.status as keyof typeof statusColors]}`}>
                    {carteira.status}
                  </span>
                </div>
              </div>
              {selectedCarteira === carteira.id && (
                <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
            </button>
          ))}

          {filteredCarteiras.length === 0 && searchTerm && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              Nenhuma carteira encontrada para "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}