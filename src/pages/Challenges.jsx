import { useState, useEffect, useCallback } from "react";
import {
    RotateCcw,
    Grid3x3,
    Package,
    FileText,
    UserCheck,
    Search,
    X,
} from "lucide-react";

import ChallengeTable from "../components/ChallengeTable";
import ChallengeForm from "../components/ChallengeForm";
import ChallengeViewModal from "../widgets/ChallengeViewModal";
import AddTeacherModal from "../widgets/AddTeacherModal";
import ReportModal from "../widgets/ReportModal";
import ClassroomSelectorModal from "../widgets/ClassroomSelectorModal";
import Toast from "../widgets/Toast";
import ConfirmDialog from "../widgets/ConfirmDialog";
import SmartFilterModal from "../widgets/SmartFilterModal";

import CriterionTable from "../components/CriterionTable";
import CriterionForm from "../components/CriterionForm";
import CriterionViewModal from "../widgets/CriterionViewModal";

import { challengesApi } from "../shared/api/ChallengesApi";
import { criterionApi } from "../shared/api/CriterionApi";

import robotRetos from "../assets/robots/robot-retos.png";

export default function Challenges() {
    const [activeTab, setActiveTab] = useState("challenges");
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState("CASO");
    const [searchTerm, setSearchTerm] = useState("");
    const [challenges, setChallenges] = useState([]);
    const [loadingChallenges, setLoadingChallenges] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [showFilterModal, setShowFilterModal] = useState(null);
    const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
    const [challengeForTeacher, setChallengeForTeacher] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [challengeForReport, setChallengeForReport] = useState(null);
    const [showClassroomModal, setShowClassroomModal] = useState(false);
    const [challengeForClassroom, setChallengeForClassroom] = useState(null);

    const [filters, setFilters] = useState({
        tipo: "",
        seccion: "",
        status: "",
    });

    const [criteria, setCriteria] = useState([]);
    const [loadingCriteria, setLoadingCriteria] = useState(false);
    const [editingCriterion, setEditingCriterion] = useState(null);
    const [selectedCriterion, setSelectedCriterion] = useState(null);
    const [showCriterionViewModal, setShowCriterionViewModal] = useState(false);

    const [toast, setToast] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
    };

    const showConfirm = (message, onConfirm) => {
        setConfirmDialog({ message, onConfirm });
    };

    const loadChallenges = useCallback(async () => {
        setLoadingChallenges(true);
        try {
            const data = await challengesApi.getAll(true);
            setChallenges(data);
        } catch (error) {
            console.error("Error al cargar retos:", error);
            showToast("Error al cargar los retos", "error");
        } finally {
            setLoadingChallenges(false);
        }
    }, []);

    const loadCriteria = useCallback(async () => {
        setLoadingCriteria(true);
        try {
            const data = await criterionApi.getAll();
            setCriteria(data);
        } catch (error) {
            console.error("Error al cargar criterios:", error);
            showToast("Error al cargar los criterios", "error");
        } finally {
            setLoadingCriteria(false);
        }
    }, []);

    useEffect(() => {
        loadChallenges();
        loadCriteria();
    }, [loadChallenges, loadCriteria]);

    const handleAddTeacher = async (challenge) => {
        try {
            const details = await challengesApi.getDetails(challenge.id);
            setChallengeForTeacher({ ...challenge, details });
            setShowAddTeacherModal(true);
        } catch (error) {
            console.error("Error al cargar detalles:", error);
            setChallengeForTeacher(challenge);
            setShowAddTeacherModal(true);
        }
    };

    const handleTeacherAdded = async () => {
        try {
            const updatedChallenge = await challengesApi.getById(
                challengeForTeacher.id,
                true
            );
            setChallenges((prev) =>
                prev.map((c) =>
                    c.id === updatedChallenge.id ? updatedChallenge : c
                )
            );
            showToast("Docente agregado exitosamente", "success");
        } catch (error) {
            console.error("Error al actualizar challenge:", error);
            loadChallenges();
        }
    };

    const handleGenerateReport = (challenge) => {
        setChallengeForReport(challenge);
        setShowReportModal(true);
    };

    const handleGeneratePDF = async () => {
        try {
            await challengesApi.generatePDF(challengeForReport.id);
            showToast("Reporte PDF descargado exitosamente", "success");
        } catch (error) {
            console.error("Error al generar reporte PDF:", error);
            showToast(
                `Error al generar el reporte PDF: ${error.message}`,
                "error"
            );
        }
    };

    const handleGenerateGoogleDoc = async () => {
        // Cerrar el modal de reportes y abrir el de selección de classroom
        setShowReportModal(false);
        setChallengeForClassroom(challengeForReport);
        setShowClassroomModal(true);
    };

    const handleSendToClassroom = () => {
        setChallengeForClassroom(challengeForReport);
        setShowClassroomModal(true);
    };

    const handlePublishToClassroom = async (selectedCourse) => {
        try {
            // Generar el Google Doc con el google_classroom_id
            const result = await challengesApi.generateGoogleDoc(
                challengeForClassroom.id,
                {
                    google_classroom_id: selectedCourse.id
                }
            );
            
            // Actualizar la lista de retos
            await loadChallenges();
            
            // Cerrar modales
            setShowClassroomModal(false);
            setChallengeForClassroom(null);
            setShowReportModal(false);
            setChallengeForReport(null);
            
            // Mostrar mensaje de éxito
            showToast("¡Google Doc creado y publicado en Classroom exitosamente!", "success");
            
            // Abrir el Google Doc
            if (result.url) {
                window.open(result.url, "_blank");
            }
            
            // Si hay link de Classroom, abrirlo también
            if (result.classroom?.alternateLink) {
                setTimeout(() => {
                    window.open(result.classroom.alternateLink, "_blank");
                }, 1000);
            }
        } catch (error) {
            console.error("Error al publicar en Classroom:", error);
            showToast(
                `Error al publicar en Google Classroom: ${error.message}`,
                "error"
            );
            throw error;
        }
    };

    const handleAddChallenge = async (data) => {
        try {
            const newChallenge = await challengesApi.create(data);
            setChallenges((prev) => [...prev, newChallenge]);
            setShowForm(false);
            setEditingChallenge(null);
            showToast("Reto agregado exitosamente", "success");
        } catch (error) {
            console.error("Error al agregar reto:", error);
            showToast(error.message || "Error al agregar el reto", "error");
        }
    };

    const handleUpdateChallenge = async (data) => {
        try {
            const updatedChallenge = await challengesApi.update(
                editingChallenge.id,
                data
            );
            setChallenges((prev) =>
                prev.map((c) =>
                    c.id === editingChallenge.id ? updatedChallenge : c
                )
            );
            setShowForm(false);
            setEditingChallenge(null);
            showToast("Reto actualizado exitosamente", "success");
        } catch (error) {
            console.error("Error al actualizar reto:", error);
            showToast(
                error.message || "Error al actualizar el reto",
                "error"
            );
        }
    };

    const handleDeleteChallenge = async (id) => {
        showConfirm("¿Estás seguro de desactivar este reto?", async () => {
            try {
                const updatedChallenge = await challengesApi.deleteLogical(id);
                setChallenges((prev) =>
                    prev.map((c) => (c.id === id ? updatedChallenge : c))
                );
                showToast("Reto desactivado exitosamente", "success");
            } catch (error) {
                console.error("Error al desactivar reto:", error);
                showToast(
                    error.message || "Error al desactivar el reto",
                    "error"
                );
            }
        });
    };

    const handleRestoreChallenge = async (id) => {
        showConfirm("¿Estás seguro de restaurar este reto?", async () => {
            try {
                const updatedChallenge = await challengesApi.restore(id);
                setChallenges((prev) =>
                    prev.map((c) => (c.id === id ? updatedChallenge : c))
                );
                showToast("Reto restaurado exitosamente", "success");
            } catch (error) {
                console.error("Error al restaurar reto:", error);
                showToast(
                    error.message || "Error al restaurar el reto",
                    "error"
                );
            }
        });
    };

    const handleEditChallenge = (challenge) => {
        setEditingChallenge(challenge);
        const tipo =
            challenge.case && challenge.case.trim() !== "" ? "CASO" : "CRITERIO";
        setFormType(tipo);
        setShowForm(true);
        setActiveTab("challenges");
    };

    const handleViewChallenge = async (challenge) => {
        try {
            const fullChallenge = await challengesApi.getById(
                challenge.id,
                true
            );
            setSelectedChallenge(fullChallenge);
        } catch (error) {
            console.error("Error al cargar detalles del reto:", error);
            setSelectedChallenge(challenge);
        }
        setShowViewModal(true);
    };

    const handleFilterClick = (filterType) => {
        setActiveFilter(filterType);

        if (filterType === "all") {
            setFilters({ tipo: "", seccion: "", status: "" });
            setShowFilterModal(null);
        }
    };

    const handleSeccionSelect = (seccion) => {
        setFilters({ ...filters, seccion });
        setShowFilterModal(null);
        setActiveFilter("seccion");
    };

    const handleEstadoSelect = (status) => {
        setFilters({ ...filters, status });
        setShowFilterModal(null);
        setActiveFilter("estado");
    };

    const handleAddCriterion = async (data) => {
        try {
            const result = await criterionApi.create(data);
            // backend devuelve { success, criterion_id }
            if (result.criterion_id) {
                const full = await criterionApi.getById(result.criterion_id);
                setCriteria((prev) => [...prev, full]);
            } else {
                await loadCriteria();
            }
            setShowForm(false);
            setEditingCriterion(null);
            showToast("Criterio creado exitosamente", "success");
        } catch (error) {
            console.error("Error al crear criterio:", error);
            showToast(
                error.message || "Error al crear el criterio",
                "error"
            );
        }
    };

    const handleDeleteCriterion = (id) => {
        showConfirm(
            "¿Estás seguro de eliminar este criterio y sus detalles?",
            async () => {
                try {
                    await criterionApi.delete(id);
                    setCriteria((prev) => prev.filter((c) => c.id !== id));
                    showToast("Criterio eliminado correctamente", "success");
                } catch (error) {
                    console.error("Error al eliminar criterio:", error);
                    showToast(
                        error.message || "Error al eliminar el criterio",
                        "error"
                    );
                }
            }
        );
    };

    const handleViewCriterion = async (criterion) => {
        try {
            const full = await criterionApi.getById(criterion.id);
            setSelectedCriterion(full || criterion);
        } catch (error) {
            console.error("Error al obtener criterio:", error);
            setSelectedCriterion(criterion);
        }
        setShowCriterionViewModal(true);
        setActiveTab("criterion");
    };

    const filteredChallenges = challenges.filter((challenge) => {
        const matchesSearch =
            challenge.name_challenge
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            challenge.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const seccionCompleta = `${challenge.classroom_code}-${challenge.classroom_section}`;
        const matchesSeccion =
            !filters.seccion || seccionCompleta === filters.seccion;

        const matchesStatus =
            !filters.status || challenge.status === filters.status;

        return matchesSearch && matchesSeccion && matchesStatus;
    });

    const filteredCriteria = criteria.filter((c) => {
        const term = searchTerm.toLowerCase();
        const text = (
            `${c.classroom_code}-${c.classroom_section} ${c.point_total}` +
            " " +
            (c.details || [])
                .map(
                    (d) =>
                        `${d.criterion || ""} ${d.course || ""} ${d.note || ""
                        }`
                )
                .join(" ")
        ).toLowerCase();

        const matchesSearch = text.includes(term);

        const seccionCompleta = `${c.classroom_code}-${c.classroom_section}`;
        const matchesSeccion =
            !filters.seccion || seccionCompleta === filters.seccion;

        let matchesStatus = true;
        if (filters.status === "A") {
            matchesStatus = c.status === "1" || c.status === "A";
        } else if (filters.status === "I") {
            matchesStatus = !(c.status === "1" || c.status === "A");
        }

        return matchesSearch && matchesSeccion && matchesStatus;
    });

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 pb-8 font-['Livvic']">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Livvic:wght@300;400;500&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>

            {/* Header */}
            <div className="relative bg-[#859ECA] rounded-3xl px-10 py-6 overflow-visible shadow-lg">
                {/* Manchas decorativas */}
                <div className="absolute top-8 right-64 w-32 h-32 bg-[#9CB3DD] rounded-full opacity-40 blur-2xl" />
                <div className="absolute bottom-12 left-32 w-40 h-40 bg-[#9CB3DD] rounded-full opacity-30 blur-3xl" />
                <div className="absolute top-20 left-1/3 w-24 h-24 bg-[#9CB3DD] rounded-full opacity-25 blur-2xl" />

                <div className="relative z-10">
                    <h1 className="text-white text-[26px] font-light mb-3 tracking-wide">
                        RETOS Y CRITERIOS
                    </h1>

                    {/* Tabs RETOS / CRITERIOS */}
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={() => setActiveTab("challenges")}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeTab === "challenges"
                                ? "bg-white text-[#003566]"
                                : "bg-white/20 text-white/80 hover:bg-white/30"
                                }`}
                        >
                            Retos
                        </button>
                        <button
                            onClick={() => setActiveTab("criterion")}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeTab === "criterion"
                                ? "bg-white text-[#003566]"
                                : "bg-white/20 text-white/80 hover:bg-white/30"
                                }`}
                        >
                            Criterios de evaluación
                        </button>
                    </div>

                    {/* Botones de filtro - RETOS y CRITERIOS */}
                    <div className="flex items-center gap-3">

                        {/* ALL */}
                        <button
                            onClick={() => handleFilterClick("all")}
                            className={`flex flex-col items-center justify-center gap-1.5 w-[70px] h-[70px] rounded-2xl border-2 border-white/50 transition-all ${activeFilter === "all"
                                ? "bg-white/20 shadow-lg scale-105"
                                : "bg-white/10 hover:bg-white/15"
                                }`}
                        >
                            <div className="w-10 h-10 bg-[#FFC300] rounded-full flex items-center justify-center">
                                <Grid3x3 size={20} className="text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-white text-[9px] font-medium tracking-wide">
                                ALL
                            </span>
                        </button>

                        {/* SECCIÓN – Para ambos tabs */}
                        <button
                            onClick={() => setShowFilterModal("seccion")}
                            className={`flex flex-col items-center justify-center gap-1.5 w-[70px] h-[70px] rounded-2xl border-2 border-white/50 transition-all ${activeFilter === "seccion"
                                ? "bg-white/20 shadow-lg scale-105"
                                : "bg-white/10 hover:bg-white/15"
                                }`}
                        >
                            <div className="w-10 h-10 bg-[#1447E6] rounded-full flex items-center justify-center">
                                <FileText size={20} className="text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-white text-[10px] font-medium tracking-wide">
                                SECCIÓN
                            </span>
                        </button>

                        {/* ESTADO – Para ambos tabs */}
                        <button
                            onClick={() => setShowFilterModal("estado")}
                            className={`flex flex-col items-center justify-center gap-1.5 w-[70px] h-[70px] rounded-2xl border-2 border-white/50 transition-all ${activeFilter === "estado"
                                ? "bg-white/20 shadow-lg scale-105"
                                : "bg-white/10 hover:bg-white/15"
                                }`}
                        >
                            <div className="w-10 h-10 bg-[#01AF74] rounded-full flex items-center justify-center">
                                <UserCheck size={20} className="text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-white text-[10px] font-medium tracking-wide">
                                ESTADO
                            </span>
                        </button>

                    </div>

                </div>

                {/* Botones de acción */}
                <div className="absolute bottom-6 right-[135px] flex items-center gap-2.5 z-10">
                    {/* Añadir caso */}
                    <button
                        onClick={() => {
                            setActiveTab("challenges");
                            setEditingChallenge(null);
                            setFormType("CASO");
                            setShowForm(true);
                        }}
                        className="px-5 py-2 bg-[#FFC300] text-white rounded-full font-bold hover:bg-[#FFE347] transition text-[12px] whitespace-nowrap shadow-lg flex items-center gap-1"
                    >
                        <span className="text-base">+</span>
                        AÑADIR NUEVO CASO
                    </button>

                    {/* Añadir criterio (transaccional Criterion) */}
                    <button
                        onClick={() => {
                            setActiveTab("criterion");
                            setEditingCriterion(null);
                            setShowForm(true);
                        }}
                        className="px-5 py-2 bg-[#003566] text-white rounded-full font-bold hover:bg-[#002244] transition text-[12px] whitespace-nowrap shadow-lg flex items-center gap-1"
                    >
                        <span className="text-base">+</span>
                        AÑADIR NUEVOS CRITERIOS
                    </button>

                    {/* Refrescar según tab */}
                    <button
                        onClick={() => {
                            if (activeTab === "challenges") {
                                loadChallenges();
                            } else {
                                loadCriteria();
                            }
                        }}
                        title="Refrescar tabla"
                        className="w-9 h-9 bg-[#FFC300] text-white rounded-full flex items-center justify-center hover:bg-[#FFE347] transition shadow-lg"
                    >
                        <RotateCcw size={15} />
                    </button>
                </div>

                {/* Robot */}
                <div className="absolute -right-10 -bottom-12 w-[230px] h-[230px] pointer-events-none z-30">
                    <img
                        src={robotRetos}
                        alt="Robot Retos"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative max-w-2xl">
                <Search
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                />
                <input
                    type="text"
                    placeholder={
                        activeTab === "challenges"
                            ? "Buscar por nombre o descripción..."
                            : "Buscar por aula, curso o texto del criterio..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-14 py-3.5 bg-white rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl">
                    ✨
                </span>
            </div>

            {/* Tabla principal según TAB */}
            {activeTab === "challenges" ? (
                loadingChallenges ? (
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <p className="text-gray-500">Cargando retos...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <ChallengeTable
                            challenges={filteredChallenges}
                            onView={handleViewChallenge}
                            onEdit={handleEditChallenge}
                            onDelete={handleDeleteChallenge}
                            onRestore={handleRestoreChallenge}
                            onAddTeacher={handleAddTeacher}
                            onGenerateReport={handleGenerateReport}
                        />
                    </div>
                )
            ) : loadingCriteria ? (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                    <p className="text-gray-500">Cargando criterios...</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <CriterionTable
                        criteria={filteredCriteria}
                        onView={handleViewCriterion}
                        onDelete={handleDeleteCriterion}
                    />
                </div>
            )}

            {/* Modales de filtros (SOLO RETOS) */}
            {showFilterModal && (
                <SmartFilterModal
                    filterType={showFilterModal}
                    activeTab={activeTab}
                    onClose={() => setShowFilterModal(null)}
                    onSelect={(value) => {
                        if (showFilterModal === "tipo") handleTipoSelect(value);
                        if (showFilterModal === "seccion") handleSeccionSelect(value);
                        if (showFilterModal === "estado") handleEstadoSelect(value);

                        setShowFilterModal(null);
                    }}
                />
            )}


            {/* Formularios según TAB */}
            {showForm && activeTab === "challenges" && (
                <ChallengeForm
                    challenge={editingChallenge}
                    formType={formType}
                    onClose={() => {
                        setShowForm(false);
                        setEditingChallenge(null);
                    }}
                    onSubmit={
                        editingChallenge
                            ? handleUpdateChallenge
                            : handleAddChallenge
                    }
                />
            )}

            {showForm && activeTab === "criterion" && (
                <CriterionForm
                    criterion={editingCriterion}
                    onClose={() => {
                        setShowForm(false);
                        setEditingCriterion(null);
                    }}
                    onSubmit={handleAddCriterion}
                />
            )}

            {/* Modales de vistas */}
            {showViewModal && activeTab === "challenges" && (
                <ChallengeViewModal
                    challenge={selectedChallenge}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedChallenge(null);
                    }}
                    onUpdate={loadChallenges}
                />
            )}

            {showCriterionViewModal && activeTab === "criterion" && (
                <CriterionViewModal
                    criterion={selectedCriterion}
                    onClose={() => {
                        setShowCriterionViewModal(false);
                        setSelectedCriterion(null);
                    }}
                    onUpdate={loadCriteria}
                />
            )}

            {/* Otros modales (RETOS) */}
            {showAddTeacherModal && (
                <AddTeacherModal
                    challenge={challengeForTeacher}
                    onClose={() => {
                        setShowAddTeacherModal(false);
                        setChallengeForTeacher(null);
                    }}
                    onSuccess={handleTeacherAdded}
                />
            )}

            {showReportModal && (
                <ReportModal
                    challenge={challengeForReport}
                    onClose={() => {
                        setShowReportModal(false);
                        setChallengeForReport(null);
                    }}
                    onGeneratePDF={handleGeneratePDF}
                    onGenerateGoogleDoc={handleGenerateGoogleDoc}
                    onSendToClassroom={handleSendToClassroom}
                />
            )}

            {showClassroomModal && (
                <ClassroomSelectorModal
                    challenge={challengeForClassroom}
                    onClose={() => {
                        setShowClassroomModal(false);
                        setChallengeForClassroom(null);
                    }}
                    onSuccess={handlePublishToClassroom}
                />
            )}

            {/* Toast & Confirm global */}
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
                    onConfirm={() => {
                        confirmDialog.onConfirm();
                        setConfirmDialog(null);
                    }}
                    onCancel={() => setConfirmDialog(null)}
                />
            )}
        </div>
    );
}
