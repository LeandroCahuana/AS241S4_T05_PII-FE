import { useNavigate, useLocation } from 'react-router-dom';
import { User, LayoutDashboard, Users, PieChart, ClipboardList, FileText, Trophy, Package, Mail, FileCheck, Calendar, Bell } from 'lucide-react';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveItem = () => {
        const path = location.pathname;
        if (path === '/') return 'dashboard';
        if (path === '/students') return 'registro';
        if (path === '/challenges') return 'retos';
        if (path === '/attendance') return 'asistencia';
        if (path === '/teaching') return 'evaluadores';
        if (path === '/ranking') return 'ranking';
        if (path === '/classrooms') return 'classrooms';
        if (path === '/classrooms-schedule') return 'classrooms-schedule';
        if (path === '/evaluationPage') return 'evaluationPage';
        return 'dashboard';
    };

    const activeItem = getActiveItem();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard, path: '/' },
        { id: 'registro', label: 'Registro de Estudiantes', Icon: Users, path: '/students' },
        { id: 'retos', label: 'Retos y Criterios', Icon: PieChart, path: '/challenges' },
        { id: 'asistencia', label: 'Control de la asistencia', Icon: ClipboardList, path: '/attendance' },
        { id: 'evaluadores', label: 'Gestor de Evaluadores', Icon: FileText, path: '/teaching' },
        { id: 'ranking', label: 'Ranking y Resultados', Icon: Trophy, path: '/ranking' }
    ];

    const quickAccess = [
        { id: 'enviar', label: 'Enviar Invitación', Icon: Mail, bgColor: '#003566', path: '/invitations' },
        { id: 'hackathon', label: 'Hackathon', Icon: FileCheck, bgColor: '#10b981', path: '/classrooms' },
        { id: 'calendario', label: 'Ver Calendario', Icon: Calendar, bgColor: '#8b5cf6', path: '/classroom-schedule' },
        { id: 'configurar', label: 'Evaluacion', Icon: FileCheck, bgColor: '#fbbf24', path: 'evaluationPage' }
    ];

    return (
        <div className="w-72 h-full bg-gray-50 flex flex-col py-6 px-4 overflow-hidden">
            {/* Profile Card - Fixed at top */}
            <div className="mb-6 shrink-0">
                <div 
                    className="rounded-3xl p-5 shadow-2xl relative overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-900/50"
                    style={{ backgroundColor: '#003566' }}
                >
                    {/* Gradient overlay effect */}
                    <div 
                        className="absolute inset-0 opacity-30"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0,53,102,0.8) 0%, rgba(0,29,61,0.9) 100%)'
                        }}
                    ></div>
                    
                    <div className="relative flex items-start gap-3 mb-4">
                        {/* Avatar circular with glow effect */}
                        <div className="w-14 h-14 bg-white rounded-full shrink-0 flex items-center justify-center shadow-lg backdrop-blur-sm border-2 border-white/20 transition-transform duration-300 hover:scale-110">
                            <User className="w-7 h-7 text-blue-900" />
                        </div>
                        
                        {/* User Info */}
                        <div className="flex flex-col gap-1 flex-1 pt-1">
                            <h3 className="text-white text-sm font-bold">Docente</h3>
                            <p className="text-white text-xs opacity-90">docente@vallegrande.edu.pe</p>
                        </div>
                    </div>
                    
                    {/* Status Badge with glow animation */}
                    <div className="relative flex justify-start">
                        <div 
                            className="rounded-full px-4 py-1.5 flex items-center gap-2 backdrop-blur-sm border border-emerald-400/30 transition-all duration-300 hover:scale-105 relative overflow-visible"
                            style={{ 
                                backgroundColor: '#10b981',
                                boxShadow: '0 0 20px rgba(16, 185, 129, 0.6), 0 0 40px rgba(16, 185, 129, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            {/* Animated glow ring */}
                            <div 
                                className="absolute inset-0 rounded-full animate-pulse"
                                style={{
                                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.8), 0 0 60px rgba(16, 185, 129, 0.4)',
                                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                }}
                            ></div>
                            
                            <div className="relative flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-lg shadow-white/50"></div>
                                <span className="text-white text-xs font-semibold">En línea</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 -mr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                {/* Navigation Menu */}
                <nav className="space-y-1 mb-6">
                    {menuItems.map((item) => {
                        const isActive = activeItem === item.id;
                        const Icon = item.Icon;
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3.5 rounded-xl 
                                    transition-all duration-300 ease-in-out
                                    ${isActive 
                                        ? 'text-white shadow-2xl transform scale-[1.02]' 
                                        : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-[1.01]'
                                    }
                                `}
                                style={isActive ? { 
                                    backgroundColor: '#0c4a6e',
                                    boxShadow: '0 8px 24px rgba(12, 74, 110, 0.35), 0 0 0 1px rgba(12, 74, 110, 0.1)'
                                } : {}}
                            >
                                <div className={`
                                    flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300
                                    ${isActive ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-50'}
                                `}>
                                    <Icon 
                                        className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
                                        strokeWidth={2}
                                    />
                                </div>
                                <span className="text-sm font-semibold text-left">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Quick Access Section */}
                <div className="pt-6 border-t border-gray-200 pb-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Package className="w-4 h-4" style={{ color: '#0c4a6e' }} />
                        <h4 
                            className="text-xs font-bold uppercase tracking-wide"
                            style={{ color: '#0c4a6e' }}
                        >
                            Accesos Rápidos
                        </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {quickAccess.map((item) => {
                            const Icon = item.Icon;
                            
                            return (
                                <button
                                    key={item.id}
                                    className="flex flex-col items-center gap-2 bg-white rounded-xl p-3 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1"
                                    onClick={() => navigate(item.path)}
                                >
                                    <div 
                                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-110"
                                        style={{ backgroundColor: item.bgColor }}
                                    >
                                        <Icon className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                                    </div>
                                    <span className="text-gray-700 text-xs font-medium text-center leading-tight">
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Custom scrollbar styles */}
            <style>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 3px;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </div>
    );
}