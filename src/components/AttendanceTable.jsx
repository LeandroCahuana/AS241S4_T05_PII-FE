import { useState, useEffect, useMemo } from 'react';
import { MessageSquare } from 'lucide-react';

export default function AttendanceTable({ attendances, loading, onOpenObservation }) {
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    // Ordenar por apellido (A–Z)
    const sortedAttendances = useMemo(() => {
        return [...attendances].sort((a, b) => 
            (a.student?.lastname || '').localeCompare(b.student?.lastname || '')
        );
    }, [attendances]);

    // Reiniciar a la primera página cuando cambian los datos
    useEffect(() => {
        setCurrentPage(1);
    }, [attendances]);

    const indexOfLast = currentPage * recordsPerPage;
    const indexOfFirst = indexOfLast - recordsPerPage;
    const currentAttendances = sortedAttendances.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(sortedAttendances.length / recordsPerPage);

    const getStatusBadge = (status) => {
        const badges = {
            'A': { label: 'PRESENTE', bgColor: '#C8F4DD', textColor: '#1F8A4F' },
            'T': { label: 'TARDANZA', bgColor: '#FFE89C', textColor: '#8B6F00' },
            'F': { label: 'FALTA', bgColor: '#FFD4D4', textColor: '#D14343' }
        };
        return badges[status] || badges['F'];
    };

    if (loading) {
        return (
            <div className="w-full py-12 text-center">
                <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full relative font-['Livvic'] mt-6">
            {/* Header */}
            <div className="rounded-[20px] bg-[#9DB5CC] h-[50px] mb-2.5 flex items-center px-6">
                <div className="grid grid-cols-[0.5fr_1.5fr_2fr_0.8fr_0.7fr_0.4fr_0.8fr_0.5fr] gap-4 items-center w-full text-white text-[11px] font-semibold uppercase">
                    <div className="text-center">N° ORDEN</div>
                    <div className="text-center">APELLIDOS Y NOMBRES</div>
                    <div className="text-center">CORREO INSTITUCIONAL</div>
                    <div className="text-center">FECHA</div>
                    <div className="text-center">HORA</div>
                    <div className="text-center">PC</div>
                    <div className="text-center">ESTADO</div>
                    <div className="text-center">OBSERVACIÓN</div>
                </div>
            </div>

            {/* Rows */}
            <div className="space-y-2">
                {currentAttendances.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-[20px]">
                        No se encontraron registros de asistencia
                    </div>
                ) : (
                    currentAttendances.map((attendance, index) => {
                        const badge = getStatusBadge(attendance.status);
                        return (
                            <div
                                key={attendance.id}
                                className="rounded-[20px] bg-white h-[55px] flex items-center px-6 hover:shadow-sm transition-shadow"
                            >
                                <div className="grid grid-cols-[0.5fr_1.5fr_2fr_0.8fr_0.7fr_0.4fr_0.8fr_0.5fr] gap-4 items-center w-full">
                                    {/* N° Orden */}
                                    <div className="flex items-center justify-center">
                                        <div className="w-9 h-9 rounded-full border-2 border-[#7B8CDE] flex items-center justify-center shrink-0">
                                            <span className="text-[#7B8CDE] text-[15px] font-medium">
                                                {indexOfFirst + index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Apellidos y Nombres */}
                                    <div className="text-[#2D3748] text-[12px] font-medium uppercase truncate">
                                        {attendance.student?.lastname}, {attendance.student?.name_student || attendance.student?.name}
                                    </div>

                                    {/* Correo */}
                                    <div className="flex items-center justify-center">
                                        <div className="rounded-full bg-[#8FA9C4] px-4 py-1.5 max-w-full">
                                            <span className="text-white text-[10px] font-normal truncate block">
                                                {attendance.student?.email}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Fecha */}
                                    <div className="text-[#2D3748] text-[12px] font-medium text-center">
                                        {attendance.date || '---'}
                                    </div>

                                    {/* Hora */}
                                    <div className="text-[#2D3748] text-[12px] font-medium text-center">
                                        {attendance.time || '---'}
                                    </div>

                                    {/* PC */}
                                    <div className="flex items-center justify-center">
                                        <div className="w-10 h-7 rounded-full bg-[#B8C9F5] flex items-center justify-center shrink-0">
                                            <span className="text-[#3D5A9E] text-[13px] font-semibold">
                                                {attendance.designated_pc || '--'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Estado */}
                                    <div className="flex items-center justify-center">
                                        <div 
                                            className="rounded-full px-4 py-1.5 w-full flex items-center justify-center"
                                            style={{ backgroundColor: badge.bgColor }}
                                        >
                                            <span 
                                                className="text-[11px] font-semibold uppercase"
                                                style={{ color: badge.textColor }}
                                            >
                                                {badge.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Observación */}
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={() => onOpenObservation(attendance)}
                                            className="w-7 h-7 bg-[#7B8CDE] hover:bg-[#6A7BC8] text-white flex items-center justify-center rounded-lg transition shrink-0"
                                            title="Ver/Agregar observación"
                                        >
                                            <MessageSquare size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

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
