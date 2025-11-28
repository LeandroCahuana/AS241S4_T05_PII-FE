import { useEffect, useState } from "react";
import { Loader, Mail } from "lucide-react";
import { getAllClassrooms } from "../shared/api/classroomApi";
import EvaluationFormModal from "../components/EvaluationFormModal";
import { createEvaluation } from "../shared/api/EvaluationApi";

const BASE = import.meta.env.VITE_API_BASE_URL;

export default function EvaluationPage() {
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [loadingClassrooms, setLoadingClassrooms] = useState(true);
  const [sendingEmails, setSendingEmails] = useState(false);

  const now = new Date();

  // Load classrooms
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllClassrooms();
        setClassrooms(data);
      } catch (err) {
        console.error("Error cargando classrooms:", err);
      } finally {
        setLoadingClassrooms(false);
      }
    };
    load();
  }, []);

  // Load teachers
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const res = await fetch(BASE + "/teachings");
        const json = await res.json();
        setTeachers(json.data);
      } catch (err) {
        console.error("Error cargando docentes:", err);
      }
    };
    loadTeachers();
  }, []);

  // Filter classrooms by teacher
  const filteredClassrooms = selectedTeacher
    ? classrooms.filter((c) => c.teaching_id === Number(selectedTeacher))
    : [];

  const openEvaluation = (student) => {
    setSelectedStudent(student);
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  const handleSaveEvaluation = async (header, details) => {
    await createEvaluation({ header, details });
  };

  const handleSendEmails = async () => {
    if (!selectedClassroom) return;

    setSendingEmails(true);

    const res = await fetch(BASE + "/evaluation/send-emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classroom_code: selectedClassroom.code,
        classroom_section: selectedClassroom.section,
      }),
    });

    const data = await res.json();
    setSendingEmails(false);

    if (!data.success) {
      alert("Error: " + data.error);
      return;
    }

    alert("Correos enviados exitosamente 🎉");
  };

  if (loadingClassrooms) {
    return (
      <div className="flex items-center justify-center py-20 gap-2">
        <Loader className="w-6 h-6 animate-spin" />
        <span>Cargando aulas...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#003566] mb-6">
        Evaluación de Estudiantes
      </h1>

      {/* SELECT TEACHER */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Selecciona un docente</label>
        <select
          className="px-4 py-2 border rounded-lg"
          value={selectedTeacher || ""}
          onChange={(e) => {
            setSelectedTeacher(e.target.value);
            setSelectedClassroom(null); // limpiar selección anterior
          }}
        >
          <option value="">-- Selecciona un docente --</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.lastname}, {t.name_teaching}
            </option>
          ))}
        </select>
      </div>

      {/* SELECT CLASSROOM */}
      {selectedTeacher && (
        <div className="mb-6">
          <label className="block mb-2 font-medium">Selecciona un classroom</label>
          <select
            className="px-4 py-2 border rounded-lg"
            value={
              selectedClassroom
                ? `${selectedClassroom.code}-${selectedClassroom.section}`
                : ""
            }
            onChange={(e) => {
              const [code, section] = e.target.value.split("-");
              const cls = filteredClassrooms.find(
                (c) => c.code === code && c.section === section
              );
              setSelectedClassroom(cls);
            }}
          >
            <option value="">-- Selecciona un classroom --</option>
            {filteredClassrooms.map((c) => (
              <option key={c.code + c.section} value={`${c.code}-${c.section}`}>
                {c.code}-{c.section}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Warning when no classroom */}
      {!selectedClassroom && selectedTeacher && (
        <p className="text-gray-600">Seleccione un aula para continuar.</p>
      )}

      {/* STUDENTS LIST */}
      {selectedClassroom && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Estudiantes ({selectedClassroom.students.length})
            </h2>

            <button
              disabled={sendingEmails}
              onClick={handleSendEmails}
              className="flex items-center gap-2 px-5 py-2 bg-[#003566] text-white rounded-full hover:bg-[#002244]"
            >
              {sendingEmails && <Loader className="w-4 h-4 animate-spin" />}
              <Mail size={18} />
              Enviar notas por correo
            </button>
          </div>

          {selectedClassroom.students.length === 0 ? (
            <p className="text-gray-500">No hay estudiantes registrados.</p>
          ) : (
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Nombre</th>
                    <th className="px-3 py-2 text-left">Correo</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClassroom.students.map((s) => {
                    const canEvaluate =
                      now >= new Date(selectedClassroom.start_datetime) &&
                      now <= new Date(selectedClassroom.end_datetime);

                    return (
                      <tr key={s.id} className="border-t">
                        <td className="px-3 py-2">
                          {s.lastname}, {s.name_student}
                        </td>
                        <td className="px-3 py-2">{s.email}</td>
                        <td className="px-3 py-2 text-right">
                          <button
                            disabled={!canEvaluate}
                            onClick={() => openEvaluation(s)}
                            className={`px-4 py-2 rounded-lg ${
                              canEvaluate
                                ? "bg-[#ffd60a] text-[#003566] hover:bg-[#ffed4e]"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                          >
                            Evaluar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Evaluation Modal */}
      {selectedStudent && (
        <EvaluationFormModal
          isOpen={true}
          onClose={closeModal}
          classroom={selectedClassroom}
          student={selectedStudent}
          teachingId={selectedTeacher} 
          onSave={handleSaveEvaluation}
        />
      )}
    </div>
  );
}
