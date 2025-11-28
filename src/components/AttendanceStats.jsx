import { UserCheck, Clock, UserX, Users } from 'lucide-react';

export default function AttendanceStats({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 font-['Livvic']">
            {/* Card Verde - Presentes */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2" style={{ backgroundColor: '#e8f5e9', borderColor: '#4caf50' }}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-4xl font-bold text-gray-900">{stats.present}</div>
                        <div className="text-sm text-gray-600 mt-1">Estudiantes Presentes</div>
                    </div>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#4caf50' }}>
                        <UserCheck className="w-7 h-7 text-white" />
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Porcentaje</span>
                        <span className="font-bold" style={{ color: '#4caf50' }}>
                            {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
                        </span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ backgroundColor: '#c8e6c9' }}>
                        <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                                width: `${stats.total > 0 ? (stats.present / stats.total) * 100 : 0}%`,
                                backgroundColor: '#4caf50'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Card Naranja - Tardanzas */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2" style={{ backgroundColor: '#fff3e0', borderColor: '#ff9800' }}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-4xl font-bold text-gray-900">{stats.late}</div>
                        <div className="text-sm text-gray-600 mt-1">Estudiantes con Tardanza</div>
                    </div>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#ff9800' }}>
                        <Clock className="w-7 h-7 text-white" />
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Porcentaje</span>
                        <span className="font-bold" style={{ color: '#ff9800' }}>
                            {stats.total > 0 ? Math.round((stats.late / stats.total) * 100) : 0}%
                        </span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ backgroundColor: '#ffe0b2' }}>
                        <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                                width: `${stats.total > 0 ? (stats.late / stats.total) * 100 : 0}%`,
                                backgroundColor: '#ff9800'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Card Rosa - Ausentes */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2" style={{ backgroundColor: '#fce4ec', borderColor: '#e91e63' }}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-4xl font-bold text-gray-900">{stats.absent}</div>
                        <div className="text-sm text-gray-600 mt-1">Estudiantes Ausentes</div>
                    </div>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e91e63' }}>
                        <UserX className="w-7 h-7 text-white" />
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Porcentaje</span>
                        <span className="font-bold" style={{ color: '#e91e63' }}>
                            {stats.total > 0 ? Math.round((stats.absent / stats.total) * 100) : 0}%
                        </span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ backgroundColor: '#f8bbd0' }}>
                        <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                                width: `${stats.total > 0 ? (stats.absent / stats.total) * 100 : 0}%`,
                                backgroundColor: '#e91e63'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Card Azul - Total */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2" style={{ backgroundColor: '#e3f2fd', borderColor: '#2196f3' }}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-4xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600 mt-1">Total de Estudiantes</div>
                    </div>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2196f3' }}>
                        <Users className="w-7 h-7 text-white" />
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Porcentaje</span>
                        <span className="font-bold" style={{ color: '#2196f3' }}>100%</span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ backgroundColor: '#bbdefb' }}>
                        <div className="h-2 rounded-full w-full" style={{ backgroundColor: '#2196f3' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
