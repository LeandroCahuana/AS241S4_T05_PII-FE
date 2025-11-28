import { FileText, ClipboardList, Users, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
    // Datos de las tarjetas de estadísticas
    const stats = [
        {
            title: 'Casos terminados',
            value: '7/7',
            percentage: 100,
            icon: FileText,
            color: '#3b82f6'
        },
        {
            title: 'Criterios terminados',
            value: '7/7',
            percentage: 100,
            icon: ClipboardList,
            color: '#3b82f6'
        },
        {
            title: 'Evaluadores asignados',
            value: '8/8',
            percentage: 100,
            icon: Users,
            color: '#3b82f6'
        },
        {
            title: 'Total de Estudiantes',
            value: '50',
            percentage: 100,
            icon: Users,
            color: '#3b82f6'
        }
    ];

    // Datos de planificación
    const planningItems = [
        { title: 'Creación de retos', description: 'Redacción de casos prácticos para cada grupo de cada ciclo', icon: CheckCircle, iconColor: '#fbbf24' },
        { title: 'Criterios de evaluación', description: 'Redacción de los criterios de evaluación', icon: CheckCircle, iconColor: '#fbbf24' },
        { title: 'Evaluadores', description: 'Asignación de los evaluadores para cada estudiante', icon: CheckCircle, iconColor: '#fbbf24' },
        { title: 'Horario', description: 'Asignación de turnos por a cada grupo de cada ciclo', icon: Clock, iconColor: '#1e3a8a' },
        { title: 'Correos', description: 'Envío de correos a los estudiantes sobre los detalles de la hackathon', icon: Clock, iconColor: '#1e3a8a' }
    ];

    // Datos de docentes
    const teachers = [
        { name: 'Luis Aquilino, Manzo Candela', status: 'Detalles' },
        { name: 'Juana Teresa, Arenas Sánchez', status: 'Detalles' },
        { name: 'Hebert Alonso, Rivera Perez', status: 'Detalles' },
        { name: 'Juan Gabriel, Condori Jara', status: 'Detalles' },
        { name: 'Jesus, Canales Guando', status: 'Detalles' }
    ];

    return (
        <div className="space-y-6">
            {/* Título principal */}
            <h1 className="text-5xl font-bold text-gray-900 mb-8">DASHBOARD</h1>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div 
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Icono en la esquina superior derecha */}
                            <div 
                                className="absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: stat.color }}
                            >
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Valor principal */}
                            <div className="text-4xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </div>

                            {/* Título */}
                            <div className="text-sm text-gray-600 mb-4">
                                {stat.title}
                            </div>

                            {/* Barra de progreso */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Porcentaje</span>
                                    <span className="font-bold" style={{ color: stat.color }}>
                                        {stat.percentage}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="h-2 rounded-full transition-all duration-500"
                                        style={{ 
                                            width: `${stat.percentage}%`,
                                            backgroundColor: stat.color
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sección de Planificación y Docentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Planificación */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">PLANIFICACIÓN</h2>
                    <div className="space-y-4">
                        {planningItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div 
                                    key={index}
                                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                    </div>
                                    <div 
                                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: item.iconColor }}
                                    >
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Docentes */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">DOCENTES</h2>
                        <button className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                            View All
                        </button>
                    </div>
                    <div className="space-y-3">
                        {teachers.map((teacher, index) => (
                            <div 
                                key={index}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
                            >
                                <div 
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
                                    style={{ backgroundColor: '#fbbf24' }}
                                >
                                    👤
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                                    <p className="text-sm text-gray-600">Alumnos asignados</p>
                                </div>
                                <button 
                                    className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                                    style={{ backgroundColor: '#fbbf24' }}
                                >
                                    {teacher.status}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
