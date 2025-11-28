import { useState, useEffect, useMemo } from "react";
import { Eye, Pencil, Trash2, RotateCcw } from "lucide-react";

export default function StudentTable({ students, onView, onEdit, onDelete, onRestore }) {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Ordenar por apellido (A–Z)
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => a.lastname.localeCompare(b.lastname));
  }, [students]);

  // Reiniciar a la primera página cuando cambian los datos
  useEffect(() => {
    setCurrentPage(1);
  }, [students]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedStudents.length / recordsPerPage);

  return (
    <div className="w-full relative font-['Livvic']">
      {/* Header */}
      <div className="rounded-[20px] bg-[#B8C9DC] h-[50px] mb-2.5 flex items-center px-6">
        <div className="grid grid-cols-[0.6fr_1.8fr_2fr_0.6fr_0.6fr_1fr_1fr] gap-4 items-center w-full text-white text-[11px] font-semibold uppercase">
          <div className="text-center">N° ORDEN</div>
          <div className="text-center">APELLIDOS Y NOMBRES</div>
          <div className="text-center">CORREO INSTITUCIONAL</div>
          <div className="text-center">SEMESTRE</div>
          <div className="text-center">SECCIÓN</div>
          <div className="text-center">ESTADO</div>
          <div className="text-center">ACCIONES</div>
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {currentStudents.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-[20px]">
            No se encontraron estudiantes
          </div>
        ) : (
          currentStudents.map((student, index) => (
            <div
              key={student.id}
              className="rounded-[20px] bg-white h-[55px] flex items-center px-6 hover:shadow-sm transition-shadow"
            >
              <div className="grid grid-cols-[0.6fr_1.8fr_2fr_0.6fr_0.6fr_1fr_1fr] gap-4 items-center w-full">
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
                  {student.lastname}, {student.name_student}
                </div>

                {/* Correo */}
                <div className="flex items-center justify-center">
                  <div className="rounded-full bg-[#8FA9C4] px-4 py-1.5 max-w-full">
                    <span className="text-white text-[10px] font-normal truncate block">
                      {student.email}
                    </span>
                  </div>
                </div>

                {/* Semestre */}
                <div className="flex items-center justify-center">
                  <div className="w-10 h-7 rounded-full bg-[#FFD89C] flex items-center justify-center shrink-0">
                    <span className="text-[#8B5A00] text-[13px] font-semibold">
                      {student.semester}
                    </span>
                  </div>
                </div>

                {/* Sección */}
                <div className="flex items-center justify-center">
                  <div className={`w-10 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    student.classroom_section === 'A' 
                      ? 'bg-[#B8C9F5]' 
                      : 'bg-[#FFE89C]'
                  }`}>
                    <span className={`text-[13px] font-semibold ${
                      student.classroom_section === 'A' 
                        ? 'text-[#3D5A9E]' 
                        : 'text-[#8B6F00]'
                    }`}>
                      {student.classroom_section || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Estado */}
                <div className="flex items-center justify-center">
                  <div className={`rounded-full px-5 py-1.5 w-full flex items-center justify-center ${
                    student.status === "A"
                      ? "bg-[#C8F4DD]"
                      : "bg-[#FFD4D4]"
                  }`}>
                    <span className={`text-[11px] font-semibold uppercase ${
                      student.status === "A" ? "text-[#1F8A4F]" : "text-[#D14343]"
                    }`}>
                      {student.status === "A" ? "ACTIVO" : "INACTIVO"}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-1.5 justify-center">
                  {/* Ver */}
                  <button
                    title="Ver detalles"
                    className="w-7 h-7 bg-[#7B8CDE] hover:bg-[#6A7BC8] text-white flex items-center justify-center rounded-lg transition shrink-0"
                    onClick={() => onView(student)}
                  >
                    <Eye size={14} />
                  </button>

                  {/* Editar - Solo si está activo */}
                  <button
                    title={student.status === "A" ? "Editar" : "No se puede editar (estudiante inactivo)"}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition shrink-0 ${
                      student.status === "A"
                        ? "bg-[#F2C94C] hover:bg-[#E0B73D] text-white cursor-pointer"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                    onClick={() => student.status === "A" && onEdit(student)}
                    disabled={student.status !== "A"}
                  >
                    <Pencil size={14} />
                  </button>

                  {/* Eliminar/Restaurar */}
                  {student.status === "A" ? (
                    <button
                      title="Desactivar estudiante"
                      className="w-7 h-7 bg-[#EB5757] hover:bg-[#D84545] text-white flex items-center justify-center rounded-lg transition shrink-0"
                      onClick={() => onDelete(student.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  ) : (
                    <button
                      title="Restaurar estudiante"
                      className="w-7 h-7 bg-[#6FCF97] hover:bg-[#5EBC85] text-white flex items-center justify-center rounded-lg transition shrink-0"
                      onClick={() => onRestore(student.id)}
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
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