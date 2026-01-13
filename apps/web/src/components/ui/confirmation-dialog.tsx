'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, XCircle, Timer, Loader2 } from 'lucide-react';

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
    countdown?: number; 
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

    useEffect(() => {
        if (isOpen) {
            setTimeLeft(countdown);
            setIsButtonEnabled(countdown === 0);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, countdown]);

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
            
            {/* Overlay com Blur */}
            <div 
                className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={isLoading ? undefined : onClose} 
            />
            
            {/* Modal Container */}
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-stone-100">
                
                <div className="p-6 flex gap-5">
                    {/* Ícone Lateral */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        variant === 'danger' 
                            ? 'bg-red-50 text-red-500' 
                            : 'bg-clay-50 text-clay-600'
                    }`}>
                        <AlertTriangle className="w-6 h-6" strokeWidth={1.5} />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-espresso-900 leading-6">
                            {title}
                        </h3>
                        <p className="mt-2 text-sm text-stone-500 leading-relaxed font-light">
                            {description}
                        </p>

                        {/* Erro Visual */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-50/50 border border-red-100 rounded-lg flex items-start gap-2 animate-in slide-in-from-top-2">
                                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-red-600 font-medium">{error}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="bg-stone-50/50 px-6 py-4 flex items-center justify-end gap-3 border-t border-stone-100">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-stone-500 hover:text-espresso-800 hover:bg-white border border-transparent hover:border-stone-200 rounded-lg transition-all disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    
                    <button
                        onClick={onConfirm}
                        disabled={isLoading || !isButtonEnabled}
                        className={`px-6 py-2 text-sm font-medium text-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2
                            ${variant === 'danger' 
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-200 disabled:bg-red-300' 
                                : 'bg-espresso-800 hover:bg-espresso-900 shadow-stone-200 disabled:bg-stone-300'
                            }
                            ${(isLoading || !isButtonEnabled) ? 'cursor-not-allowed transform-none shadow-none' : ''}
                        `}
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
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