import { useEffect, useState } from "react";
import { X, Loader } from "lucide-react";
import { getCriterionDetailsByClassroom } from "../shared/api/CriterionApi";

export default function EvaluationFormModal({
  isOpen,
  onClose,
  classroom,
  student,
  teachingId,
  onSave,
}) {
  const [criteria, setCriteria] = useState([]);
  const [scores, setScores] = useState({});
  const [observations, setObservations] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingCriteria, setLoadingCriteria] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !classroom) return;

    const load = async () => {
      try {
        setLoadingCriteria(true);
        setError("");
        const details = await getCriterionDetailsByClassroom(
          classroom.code,
          classroom.section
        );
        setCriteria(details);
        
        const initialScores = {};
        details.forEach((d) => {
          initialScores[d.id] = d.point_criterion || 0;
        });
        setScores(initialScores);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los criterios.");
      } finally {
        setLoadingCriteria(false);
      }
    };

    load();
  }, [isOpen, classroom]);

  if (!isOpen || !classroom || !student) return null;

  const handleScoreChange = (id, value) => {
    setScores((prev) => ({ ...prev, [id]: value }));
  };

  const handleObsChange = (id, value) => {
    setObservations((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    
    const detailsPayload = criteria.map((c) => {
      const rawScore = scores[c.id] ?? 0;
      const numScore = parseFloat(rawScore) || 0;
      if (numScore < 0 || numScore > parseFloat(c.point_criterion)) {
        throw new Error(
          `La nota del criterio "${c.criterion}" debe estar entre 0 y ${c.point_criterion}`
        );
      }
      return {
        criterion_detail_id: c.id,
        qualification: numScore,
        observation: observations[c.id] || null,
      };
    });

    const total = detailsPayload.reduce(
      (acc, d) => acc + parseFloat(d.qualification),
      0
    );

    const header = {
      teaching_id: teachingId,
      student_id: student.id,
      classroom_code: classroom.code,
      classroom_section: classroom.section,
      qualification_total: total,
      status: 1,
    };

    try {
      setLoading(true);
      await onSave(header, detailsPayload);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al guardar evaluación.");
    } finally {
      setLoading(false);
    }
  };

  const totalCurrent = criteria.reduce((acc, c) => {
    return acc + (parseFloat(scores[c.id]) || 0);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#003566]">
              Evaluar estudiante
            </h2>
            <p className="text-sm text-gray-600">
              {student.lastname}, {student.name_student} —{" "}
              {classroom.code}-{classroom.section}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loadingCriteria ? (
          <div className="py-10 flex items-center justify-center gap-2">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Cargando criterios...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tabla de criterios */}
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Criterio</th>
                    <th className="px-3 py-2 text-left">Máx.</th>
                    <th className="px-3 py-2 text-left">Nota</th>
                    <th className="px-3 py-2 text-left">Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {criteria.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="px-3 py-2">{c.criterion}</td>
                      <td className="px-3 py-2">
                        {parseFloat(c.point_criterion)}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={c.point_criterion}
                          value={scores[c.id] ?? ""}
                          onChange={(e) =>
                            handleScoreChange(c.id, e.target.value)
                          }
                          className="w-24 px-2 py-1 border rounded-md"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={observations[c.id] ?? ""}
                          onChange={(e) =>
                            handleObsChange(c.id, e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded-md"
                          placeholder="Opcional..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">
                Total actual del estudiante:
              </span>
              <span className="text-lg font-bold text-[#003566]">
                {totalCurrent.toFixed(2)} pts
              </span>
            </div>

            {error && (
              <p className="text-red-600 text-sm font-semibold mt-2">
                {error}
              </p>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-full bg-[#ffd60a] text-[#003566] font-semibold hover:bg-[#ffed4e] flex items-center gap-2 disabled:opacity-60"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                Guardar evaluación
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
