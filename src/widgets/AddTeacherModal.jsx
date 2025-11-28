import { useState, useEffect } from 'react';
import { X, UserPlus, Search, Loader } from 'lucide-react';
import { teachingApi } from '../shared/api/TeachingApi';
import { challengesApi } from '../shared/api/ChallengesApi';

export default function AddTeacherModal({ challenge, onClose, onSuccess }) {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadTeachers();
    }, []);

    const loadTeachers = async () => {
        setLoading(true);
        try {
            const data = await teachingApi.getActive();
            setTeachers(data);
        } catch (error) {
            console.error('Error al cargar docentes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTeachers = teachers.filter(teacher => {
        const searchLower = searchTerm.toLowerCase();
        return (
            teacher.name_teaching?.toLowerCase().includes(searchLower) ||
            teacher.lastname?.toLowerCase().includes(searchLower) ||
            teacher.email?.toLowerCase().includes(searchLower)
        );
    });

    const handleSubmit = async () => {
        if (!selectedTeacherId) return;

        setSubmitting(true);
        try {
            await challengesApi.createDetail(challenge.id, {
                teaching_id: selectedTeacherId,
                status: 'A'
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al agregar docente:', error);
            alert(`Error al agregar el docente responsable: ${error.message || 'Error desconocido'}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#003566] to-[#0466C8] px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <UserPlus size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                Agregar Docente Responsable
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

                {/* Search Bar */}
                <div className="p-6 border-b">
                    {!loading && teachers.length > 0 && (
                        <p className="text-sm text-gray-600 mb-3">
                            {teachers.length} docente{teachers.length !== 1 ? 's' : ''} disponible{teachers.length !== 1 ? 's' : ''}
                        </p>
                    )}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, apellido o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0466C8]"
                        />
                    </div>
                </div>

                {/* Teachers List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader className="w-8 h-8 animate-spin text-[#0466C8]" />
                            <p className="text-gray-500 ml-3">Cargando docentes...</p>
                        </div>
                    ) : teachers.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-2">No hay docentes activos disponibles</p>
                            <p className="text-sm text-gray-400">Total cargados: {teachers.length}</p>
                        </div>
                    ) : filteredTeachers.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-2">No se encontraron docentes con ese criterio</p>
                            <p className="text-sm text-gray-400">Total disponibles: {teachers.length}</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredTeachers.map((teacher) => (
                                <div
                                    key={teacher.id}
                                    onClick={() => setSelectedTeacherId(teacher.id)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                                        selectedTeacherId === teacher.id
                                            ? 'border-[#0466C8] bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                                            selectedTeacherId === teacher.id
                                                ? 'bg-[#0466C8]'
                                                : 'bg-gray-400'
                                        }`}>
                                            {teacher.name_teaching?.charAt(0)}{teacher.lastname?.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">
                                                {teacher.name_teaching} {teacher.lastname}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {teacher.email}
                                            </p>
                                        </div>
                                        {selectedTeacherId === teacher.id && (
                                            <div className="w-6 h-6 bg-[#0466C8] rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 px-6 py-4 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedTeacherId || submitting}
                        className="flex-1 px-6 py-3 bg-[#0466C8] text-white rounded-full font-medium hover:bg-[#003566] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting && <Loader className="w-4 h-4 animate-spin" />}
                        {submitting ? 'Agregando...' : 'Agregar Docente'}
                    </button>
                </div>
            </div>
        </div>
    );
}
