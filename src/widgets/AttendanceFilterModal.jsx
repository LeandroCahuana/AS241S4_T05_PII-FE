import { useState, useEffect } from 'react';
import { X, FileText, UserCheck } from 'lucide-react';
import { classroomApi } from '../shared/api/classroomApi';

export default function AttendanceFilterModal({ type, onClose, onSelect }) {
    const [classrooms, setClassrooms] = useState([]);
    const [loadingClassrooms, setLoadingClassrooms] = useState(false);

    useEffect(() => {
        if (type === 'seccion') {
            loadClassrooms();
        }
    }, [type]);

    const loadClassrooms = async () => {
        try {
            setLoadingClassrooms(true);
            const data = await classroomApi.getActive();
            setClassrooms(data);
        } catch (error) {
            console.error('Error al cargar classrooms:', error);
        } finally {
            setLoadingClassrooms(false);
        }
    };

    const seccionOptions = classrooms.map(classroom => ({
        value: `${classroom.code}-${classroom.section}`,
        label: `${classroom.code}-${classroom.section}`
    }));

    const config = {
        seccion: {
            title: 'Filtrar por Sección',
            icon: FileText,
            color: '#5B8FCC',
            options: seccionOptions
        },
        estado: {
            title: 'Filtrar por Estado',
            icon: UserCheck,
            color: '#5ECFB1',
            options: [
                { value: 'A', label: 'Presente' },
                { value: 'T', label: 'Tardanza' },
                { value: 'F', label: 'Falta' }
            ]
        }
    };

    const currentConfig = config[type];
    if (!currentConfig) return null;

    const Icon = currentConfig.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-['Livvic']">
            <style>{`
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
            
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[320px] animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X size={20} />
                </button>
                
                <div className="flex items-center gap-3 mb-4">
                    <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: currentConfig.color }}
                    >
                        <Icon size={24} className="text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{currentConfig.title}</h3>
                </div>
                
                <div className="space-y-2">
                    {loadingClassrooms && type === 'seccion' ? (
                        <div className="text-center py-4 text-gray-500">
                            Cargando secciones...
                        </div>
                    ) : currentConfig.options.length === 0 && type === 'seccion' ? (
                        <div className="text-center py-4 text-gray-500">
                            No hay secciones disponibles
                        </div>
                    ) : (
                        currentConfig.options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => onSelect(option.value)}
                                className="w-full text-left px-4 py-3 rounded-xl transition font-medium text-gray-700"
                                style={{
                                    ':hover': {
                                        backgroundColor: `${currentConfig.color}10`,
                                        color: currentConfig.color
                                    }
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = `${currentConfig.color}10`;
                                    e.target.style.color = currentConfig.color;
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#374151';
                                }}
                            >
                                {option.label}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
