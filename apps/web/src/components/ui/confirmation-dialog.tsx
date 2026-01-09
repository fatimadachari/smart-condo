'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, XCircle, Timer } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
  error?: string | null;
  countdown?: number; // Tempo em segundos para habilitar o botão
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary',
  isLoading = false,
  error = null,
  countdown = 0,
}: ConfirmationDialogProps) {
  const [mounted, setMounted] = useState(false);
  
  // Lógica do Timer
  const [timeLeft, setTimeLeft] = useState(countdown);
  const [isButtonEnabled, setIsButtonEnabled] = useState(countdown === 0);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reinicia o timer toda vez que o modal abre
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(countdown);
      setIsButtonEnabled(countdown === 0);
      document.body.style.overflow = 'hidden'; // Trava scroll
    } else {
      document.body.style.overflow = 'unset'; // Destrava scroll
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, countdown]);

  // Contagem regressiva
  useEffect(() => {
    if (!isOpen || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsButtonEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      
      {/* Overlay Escuro */}
      <div 
        className="absolute inset-0 bg-gunmetal-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={isLoading ? undefined : onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 flex gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
            variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-terracotta-100 text-terracotta-600'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-gunmetal-600 leading-6">
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              {description}
            </p>

            {/* Erro Visual (Opcional) */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-600 font-medium">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            // Botão fica desabilitado se estiver carregando OU se o timer não zerou
            disabled={isLoading || !isButtonEnabled}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-all flex items-center gap-2
              ${variant === 'danger' 
                ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-300' 
                : 'bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-terracotta-300'
              }
              ${(isLoading || !isButtonEnabled) ? 'cursor-not-allowed' : ''}
            `}
          >
            {/* Ícone de Timer pulsando se estiver contando */}
            {!isButtonEnabled && timeLeft > 0 && <Timer className="w-4 h-4 animate-pulse" />}
            
            {isLoading 
              ? 'Processando...' 
              : !isButtonEnabled && timeLeft > 0 
                ? `Aguarde ${timeLeft}s` 
                : confirmText
            }
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}