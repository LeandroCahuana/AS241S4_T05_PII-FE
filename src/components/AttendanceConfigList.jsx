import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AttendanceConfigList({ configs, onEdit, onDelete, onToggle, loading }) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-center text-gray-500">Cargando configuraciones...</p>
            </div>
        );
    }

    if (!configs || configs.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-center text-gray-500">
                    No hay configuraciones de horarios. Haz clic en el botón "HORARIO" para crear una.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 font-['Livvic']">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
                Configuraciones de Horarios
            </h3>
            
            <div className="space-y-3">
                {configs.map(config => (
                    <div 
                        key={config.id}
                        className={`border-2 rounded-xl p-4 transition-all ${
                            config.enabled === 'A' 
                                ? 'border-green-300 bg-green-50' 
                                : 'border-gray-300 bg-gray-50'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            {/* Información del aula */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-lg font-bold text-gray-800">
                                        {config.classroom_code}-{config.classroom_section}
                                    </h4>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        config.enabled === 'A'
                                            ? 'bg-green-200 text-green-800'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {config.enabled === 'A' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                                
                                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Fecha:</p>
                                        <p className="font-semibold text-gray-800">
                                            {(() => {
                                                // Corregir zona horaria: agregar 'T00:00:00' para evitar desfase
                                                const date = new Date(config.attendance_date + 'T00:00:00');
                                                return date.toLocaleDateString('es-PE', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                });
                                            })()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Horario:</p>
                                        <p className="font-semibold text-gray-800">
                                            {config.start_time} - {config.end_time}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-2 flex gap-4 text-xs">
                                    <div className="flex items-center gap-1">
                                        <span className="text-green-600">✓</span>
                                        <span className="text-gray-600">
                                            Presente: hasta {config.present_until}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-orange-600">⚠</span>
                                        <span className="text-gray-600">
                                            Tardanza: hasta {config.late_until}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Acciones */}
                            <div className="flex items-center gap-2 ml-4">
                                <button
                                    onClick={() => onToggle(config)}
                                    className={`p-2 rounded-lg transition-colors ${
                                        config.enabled === 'A'
                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                    title={config.enabled === 'A' ? 'Deshabilitar' : 'Habilitar'}
                                >
                                    {config.enabled === 'A' ? (
                                        <ToggleRight size={20} />
                                    ) : (
                                        <ToggleLeft size={20} />
                                    )}
                                </button>
                                
                                <button
                                    onClick={() => onEdit(config)}
                                    className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                    title="Editar"
                                >
                                    <Edit size={20} />
                                </button>
                                
                                <button
                                    onClick={() => onDelete(config)}
                                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
