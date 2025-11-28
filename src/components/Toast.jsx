import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        warning: <AlertCircle className="w-5 h-5" />,
        info: <AlertCircle className="w-5 h-5" />
    };

    const styles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-orange-500 text-white',
        info: 'bg-blue-500 text-white'
    };

    return (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
            <div className={`${styles[type]} rounded-xl shadow-2xl px-6 py-4 flex items-center gap-3 min-w-[300px] max-w-md`}>
                <div className="flex-shrink-0">
                    {icons[type]}
                </div>
                <p className="flex-1 text-sm font-medium">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
