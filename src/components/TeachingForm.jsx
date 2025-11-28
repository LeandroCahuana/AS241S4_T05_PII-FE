import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TeachingForm({ teaching, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    type_document: 'DNI',
    number_document: '',
    name_teaching: '',
    lastname: '',
    email: '',
    status: 'A'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (teaching) {

      const emailPart = teaching.email ? teaching.email.split('@')[0] : '';
      
      setFormData({
        type_document: teaching.type_document || 'DNI',
        number_document: teaching.number_document || '',
        name_teaching: teaching.name_teaching || '',
        lastname: teaching.lastname || '',
        email: emailPart,
        status: teaching.status || 'A'
      });
    }
  }, [teaching]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type_document) {
      newErrors.type_document = 'Seleccione un tipo de documento';
    }

    if (!formData.number_document.trim()) {
      newErrors.number_document = 'El número de documento es requerido';
    } else if (formData.type_document === 'DNI') {
      if (!/^\d{8}$/.test(formData.number_document)) {
        newErrors.number_document = 'DNI debe tener exactamente 8 dígitos';
      }
    } else if (formData.type_document === 'CE') {
      if (formData.number_document.length > 20) {
        newErrors.number_document = 'Carnet de extranjería no puede superar 20 caracteres';
      } else if (formData.number_document.length < 9) {
        newErrors.number_document = 'Carnet de extranjería debe tener al menos 9 caracteres';
      }
    }

    if (!formData.name_teaching.trim()) {
      newErrors.name_teaching = 'Los nombres son requeridos';
    } else if (formData.name_teaching.length > 70) {
      newErrors.name_teaching = 'Máximo 70 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name_teaching)) {
      newErrors.name_teaching = 'Solo se permiten letras';
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Los apellidos son requeridos';
    } else if (formData.lastname.length > 120) {
      newErrors.lastname = 'Máximo 120 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.lastname)) {
      newErrors.lastname = 'Solo se permiten letras';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (formData.email.length > 150) {
      newErrors.email = 'Máximo 150 caracteres';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.email)) {
      newErrors.email = 'Formato de correo inválido (solo letras, números, puntos, guiones)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validación especial para número de documento según el tipo
    if (name === 'number_document') {
      if (formData.type_document === 'DNI') {
        // Solo permite números y máximo 8 dígitos
        if (value === '' || /^\d{0,8}$/.test(value)) {
          setFormData({
            ...formData,
            [name]: value
          });
        }
      } else if (formData.type_document === 'CE') {
        // Permite alfanuméricos hasta 20 caracteres
        if (value.length <= 20) {
          setFormData({
            ...formData,
            [name]: value
          });
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Manejar cambio de tipo de documento
  const handleDocumentTypeChange = (e) => {
    const newType = e.target.value;
    setFormData({
      ...formData,
      type_document: newType,
      number_document: '' // Limpiar el número cuando cambia el tipo
    });
    
    // Limpiar errores relacionados
    if (errors.type_document || errors.number_document) {
      setErrors({
        ...errors,
        type_document: '',
        number_document: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        email: `${formData.email}@vallegrande.edu.pe`
      };
      onSubmit(dataToSubmit);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#003566]">
            {teaching ? 'Editar Evaluador' : 'Nuevo Evaluador'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-2 gap-6">
            {/* Tipo de Documento */}
            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Tipo de Documento <span className="text-red-500">*</span>
              </label>
              <select
                name="type_document"
                value={formData.type_document}
                onChange={handleDocumentTypeChange}
                className={`w-full px-4 py-2 border ${errors.type_document ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
              >
                <option value="DNI">DNI</option>
                <option value="CE">Carnet de Extranjería</option>
              </select>
              {errors.type_document && (
                <p className="text-red-500 text-xs mt-1">{errors.type_document}</p>
              )}
            </div>

            {/* Número de Documento */}
            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Número de Documento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="number_document"
                value={formData.number_document}
                onChange={handleChange}
                maxLength={formData.type_document === 'DNI' ? 8 : 20}
                className={`w-full px-4 py-2 border ${errors.number_document ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                placeholder={formData.type_document === 'DNI' ? 'Ej: 12345678' : 'Ej: CE12345678'}
              />
              {errors.number_document && (
                <p className="text-red-500 text-xs mt-1">{errors.number_document}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {formData.type_document === 'DNI' 
                  ? '8 dígitos numéricos' 
                  : '9-20 caracteres alfanuméricos'}
              </p>
            </div>

            {/* Nombres */}
            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Nombres <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name_teaching"
                value={formData.name_teaching}
                onChange={handleChange}
                maxLength="70"
                className={`w-full px-4 py-2 border ${errors.name_teaching ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                placeholder="Ej: Ana María"
              />
              {errors.name_teaching && (
                <p className="text-red-500 text-xs mt-1">{errors.name_teaching}</p>
              )}
            </div>

            {/* Apellidos */}
            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Apellidos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                maxLength="120"
                className={`w-full px-4 py-2 border ${errors.lastname ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                placeholder="Ej: Gomez De la Cruz"
              />
              {errors.lastname && (
                <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
              )}
            </div>

            {/* Email - Solo la parte antes del @ */}
            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Correo Institucional <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength="150"
                  className={`flex-1 px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                  placeholder="usuario"
                />
                <span className="px-4 py-2 bg-gray-100 border border-l-0 border-[#d9d9d9] rounded-r-lg text-gray-600">
                  @vallegrande.edu.pe
                </span>
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Solo ingrese la parte antes del @
              </p>
            </div>
        </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#d9d9d9] text-[#4a4a4a] rounded-full font-medium hover:bg-[#c0c0c0] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#ffd60a] text-[#003566] rounded-full font-medium hover:bg-[#ffed4e] transition-colors"
            >
              {teaching ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}