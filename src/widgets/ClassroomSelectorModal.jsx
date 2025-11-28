import { useState, useEffect } from 'react';
import { X, BookOpen, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { googleClassroomApi } from '../shared/api/GoogleClassroomApi';

export default function ClassroomSelectorModal({ challenge, onClose, onSuccess }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [publishing, setPublishing] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await googleClassroomApi.getCourses();
            setCourses(data);
            
            // Si el reto ya tiene un google_classroom_id, pre-seleccionarlo
            if (challenge.google_classroom_id) {
                const matchingCourse = data.find(c => c.id === challenge.google_classroom_id);
                if (matchingCourse) {
                    setSelectedCourse(matchingCourse);
                }
            }
        } catch (err) {
            console.error('Error al cargar cursos:', err);
            setError(err.message || 'Error al cargar los cursos de Google Classroom');
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        if (!selectedCourse) {
            setError('Por favor selecciona un curso');
            return;
        }

        try {
            setPublishing(true);
            setError(null);
            await onSuccess(selectedCourse);
        } catch (err) {
            console.error('Error al publicar:', err);
            setError(err.message || 'Error al publicar en Google Classroom');
            setPublishing(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            await googleClassroomApi.logout();
            // Recargar la página para forzar nueva autenticación
            window.location.reload();
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
            setError('Error al cerrar sesión. Intenta de nuevo.');
            setLoading(false);
        }
    };

    // Verificar si el curso coincide con el classroom del reto
    const isCourseMatching = (course) => {
        const retoSection = `${challenge.classroom_code}-${challenge.classroom_section}`;
        const courseSection = course.section || '';
        const courseName = course.name || '';
        
        // Buscar coincidencia en el nombre o sección del curso
        return courseName.includes(challenge.classroom_code) || 
               courseSection.includes(challenge.classroom_section) ||
               courseName.includes(retoSection);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#34A853] to-[#0F9D58] px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Seleccionar Google Classroom
                            </h2>
                            <p className="text-white/80 text-sm">
                                {challenge.name_challenge}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition"
                        disabled={publishing}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Info del reto */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <p className="text-sm text-blue-800">
                                    <strong>Clase del reto:</strong> {challenge.classroom_code}-{challenge.classroom_section}
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Los cursos que coincidan con esta clase aparecerán destacados
                                </p>
                            </div>
                            {!loading && courses.length > 0 && (
                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className="ml-4 text-xs text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
                                    disabled={publishing}
                                >
                                    Cambiar cuenta
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Confirmación de logout */}
                    {showLogoutConfirm && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-yellow-800 mb-3">
                                ¿Estás seguro de que quieres cambiar de cuenta? Tendrás que volver a autenticarte.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition"
                                >
                                    Sí, cambiar cuenta
                                </button>
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                            <p className="text-gray-600">Cargando cursos de Google Classroom...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-800 font-medium">Error</p>
                                <p className="text-red-600 text-sm mt-1">{error}</p>
                                <button
                                    onClick={loadCourses}
                                    className="mt-3 text-sm text-red-700 underline hover:text-red-800"
                                >
                                    Intentar de nuevo
                                </button>
                            </div>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">No se encontraron cursos en Google Classroom</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Asegúrate de tener cursos activos en tu cuenta de Google Classroom
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600 mb-4">
                                Selecciona el curso donde deseas publicar este reto:
                            </p>
                            
                            {courses.map((course) => {
                                const isMatching = isCourseMatching(course);
                                const isSelected = selectedCourse?.id === course.id;
                                const isAlreadyPublished = challenge.google_classroom_id === course.id && challenge.google_coursework_id;
                                
                                return (
                                    <button
                                        key={course.id}
                                        onClick={() => !isAlreadyPublished && setSelectedCourse(course)}
                                        disabled={isAlreadyPublished}
                                        className={`w-full p-4 border-2 rounded-xl transition flex items-center gap-4 text-left ${
                                            isAlreadyPublished
                                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                                : isSelected
                                                ? 'border-green-500 bg-green-50'
                                                : isMatching
                                                ? 'border-blue-300 bg-blue-50 hover:border-blue-400'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                            isAlreadyPublished
                                                ? 'bg-gray-200'
                                                : isSelected
                                                ? 'bg-green-500'
                                                : isMatching
                                                ? 'bg-blue-500'
                                                : 'bg-gray-300'
                                        }`}>
                                            {isAlreadyPublished ? (
                                                <CheckCircle size={24} className="text-gray-500" />
                                            ) : isSelected ? (
                                                <CheckCircle size={24} className="text-white" />
                                            ) : (
                                                <BookOpen size={24} className="text-white" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {course.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">
                                                {course.section ? `Sección: ${course.section}` : 'Sin sección'}
                                            </p>
                                            {isMatching && !isAlreadyPublished && (
                                                <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                    Coincide con el reto
                                                </span>
                                            )}
                                            {isAlreadyPublished && (
                                                <span className="inline-block mt-1 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                                    Ya publicado aquí
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 px-6 py-4 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={publishing}
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={!selectedCourse || publishing}
                        className="flex-1 px-6 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {publishing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Publicando...
                            </>
                        ) : (
                            'Publicar en Classroom'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
