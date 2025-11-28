import { useState, useEffect } from "react";
import { X, Package, FileText, UserCheck } from "lucide-react";
import { classroomApi } from "../shared/api/classroomApi";

export default function SmartFilterModal({
    filterType,
    activeTab,
    onClose,
    onSelect
}) {
    const [classrooms, setClassrooms] = useState([]);
    const [loadingClassrooms, setLoadingClassrooms] = useState(false);

    useEffect(() => {
        if (filterType === "seccion") {
            loadClassrooms();
        }
    }, [filterType]);

    const loadClassrooms = async () => {
        try {
            setLoadingClassrooms(true);
            const data = await classroomApi.getActive();
            setClassrooms(data);
        } catch (error) {
            console.error("Error al cargar classrooms:", error);
        } finally {
            setLoadingClassrooms(false);
        }
    };

    const seccionOptions = classrooms.map(classroom => ({
        label: `${classroom.code}-${classroom.section}`,
        value: `${classroom.code}-${classroom.section}`
    }));

    const OPTIONS = {
        tipo: [
            { label: "Casos", value: "CASO", icon: <Package size={22} className="text-white" /> },
            { label: "Criterios", value: "CRITERIO", icon: <FileText size={22} className="text-white" /> },
        ],
        seccion: seccionOptions,
        estado: [
            { label: "Activo", value: "A" },
            { label: "Inactivo", value: "I" },
        ]
    };

    const titleMap = {
        tipo: "Filtrar por Tipo",
        seccion: "Filtrar por Sección",
        estado: "Filtrar por Estado"
    };

    const iconMap = {
        tipo: <Package className="text-white" size={24} />,
        seccion: <FileText className="text-white" size={24} />,
        estado: <UserCheck className="text-white" size={24} />,
    };

    const bgMap = {
        tipo: "bg-[#8B5CF6]",
        seccion: "bg-[#1447E6]",
        estado: "bg-[#01AF74]",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-[320px] animate-fadeIn">
                
                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X size={20} />
                </button>

                {/* HEADER */}
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgMap[filterType]}`}>
                        {iconMap[filterType]}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                        {titleMap[filterType]}
                    </h3>
                </div>

                {/* OPTIONS */}
                <div className="space-y-2">
                    {loadingClassrooms && filterType === "seccion" ? (
                        <div className="text-center py-4 text-gray-500">
                            Cargando secciones...
                        </div>
                    ) : OPTIONS[filterType].length === 0 && filterType === "seccion" ? (
                        <div className="text-center py-4 text-gray-500">
                            No hay secciones disponibles
                        </div>
                    ) : (
                        OPTIONS[filterType].map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => onSelect(opt.value)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-xl transition font-medium text-gray-700"
                            >
                            {opt.icon && <span className="mr-2 inline-block">{opt.icon}</span>}
                                {opt.label}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
