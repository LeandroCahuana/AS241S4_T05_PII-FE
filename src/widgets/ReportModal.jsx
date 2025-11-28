import { X, FileText, FileDown, Send } from 'lucide-react';

export default function ReportModal({ challenge, onClose, onGeneratePDF, onGenerateGoogleDoc, onSendToClassroom }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#003566] to-[#0466C8] px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <FileText size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Opciones de Reto
                            </h2>
                            <p className="text-white/80 text-sm">
                                {challenge.name_challenge}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600 mb-6 text-sm">
                        Selecciona una opción:
                    </p>

                    <div className="space-y-3">
                        {/* Opción Enviar a Google Classroom */}
                        <button
                            onClick={() => {
                                onSendToClassroom();
                                onClose();
                            }}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#34A853] hover:bg-green-50 transition flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                                <Send size={24} className="text-green-600" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-semibold text-gray-900">Enviar a Google Classroom</h3>
                                <p className="text-sm text-gray-500">Publica el reto en tu clase de Google Classroom</p>
                            </div>
                        </button>

                        {/* Opción PDF */}
                        <button
                            onClick={() => {
                                onGeneratePDF();
                                onClose();
                            }}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#0466C8] hover:bg-blue-50 transition flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition">
                                <FileDown size={24} className="text-red-600" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-semibold text-gray-900">Descargar PDF</h3>
                                <p className="text-sm text-gray-500">Genera y descarga un archivo PDF</p>
                            </div>
                        </button>

                        {/* Opción Google Doc */}
                        <button
                            onClick={() => {
                                onGenerateGoogleDoc();
                                onClose();
                            }}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#0466C8] hover:bg-blue-50 transition flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                                <FileText size={24} className="text-blue-600" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-semibold text-gray-900">Crear Google Doc</h3>
                                <p className="text-sm text-gray-500">Crea un documento en Google Drive</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
