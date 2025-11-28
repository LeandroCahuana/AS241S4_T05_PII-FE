import { useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";
import debounce from "lodash.debounce";

import { studentsApi } from "../shared/api/studentsApi";
import { teachingApi } from "../shared/api/TeachingApi";
import { autoGenerateClassrooms } from "../shared/api/classroomApi";

export default function ClassroomGenerateModal({
  onClose,
  onSuccess,
  existingClassrooms,
}) {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [teachers, setTeachers] = useState([]);
  const [classroomCode, setClassroomCode] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(20);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [searchText, setSearchText] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    studentsApi.getAll().then((data) => {
      setStudents(data);
      setFiltered(data);
    });
    teachingApi.getAll().then((t) => setTeachers(t));
  }, []);

  const codeExists = useMemo(() => {
    const code = classroomCode.trim();
    if (!code) return false;
    return existingClassrooms.some(
      (c) => c.code.toLowerCase() === code.toLowerCase()
    );
  }, [classroomCode, existingClassrooms]);

  // FILTRO
  useEffect(() => {
    let list = [...students];

    if (semesterFilter) {
      list = list.filter((s) => String(s.semester) === String(semesterFilter));
    }
    if (searchText.trim()) {
      const t = searchText.toLowerCase();
      list = list.filter(
        (s) =>
          s.name_student.toLowerCase().includes(t) ||
          s.lastname.toLowerCase().includes(t) ||
          s.email.toLowerCase().includes(t)
      );
    }
    setFiltered(list);
  }, [searchText, semesterFilter, students]);

  const handleSearch = debounce((value) => setSearchText(value), 300);

  const toggleStudent = (id) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (prev.size === filtered.length) return new Set();
      return new Set(filtered.map((s) => s.id));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setResult(null);

    if (!classroomCode.trim()) {
      return setErrorMsg("Ingrese un código base.");
    }

    if (codeExists) {
      return setErrorMsg("El código base ya existe. Use otro código.");
    }

    if (!selectedTeacher) {
      return setErrorMsg("Seleccione un docente.");
    }

    if (selectedIds.size === 0) {
      return setErrorMsg("Seleccione al menos un estudiante.");
    }

    setLoading(true);

    const payload = {
      classroom_code: classroomCode.trim(),
      max_capacity: maxCapacity,
      student_ids: Array.from(selectedIds),
      teachingId: selectedTeacher,
    };

    try {
      const response = await autoGenerateClassrooms(payload);
      setResult(response);
      onSuccess();
    } catch (err) {
      setErrorMsg(err.message || "Error al generar classrooms");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-6xl w-full">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#003566]">
            Generar Classrooms
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Código base */}
            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Ciclo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]"
                value={classroomCode}
                onChange={(e) => setClassroomCode(e.target.value)}
                placeholder="Ej: AS241S1"
              />
              {codeExists && (
                <p className="text-red-500 text-xs mt-1">
                  Este código ya existe. Use otro código base.
                </p>
              )}
            </div>

            {/* Capacidad */}
            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Capacidad por aula <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                className="w-full px-4 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
              />
            </div>

            {/* Docente */}
            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Docente encargado <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                <option value="">Seleccione...</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name_teaching} {t.lastname}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm font-semibold">{errorMsg}</p>
          )}

          {result && (
            <div className="bg-green-50 border p-3 rounded">
              <p className="font-semibold text-green-700">{result.message}</p>
              <p>Estudiantes: {result.total_students}</p>
              <p>Classrooms: {result.groups}</p>
              <p>Creados: {result.classrooms_created.join(", ")}</p>
            </div>
          )}

          {/* FILTROS */}
          <div className="flex gap-4 items-center">
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="">Todos los semestres</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}° semestre
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Buscar estudiante..."
              className="border px-3 py-2 rounded w-64"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* TABLA ESTUDIANTES */}
          <div className="border rounded max-h-80 overflow-auto mt-2">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-3 py-2 w-8">
                    <input
                      type="checkbox"
                      checked={
                        filtered.length > 0 &&
                        selectedIds.size === filtered.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">Apellido</th>
                  <th className="px-3 py-2">Correo</th>
                  <th className="px-3 py-2">Semestre</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(s.id)}
                        onChange={() => toggleStudent(s.id)}
                      />
                    </td>
                    <td className="px-3 py-2">{s.name_student}</td>
                    <td className="px-3 py-2">{s.lastname}</td>
                    <td className="px-3 py-2">{s.email}</td>
                    <td className="px-3 py-2">{s.semester}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#d9d9d9] text-[#4a4a4a] rounded-full font-medium hover:bg-[#c0c0c0] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || codeExists}
              className="flex-1 px-6 py-3 bg-[#ffd60a] text-[#003566] rounded-full font-medium hover:bg-[#ffed4e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Generando..." : "Generar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
