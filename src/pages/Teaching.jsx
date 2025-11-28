import { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import Toast from "../widgets/Toast";
import SearchBar from "../widgets/SearchBar";
import TeachingTable from '../components/TeachingTable';
import TeachingForm from "../components/TeachingForm";
import TeachingFilterModal from "../widgets/TeachingFilterModal";
import TeachingViewModal from "../widgets/TeachingViewModal";
import { teachingApi } from '../shared/api/TeachingApi';

export default function Teachings() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [teachings, setTeachings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingTeaching, setEditingTeaching] = useState(null);
  
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeaching, setSelectedTeaching] = useState(null);
  const [filters, setFilters] = useState({
    type_document: "",
    status: "",
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    loadTeachings();
  }, []);

  const loadTeachings = async () => {
    setLoading(true);
    try {
      const data = await teachingApi.getAll();
      setTeachings(data);
    } catch (error) {
      console.error("Error al cargar los evaluadores:", error);
      showToast("Error al cargar los evaluadores", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeaching = async (data) => {
    try {
      const newTeaching = await teachingApi.create(data);
      setTeachings([...teachings, newTeaching]);
      setShowForm(false);
      showToast("Evaluador agregado exitosamente", "success");
    } catch (error) {
      console.error("Error al agregar evaluador:", error);
      showToast("Error al agregar el evaluador", "error");
    }
  };

  const handleUpdateTeaching = async (data) => {
    try {
      const updatedTeaching = await teachingApi.update(editingTeaching.id, data);
      setTeachings(
        teachings.map((s) =>
          s.id === editingTeaching.id ? updatedTeaching : s
        )
      );
      setShowForm(false);
      setEditingTeaching(null);
      showToast("Evaluador actualizado exitosamente", "success");
    } catch (error) {
      console.error("Error al actualizar evaluador:", error);
      showToast("Error al actualizar al evaluador", "error");
    }
  };

  const handleDeleteTeaching = async (id) => {
    if (!confirm("¿Estás seguro de desactivar a este evaluador?")) return;
    try {
      const updatedTeaching = await teachingApi.deleteLogical(id);
      setTeachings(teachings.map((s) => (s.id === id ? updatedTeaching : s)));
      showToast("Evaluador desactivado exitosamente", "success");
    } catch (error) {
      console.error("Error al desactivar evaluador:", error);
      showToast("Error al desactivar el evaluador", "error");
    }
  };

  const handleRestoreTeaching = async (id) => {
    if (!confirm("¿Estás seguro de restaurar a este evaluador?")) return;
    try {
      const updatedTeaching = await teachingApi.restore(id);
      setTeachings(teachings.map((s) => (s.id === id ? updatedTeaching : s)));
      showToast("Evaluador restaurado exitosamente", "success");
    } catch (error) {
      console.error("Error al restaurar evaluador:", error);
      showToast("Error al restaurar el evaluador", "error");
    }
  };

  const handleEditTeaching = (teaching) => {
    setEditingTeaching(teaching);
    setShowForm(true);
  };

  const handleViewTeaching = (teaching) => {
    setSelectedTeaching(teaching);
    setShowViewModal(true);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    showToast("Filtros aplicados correctamente", "info");
  };

  const filteredTeachings = teachings.filter((teaching) => {
    const matchesSearch =
      teaching.name_teaching?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teaching.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teaching.number_document?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teaching.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTypeDoc =
      !filters.type_document || teaching.type_document === filters.type_document;
    const matchesStatus =
      !filters.status || teaching.status === filters.status;

    return matchesSearch && matchesTypeDoc && matchesStatus;
  });

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-semibold text-[#4a4a4a]">
              EVALUADORES
            </h1>
          </div>
    
          <div className="flex items-center gap-3 justify-between">
            <div className="flex-1 max-w-2xl">
              <SearchBar
                placeholder="Buscar evaluador por nombre, documento o correo..."
                onSearch={setSearchTerm}
              />
            </div>
    
            <div className="flex gap-3 items-center">
              <button
                onClick={() => {
                  setEditingTeaching(null);
                  setShowForm(true);
                }}
                className="px-6 py-2.5 bg-[#FFD60A] text-black rounded-full font-medium hover:bg-[#FFE347] transition text-[13px] whitespace-nowrap"
              >
                + EVALUADOR
              </button>
    
              <button
                onClick={() => setShowFilterModal(true)}
                className="px-6 py-2.5 bg-[#FFD60A] text-black rounded-full font-medium hover:bg-[#FFE347] transition text-[13px] whitespace-nowrap"
              >
                FILTRAR
              </button>
    
              <button
                onClick={loadTeachings}
                title="Refrescar tabla"
                className="w-10 h-10 bg-[#FFD60A] text-black rounded-full flex items-center justify-center hover:bg-[#FFE347] transition"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
    
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <p className="text-gray-500">Cargando evaluadores...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <TeachingTable
                teachings={filteredTeachings}
                onView={handleViewTeaching}
                onEdit={handleEditTeaching}
                onDelete={handleDeleteTeaching}
                onRestore={handleRestoreTeaching}
              />
            </div>
          )}
    
          {showForm && (
            <TeachingForm
              teaching={editingTeaching}
              onClose={() => {
                setShowForm(false);
                setEditingTeaching(null);
              }}
              onSubmit={editingTeaching ? handleUpdateTeaching : handleAddTeaching}
            />
          )}
    
          {showFilterModal && (
            <TeachingFilterModal
              onClose={() => setShowFilterModal(false)}
              onApplyFilters={handleApplyFilters}
              currentFilters={filters}
            />
          )}
    
          {showViewModal && (
            <TeachingViewModal
              teaching={selectedTeaching}
              onClose={() => {
                setShowViewModal(false);
                setSelectedTeaching(null);
              }}
            />
          )}
    
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
  );
};