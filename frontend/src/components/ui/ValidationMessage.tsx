import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ValidationMessageProps {
  type: 'error' | 'success' | 'warning';
  message: string;
  className?: string;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({ type, message, className = '' }) => {
  const getStyles = () => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-500',
          IconComponent: AlertCircle
        };
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: 'text-green-500',
          IconComponent: CheckCircle
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: 'text-yellow-500',
          IconComponent: AlertCircle
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200 text-gray-800',
          icon: 'text-gray-500',
          IconComponent: AlertCircle
        };
    }
  };

  const { container, icon, IconComponent } = getStyles();

  return (
    <div className={`flex items-center gap-2 p-3 border rounded-lg ${container} ${className}`}>
      <IconComponent className={`h-4 w-4 ${icon} flex-shrink-0`} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default ValidationMessage;