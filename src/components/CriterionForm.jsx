import { useState, useEffect } from "react";
import { X, Plus, Trash2, Pencil, Loader } from "lucide-react";
import { getAllClassrooms } from "../shared/api/ClassroomApi";

export default function CriterionForm({ criterion, onClose, onSubmit }) {

  const [classroomOptions, setClassroomOptions] = useState([]);

  useEffect(() => {
    const loadClassrooms = async () => {
      try {
        const data = await getAllClassrooms();
        const activos = data.filter((c) => c.status === "A");

        setClassroomOptions(
          activos.map((c) => ({
            code: c.code,
            section: c.section,
          }))
        );
      } catch (err) {
        console.error("Error cargando classrooms:", err);
      }
    };

    loadClassrooms();
  }, []);

  const [formData, setFormData] = useState({
    classroom_code: criterion?.classroom_code || "",
    classroom_section: criterion?.classroom_section || "",
    point_total: criterion?.point_total || "",
    status: criterion?.status || "1",
    details: criterion?.details || [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [newDetail, setNewDetail] = useState({
    criterion: "",
    note: "",
    course: "",
    point_criterion: "",
  });

  const validate = () => {
    const e = {};
    if (!formData.classroom_code)
      e.classroom_code = "Seleccione un código de aula";
    if (!formData.classroom_section)
      e.classroom_section = "Seleccione una sección";
    if (!formData.point_total) e.point_total = "Ingrese el puntaje total";
    if (formData.details.length === 0)
      e.details = "Debe ingresar al menos un criterio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleHeaderChange = (name, value) => {
    setFormData((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: "" }));
  };

  const handleDetailChange = (name, value) => {
    setNewDetail((d) => ({ ...d, [name]: value }));
  };

  const handleAddDetail = () => {
    if (!newDetail.criterion || !newDetail.point_criterion) {
      setErrors((e) => ({
        ...e,
        details: "El criterio y puntaje son obligatorios",
      }));
      return;
    }

    const updated = [...formData.details, { ...newDetail }];
    setFormData((f) => ({ ...f, details: updated }));
    setNewDetail({
      criterion: "",
      note: "",
      course: "",
      point_criterion: "",
    });
    setErrors((e) => ({ ...e, details: "" }));
  };

  const handleDeleteDetail = (index) => {
    const updated = formData.details.filter((_, i) => i !== index);
    setFormData((f) => ({ ...f, details: updated }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const fixedData = {
      ...formData,
      point_total: parseFloat(formData.point_total),
      details: formData.details.map((d) => ({
        ...d,
        point_criterion: parseFloat(d.point_criterion),
      })),
    };

    setLoading(true);
    try {
      await onSubmit(fixedData);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#003566]">
            {criterion ? "Editar Criterio" : "Nuevo Criterio"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* FORM HEADER */}
        <div className="space-y-6">

          {/* CODE + SECTION */}
          <div className="grid grid-cols-2 gap-6">
            {/* CODE */}
            <div>
              <label className="block text-sm font-medium mb-1">Código de Aula *</label>
              <select
                value={formData.classroom_code}
                onChange={(e) => handleHeaderChange("classroom_code", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg ${errors.classroom_code ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <option value="">Seleccionar aula...</option>
                {[...new Set(classroomOptions.map((c) => c.code))].map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              {errors.classroom_code && (
                <p className="text-red-500 text-xs mt-1">{errors.classroom_code}</p>
              )}
            </div>

            {/* SECTION */}
            <div>
              <label className="block text-sm font-medium mb-1">Sección *</label>
              <select
                value={formData.classroom_section}
                onChange={(e) => handleHeaderChange("classroom_section", e.target.value)}
                disabled={!formData.classroom_code}
                className={`w-full px-4 py-2 border rounded-lg ${errors.classroom_section ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <option value="">Seleccionar sección...</option>
                {classroomOptions
                  .filter((c) => c.code === formData.classroom_code)
                  .map((c) => (
                    <option key={c.section} value={c.section}>
                      {c.section}
                    </option>
                  ))}
              </select>
              {errors.classroom_section && (
                <p className="text-red-500 text-xs mt-1">{errors.classroom_section}</p>
              )}
            </div>
          </div>

          {/* TOTAL POINTS */}
          <div>
            <label className="block text-sm font-medium mb-1">Puntaje Total *</label>
            <input
              type="number"
              step="0.01"
              value={formData.point_total}
              onChange={(e) => handleHeaderChange("point_total", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg ${errors.point_total ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.point_total && (
              <p className="text-red-500 text-xs mt-1">{errors.point_total}</p>
            )}
          </div>

          {/* DETAILS TITLE */}
          <h3 className="text-lg font-semibold text-[#003566] mt-6">Detalles del Criterio</h3>

          {/* ADD DETAIL FORM */}
          <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl">
            <input
              type="text"
              placeholder="Criterio *"
              value={newDetail.criterion}
              onChange={(e) => handleDetailChange("criterion", e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Curso"
              value={newDetail.course}
              onChange={(e) => handleDetailChange("course", e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Nota"
              value={newDetail.note}
              onChange={(e) => handleDetailChange("note", e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Puntaje *"
              value={newDetail.point_criterion}
              onChange={(e) => handleDetailChange("point_criterion", e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
            <button
              onClick={handleAddDetail}
              className="col-span-4 mt-3 flex items-center justify-center px-4 py-2 bg-[#003566] text-white rounded-lg hover:bg-[#002244]"
            >
              <Plus className="w-4 h-4 mr-2" /> Agregar Detalle
            </button>
          </div>

          {errors.details && (
            <p className="text-red-500 text-xs mt-1">{errors.details}</p>
          )}

          {/* DETAILS TABLE */}
          {formData.details.length > 0 && (
            <div className="mt-4 border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Criterio</th>
                    <th className="px-3 py-2 text-left">Curso</th>
                    <th className="px-3 py-2 text-left">Nota</th>
                    <th className="px-3 py-2 text-left">Puntaje</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.details.map((d, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{d.criterion}</td>
                      <td className="px-3 py-2">{d.course}</td>
                      <td className="px-3 py-2">{d.note}</td>
                      <td className="px-3 py-2">{d.point_criterion}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => handleDeleteDetail(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex gap-3 pt-8 mt-8">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-[#ffd60a] text-[#003566] rounded-full font-bold hover:bg-[#ffed4e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {criterion ? "Actualizar" : "Guardar"}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-300 rounded-full font-medium hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
}
