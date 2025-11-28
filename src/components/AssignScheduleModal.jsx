import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AssignScheduleModal({
    isOpen,
    onClose,
    onConfirm,
    week,
    weekday,
    groups,
}) {

    const [selectedTurn, setSelectedTurn] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setSelectedTurn({});
            setError("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const assignments = Object.entries(selectedTurn)
            .filter(([_, turn]) => turn !== "")
            .map(([key, turn]) => {
                const [code, section] = key.split("|");
                return { code, section, turn };
            });

        if (assignments.length === 0) {
            setError("Debe asignar al menos un turno.");
            return;
        }

        onConfirm(assignments);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 animate-fadeIn">

                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-bold text-[#003566]">
                        Asignar horario — {weekday} ({week})
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">

                    <div className="max-h-80 overflow-y-auto pr-2 space-y-3">
                        {groups.length === 0 && (
                            <p className="text-center text-gray-500 text-sm">No hay grupos disponibles.</p>
                        )}

                        {groups.map((group) => {
                            const assigned = group.start_datetime !== null;

                            return (
                                <div
                                    key={`${group.code}|${group.section}`}
                                    className={`p-4 border rounded-xl shadow-sm flex justify-between items-center 
                    ${assigned ? "bg-gray-200 border-gray-300 opacity-60" : "bg-white"}`}
                                >
                                    <div>
                                        <p className="font-semibold text-[#003566] text-sm">
                                            {group.code}-{group.section}
                                        </p>

                                        {assigned ? (
                                            <p className="text-xs text-red-500 mt-1">
                                                Ya asignado el{" "}
                                                {new Date(group.start_datetime).toLocaleDateString("es-PE")}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-gray-500">
                                                Capacidad: {group.max_capacity}
                                            </p>
                                        )}
                                    </div>

                                    <select
                                        disabled={assigned}
                                        value={selectedTurn[`${group.code}|${group.section}`] || ""}
                                        onChange={(e) =>
                                            setSelectedTurn((prev) => ({
                                                ...prev,
                                                [`${group.code}|${group.section}`]: e.target.value,
                                            }))
                                        }
                                        className={`border rounded-lg px-3 py-2 text-sm ${
                                            assigned ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                        }`}
                                    >
                                        <option value="">Seleccionar turno</option>
                                        <option value="mañana">Mañana (8:00 - 13:00)</option>
                                        <option value="tarde">Tarde (14:30 - 18:20)</option>
                                    </select>
                                </div>
                            );
                        })}
                    </div>

                    {error && <p className="text-red-600 font-semibold text-sm">{error}</p>}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="px-6 py-2 rounded-full bg-[#ffd60a] text-[#003566] hover:bg-[#ffed4e] transition font-semibold"
                        >
                            Confirmar asignación
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
