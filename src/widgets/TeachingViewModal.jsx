import { X } from 'lucide-react';

export default function TeachingViewModal({ teaching, onClose }) {
  if (!teaching) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#003566]">Detalle del Evaluador</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">ID</label>
              <p className="text-gray-900 font-medium">{teaching.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Tipo de Documento</label>
              <p className="text-gray-900 font-medium">{teaching.type_document}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Número de Documento</label>
              <p className="text-gray-900 font-medium">{teaching.number_document}</p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Nombres Completos</label>
              <p className="text-gray-900 font-medium">{teaching.name_teaching}</p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Apellidos Completos</label>
              <p className="text-gray-900 font-medium">{teaching.lastname}</p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">Correo Institucional</label>
              <p className="text-gray-900 font-medium">{teaching.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Estado</label>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  teaching.status === 'A'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {teaching.status === 'A' ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>

          {/* Botón cerrar */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#ffd60a] text-[#003566] rounded-full font-medium hover:bg-[#ffed4e] transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}