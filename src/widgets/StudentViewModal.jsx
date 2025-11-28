import { X } from 'lucide-react';

export default function StudentViewModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#003566]">Detalle del Estudiante</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-semibold text-[#003566] mb-4 pb-2 border-b-2 border-[#ffd60a]">
              Información Personal
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Nombres Completos</label>
                <p className="text-gray-900 font-medium">{student.name_student || 'No especificado'}</p>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Apellidos Completos</label>
                <p className="text-gray-900 font-medium">{student.lastname || 'No especificado'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Tipo de Documento</label>
                <p className="text-gray-900 font-medium">{student.type_document || 'No especificado'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Número de Documento</label>
                <p className="text-gray-900 font-medium">{student.number_docum || 'No especificado'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Estado Actual</label>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  student.status === 'A'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {student.status === 'A' ? '✓ Activo' : '✗ Inactivo'}
              </span>
            </div>
          </div>

          {/* Información Académica */}
          <div>
            <h3 className="text-lg font-semibold text-[#003566] mb-4 pb-2 border-b-2 border-[#ffd60a]">
              Información Académica
            </h3>
            <div className="grid grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Código de Aula</label>
                <p className="text-gray-900 font-medium">{student.classroom_code || 'No especificado'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Sección</label>
                <p className="text-gray-900 font-medium">{student.classroom_section || 'No especificado'}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Correo Institucional</label>
                <p className="text-gray-900 font-medium">{student.email || 'No especificado'}</p>
              </div>
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