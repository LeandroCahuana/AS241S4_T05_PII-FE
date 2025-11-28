// widgets/ClassroomGroupDetailModal.jsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { teachingApi } from "../shared/api/TeachingApi";
import { studentsApi } from "../shared/api/studentsApi";

export default function ClassroomGroupDetailModal({ group, onClose }) {
  const [teachers, setTeachers] = useState({});
  const [studentsBySection, setStudentsBySection] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        // Docentes
        const teacherMap = {};
        for (const id of group.teacherIds) {
          try {
            const t = await teachingApi.getById(id);
            teacherMap[id] = t;
          } catch {
            teacherMap[id] = null;
          }
        }
        setTeachers(teacherMap);

        // Estudiantes por sección
        const studentsMap = {};
        for (const cls of group.classrooms) {
          try {
            const list = await studentsApi.getByClassroom(
              cls.code,
              cls.section
            );
            studentsMap[`${cls.code}-${cls.section}`] = list;
          } catch {
            studentsMap[`${cls.code}-${cls.section}`] = [];
          }
        }
        setStudentsBySection(studentsMap);
      } catch (err) {
        console.error("Error cargando detalles de grupo:", err);
      }
    };

    loadData();
  }, [group]);

  const getTeacherLabel = (id) => {
    const t = teachers[id];
    if (!t) return `ID: ${id}`;
    return `${t.lastname}, ${t.name_teaching}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-5xl w-full">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#003566]">
            Detalle del código {group.code}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* INFO GENERAL */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="font-semibold text-[#4a4a4a]">Ciclo:</p>
            <p className="text-gray-700">{group.code}</p>
          </div>
          <div>
            <p className="font-semibold text-[#4a4a4a]">Total de aulas:</p>
            <p className="text-gray-700">{group.classrooms.length}</p>
          </div>

          <div>
            <p className="font-semibold text-[#4a4a4a]">Secciones:</p>
            <p className="text-gray-700">{group.sections.join(", ")}</p>
          </div>

          <div>
            <p className="font-semibold text-[#4a4a4a]">
              Capacidad total del grupo:
            </p>
            <p className="text-gray-700">{group.totalCapacity}</p>
          </div>

          <div className="col-span-2">
            <p className="font-semibold text-[#4a4a4a]">Docentes:</p>
            {group.teacherIds.length === 0 ? (
              <p className="text-gray-700">Sin docentes asignados</p>
            ) : (
              <ul className="list-disc list-inside text-gray-700">
                {group.teacherIds.map((id) => (
                  <li key={id}>{getTeacherLabel(id)}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* TABLA DE SECCIONES */}
        <h3 className="text-lg font-semibold mb-3 text-[#003566]">
          Aulas y estudiantes por sección
        </h3>

        <div className="border rounded max-h-72 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left">Sección</th>
                <th className="px-3 py-2 text-left">Capacidad</th>
                <th className="px-3 py-2 text-left">Docente (ID)</th>
                <th className="px-3 py-2 text-left">Estado</th>
                <th className="px-3 py-2 text-left"># Estudiantes</th>
              </tr>
            </thead>
            <tbody>
              {group.classrooms.map((cls) => {
                const key = `${cls.code}-${cls.section}`;
                const students = studentsBySection[key] || [];
                const teacherLabel = cls.teaching_id
                  ? getTeacherLabel(cls.teaching_id)
                  : "Sin docente";

                return (
                  <tr key={key} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2">{cls.section}</td>
                    <td className="px-3 py-2">{cls.max_capacity}</td>
                    <td className="px-3 py-2">{teacherLabel}</td>
                    <td className="px-3 py-2">
                      {cls.status === "A" ? "Activo" : "Inactivo"}
                    </td>
                    <td className="px-3 py-2">{students.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* BOTÓN CERRAR */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#d9d9d9] text-[#4a4a4a] rounded-full font-medium hover:bg-[#c0c0c0] transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
