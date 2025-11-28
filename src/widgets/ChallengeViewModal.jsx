import { useState } from 'react';
import { X, Package, FileText, Target, AlertCircle, Wrench, CheckSquare, Shield, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';
import { challengesApi } from '../shared/api/ChallengesApi';
import ConfirmDialog from './ConfirmDialog';

export default function ChallengeViewModal({ challenge, onClose, onUpdate }) {
    const [localChallenge, setLocalChallenge] = useState(challenge);
    const [togglingDetail, setTogglingDetail] = useState(null);
    const [togglingChallenge, setTogglingChallenge] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(null);

    if (!localChallenge) return null;

    const isCaso = localChallenge.case && localChallenge.case.trim() !== '';

    const handleToggleChallenge = () => {
        const confirmMessage = localChallenge.status === 'A' 
            ? '¿Estás seguro de desactivar este reto?' 
            : '¿Estás seguro de activar este reto?';
        
        setConfirmDialog({
            message: confirmMessage,
            onConfirm: async () => {
                setTogglingChallenge(true);
                try {
                    const newStatus = localChallenge.status === 'A' ? 'I' : 'A';
                    
                    if (newStatus === 'I') {
                        const result = await challengesApi.deleteLogical(localChallenge.id);
                        console.log('Reto desactivado:', result);
                    } else {
                        const result = await challengesApi.restore(localChallenge.id);
                        console.log('Reto activado:', result);
                    }
                    
                    // Actualizar el estado local
                    setLocalChallenge({ ...localChallenge, status: newStatus });
                    
                    if (onUpdate) onUpdate();
                } catch (error) {
                    console.error('Error al cambiar estado del reto:', error);
                    alert(`Error al cambiar el estado del reto: ${error.message}`);
                } finally {
                    setTogglingChallenge(false);
                    setConfirmDialog(null);
                }
            }
        });
    };

    const handleToggleDetail = async (detail) => {
        setTogglingDetail(detail.id);
        try {
            const newStatus = detail.status === 'A' ? 'I' : 'A';
            
            if (newStatus === 'I') {
                await challengesApi.deleteDetailLogical(detail.id);
            } else {
                await challengesApi.restoreDetail(detail.id);
            }
            
            // Actualizar el estado local
            const updatedDetails = localChallenge.details.map(d =>
                d.id === detail.id ? { ...d, status: newStatus } : d
            );
            setLocalChallenge({ ...localChallenge, details: updatedDetails });
            
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error al cambiar estado del docente:', error);
            alert('Error al cambiar el estado del docente');
        } finally {
            setTogglingDetail(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-linear-to-r from-[#003566] to-[#0466C8] px-8 py-6 flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCaso ? 'bg-purple-500' : 'bg-green-500'
                                }`}>
                                {isCaso ? <Package size={20} className="text-white" /> : <FileText size={20} className="text-white" />}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCaso
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                {isCaso ? 'CASO' : 'CRITERIO'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${localChallenge.status === 'A'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                {localChallenge.status === 'A' ? 'ACTIVO' : 'INACTIVO'}
                            </span>
                            <button
                                onClick={handleToggleChallenge}
                                disabled={togglingChallenge}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                                    localChallenge.status === 'A'
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                } disabled:opacity-50`}
                                title={localChallenge.status === 'A' ? 'Desactivar reto' : 'Activar reto'}
                            >
                                {localChallenge.status === 'A' ? (
                                    <>
                                        <ToggleRight size={16} />
                                        Desactivar
                                    </>
                                ) : (
                                    <>
                                        <ToggleLeft size={16} />
                                        Activar
                                    </>
                                )}
                            </button>
                        </div>
                        <h2 className={`text-2xl font-bold mb-2 ${localChallenge.status === 'A' ? 'text-white' : 'text-white/50'}`}>
                            {localChallenge.name_challenge}
                        </h2>
                        <div className="flex items-center gap-4 text-white/80 text-sm">
                            <span className="flex items-center gap-1">
                                <span className="font-semibold">Aula:</span> {localChallenge.classroom_code}-{localChallenge.classroom_section}
                            </span>
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
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="space-y-6">
                        {/* Descripción */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                            <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                <FileText size={16} />
                                DESCRIPCIÓN
                            </h3>
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                {localChallenge.description || 'No especificado'}
                            </p>
                        </div>

                        {/* Objetivo - Solo para CASOS */}
                        {isCaso && localChallenge.objective && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                                <h3 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                                    <Target size={16} />
                                    OBJETIVO
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                    {localChallenge.objective}
                                </p>
                            </div>
                        )}

                        {/* Caso - Solo para CASOS */}
                        {isCaso && localChallenge.case && (
                            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                                <h3 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                    <Package size={16} />
                                    CASO
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                    {localChallenge.case}
                                </p>
                            </div>
                        )}

                        {/* Grid de 2 columnas para otros campos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Desafíos */}
                            {localChallenge.challenges && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                    <h3 className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-2">
                                        <AlertCircle size={16} />
                                        DESAFÍOS
                                    </h3>
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        {localChallenge.challenges}
                                    </p>
                                </div>
                            )}

                            {/* Herramientas */}
                            {localChallenge.tools && (
                                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                                    <h3 className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                                        <Wrench size={16} />
                                        HERRAMIENTAS
                                    </h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {localChallenge.tools}
                                    </p>
                                </div>
                            )}

                            {/* Tareas Específicas */}
                            {localChallenge.specific_tasks && (
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                                    <h3 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
                                        <CheckSquare size={16} />
                                        TAREAS ESPECÍFICAS
                                    </h3>
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        {localChallenge.specific_tasks}
                                    </p>
                                </div>
                            )}

                            {/* Estándares */}
                            {localChallenge.standards && (
                                <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-r-lg">
                                    <h3 className="text-sm font-semibold text-cyan-900 mb-2 flex items-center gap-2">
                                        <Shield size={16} />
                                        ESTÁNDARES
                                    </h3>
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        {localChallenge.standards}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Restricciones - Full width */}
                        {localChallenge.restrictions && (
                            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                                <h3 className="text-sm font-semibold text-orange-900 mb-2 flex items-center gap-2">
                                    <AlertTriangle size={16} />
                                    RESTRICCIONES
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                    {localChallenge.restrictions}
                                </p>
                            </div>
                        )}

                        {/* Docentes Responsables (si existen) */}
                        {localChallenge.details && localChallenge.details.length > 0 && (
                            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <FileText size={16} />
                                    DOCENTES RESPONSABLES ({localChallenge.details.length})
                                </h3>
                                <div className="space-y-2">
                                    {localChallenge.details.map((detail, index) => {
                                        // El backend puede devolver el teaching de diferentes formas
                                        const teaching = detail.teaching || detail.Teaching;
                                        const teachingName = teaching?.name || teaching?.first_name || '';
                                        const teachingLastName = teaching?.last_name || teaching?.lastName || '';
                                        
                                        return (
                                            <div
                                                key={detail.id}
                                                className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                                                        {index + 1}
                                                    </span>
                                                    <div className="flex-1">
                                                        <p className={`text-sm font-medium ${detail.status === 'A' ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                                                            {teachingName && teachingLastName 
                                                                ? `${teachingName} ${teachingLastName}`
                                                                : teaching
                                                                ? JSON.stringify(teaching)
                                                                : `Teaching ID: ${detail.teaching_id}`
                                                            }
                                                        </p>
                                                        {teaching?.email && (
                                                            <p className="text-xs text-gray-500">{teaching.email}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${detail.status === 'A'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {detail.status === 'A' ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                    <button
                                                        onClick={() => handleToggleDetail(detail)}
                                                        disabled={togglingDetail === detail.id}
                                                        className={`p-2 rounded-lg transition ${
                                                            detail.status === 'A'
                                                                ? 'bg-red-100 hover:bg-red-200 text-red-600'
                                                                : 'bg-green-100 hover:bg-green-200 text-green-600'
                                                        } disabled:opacity-50`}
                                                        title={detail.status === 'A' ? 'Desactivar' : 'Activar'}
                                                    >
                                                        {detail.status === 'A' ? (
                                                            <ToggleRight size={18} />
                                                        ) : (
                                                            <ToggleLeft size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 px-8 py-4">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-[#003566] text-white rounded-full font-medium hover:bg-[#002244] transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>

            {/* Confirm Dialog */}
            {confirmDialog && (
                <ConfirmDialog
                    message={confirmDialog.message}
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={() => setConfirmDialog(null)}
                />
            )}
        </div>
    );
}