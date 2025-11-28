import { X } from 'lucide-react';
import { useState } from 'react';

export default function TeachingFilterModal({ onClose, onApplyFilters, currentFilters }) {
  const [filters, setFilters] = useState({
    type_document: currentFilters?.type_document || '',
    status: currentFilters?.status || ''
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters = {
      type_document: '',
      status: ''
    };
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#003566]">Filtrar Evaluadores</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Tipo de Documento */}
          <div>
            <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
              Tipo de Documento
            </label>
            <select
              name="type_document"
              value={filters.type_document}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]"
            >
              <option value="">Todos</option>
              <option value="DNI">DNI</option>
              <option value="CE">Carnet de Extranjería</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
              Estado
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]"
            >
              <option value="">Todos</option>
              <option value="A">Activo</option>
              <option value="I">Inactivo</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 px-6 py-3 bg-[#d9d9d9] text-[#4a4a4a] rounded-full font-medium hover:bg-[#c0c0c0] transition-colors"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 px-6 py-3 bg-[#ffd60a] text-[#003566] rounded-full font-medium hover:bg-[#ffed4e] transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}