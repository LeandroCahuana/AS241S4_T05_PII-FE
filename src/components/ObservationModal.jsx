export default function ObservationModal({ 
    show, 
    attendance, 
    observationText, 
    onObservationChange, 
    onSave, 
    onClose 
}) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 font-['Livvic']">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Observación</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {attendance && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                            <span className="font-semibold">Estudiante:</span> {attendance.student?.lastname}, {attendance.student?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Fecha:</span> {attendance.date} - {attendance.time}
                        </p>
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Observación
                    </label>
                    <textarea
                        value={observationText}
                        onChange={(e) => onObservationChange(e.target.value)}
                        placeholder="Escribe una observación..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows="4"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 px-4 py-2.5 text-white rounded-xl font-semibold transition-colors"
                        style={{ backgroundColor: '#3C6C99' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5273'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3C6C99'}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
