import { useState, useEffect, useMemo } from "react";
import { Eye, Pencil, Trash2, RotateCcw, Package, FileText, Settings, ChevronDown, UserPlus, FileDown } from "lucide-react";

export default function ChallengeTable({ challenges, onView, onEdit, onDelete, onRestore, onAddTeacher, onGenerateReport }) {
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Ordenar por nombre (A–Z)
    const sortedChallenges = useMemo(() => {
        return [...challenges].sort((a, b) => a.name_challenge.localeCompare(b.name_challenge));
    }, [challenges]);

    // Reiniciar a la primera página cuando cambian los datos
    useEffect(() => {
        setCurrentPage(1);
    }, [challenges]);

    const indexOfLast = currentPage * recordsPerPage;
    const indexOfFirst = indexOfLast - recordsPerPage;
    const currentChallenges = sortedChallenges.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(sortedChallenges.length / recordsPerPage);

    // Determinar si es CASO o CRITERIO
    const getChallengeType = (challenge) => {
        // Si tiene el campo "case" con contenido, es CASO
        if (challenge.case && challenge.case.trim() !== '') {
            return 'CASO';
        }
        return 'CRITERIO';
    };

    return (
        <div className="w-full relative font-['Livvic'] space-y-3">{/* Rows sin header visible */}

            {currentChallenges.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-[20px] shadow-sm">
                    No se encontraron retos
                </div>
            ) : (
                currentChallenges.map((challenge, index) => {
                    const challengeType = getChallengeType(challenge);

                    return (
                        <div
                            key={challenge.id}
                            className="rounded-[20px] bg-white shadow-sm hover:shadow-md transition-shadow p-5 flex items-center justify-between"
                        >
                            {/* Lado izquierdo: Icono + Info */}
                            <div className="flex items-center gap-4 flex-1">
                                {/* Icono de tipo */}
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${challengeType === "CASO" ? "bg-[#8B5CF6]" : "bg-[#10B981]"
                                    }`}>
                                    {challengeType === "CASO" ? (
                                        <Package size={28} className="text-white" strokeWidth={2} />
                                    ) : (
                                        <FileText size={28} className="text-white" strokeWidth={2} />
                                    )}
                                </div>

                                {/* Info del reto */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[15px] font-semibold text-gray-900 mb-0.5">
                                        {challenge.classroom_code}{challenge.classroom_section} – {challenge.classroom_section}
                                    </h3>
                                    <p className="text-[12px] text-gray-500 line-clamp-1">
                                        {challenge.description || "Sin descripción"}
                                    </p>
                                </div>
                            </div>

                            {/* Centro: Responsables */}
                            <div className="flex items-center gap-6 px-8">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-[11px] text-gray-500">Responsables:</span>
                                    <div className="flex items-center gap-1">
                                        <div className="flex -space-x-2">
                                            {challenge.details && challenge.details.length > 0 ? (
                                                <>
                                                    {challenge.details.slice(0, 3).map((detail, idx) => (
                                                        <div
                                                            key={detail.id}
                                                            className="w-7 h-7 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[10px] font-medium text-white"
                                                            title={detail.teaching?.name || `Teaching ${detail.teaching_id}`}
                                                        >
                                                            {detail.teaching?.name?.charAt(0) || '?'}
                                                        </div>
                                                    ))}
                                                    {challenge.details.length > 3 && (
                                                        <div className="w-7 h-7 rounded-full bg-gray-500 border-2 border-white flex items-center justify-center text-[10px] font-medium text-white">
                                                            +{challenge.details.length - 3}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-[10px] font-medium text-gray-600">
                                                    0
                                                </div>
                                            )}
                                        </div>
                                        {challenge.status === "A" && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onAddTeacher(challenge);
                                                }}
                                                className="w-7 h-7 rounded-full bg-green-500 hover:bg-green-600 border-2 border-white flex items-center justify-center transition"
                                                title="Agregar docente"
                                            >
                                                <UserPlus size={14} className="text-white" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Estado */}
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${challenge.status === "A" ? "bg-green-500" : "bg-red-500"
                                        }`}></div>
                                    <span className={`text-[12px] font-medium ${challenge.status === "A" ? "text-green-600" : "text-red-600"
                                        }`}>
                                        {challenge.status === "A" ? "ACTIVO" : "INACTIVO"}
                                    </span>
                                </div>
                            </div>

                            {/* Lado derecho: Botones de acción */}
                            <div className="flex items-center gap-2">
                                {/* Botón de reportes */}
                                <button
                                    title="Generar reporte"
                                    className="w-9 h-9 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg flex items-center justify-center transition"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onGenerateReport(challenge);
                                    }}
                                >
                                    <FileDown size={18} />
                                </button>

                                {/* Botón de configuración */}
                                <button
                                    title="Editar"
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${challenge.status === "A"
                                            ? "bg-[#1E3A8A] hover:bg-[#1E40AF] text-white cursor-pointer"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        }`}
                                    onClick={() => challenge.status === "A" && onEdit(challenge)}
                                    disabled={challenge.status !== "A"}
                                >
                                    <Settings size={18} />
                                </button>

                                {/* Botón dropdown */}
                                <button
                                    title="Más opciones"
                                    className="w-9 h-9 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg flex items-center justify-center transition"
                                    onClick={() => onView(challenge)}
                                >
                                    <ChevronDown size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })
            )}

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 py-6 mt-6">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="rounded-md bg-gray-400 text-white px-6 py-2 font-medium hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-gray-700 font-normal">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="rounded-md bg-white border border-gray-300 text-black px-6 py-2 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}