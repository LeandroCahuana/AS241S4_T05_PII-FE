import { Grid3x3, FileText, UserCheck, Search, Settings } from 'lucide-react';

export default function AttendanceFilters({ activeFilter, onFilterClick, onShowModal, searchTerm, onSearchChange, onShowScheduleConfig }) {
    return (
        <div className="relative bg-[#859ECA] rounded-3xl px-10 py-6 overflow-visible shadow-lg font-['Livvic']">
            {/* Manchas decorativas */}
            <div className="absolute top-8 right-64 w-32 h-32 bg-[#9CB3DD] rounded-full opacity-40 blur-2xl"></div>
            <div className="absolute bottom-12 left-32 w-40 h-40 bg-[#9CB3DD] rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute top-20 left-1/3 w-24 h-24 bg-[#9CB3DD] rounded-full opacity-25 blur-2xl"></div>
            
            <div className="relative z-10">
                {/* Título */}
                <h1 className="text-white text-[26px] font-light mb-5 tracking-wide">
                    CONTROL DE ASISTENCIA
                </h1>
                
                {/* Contenedor de filtros y búsqueda */}
                <div className="flex items-center justify-between gap-6">
                    {/* Botones de filtro */}
                    <div className="flex items-center gap-3">
                        {/* Filtro ALL */}
                        <button
                            onClick={() => onFilterClick("all")}
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

                        {/* Filtro SECCIÓN */}
                        <button
                            onClick={() => onShowModal("seccion")}
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
                            onClick={() => onShowModal("estado")}
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

                        {/* Configuración de Horarios */}
                        <button
                            onClick={onShowScheduleConfig}
                            className="flex flex-col items-center justify-center gap-1.5 w-[70px] h-[70px] rounded-2xl border-2 border-white/50 transition-all bg-white/10 hover:bg-white/15"
                        >
                            <div className="w-10 h-10 bg-[#3C6C99] rounded-full flex items-center justify-center">
                                <Settings size={20} className="text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-white text-[10px] font-medium tracking-wide">HORARIO</span>
                        </button>
                    </div>

                    {/* Barra de búsqueda */}
                    <div className="relative flex-1 max-w-md ml-auto mr-32">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar estudiantes por nombre, correo..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-14 pr-14 py-3.5 bg-white rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl">✨</span>
                    </div>
                </div>
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
    );
}
