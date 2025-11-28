import { useState, useEffect } from 'react';
import { X, Loader, BookOpen, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function GoogleClassroomModal({ challenge, onClose, onConfirm }) {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get(`${API_URL}/google-classroom/courses`);
            setCourses(response.data.data || []);
        } catch (err) {
            console.error('Error al cargar cursos:', err);
            setError('No se pudieron cargar los cursos de Google Classroom. Verifica tu conexión.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedCourse) {
            setError('Por favor selecciona un curso');
            return;
        }

        setSubmitting(true);
        try {
            await onConfirm(selectedCourse);
            onClose();
        } catch (err) {
            setError(err.message || 'Error al publicar en Google Classroom');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#34A853] to-[#0F9D58] px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Publicar en Google Classroom
                            </h2>
                            <p className="text-white/80 text-sm">
                                {challenge.name_challenge}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition"
                        disabled={submitting}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader className="w-8 h-8 animate-spin text-[#34A853] mb-4" />
                            <p className="text-gray-600">Cargando cursos...</p>
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">No se encontraron cursos</p>
                            <p className="text-sm text-gray-500">
                                Verifica que tengas cursos activos en Google Classroom
                            </p>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selecciona el curso donde publicar el reto:
                            </label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => {
                                    setSelectedCourse(e.target.value);
                                    setError('');
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34A853] focus:border-transparent"
                                disabled={submitting}
                            >
                                <option value="">Seleccionar curso...</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name} {course.section ? `- ${course.section}` : ''}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                El reto se publicará como material en el curso seleccionado
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 px-6 py-4 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || loading || courses.length === 0 || !selectedCourse}
                        className="flex-1 px-6 py-3 bg-[#34A853] text-white rounded-full font-medium hover:bg-[#0F9D58] transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting && <Loader className="w-4 h-4 animate-spin" />}
                        {submitting ? 'Publicando...' : 'Publicar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
