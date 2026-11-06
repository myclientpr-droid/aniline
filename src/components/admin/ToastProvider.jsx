'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
    return ctx;
}

export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const remove = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback(
        (toast) => {
            const id = Math.random().toString(36).slice(2);
            setToasts((prev) => [...prev, { id, ...toast }]);
            const timeout = toast.duration ?? 4000;
            setTimeout(() => remove(id), timeout);
            return id;
        },
        [remove]
    );

    const success = useCallback((msg) => push({ type: 'success', message: msg }), [push]);
    const error = useCallback((msg) => push({ type: 'error', message: msg }), [push]);

    return (
        <ToastContext.Provider value={{ success, error }}>
            {children}
            <div
                aria-live="polite"
                aria-atomic="true"
                className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role={t.type === 'error' ? 'alert' : 'status'}
                        className={`flex items-start gap-3 rounded-md shadow-lg px-4 py-3 text-sm ${t.type === 'error'
                            ? 'bg-red-600 text-white'
                            : 'bg-navy-dark text-white'
                            }`}
                    >
                        {t.type === 'error' ? (
                            <AlertCircle className="h-4 w-4 mt-0.5 flex-none" aria-hidden="true" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-none text-orange" aria-hidden="true" />
                        )}
                        <p className="flex-1">{t.message}</p>
                        <button
                            type="button"
                            onClick={() => remove(t.id)}
                            aria-label="Dismiss"
                            className="p-1 rounded hover:bg-white/10"
                        >
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}