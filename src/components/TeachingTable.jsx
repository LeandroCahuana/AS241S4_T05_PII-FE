import { useState, useEffect, useMemo } from "react";
import { Eye, Pencil, Trash2, RotateCcw } from "lucide-react";

export default function TeachingTable({ teachings, onView, onEdit, onDelete, onRestore }) {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Ordenar por apellido (A–Z)
  const sortedTeachings = useMemo(() => {
    return [...teachings].sort((a, b) => a.lastname.localeCompare(b.lastname));
  }, [teachings]);

  // Reiniciar a la primera página cuando cambian los datos
  useEffect(() => {
    setCurrentPage(1);
  }, [teachings]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentTeachings = sortedTeachings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedTeachings.length / recordsPerPage);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#003566] text-white grid grid-cols-[80px_1fr_1fr_2fr_80px_120px_140px] gap-4 px-6 py-4 font-medium">
        <div>#</div>
        <div>Nombres</div>
        <div>Apellidos</div>
        <div>Correo Institucional</div>
        <div>Estado</div>
        <div>Acciones</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {currentTeachings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron evaluadores
          </div>
        ) : (
          currentTeachings.map((teaching, index) => (
            <div
              key={teaching.id}
              className="grid grid-cols-[80px_1fr_1fr_2fr_80px_120px_140px] gap-4 px-6 py-5 items-center hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium text-gray-800">
                {indexOfFirst + index + 1}
              </div>
              <div className="text-gray-800">{teaching.name_teaching}</div>
              <div className="text-gray-800">{teaching.lastname}</div>
              <div className="text-gray-800">{teaching.email}</div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    teaching.status === "A"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {teaching.status === "A" ? "Activo" : "Inactivo"}
                </span>
              </div>

              {/* Botones */}
              <div className="flex gap-2 justify-center">
                <button
                  title="Ver detalles"
                  className="w-9 h-9 bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center rounded-md transition"
                  onClick={() => onView(teaching)}
                >
                  <Eye size={18} />
                </button>

                <button
                  title="Editar"
                  className="w-9 h-9 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 flex items-center justify-center rounded-md transition"
                  onClick={() => onEdit(teaching)}
                >
                  <Pencil size={18} />
                </button>

                {teaching.status === "A" ? (
                  <button
                    title="Eliminar (desactivar)"
                    className="w-9 h-9 bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center rounded-md transition"
                    onClick={() => onDelete(teaching.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                ) : (
                  <button
                    title="Restaurar (activar)"
                    className="w-9 h-9 bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center rounded-md transition"
                    onClick={() => onRestore(teaching.id)}
                  >
                    <RotateCcw size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 py-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
