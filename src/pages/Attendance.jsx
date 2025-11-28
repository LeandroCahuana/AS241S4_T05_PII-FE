import { useState, useEffect } from 'react';
import { attendanceApi } from '../shared/api/attendanceApi';
import { studentsApi } from '../shared/api/studentsApi';
import { attendanceConfigApi } from '../shared/api/attendanceConfigApi';
import AttendanceFilters from '../components/AttendanceFilters';
import AttendanceStats from '../components/AttendanceStats';
import AttendanceTable from '../components/AttendanceTable';
import AttendanceConfigList from '../components/AttendanceConfigList';
import ObservationModal from '../components/ObservationModal';
import AttendanceFilterModal from '../widgets/AttendanceFilterModal';
import AttendanceScheduleModal from '../widgets/AttendanceScheduleModal';
import Toast from '../components/Toast';

export default function Attendance() {
    const [attendances, setAttendances] = useState([]);
    const [filteredAttendances, setFilteredAttendances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showObservationModal, setShowObservationModal] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [observationText, setObservationText] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [showFilterModal, setShowFilterModal] = useState(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduleConfig, setScheduleConfig] = useState(null);
    const [allConfigs, setAllConfigs] = useState([]);
    const [loadingConfigs, setLoadingConfigs] = useState(false);
    const [toast, setToast] = useState(null);
    const [filters, setFilters] = useState({
        seccion: '',
        estado: ''
    });
    const [stats, setStats] = useState({
        present: 0,
        late: 0,
        absent: 0,
        total: 0
    });

    useEffect(() => {
        loadAttendances();
        loadScheduleConfigs();
    }, []);

    const loadScheduleConfigs = async () => {
        try {
            setLoadingConfigs(true);
            const configs = await attendanceConfigApi.getAll();
            console.log('📅 Configuraciones cargadas:', configs);
            setAllConfigs(configs);
            
            // Filtrar configuraciones de hoy
            const todayConfigs = configs.filter(c => {
                const configDate = new Date(c.attendance_date);
                const today = new Date();
                return configDate.toDateString() === today.toDateString();
            });
            
            if (todayConfigs.length > 0) {
                setScheduleConfig(todayConfigs[0]);
            }
        } catch (error) {
            console.error('Error al cargar configuraciones:', error);
        } finally {
            setLoadingConfigs(false);
        }
    };

    const loadAttendances = async () => {
        try {
            setLoading(true);
            
            // Obtener asistencias y estudiantes en paralelo
            const [attendanceData, studentsData] = await Promise.all([
                attendanceApi.getAll(),
                studentsApi.getAll()
            ]);
            
            // Crear un mapa de estudiantes por ID para búsqueda rápida
            const studentsMap = {};
            studentsData.forEach(student => {
                studentsMap[student.id] = student;
            });
            
            // Enriquecer los datos de asistencia con la información completa del estudiante
            const enrichedData = attendanceData.map(attendance => ({
                ...attendance,
                student: studentsMap[attendance.student_id] || attendance.student
            }));
            
            console.log('📊 Datos enriquecidos:', enrichedData);
            console.log('📊 Ejemplo de estudiante completo:', enrichedData[0]?.student);
            
            setAttendances(enrichedData);
            setFilteredAttendances(enrichedData);
            calculateStats(enrichedData);
        } catch (error) {
            console.error('Error al cargar asistencias:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const present = data.filter(a => a.status === 'A').length;
        const late = data.filter(a => a.status === 'T').length;
        const absent = data.filter(a => a.status === 'F').length;
        
        setStats({
            present,
            late,
            absent,
            total: data.length
        });
    };

    useEffect(() => {
        let filtered = attendances;

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(a => 
                a.student?.name_student?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.student?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.student?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrar por sección
        if (filters.seccion) {
            console.log('🔍 Filtrando por sección:', filters.seccion);
            console.log('🔍 Primer estudiante completo:', filtered[0]?.student);
            
            filtered = filtered.filter(a => {
                // Construir la sección completa desde los campos del estudiante
                let studentSeccionCompleta = "";
                
                if (a.student?.classroom_code && a.student?.classroom_section) {
                    studentSeccionCompleta = a.student.classroom_section.startsWith("-")
                        ? `${a.student.classroom_code}${a.student.classroom_section}`
                        : `${a.student.classroom_code}-${a.student.classroom_section}`;
                } else if (a.student?.classroom_code) {
                    studentSeccionCompleta = a.student.classroom_code;
                } else if (a.student?.seccion) {
                    studentSeccionCompleta = a.student.seccion;
                }
                
                return studentSeccionCompleta === filters.seccion;
            });
            
            console.log('✅ Registros filtrados:', filtered.length);
        }

        // Filtrar por estado de asistencia
        if (filters.estado) {
            console.log('🔍 Filtrando por estado:', filters.estado);
            filtered = filtered.filter(a => a.status === filters.estado);
            console.log('✅ Registros con estado:', filtered.length);
        }

        setFilteredAttendances(filtered);
        calculateStats(filtered);
    }, [searchTerm, filters, attendances]);

    const handleFilterClick = (filterType) => {
        setActiveFilter(filterType);
        
        if (filterType === 'all') {
            setFilters({ seccion: '', estado: '' });
            setShowFilterModal(null);
        }
    };

    const handleSeccionSelect = (seccion) => {
        setFilters({ ...filters, seccion });
        setShowFilterModal(null);
        setActiveFilter('seccion');
    };

    const handleEstadoSelect = (estado) => {
        setFilters({ ...filters, estado });
        setShowFilterModal(null);
        setActiveFilter('estado');
    };

    const handleOpenObservation = (attendance) => {
        setSelectedAttendance(attendance);
        setObservationText(attendance.observation || '');
        setShowObservationModal(true);
    };

    const handleSaveObservation = async () => {
        try {
            await attendanceApi.updateObservation(selectedAttendance.id, observationText);
            await loadAttendances();
            setShowObservationModal(false);
            setSelectedAttendance(null);
            setObservationText('');
            setToast({ message: 'Observación guardada exitosamente', type: 'success' });
        } catch (error) {
            console.error('Error al guardar observación:', error);
            setToast({ message: 'Error al guardar la observación', type: 'error' });
        }
    };

    const handleCloseModal = () => {
        setShowObservationModal(false);
        setSelectedAttendance(null);
        setObservationText('');
    };

    const handleSaveScheduleConfig = async (config) => {
        try {
            let savedConfig;
            
            if (scheduleConfig?.id) {
                // Actualizar configuración existente
                savedConfig = await attendanceConfigApi.update(scheduleConfig.id, config);
                setToast({ message: 'Configuración actualizada exitosamente', type: 'success' });
            } else {
                // Crear nueva configuración
                savedConfig = await attendanceConfigApi.create(config);
                setToast({ message: 'Configuración creada exitosamente', type: 'success' });
            }
            
            // Recargar configuraciones
            await loadScheduleConfigs();
            
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            setToast({ message: `Error: ${error.message}`, type: 'error' });
        }
    };

    const handleEditConfig = (config) => {
        setScheduleConfig(config);
        setShowScheduleModal(true);
    };

    const handleDeleteConfig = async (config) => {
        if (!confirm(`¿Estás seguro de eliminar la configuración para ${config.classroom_code}-${config.classroom_section}?`)) {
            return;
        }

        try {
            await attendanceConfigApi.delete(config.id);
            setToast({ message: 'Configuración eliminada exitosamente', type: 'success' });
            await loadScheduleConfigs();
        } catch (error) {
            console.error('Error al eliminar configuración:', error);
            setToast({ message: `Error: ${error.message}`, type: 'error' });
        }
    };

    const handleToggleConfig = async (config) => {
        try {
            await attendanceConfigApi.toggle(config.id);
            const action = config.enabled === 'A' ? 'deshabilitada' : 'habilitada';
            setToast({ message: `Configuración ${action} exitosamente`, type: 'success' });
            await loadScheduleConfigs();
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            setToast({ message: `Error: ${error.message}`, type: 'error' });
        }
    };

    const handleNewConfig = () => {
        setScheduleConfig(null);
        setShowScheduleModal(true);
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 pb-8 font-['Livvic']">
            <AttendanceFilters 
                activeFilter={activeFilter}
                onFilterClick={handleFilterClick}
                onShowModal={setShowFilterModal}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onShowScheduleConfig={handleNewConfig}
            />

            <AttendanceStats stats={stats} />
            
            {/* Lista de configuraciones */}
            <AttendanceConfigList
                configs={allConfigs}
                loading={loadingConfigs}
                onEdit={handleEditConfig}
                onDelete={handleDeleteConfig}
                onToggle={handleToggleConfig}
            />
            
            <AttendanceTable 
                attendances={filteredAttendances}
                loading={loading}
                onOpenObservation={handleOpenObservation}
            />

            <ObservationModal 
                show={showObservationModal}
                attendance={selectedAttendance}
                observationText={observationText}
                onObservationChange={setObservationText}
                onSave={handleSaveObservation}
                onClose={handleCloseModal}
            />

            {/* Modal de Filtro - Sección */}
            {showFilterModal === 'seccion' && (
                <AttendanceFilterModal
                    type="seccion"
                    onClose={() => setShowFilterModal(null)}
                    onSelect={handleSeccionSelect}
                />
            )}

            {/* Modal de Filtro - Estado */}
            {showFilterModal === 'estado' && (
                <AttendanceFilterModal
                    type="estado"
                    onClose={() => setShowFilterModal(null)}
                    onSelect={handleEstadoSelect}
                />
            )}

            {/* Modal de Configuración de Horarios */}
            <AttendanceScheduleModal
                show={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                onSave={handleSaveScheduleConfig}
                currentConfig={scheduleConfig}
            />

            {/* Toast de notificaciones */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
