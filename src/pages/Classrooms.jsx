// pages/Classrooms.jsx
import { useEffect, useState } from "react";
import {
  getAllClassrooms,
  deleteClassroomGroup,
} from "../shared/api/ClassroomApi";
import ClassroomTable from "../components/ClassroomTable";
import ClassroomGenerateModal from "../components/ClassroomGenerateModal";
import ClassroomGroupDetailModal from "../widgets/ClassroomGroupDetailModal";
import ConfirmDialog from "../widgets/ConfirmDialog";

export default function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState(null);

  const loadClassrooms = async () => {
    try {
      setLoading(true);
      const data = await getAllClassrooms();
      setClassrooms(data);
    } catch (err) {
      console.error("Error cargando classrooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassrooms();
  }, []);

  const handleOpenGenerate = () => setShowGenerateModal(true);

  const handleGenerated = () => {
    setShowGenerateModal(false);
    loadClassrooms();
  };

  const handleViewGroup = (group) => {
    setSelectedGroup(group);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setSelectedGroup(null);
    setShowDetailModal(false);
  };

  // 🔥 Abrir modal de confirmación
  const handleDeleteRequest = (code) => {
    setCodeToDelete(code);
    setShowConfirm(true);
  };

  // 🔥 Confirmar desde el modal
  const confirmDelete = async () => {
    if (!codeToDelete) return;

    try {
      await deleteClassroomGroup(codeToDelete);
      await loadClassrooms();
    } catch (err) {
      console.error(err);
    }

    setShowConfirm(false);
    setCodeToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setCodeToDelete(null);
  };

  return (
    <div className="p-6 w-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Classrooms</h1>

        <button
          onClick={handleOpenGenerate}
          className="px-6 py-2 rounded-full bg-[#ffd60a] text-[#003566] font-semibold hover:bg-[#ffed4e] transition-colors"
        >
          Generar Classroom
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded-[20px] p-4">
        {loading ? (
          <p className="text-gray-500 text-sm">Cargando aulas...</p>
        ) : (
          <ClassroomTable
            classrooms={classrooms}
            onViewGroup={handleViewGroup}
            onDeleteRequest={handleDeleteRequest}
          />
        )}
      </div>

      {/* Modal de generación */}
      {showGenerateModal && (
        <ClassroomGenerateModal
          onClose={() => setShowGenerateModal(false)}
          onSuccess={handleGenerated}
          existingClassrooms={classrooms}
        />
      )}

      {/* Modal de detalles */}
      {showDetailModal && selectedGroup && (
        <ClassroomGroupDetailModal
          group={selectedGroup}
          onClose={handleCloseDetail}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {showConfirm && (
        <ConfirmDialog
          title="Eliminar classrooms"
          message={`¿Seguro que deseas eliminar TODOS los classrooms con código ${codeToDelete}? Esta acción no se puede deshacer.`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
