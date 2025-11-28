import { useState, useEffect } from 'react';
import { attendanceApi } from '../shared/api/attendanceApi';
import { studentsApi } from '../shared/api/studentsApi';
import { attendanceConfigApi } from '../shared/api/attendanceConfigApi';

export default function StudentSelfRegister() {
    const [email, setEmail] = useState('');
    const [pc, setPc] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [student, setStudent] = useState(null);
    const [scheduleConfig, setScheduleConfig] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('enabled'); // Cambiar a 'enabled' por defecto
    const [attendanceStatus, setAttendanceStatus] = useState(null);

    // Verificar disponibilidad de registro para un aula específica
    const checkAttendanceAvailability = async (classroomCode, classroomSection) => {
        try {
            console.log('🔍 Verificando configuración para:', classroomCode, classroomSection);
            
            // Intentar obtener configuración
            const config = await attendanceConfigApi.getActiveConfig(classroomCode, classroomSection);
            
            console.log('📋 Configuración obtenida:', config);
            
            // Si NO hay configuración, bloquear el registro
            if (!config) {
                console.log('❌ NO hay configuración - Registro bloqueado');
                return { 
                    available: false, 
                    status: 'disabled',
                    message: 'No hay configuración de asistencia para tu aula. Contacta al administrador.',
                    config: null
                };
            }
            
            // Si hay configuración, DEBE respetarse obligatoriamente
            console.log('✅ HAY configuración - Aplicando restricciones de horario');
            
            // Si está deshabilitada
            if (config.enabled !== 'A') {
                return { 
                    available: false, 
                    status: 'disabled',
                    message: 'El registro está deshabilitado por el administrador',
                    config 
                };
            }
            
            // Verificar el estado actual basado en current_status del backend
            console.log('🕐 Estado actual del backend:', config.current_status);
            
            // Si el backend no proporciona current_status, calcularlo en el frontend
            let currentStatusUpper = config.current_status?.toUpperCase();
            
            if (!currentStatusUpper) {
                console.log('⚠️ Backend no devolvió current_status, calculando en frontend...');
                
                // Función para convertir hora "HH:MM" a minutos desde medianoche
                const timeToMinutes = (timeStr) => {
                    const [hours, minutes] = timeStr.split(':').map(Number);
                    return hours * 60 + minutes;
                };
                
                const now = new Date();
                const currentMinutes = now.getHours() * 60 + now.getMinutes();
                const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                
                const startMinutes = timeToMinutes(config.start_time);
                const presentUntilMinutes = timeToMinutes(config.present_until);
                const lateUntilMinutes = timeToMinutes(config.late_until);
                const endMinutes = timeToMinutes(config.end_time);
                
                console.log('🕐 Hora actual:', currentTime, `(${currentMinutes} minutos)`);
                console.log('📅 Horarios configurados:', {
                    start: `${config.start_time} (${startMinutes} min)`,
                    present_until: `${config.present_until} (${presentUntilMinutes} min)`,
                    late_until: `${config.late_until} (${lateUntilMinutes} min)`,
                    end: `${config.end_time} (${endMinutes} min)`
                });
                
                if (currentMinutes < startMinutes) {
                    currentStatusUpper = 'NOT_STARTED';
                } else if (currentMinutes <= presentUntilMinutes) {
                    currentStatusUpper = 'PRESENT';
                } else if (currentMinutes <= lateUntilMinutes) {
                    currentStatusUpper = 'LATE';
                } else if (currentMinutes <= endMinutes) {
                    currentStatusUpper = 'ENDED';
                } else {
                    currentStatusUpper = 'ENDED';
                }
                
                console.log('✅ Estado calculado:', currentStatusUpper);
            }
            
            switch (currentStatusUpper) {
                case 'NOT_STARTED':
                    return { 
                        available: false, 
                        status: 'not_started',
                        message: `El registro comienza a las ${config.start_time}`,
                        config 
                    };
                case 'ENDED':
                case 'ABSENT':
                    return { 
                        available: false, 
                        status: 'ended',
                        message: `El registro finalizó a las ${config.end_time}`,
                        config 
                    };
                case 'PRESENT':
                    return { 
                        available: true, 
                        status: 'enabled',
                        attendanceStatus: 'A', // Presente
                        statusText: 'PRESENTE',
                        config 
                    };
                case 'LATE':
                    return { 
                        available: true, 
                        status: 'enabled',
                        attendanceStatus: 'T', // Tardanza
                        statusText: 'TARDANZA',
                        config 
                    };
                default:
                    console.log('⚠️ Estado desconocido:', currentStatusUpper);
                    return { 
                        available: false, 
                        status: 'ended',
                        message: `Estado desconocido: ${currentStatusUpper}. Fuera del horario de registro.`,
                        config 
                    };
            }
            
        } catch (error) {
            console.error('❌ Error al verificar disponibilidad:', error);
            // En caso de error, bloquear el registro por seguridad
            return { 
                available: false, 
                status: 'disabled',
                message: 'Error al verificar la configuración. Intenta nuevamente.',
                config: null
            };
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setMessage({ type: 'error', text: 'Por favor ingresa tu correo institucional' });
            return;
        }

        // Validar que sea un correo institucional
        const emailDomain = email.toLowerCase().split('@')[1];
        if (emailDomain !== 'vallegrande.edu.pe') {
            setMessage({ 
                type: 'error', 
                text: 'Debes usar tu correo institucional (@vallegrande.edu.pe)' 
            });
            return;
        }

        try {
            setLoading(true);
            setMessage(null);
            
            // Buscar estudiante por email
            const students = await studentsApi.getAll();
            const foundStudent = students.find(s => 
                s.email?.toLowerCase() === email.toLowerCase() && s.status === 'A'
            );

            if (!foundStudent) {
                setMessage({ 
                    type: 'error', 
                    text: 'No se encontró un estudiante activo con ese correo' 
                });
                setStudent(null);
                return;
            }
            
            // Verificar disponibilidad de registro para su aula
            const availability = await checkAttendanceAvailability(
                foundStudent.classroom_code,
                foundStudent.classroom_section
            );
            
            if (!availability.available) {
                setMessage({ type: 'error', text: availability.message });
                setCurrentStatus(availability.status);
                setScheduleConfig(availability.config);
                setStudent(null);
                return;
            }
            
            // Todo OK, mostrar formulario
            setStudent(foundStudent);
            setAttendanceStatus(availability.attendanceStatus); // 'A' o 'T'
            setScheduleConfig(availability.config);
            setCurrentStatus('enabled');
            setMessage({ 
                type: 'success', 
                text: `Bienvenido/a ${foundStudent.name_student} ${foundStudent.lastname}` 
            });
            
        } catch (error) {
            console.error('Error al buscar estudiante:', error);
            setMessage({ type: 'error', text: 'Error al buscar estudiante' });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!pc) {
            setMessage({ type: 'error', text: 'Por favor selecciona el número de PC' });
            return;
        }

        try {
            setLoading(true);
            
            // Verificar disponibilidad en tiempo real antes de registrar
            const availability = await checkAttendanceAvailability(
                student.classroom_code,
                student.classroom_section
            );
            
            if (!availability.available) {
                setMessage({ 
                    type: 'error', 
                    text: availability.message 
                });
                setCurrentStatus(availability.status);
                setStudent(null);
                setEmail('');
                setPc('');
                return;
            }
            
            const statusText = availability.statusText; // 'PRESENTE' o 'TARDANZA'
            
            const attendanceData = {
                student_id: student.id,
                designated_pc: pc,
                status: availability.attendanceStatus, // 'A' o 'T'
                observation: 'Auto-registro'
            };

            await attendanceApi.create(attendanceData);
            
            setMessage({ 
                type: 'success', 
                text: `¡Asistencia registrada como ${statusText}!` 
            });
            
            // Limpiar formulario después de 3 segundos
            setTimeout(() => {
                setEmail('');
                setPc('');
                setStudent(null);
                setAttendanceStatus(null);
                setMessage(null);
            }, 3000);
            
        } catch (error) {
            console.error('Error al registrar asistencia:', error);
            setMessage({ 
                type: 'error', 
                text: 'Error al registrar asistencia. Es posible que ya estés registrado.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-6 font-['Livvic']">
            <div className="w-full max-w-md">
                {/* Logo y título */}
                <div className="text-center mb-8">
                    <div 
                        className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-white text-4xl shadow-2xl mx-auto mb-4"
                        style={{ backgroundColor: '#2563eb' }}
                    >
                        DO
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Registro de Asistencia
                    </h1>
                    <p className="text-blue-200">
                        Instituto Valle Grande de Cañete
                    </p>
                </div>

                {/* Indicador de estado */}
                {currentStatus !== 'enabled' ? (
                    // Mensaje cuando no está disponible
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">
                                {currentStatus === 'disabled' && '🔒'}
                                {currentStatus === 'not_started' && '⏰'}
                                {currentStatus === 'ended' && '🔒'}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Asistencia No Disponible
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {currentStatus === 'disabled' && 'El registro de asistencia está deshabilitado por el administrador.'}
                                {currentStatus === 'not_started' && 'El registro de asistencia aún no ha comenzado.'}
                                {currentStatus === 'ended' && 'El registro de asistencia ha finalizado.'}
                            </p>
                            {scheduleConfig && currentStatus !== 'disabled' && (
                                <div className="bg-blue-50 rounded-xl p-4 inline-block">
                                    <p className="text-sm font-semibold text-gray-700">Horario de registro:</p>
                                    <p className="text-lg font-bold text-blue-600">
                                        {scheduleConfig.start_time} - {scheduleConfig.end_time}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Banner de estado activo - solo si hay configuración */}
                        {currentStatus === 'enabled' && scheduleConfig && (
                            <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-3 mb-6 text-center">
                                <p className="text-green-800 font-bold flex items-center justify-center gap-2">
                                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                                    Registro de Asistencia Activo
                                </p>
                                <p className="text-green-600 text-sm mt-1">
                                    {attendanceStatus === 'A' && '⏰ Registrándose ahora: PRESENTE'}
                                    {attendanceStatus === 'T' && '⚠️ Registrándose ahora: TARDANZA'}
                                </p>
                            </div>
                        )}

                        {/* Card principal */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8">
                            {!student ? (
                        // Formulario de búsqueda
                        <form onSubmit={handleSearch} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Correo Institucional
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ejemplo@vallegrande.edu.pe"
                                    title="Debe ser un correo institucional (@vallegrande.edu.pe)"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={loading}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Usa tu correo institucional @vallegrande.edu.pe
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Buscando...' : 'Buscar'}
                            </button>
                        </form>
                    ) : (
                        // Formulario de registro
                        <div className="space-y-6">
                            {/* Información del estudiante */}
                            <div className="bg-blue-50 rounded-xl p-4">
                                <p className="text-sm text-gray-600 mb-1">Estudiante</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {student.name_student} {student.lastname}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {student.semester}° Semestre - Sección {student.classroom_section}
                                </p>
                            </div>

                            {/* Número de PC */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Número de PC
                                </label>
                                <select
                                    value={pc}
                                    onChange={(e) => setPc(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    disabled={loading}
                                >
                                    <option value="">Selecciona una PC</option>
                                    {Array.from({ length: 32 }, (_, i) => {
                                        const pcNumber = String(i + 1).padStart(2, '0');
                                        return (
                                            <option key={pcNumber} value={pcNumber}>
                                                PC-{pcNumber}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setStudent(null);
                                        setMessage(null);
                                    }}
                                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleRegister}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Registrando...' : 'Registrar Asistencia'}
                                </button>
                            </div>
                        </div>
                    )}

                            {/* Mensajes */}
                            {message && (
                                <div 
                                    className={`mt-6 p-4 rounded-xl ${
                                        message.type === 'success' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    <p className="text-sm font-semibold text-center">
                                        {message.text}
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-blue-200 text-sm">
                        Hackathon 2025 - Sistema de Control de Asistencia
                    </p>
                </div>
            </div>
        </div>
    );
}
