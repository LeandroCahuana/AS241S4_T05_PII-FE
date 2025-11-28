import { ChevronDown, Settings } from 'lucide-react';

export default function AttendanceHeader() {
    return (
        <div className="flex items-center justify-between mb-6 font-['Livvic']">
            <h1 className="text-3xl font-normal text-gray-900">Control De Asistencia</h1>
            <div className="flex items-center gap-3">
                <button 
                    className="px-6 py-2.5 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
                    style={{ backgroundColor: '#3C6C99' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5273'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3C6C99'}
                >
                    + Activar Asistencia
                </button>
                <button 
                    className="px-4 py-2.5 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
                    style={{ backgroundColor: '#9DB5CC' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#8aa5bb'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#9DB5CC'}
                >
                    Semestre <ChevronDown className="w-4 h-4" />
                </button>
                <button 
                    className="p-2.5 text-white rounded-xl transition-colors"
                    style={{ backgroundColor: '#3C6C99' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5273'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3C6C99'}
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
