import { X } from "lucide-react";

export default function ClassroomDetailModal({ classroom, onClose }) {
  if (!classroom) return null;

  const { code, section, max_capacity, status, teaching_id, students = [] } = classroom;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl p-6 relative">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-[#003566]">
            Detalles del Aula — {code}-{section}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Info General */}
        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
          <div>
            <p className="text-gray-500 font-semibold">Código</p>
            <p className="text-gray-800 font-medium">{code}</p>
          </div>

          <div>
            <p className="text-gray-500 font-semibold">Sección</p>
            <p className="text-gray-800 font-medium">{section}</p>
          </div>

          <div>
            <p className="text-gray-500 font-semibold">Capacidad Máxima</p>
            <p className="text-gray-800 font-medium">{max_capacity}</p>
          </div>

          <div>
            <p className="text-gray-500 font-semibold">Docente ID</p>
            <p className="text-gray-800 font-medium">
              {teaching_id || "Sin asignar"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 font-semibold">Estado</p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                status === "A"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {status === "A" ? "ACTIVO" : "INACTIVO"}
            </span>
          </div>

          <div>
            <p className="text-gray-500 font-semibold">Total Estudiantes</p>
            <p className="text-gray-800 font-medium">{students.length}</p>
          </div>
        </div>

        {/* Tabla de estudiantes */}
        <div>
          <h3 className="text-lg font-semibold text-[#003566] mb-2">
            Estudiantes asignados ({students.length})
          </h3>

          {students.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay estudiantes asignados.</p>
          ) : (
            <div className="max-h-60 overflow-auto border rounded-lg">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-100 sticky top-0 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-2">Apellido</th>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Correo</th>
                    <th className="px-4 py-2">Semestre</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{s.lastname}</td>
                      <td className="px-4 py-2">{s.name_student}</td>
                      <td className="px-4 py-2">{s.email}</td>
                      <td className="px-4 py-2">{s.semester}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Botón cerrar */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-[#ffd60a] text-[#003566] font-medium px-6 py-2 rounded-full hover:bg-[#ffea62]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
