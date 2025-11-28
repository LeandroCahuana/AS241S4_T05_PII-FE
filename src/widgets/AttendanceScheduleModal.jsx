import { X, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { classroomApi } from '../shared/api/ClassroomApi';

export default function AttendanceScheduleModal({ show, onClose, onSave, currentConfig }) {
    const [config, setConfig] = useState({
        classroom_code: '',
        classroom_section: '',
        attendance_date: new Date().toISOString().split('T')[0],
        enabled: 'A',
        start_time: '08:00',
        present_until: '08:10',
        late_until: '08:20',
        end_time: '08:30'
    });
    
    const [classrooms, setClassrooms] = useState([]);
    const [availableCodes, setAvailableCodes] = useState([]);
    const [availableSections, setAvailableSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState('');

    // Cargar aulas desde la API
    useEffect(() => {
        if (show) {
            loadClassrooms();
        }
    }, [show]);

    const loadClassrooms = async () => {
        try {
            setLoading(true);
            setValidationError('');
            
            // Cargar aulas activas directamente desde la tabla classroom
            const classrooms = await classroomApi.getActive();
            
            // DEBUG: Ver qué aulas se cargaron
            console.log('🏫 Aulas activas cargadas:', classrooms);
            
            // Ordenar alfabéticamente
            classrooms.sort((a, b) => {
                const codeCompare = a.code.localeCompare(b.code);
                if (codeCompare !== 0) return codeCompare;
                return a.section.localeCompare(b.section);
            });
            
            setClassrooms(classrooms);
            
            // Extraer códigos únicos
            const codes = [...new Set(classrooms.map(c => c.code))].sort();
            setAvailableCodes(codes);
            
        } catch (error) {
            console.error('Error al cargar aulas:', error);
            setValidationError('Error al cargar las aulas. Verifica que el backend esté funcionando.');
        } finally {
            setLoading(false);
        }
    };

    // Actualizar secciones disponibles cuando cambia el código
    useEffect(() => {
        if (config.classroom_code) {
            const sections = classrooms
                .filter(c => c.code === config.classroom_code)
                .map(c => c.section)
                .sort();
            setAvailableSections(sections);
            
            // Si la sección actual no está disponible, limpiarla
            if (!sections.includes(config.classroom_section)) {
                setConfig(prev => ({ ...prev, classroom_section: '' }));
            }
        } else {
            setAvailableSections([]);
        }
    }, [config.classroom_code, classrooms]);

    useEffect(() => {
        if (currentConfig) {
            setConfig({
                classroom_code: currentConfig.classroom_code || '',
                classroom_section: currentConfig.classroom_section || '',
                attendance_date: currentConfig.attendance_date || new Date().toISOString().split('T')[0],
                enabled: currentConfig.enabled || 'A',
                start_time: currentConfig.start_time || '08:00',
                present_until: currentConfig.present_until || '08:10',
                late_until: currentConfig.late_until || '08:20',
                end_time: currentConfig.end_time || '08:30'
            });
        }
    }, [currentConfig]);

    const handleSave = () => {
        // Limpiar error previo
        setValidationError('');

        // Validar campos requeridos
        if (!config.classroom_code) {
            setValidationError('Debes seleccionar el código del aula');
            return;
        }
        if (!config.classroom_section) {
            setValidationError('Debes seleccionar la sección del aula');
            return;
        }
        if (!config.attendance_date) {
            setValidationError('Debes seleccionar una fecha');
            return;
        }
        
        // Validar formato de hora (HH:MM)
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(config.start_time)) {
            setValidationError('Hora de inicio inválida. Formato: HH:MM (ej: 08:00)');
            return;
        }
        if (!timeRegex.test(config.present_until)) {
            setValidationError('Límite para presente inválido. Formato: HH:MM (ej: 08:10)');
            return;
        }
        if (!timeRegex.test(config.late_until)) {
            setValidationError('Límite para tardanza inválido. Formato: HH:MM (ej: 08:20)');
            return;
        }
        if (!timeRegex.test(config.end_time)) {
            setValidationError('Hora de fin inválida. Formato: HH:MM (ej: 08:30)');
            return;
        }
        
        // Validar que los horarios sean coherentes
        if (config.start_time >= config.present_until) {
            setValidationError('La hora de inicio debe ser menor que el límite de presente');
            return;
        }
        if (config.present_until >= config.late_until) {
            setValidationError('El límite de presente debe ser menor que el límite de tardanza');
            return;
        }
        if (config.late_until >= config.end_time) {
            setValidationError('El límite de tardanza debe ser menor que la hora de fin');
            return;
        }

        onSave(config);
        onClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-['Livvic']">
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
            
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[700px] max-h-[90vh] overflow-y-auto animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X size={20} />
                </button>
                
                <div className="flex items-center gap-3 mb-6">
                    <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#3C6C99' }}
                    >
                        <Clock size={24} className="text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Configurar Horarios de Asistencia</h3>
                </div>

                {/* Mensaje de error de validación */}
                {validationError && (
                    <div className="mb-4 p-3 bg-red-100 border-2 border-red-300 rounded-xl animate-shake">
                        <p className="text-red-800 text-sm font-semibold text-center">
                            ⚠️ {validationError}
                        </p>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Información del Aula */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-xl">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Código de Aula *
                            </label>
                            <select
                                value={config.classroom_code}
                                onChange={(e) => setConfig({ ...config, classroom_code: e.target.value })}
                                disabled={loading}
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100"
                            >
                                <option value="">Seleccionar aula</option>
                                {availableCodes.map(code => (
                                    <option key={code} value={code}>
                                        {code}
                                    </option>
                                ))}
                            </select>
                            {loading && (
                                <p className="text-xs text-gray-500 mt-1">Cargando aulas...</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Sección *
                            </label>
                            <select
                                value={config.classroom_section}
                                onChange={(e) => setConfig({ ...config, classroom_section: e.target.value })}
                                disabled={!config.classroom_code || loading}
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100"
                            >
                                <option value="">Seleccionar sección</option>
                                {availableSections.map(section => (
                                    <option key={section} value={section}>
                                        {section}
                                    </option>
                                ))}
                            </select>
                            {!config.classroom_code && (
                                <p className="text-xs text-gray-500 mt-1">Primero selecciona un aula</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fecha *
                            </label>
                            <input
                                type="date"
                                value={config.attendance_date}
                                onChange={(e) => setConfig({ ...config, attendance_date: e.target.value })}
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Habilitar/Deshabilitar */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <p className="font-semibold text-gray-800">Estado del Registro</p>
                            <p className="text-sm text-gray-600">
                                {config.enabled === 'A' ? 'Registro habilitado' : 'Registro deshabilitado'}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={config.enabled === 'A'}
                                onChange={(e) => setConfig({ ...config, enabled: e.target.checked ? 'A' : 'I' })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                    </div>

                    {/* Grid de 2 columnas para los horarios */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Hora de inicio */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🕐 Hora de Inicio
                            </label>
                            <input
                                type="text"
                                value={config.start_time}
                                onChange={(e) => setConfig({ ...config, start_time: e.target.value })}
                                placeholder="08:00"
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Formato: HH:MM (ej: 08:00)
                            </p>
                        </div>

                        {/* Límite para presente */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                ✅ Límite para Presente
                            </label>
                            <input
                                type="text"
                                value={config.present_until}
                                onChange={(e) => setConfig({ ...config, present_until: e.target.value })}
                                placeholder="08:10"
                                className="w-full px-4 py-2 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Hasta esta hora: PRESENTE
                            </p>
                        </div>

                        {/* Límite para tardanza */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                ⚠️ Límite para Tardanza
                            </label>
                            <input
                                type="text"
                                value={config.late_until}
                                onChange={(e) => setConfig({ ...config, late_until: e.target.value })}
                                placeholder="08:20"
                                className="w-full px-4 py-2 border-2 border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Hasta esta hora: TARDANZA
                            </p>
                        </div>

                        {/* Hora de fin */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🔒 Hora de Fin
                            </label>
                            <input
                                type="text"
                                value={config.end_time}
                                onChange={(e) => setConfig({ ...config, end_time: e.target.value })}
                                placeholder="08:30"
                                className="w-full px-4 py-2 border-2 border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Después: NO PERMITIDO
                            </p>
                        </div>
                    </div>

                    {/* Resumen visual */}
                    <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-800 mb-2">
                            Resumen para: {config.classroom_code}-{config.classroom_section} ({config.attendance_date})
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-green-700">
                                <span className="text-2xl">✓</span>
                                <p className="font-semibold mt-1">PRESENTE</p>
                                <p className="text-xs">{config.start_time} - {config.present_until}</p>
                            </div>
                            <div className="text-orange-700">
                                <span className="text-2xl">⚠</span>
                                <p className="font-semibold mt-1">TARDANZA</p>
                                <p className="text-xs">{config.present_until} - {config.late_until}</p>
                            </div>
                            <div className="text-red-700">
                                <span className="text-2xl">✗</span>
                                <p className="font-semibold mt-1">NO PERMITIDO</p>
                                <p className="text-xs">Después de {config.late_until}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2.5 text-white rounded-xl font-semibold transition-colors"
                        style={{ backgroundColor: '#3C6C99' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5273'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3C6C99'}
                    >
                        Guardar Configuración
                    </button>
                </div>
            </div>
        </div>
    );
}
