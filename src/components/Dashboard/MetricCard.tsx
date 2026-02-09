import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  color,
  onClick 
}: MetricCardProps) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 
        hover:shadow-md dark:hover:shadow-lg transition-all duration-200 
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 break-words">{title}</p>
          <p className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mt-2 break-words">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ml-4"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}