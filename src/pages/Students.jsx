import { useState, useEffect, useCallback } from "react";
import { RotateCcw, Grid3x3, Calendar, FileText, UserCheck, Search, X, FileDown } from "lucide-react";
import StudentTable from "../components/StudentTable";
import StudentForm from "../components/StudentForm";
import StudentViewModal from "../widgets/StudentViewModal";
import Toast from "../widgets/Toast";
import ConfirmDialog from "../widgets/ConfirmDialog";
import { studentsApi } from "../shared/api/studentsApi";
import { reportsApi } from "../shared/api/reportsApi";
import { classroomApi } from "../shared/api/classroomApi";

export default function Students() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(null);
  
  const [filters, setFilters] = useState({
    semester: "",
    seccion: "",
    status: "",
  });

  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [showReportsMenu, setShowReportsMenu] = useState(false);
  const [classrooms, setClassrooms] = useState([]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const showConfirm = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch (error) {
      console.error("Error al cargar estudiantes:", error);
      showToast("Error al cargar los estudiantes", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
    loadClassrooms();
  }, [loadStudents]);

  const loadClassrooms = async () => {
    try {
      const data = await classroomApi.getActive();
      setClassrooms(data);
    } catch (error) {
      console.error("Error al cargar classrooms:", error);
    }
  };

  // Cerrar menú de reportes al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showReportsMenu && !event.target.closest('.reports-menu-container')) {
        setShowReportsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showReportsMenu]);

  const handleAddStudent = async (data) => {
    try {
      const newStudent = await studentsApi.create(data);
      setStudents([...students, newStudent]);
      setShowForm(false);
      showToast("Estudiante agregado exitosamente", "success");
    } catch (error) {
      console.error("Error al agregar estudiante:", error);
      // Mostrar el mensaje específico del backend
      showToast(error.message || "Error al agregar el estudiante", "error");
    }
  };

  const handleUpdateStudent = async (data) => {
    try {
      const updatedStudent = await studentsApi.update(editingStudent.id, data);
      setStudents(
        students.map((s) =>
          s.id === editingStudent.id ? updatedStudent : s
        )
      );
      setShowForm(false);
      setEditingStudent(null);
      showToast("Estudiante actualizado exitosamente", "success");
    } catch (error) {
      console.error("Error al actualizar estudiante:", error);
      // Mostrar el mensaje específico del backend
      showToast(error.message || "Error al actualizar el estudiante", "error");
    }
  };

  const handleDeleteStudent = async (id) => {
    showConfirm("¿Estás seguro de desactivar este estudiante?", async () => {
      try {
        const updatedStudent = await studentsApi.deleteLogical(id);
        setStudents(students.map((s) => (s.id === id ? updatedStudent : s)));
        showToast("Estudiante desactivado exitosamente", "success");
      } catch (error) {
        console.error("Error al desactivar estudiante:", error);
        showToast(error.message || "Error al desactivar el estudiante", "error");
      }
    });
  };

  const handleRestoreStudent = async (id) => {
    showConfirm("¿Estás seguro de restaurar este estudiante?", async () => {
      try {
        const updatedStudent = await studentsApi.restore(id);
        setStudents(students.map((s) => (s.id === id ? updatedStudent : s)));
        showToast("Estudiante restaurado exitosamente", "success");
      } catch (error) {
        console.error("Error al restaurar estudiante:", error);
        showToast(error.message || "Error al restaurar el estudiante", "error");
      }
    });
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleFilterClick = (filterType) => {
    setActiveFilter(filterType);
    
    if (filterType === "all") {
      setFilters({ semester: "", seccion: "", status: "" });
      setShowFilterModal(null);
    }
  };

  const handleSemesterSelect = (semester) => {
    setFilters({ ...filters, semester });
    setShowFilterModal(null);
    setActiveFilter("semestre");
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

  const handleGenerateReport = async (format) => {
    try {
      const currentFilters = {
        semester: filters.semester,
        seccion: filters.seccion,
        status: filters.status
      };
      
      setShowReportsMenu(false);
      
      if (format === 'google-sheets') {
        showToast('Creando Google Sheet...', 'info');
        const result = await reportsApi.generateGoogleSheet(filteredStudents, currentFilters);
        showToast(`Google Sheet creado: ${result.title}`, 'success');
      } else {
        showToast(`Generando reporte ${format.toUpperCase()}...`, 'info');
        
        // Enviar los estudiantes ya filtrados
        if (format === 'pdf') {
          await reportsApi.generatePDF(filteredStudents, currentFilters);
        } else if (format === 'csv') {
          await reportsApi.generateCSV(filteredStudents);
        } else if (format === 'excel') {
          await reportsApi.generateExcel(filteredStudents);
        }
        
        showToast(`Reporte ${format.toUpperCase()} descargado exitosamente`, 'success');
      }
    } catch (error) {
      showToast(error.message || `Error al generar reporte`, 'error');
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name_student?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.number_docum?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSemester =
      !filters.semester ||
      student.semester?.toString() === filters.semester.toString();
    
    // Construir la sección completa desde los campos del estudiante
    let studentSeccionCompleta = "";
    
    if (student.classroom_code && student.classroom_section) {
      studentSeccionCompleta = student.classroom_section.startsWith("-")
        ? `${student.classroom_code}${student.classroom_section}`
        : `${student.classroom_code}-${student.classroom_section}`;
    } else if (student.classroom_code) {
      studentSeccionCompleta = student.classroom_code;
    } else if (student.seccion) {
      studentSeccionCompleta = student.seccion;
    }
    
    const matchesSeccion =
      !filters.seccion || studentSeccionCompleta === filters.seccion;
    
    const matchesStatus =
      !filters.status || student.status === filters.status;

    return matchesSearch && matchesSemester && matchesSeccion && matchesStatus;
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
      
      {/* Header con fondo y manchas */}
      <div className="relative bg-[#859ECA] rounded-3xl px-10 py-6 overflow-visible shadow-lg">
        {/* Manchas decorativas */}
        <div className="absolute top-8 right-64 w-32 h-32 bg-[#9CB3DD] rounded-full opacity-40 blur-2xl"></div>
        <div className="absolute bottom-12 left-32 w-40 h-40 bg-[#9CB3DD] rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute top-20 left-1/3 w-24 h-24 bg-[#9CB3DD] rounded-full opacity-25 blur-2xl"></div>
        
        <div className="relative z-10">
          {/* Título */}
          <h1 className="text-white text-[26px] font-light mb-5 tracking-wide">
            REGISTRO DE ESTUDIANTES
          </h1>
          
          {/* Botones de filtro con círculos de colores */}
          <div className="flex items-center gap-3">
            {/* Filtro ALL */}
            <button
              onClick={() => handleFilterClick("all")}
              className={`flex flex-col items-center justify-center gap-1.5 w-[70px] h-[70px] rounded-2xl border-2 border-white/50 transition-all ${
                activeFilter === "all"
                  ? "bg-white/20 shadow-lg scale-105"
                  : "bg-white/10 hover:bg-white/15"
              }`}
            >
              <div className="w-10 h-10 bg-[#003566] rounded-full flex items-center justify-center">
                <Grid3x3 size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-white text-[9px] font-medium tracking-wide">ALL</span>
            </button>

            {/* Filtro SEMESTRE */}
            <button
              onClick={() => setShowFilterModal("semestre")}
              className={`flex flex-col items-center justify-center gap-1.5 w-[70px] h-[70px] rounded-2xl border-2 border-white/50 transition-all ${
                activeFilter === "semestre"
                  ? "bg-white/20 shadow-lg scale-105"
                  : "bg-white/10 hover:bg-white/15"
              }`}
            >
              <div className="w-10 h-10 bg-[#FFC300] rounded-full flex items-center justify-center">
                <Calendar size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-white text-[10px] font-medium tracking-wide">SEMESTRE</span>
            </button>

            {/* Filtro SECCIÓN */}
            <button
              onClick={() => setShowFilterModal("seccion")}
              className={`flex flex-col items-center justify-center gap-1.5 w-[70px] h-[70px] rounded-2xl border-2 border-white/50 transition-all ${
                activeFilter === "seccion"
                  ? "bg-white/20 shadow-lg scale-105"
                  : "bg-white/10 hover:bg-white/15"
              }`}
            >
              <div className="w-10 h-10 bg-[#124dfc] rounded-full flex items-center justify-center">
                <FileText size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-white text-[10px] font-medium tracking-wide">SECCIÓN</span>
            </button>

            {/* Filtro ESTADO */}
            <button
              onClick={() => setShowFilterModal("estado")}
              className={`flex flex-col items-center justify-center gap-1.5 w-[70px] h-[70px] rounded-2xl border-2 border-white/50 transition-all ${
                activeFilter === "estado"
                  ? "bg-white/20 shadow-lg scale-105"
                  : "bg-white/10 hover:bg-white/15"
              }`}
            >
              <div className="w-10 h-10 bg-[#01AF74] rounded-full flex items-center justify-center">
                <UserCheck size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-white text-[10px] font-medium tracking-wide">ESTADO</span>
            </button>
          </div>
        </div>

        {/* Botones de acción en esquina inferior derecha */}
        <div className="absolute bottom-6 right-45 flex items-center gap-2.5 z-10">
          {/* Botón de Reportes con Dropdown */}
          <div className="relative reports-menu-container">
            <button
              onClick={() => setShowReportsMenu(!showReportsMenu)}
              title="Generar reportes"
              className="w-9 h-9 bg-[#10b981] text-white rounded-full flex items-center justify-center hover:bg-[#059669] transition shadow-lg"
            >
              <FileDown size={15} />
            </button>
            
            {/* Dropdown Menu de Reportes */}
            {showReportsMenu && (
              <div className="absolute top-full right-0 mb-2 bg-white rounded-xl shadow-2xl py-2 min-w-[180px] animate-fadeIn">
                <button
                  onClick={() => handleGenerateReport('pdf')}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 transition font-medium text-gray-700 text-sm flex items-center gap-2"
                >
                  <span className="text-lg">📄</span>
                  Exportar PDF
                </button>
                <button
                  onClick={() => handleGenerateReport('csv')}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 transition font-medium text-gray-700 text-sm flex items-center gap-2"
                >
                  <span className="text-lg">📊</span>
                  Exportar CSV
                </button>
                <button
                  onClick={() => handleGenerateReport('excel')}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 transition font-medium text-gray-700 text-sm flex items-center gap-2"
                >
                  <span className="text-lg">📗</span>
                  Exportar Excel
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => handleGenerateReport('google-sheets')}
                  className="w-full text-left px-4 py-2.5 hover:bg-green-50 transition font-medium text-green-700 text-sm flex items-center gap-2"
                >
                  <span className="text-lg">📋</span>
                  Google Sheets
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setEditingStudent(null);
              setShowForm(true);
            }}
            className="px-5 py-2 bg-[#FFC300] text-white rounded-full font-bold hover:bg-[#FFE347] transition text-[12px] whitespace-nowrap shadow-lg flex items-center gap-1"
          >
            <span className="text-base">+</span>
            AÑADIR ESTUDIANTE
          </button>

          <button
            onClick={loadStudents}
            title="Refrescar tabla"
            className="w-9 h-9 bg-[#FFC300] text-white rounded-full flex items-center justify-center hover:bg-[#FFE347] transition shadow-lg"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Robot */}
        <div className="absolute -right-10 -bottom-12 w-[250px] h-[250px] pointer-events-none z-30">
          <img
            src="/src/assets/robots/robot-estudiantes.png"
            alt="Robot"
            className="w-full h-full object-contain drop-shadow-2xl"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar estudiantes por nombre, correo o documento ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-14 py-3.5 bg-white rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl">✨</span>
      </div>

      {/* Tabla de estudiantes */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <p className="text-gray-500">Cargando estudiantes...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <StudentTable
            students={filteredStudents}
            onView={handleViewStudent}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onRestore={handleRestoreStudent}
          />
        </div>
      )}

      {/* Modal de Filtro - Semestre */}
      {showFilterModal === "semestre" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowFilterModal(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[320px] animate-fadeIn">
            <button
              onClick={() => setShowFilterModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#FDB813] rounded-xl flex items-center justify-center">
                <Calendar size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Filtrar por Semestre</h3>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => handleSemesterSelect("2")}
                className="w-full text-left px-4 py-3 hover:bg-[#FDB813]/10 rounded-xl transition font-medium text-gray-700 hover:text-[#FDB813]"
              >
                2do Semestre
              </button>
              <button
                onClick={() => handleSemesterSelect("3")}
                className="w-full text-left px-4 py-3 hover:bg-[#FDB813]/10 rounded-xl transition font-medium text-gray-700 hover:text-[#FDB813]"
              >
                3er Semestre
              </button>
              <button
                onClick={() => handleSemesterSelect("5")}
                className="w-full text-left px-4 py-3 hover:bg-[#FDB813]/10 rounded-xl transition font-medium text-gray-700 hover:text-[#FDB813]"
              >
                5to Semestre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Filtro - Sección */}
      {showFilterModal === "seccion" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowFilterModal(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[320px] animate-fadeIn">
            <button
              onClick={() => setShowFilterModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#5B8FCC] rounded-xl flex items-center justify-center">
                <FileText size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Filtrar por Sección</h3>
            </div>
            
            <div className="space-y-2">
              {classrooms.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No hay secciones disponibles</p>
              ) : (
                classrooms.map((classroom) => {
                  const seccionCompleta = `${classroom.code}-${classroom.section}`;
                  return (
                    <button
                      key={seccionCompleta}
                      onClick={() => handleSeccionSelect(seccionCompleta)}
                      className="w-full text-left px-4 py-3 hover:bg-[#5B8FCC]/10 rounded-xl transition font-medium text-gray-700 hover:text-[#5B8FCC]"
                    >
                      {seccionCompleta}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Filtro - Estado */}
      {showFilterModal === "estado" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowFilterModal(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[320px] animate-fadeIn">
            <button
              onClick={() => setShowFilterModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#5ECFB1] rounded-xl flex items-center justify-center">
                <UserCheck size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Filtrar por Estado</h3>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => handleEstadoSelect("A")}
                className="w-full text-left px-4 py-3 hover:bg-[#5ECFB1]/10 rounded-xl transition font-medium text-gray-700 hover:text-[#5ECFB1]"
              >
                Activo
              </button>
              <button
                onClick={() => handleEstadoSelect("I")}
                className="w-full text-left px-4 py-3 hover:bg-[#5ECFB1]/10 rounded-xl transition font-medium text-gray-700 hover:text-[#5ECFB1]"
              >
                Inactivo
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <StudentForm
          student={editingStudent}
          onClose={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
          onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
        />
      )}

      {showViewModal && (
        <StudentViewModal
          student={selectedStudent}
          onClose={() => {
            setShowViewModal(false);
            setSelectedStudent(null);
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