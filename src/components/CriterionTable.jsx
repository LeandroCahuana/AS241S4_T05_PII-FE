import { useState, useEffect, useMemo } from 'react';
import { FileText, Trash2, ChevronDown } from 'lucide-react';

export default function CriterionTable({ criteria, onView, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const sorted = useMemo(
    () => [...criteria].sort((a, b) => a.classroom_code.localeCompare(b.classroom_code)),
    [criteria]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [criteria]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const current = sorted.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sorted.length / recordsPerPage);

  return (
    <div className="w-full relative font-['Livvic'] space-y-3">
      {current.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-[20px]">
          No se encontraron criterios
        </div>
      ) : (
        current.map((c) => (
          <div
            key={c.id}
            className="rounded-[20px] bg-white shadow-sm hover:shadow-md transition-shadow p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 rounded-xl bg-[#10B981] flex items-center justify-center shrink-0">
                <FileText size={28} className="text-white" strokeWidth={2} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-gray-900 mb-0.5">
                  {c.classroom_code}{c.classroom_section} – {c.classroom_section}
                </h3>
                <p className="text-[12px] text-gray-500 line-clamp-1">
                  Puntaje total: {c.point_total}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 px-8">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] text-gray-500">Criterios:</span>
                <span className="text-[13px] font-semibold text-gray-800">
                  {c.details ? c.details.length : 0}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                title="Eliminar"
                className="w-9 h-9 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition"
                onClick={() => onDelete(c.id)}
              >
                <Trash2 size={18} />
              </button>

              <button
                title="Ver detalle"
                className="w-9 h-9 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg flex items-center justify-center transition"
                onClick={() => onView(c)}
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>
        ))
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-6 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-md bg-gray-400 text-white px-6 py-2 font-medium hover:bg-gray-500 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-md bg-white border border-gray-300 text-black px-6 py-2 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
