import { X, AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Livvic:wght@300;400;700&display=swap');
    `}</style>

            <div className="fixed inset-0 z-50 flex items-center justify-center font-['Livvic']">
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onCancel}
                />

                {/* Dialog */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fadeIn">
                    {/* Botón cerrar */}
                    <button
                        onClick={onCancel}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    >
                        <X size={24} />
                    </button>

                    {/* Icono de alerta */}
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                            <AlertTriangle size={32} className="text-[#FFD60A]" strokeWidth={2.5} />
                        </div>
                    </div>

                    {/* Título */}
                    <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                        Confirmar Acción
                    </h3>

                    {/* Mensaje */}
                    <p className="text-center text-gray-600 mb-8 text-base">
                        {message}
                    </p>

                    {/* Botones */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-6 py-3 bg-[#FFD60A] text-black rounded-full font-semibold hover:bg-[#FFE347] transition text-sm shadow-md"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
        </>
    );
}