import { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Animar la barra de progreso
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1; // 100 / 100 = 1 para completar en 10 segundos
            });
        }, 100);

        // Terminar después de 10 segundos
        const timeout = setTimeout(() => {
            onFinish();
        }, 10000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [onFinish]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#003566' }}>
            <div className="text-center space-y-8 px-8">
                {/* Título */}
                <div className="space-y-4 animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                        Sistematización de la Hackathon
                    </h1>
                    <p className="text-2xl text-white/80">
                        Instituto Valle Grande de Cañete
                    </p>
                </div>

                {/* Barra de progreso */}
                <div className="w-full max-w-md mx-auto space-y-3 animate-fade-in-delay">
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                        <div 
                            className="h-full bg-white rounded-full transition-all duration-300 ease-out shadow-lg"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="h-full w-full bg-white/30 animate-shimmer"></div>
                        </div>
                    </div>
                    <p className="text-white/80 text-sm font-medium">
                        Cargando sistema... {Math.round(progress)}%
                    </p>
                </div>

                {/* Puntos de carga */}
                <div className="flex justify-center gap-2 animate-fade-in-delay-2">
                    <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
                
                .animate-fade-in-delay {
                    opacity: 0;
                    animation: fade-in 1s ease-out 0.5s forwards;
                }
                
                .animate-fade-in-delay-2 {
                    opacity: 0;
                    animation: fade-in 1s ease-out 1s forwards;
                }
                
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
}
