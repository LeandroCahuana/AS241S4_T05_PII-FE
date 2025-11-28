import { useState, useEffect, useMemo } from "react";
import { Eye, Trash2 } from "lucide-react";

export default function ClassroomTable({
  classrooms,
  onViewGroup,
  onDeleteRequest,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Agrupar classrooms por code
  const grouped = useMemo(() => {
    const map = new Map();

    classrooms.forEach((c) => {
      if (!map.has(c.code)) map.set(c.code, []);
      map.get(c.code).push(c);
    });

    const groupsArray = Array.from(map.entries()).map(([code, list]) => {
      const sections = list.map((c) => c.section).sort();
      const totalCapacity = list.reduce(
        (sum, c) => sum + (c.max_capacity || 0),
        0
      );

      const teacherIds = Array.from(
        new Set(list.map((c) => c.teaching_id).filter(Boolean))
      );

      return {
        code,
        sections,
        totalCapacity,
        classrooms: list,
        teacherIds,
      };
    });

    return groupsArray.sort((a, b) => a.code.localeCompare(b.code));
  }, [classrooms]);

  useEffect(() => {
    setCurrentPage(1);
  }, [classrooms]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentGroups = grouped.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(grouped.length / recordsPerPage);

  const handleDeleteClick = (code) => {
    if (typeof onDeleteRequest === "function") {
      onDeleteRequest(code);
    } else {
      console.warn(
        "onDeleteRequest no fue pasado como prop a ClassroomTable, se ignoró el clic."
      );
    }
  };

  return (
    <div className="w-full relative font-['Livvic']">
      {/* ENCABEZADO */}
      <div className="rounded-[20px] bg-[#B8C9DC] h-[50px] mb-2.5 flex items-center px-6">
        <div className="grid grid-cols-[0.5fr_1.6fr_1.7fr_1fr_1fr] gap-4 items-center w-full text-white text-[11px] font-semibold uppercase">
          <div className="text-center">N°</div>
          <div className="text-center">Código</div>
          <div className="text-center">Secciones</div>
          <div className="text-center">Docentes</div>
          <div className="text-center">Acciones</div>
        </div>
      </div>

      {/* FILAS */}
      <div className="space-y-2">
        {currentGroups.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-[20px]">
            No se encontraron classrooms
          </div>
        ) : (
          currentGroups.map((g, index) => (
            <div
              key={g.code}
              className="rounded-[20px] bg-white h-[55px] flex items-center px-6 hover:shadow-sm transition-shadow"
            >
              <div className="grid grid-cols-[0.5fr_1.6fr_1.7fr_1fr_1fr] gap-4 items-center w-full">
                {/* N° */}
                <div className="flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full border-2 border-[#7B8CDE] flex items-center justify-center">
                    <span className="text-[#7B8CDE] text-[15px] font-medium">
                      {indexOfFirst + index + 1}
                    </span>
                  </div>
                </div>

                {/* CÓDIGO */}
                <div className="text-[#2D3748] text-[12px] font-medium uppercase">
                  {g.code}
                </div>

                {/* SECCIONES */}
                <div className="flex gap-1 justify-center">
                  {g.sections.map((sec) => (
                    <span
                      key={sec}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                        sec === "A"
                          ? "bg-[#B8C9F5] text-[#3D5A9E]"
                          : sec === "B"
                          ? "bg-[#FFE89C] text-[#8B6F00]"
                          : "bg-[#D1F2EB] text-[#117A65]"
                      }`}
                    >
                      {sec}
                    </span>
                  ))}
                </div>

                {/* DOCENTES */}
                <div className="flex justify-center">
                  <div className="rounded-full bg-[#8FA9C4] px-4 py-1.5">
                    <span className="text-white text-[10px]">
                      {g.teacherIds.length === 0
                        ? "Sin docente"
                        : g.teacherIds.length === 1
                        ? `ID: ${g.teacherIds[0]}`
                        : `Múltiples (${g.teacherIds.length})`}
                    </span>
                  </div>
                </div>

                {/* ACCIONES */}
                <div className="flex gap-2 justify-center">
                  {/* Ver */}
                  <button
                    onClick={() => onViewGroup(g)}
                    className="w-7 h-7 bg-[#7B8CDE] hover:bg-[#6A7BC8] text-white flex items-center justify-center rounded-lg transition"
                  >
                    <Eye size={14} />
                  </button>

                  {/* Eliminar */}
                  <button
                    onClick={() => handleDeleteClick(g.code)}
                    className="w-7 h-7 bg-[#EB5757] hover:bg-[#D84545] text-white flex items-center justify-center rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINACIÓN */}
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
