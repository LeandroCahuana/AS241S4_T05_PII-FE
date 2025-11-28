import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export default function AttendanceSearch({ searchTerm, onSearchChange, selectedAula, onAulaChange }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const aulas = ['A', 'B'];

    const handleSelectAula = (aula) => {
        onAulaChange(aula);
        setShowDropdown(false);
    };

    return (
        <div className="flex items-center justify-between gap-3 mb-6 font-['Livvic']">
            <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar estudiantes..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base">✨</span>
            </div>
            
            <div className="relative">
                <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2"
                >
                    Aula "{selectedAula}" <ChevronDown className="w-3 h-3" />
                </button>
                
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        {aulas.map((aula) => (
                            <button
                                key={aula}
                                onClick={() => handleSelectAula(aula)}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                    selectedAula === aula ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                                }`}
                            >
                                Aula "{aula}"
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
