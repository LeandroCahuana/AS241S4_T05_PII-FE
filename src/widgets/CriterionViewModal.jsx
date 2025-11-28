import { useState } from "react";
import { X, Plus, Pencil, Trash2 } from "lucide-react";
import { criterionApi } from "../shared/api/CriterionApi";
import ConfirmDialog from "./ConfirmDialog";
import Toast from "./Toast";

export default function CriterionViewModal({ criterion, onClose, onUpdate }) {
    const [local, setLocal] = useState(criterion);
    const [editingDetail, setEditingDetail] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [toast, setToast] = useState(null);
    const [editHeader, setEditHeader] = useState(false);

    const showToast = (msg, type = "success") => setToast({ message: msg, type });

    const openDetailForm = (detail = null) => {
        setEditingDetail(
            detail || {
                criterion: "",
                note: "",
                course: "",
                point_criterion: "",
            }
        );
        setFormVisible(true);
    };

    const saveDetail = async () => {
        try {
            const payload = {
                ...editingDetail,
                point_criterion: editingDetail.point_criterion === ""
                    ? null
                    : parseFloat(editingDetail.point_criterion)
            };

            if (editingDetail.id) {
                // EDITAR
                await criterionApi.updateDetail(editingDetail.id, payload);

                const updated = local.details.map((d) =>
                    d.id === editingDetail.id ? { ...editingDetail, ...payload } : d
                );

                setLocal({ ...local, details: updated });
                showToast("Detalle actualizado");
            } else {
                // CREAR NUEVO
                const res = await criterionApi.createDetail(local.id, payload);
                const newDetail = { ...payload, id: res.detail_id };

                setLocal({ ...local, details: [...local.details, newDetail] });
                showToast("Detalle agregado");
            }

            setFormVisible(false);
            setEditingDetail(null);
            onUpdate && onUpdate();
        } catch (error) {
            showToast(error.message || "Error al guardar el detalle", "error");
            console.error(error);
        }
    };

    const deleteDetail = (detailId) => {
        setConfirmDialog({
            message: "¿Eliminar este detalle?",
            onConfirm: async () => {
                try {
                    await criterionApi.deleteDetail(detailId);

                    const updated = local.details.filter((d) => d.id !== detailId);
                    setLocal({ ...local, details: updated });

                    showToast("Detalle eliminado");
                    onUpdate && onUpdate();
                } catch (e) {
                    showToast("Error al eliminar detalle", "error");
                }
                setConfirmDialog(null);
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#003566]">
                        Criterio #{local.id}
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black">
                        <X size={26} />
                    </button>
                </div>

                {/* CABECERA */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <p><strong>Aula:</strong> {local.classroom_code}</p>
                    <p><strong>Sección:</strong> {local.classroom_section}</p>
                    <p><strong>Puntaje total:</strong> {local.point_total}</p>
                    <p><strong>Estado:</strong> {local.status === "1" ? "Activo" : "Inactivo"}</p>
                </div>

                {/* LISTA DE DETALLES */}
                <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-[#003566]">
                        Detalles del criterio
                    </h3>

                    <button
                        onClick={() => openDetailForm()}
                        className="flex items-center gap-1 px-4 py-2 bg-[#003566] text-white rounded-full hover:bg-[#002244]"
                    >
                        <Plus size={18} /> Nuevo detalle
                    </button>
                </div>

                {local.details.length === 0 ? (
                    <p className="text-gray-500">No hay detalles registrados.</p>
                ) : (
                    <div className="space-y-4">
                        {local.details.map((d) => (
                            <div
                                key={d.id}
                                className="border rounded-xl p-4 shadow-sm flex justify-between items-center"
                            >
                                <div>
                                    <p><strong>Criterio:</strong> {d.criterion}</p>
                                    <p><strong>Curso:</strong> {d.course || "-"}</p>
                                    <p><strong>Nota:</strong> {d.note || "-"}</p>
                                    <p><strong>Puntos:</strong> {d.point_criterion}</p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        className="text-blue-600 hover:text-blue-900"
                                        onClick={() => openDetailForm(d)}
                                    >
                                        <Pencil size={20} />
                                    </button>

                                    <button
                                        className="text-red-600 hover:text-red-900"
                                        onClick={() => deleteDetail(d.id)}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* FORM MODAL PARA DETALLE */}
            {formVisible && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">
                            {editingDetail.id ? "Editar detalle" : "Nuevo detalle"}
                        </h3>

                        {/* Campos */}
                        <div className="space-y-3">
                            <input
                                placeholder="Criterio"
                                value={editingDetail.criterion}
                                onChange={(e) =>
                                    setEditingDetail({ ...editingDetail, criterion: e.target.value })
                                }
                                className="w-full border px-3 py-2 rounded-lg"
                            />
                            <input
                                placeholder="Curso"
                                value={editingDetail.course || ""}
                                onChange={(e) =>
                                    setEditingDetail({ ...editingDetail, course: e.target.value })
                                }
                                className="w-full border px-3 py-2 rounded-lg"
                            />
                            <input
                                placeholder="Nota (opcional)"
                                value={editingDetail.note || ""}
                                onChange={(e) =>
                                    setEditingDetail({ ...editingDetail, note: e.target.value })
                                }
                                className="w-full border px-3 py-2 rounded-lg"
                            />
                            <input
                                type="number"
                                step="0.01"
                                value={editingDetail.point_criterion?.toString() ?? ""}
                                onChange={(e) =>
                                    setEditingDetail({
                                        ...editingDetail,
                                        point_criterion: e.target.value,
                                    })
                                }
                                className="w-full border px-3 py-2 rounded-lg"
                            />

                        </div>

                        {/* Botones */}
                        <div className="flex justify-end gap-3 mt-5">
                            <button
                                onClick={() => setFormVisible(false)}
                                className="px-4 py-2 bg-gray-300 rounded-full"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={saveDetail}
                                className="px-4 py-2 bg-[#003566] text-white rounded-full"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST & CONFIRM */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {confirmDialog && (
                <ConfirmDialog
                    message={confirmDialog.message}
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={() => setConfirmDialog(null)}
                />
            )}
        </div>
    );
}
