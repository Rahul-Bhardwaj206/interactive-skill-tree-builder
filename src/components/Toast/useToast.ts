import { useContext } from 'react';
import { ToastContext } from './ToastContext';

// Custom hook for using toast
export const useToast = (): {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
} => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { showToast } = context;

  return {
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    info: (message: string) => showToast(message, 'info'),
  };
};
