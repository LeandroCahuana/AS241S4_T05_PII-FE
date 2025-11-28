import { useState } from "react";
import { X } from "lucide-react";

export default function AssignAutoScheduleModal({
  isOpen,
  onClose,
  onConfirm,
  week,
  weekday,
  groupsByCycle,
}) {
  const [selectedCode, setSelectedCode] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const cycles = Object.keys(groupsByCycle);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCode) {
      setError("Debe seleccionar un ciclo.");
      return;
    }

    onConfirm(selectedCode);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 animate-fadeIn">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-[#003566]">
            Asignación automática — {weekday} ({week})
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">

          {/* Selector de ciclo */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#003566]">
              Seleccionar ciclo
            </label>

            <select
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="">Seleccione un ciclo...</option>
              {cycles.map((code) => (
                <option key={code} value={code}>
                  {code} — {groupsByCycle[code].length} grupos
                </option>
              ))}
            </select>

            {error && <p className="text-red-600 mt-1 text-sm">{error}</p>}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#ffd60a] text-[#003566] hover:bg-[#ffed4e] font-semibold"
            >
              Asignar automáticamente
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
