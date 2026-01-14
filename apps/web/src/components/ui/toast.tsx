'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, type, title, message };
    
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => showToast('success', title, message), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast('error', title, message), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast('info', title, message), [showToast]);
  const warning = useCallback((title: string, message?: string) => showToast('warning', title, message), [showToast]);

  const getToastConfig = (type: ToastType) => {
    switch (type) {
      case 'success': 
        return { 
          bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', 
          iconColor: 'text-green-600', Icon: CheckCircle2 
        };
      case 'error': 
        return { 
          bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', 
          iconColor: 'text-red-600', Icon: AlertCircle 
        };
      case 'warning': 
        return { 
          bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', 
          iconColor: 'text-amber-600', Icon: AlertTriangle 
        };
      case 'info': 
      default:
        return { 
          bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', 
          iconColor: 'text-blue-600', Icon: Info 
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      
      {mounted && createPortal(
        <div className="fixed top-4 right-4 z-[99999] flex flex-col gap-3 max-w-md w-full pointer-events-none p-4 sm:p-0">
          {toasts.map((toast) => {
            const config = getToastConfig(toast.type);
            const Icon = config.Icon;

            return (
              <div
                key={toast.id}
                className={`
                  pointer-events-auto
                  ${config.bg} ${config.border} ${config.text}
                  border rounded-xl shadow-lg p-4 pr-10 relative 
                  animate-in slide-in-from-right-full fade-in duration-300
                `}
                role="alert"
              >
                <button
                  onClick={() => removeToast(toast.id)}
                  className="absolute top-3 right-3 p-1 hover:bg-black/5 rounded-lg transition-colors opacity-60 hover:opacity-100"
                  aria-label="Fechar notificação"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="flex items-start gap-3">
                  <div className={`${config.iconColor} shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-0.5 leading-tight">{toast.title}</h4>
                    {toast.message && (
                      <p className="text-sm opacity-90 font-light leading-relaxed">{toast.message}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}