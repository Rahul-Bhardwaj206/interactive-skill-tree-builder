import React, { useState, useCallback } from 'react';
import { ToastContext, type Toast, type ToastType } from './ToastContext';
import './Toast.css';

// Toast provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Function to add a toast
  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString(); // Simple ID generation using timestamp
    const newToast = { id, message, type };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            role="alert"
            aria-live="assertive"
          >
            <div className="toast-message">{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};