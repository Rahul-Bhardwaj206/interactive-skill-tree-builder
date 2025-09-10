import { createContext } from 'react';

// Types for our toast system
export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

// Create the context
export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
