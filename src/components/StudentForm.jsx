import { useState, useEffect } from 'react';
import { X, AlertCircle, Loader } from 'lucide-react';

export default function StudentForm({ student, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    type_document: 'DNI',
    number_docum: '',
    name_student: '',
    lastname: '',
    email: '',
    semester: '2',
    status: 'A'
  });

  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      const emailPart = student.email ? student.email.split('@')[0] : '';
      
      setFormData({
        type_document: student.type_document || 'DNI',
        number_docum: student.number_docum || '',
        name_student: student.name_student || '',
        lastname: student.lastname || '',
        email: emailPart,
        semester: student.semester?.toString() || '2',
        status: student.status || 'A'
      });
    }
  }, [student]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type_document) {
      newErrors.type_document = 'Seleccione un tipo de documento';
    }

    if (!formData.number_docum.trim()) {
      newErrors.number_docum = 'El número de documento es requerido';
    } else if (formData.type_document === 'DNI') {
      if (!/^\d{8}$/.test(formData.number_docum)) {
        newErrors.number_docum = 'DNI debe tener exactamente 8 dígitos';
      }
    } else if (formData.type_document === 'CE') {
      if (formData.number_docum.length > 20) {
        newErrors.number_docum = 'Carnet de extranjería no puede superar 20 caracteres';
      } else if (formData.number_docum.length < 9) {
        newErrors.number_docum = 'Carnet de extranjería debe tener al menos 9 caracteres';
      }
    }

    if (!formData.name_student.trim()) {
      newErrors.name_student = 'Los nombres son requeridos';
    } else if (formData.name_student.length > 70) {
      newErrors.name_student = 'Máximo 70 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name_student)) {
      newErrors.name_student = 'Solo se permiten letras y espacios';
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Los apellidos son requeridos';
    } else if (formData.lastname.length > 120) {
      newErrors.lastname = 'Máximo 120 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.lastname)) {
      newErrors.lastname = 'Solo se permiten letras y espacios';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (formData.email.length > 150) {
      newErrors.email = 'Máximo 150 caracteres';
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.email)) {
      newErrors.email = 'Formato inválido (solo letras, números, puntos, guiones)';
    }

    if (!formData.semester) {
      newErrors.semester = 'El semestre es requerido';
    }

    setErrors(newErrors);
    setServerErrors({});
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'number_docum') {
      if (formData.type_document === 'DNI') {
        if (value === '' || /^\d{0,8}$/.test(value)) {
          setFormData({ ...formData, [name]: value });
        }
      } else if (formData.type_document === 'CE') {
        if (value.length <= 20) {
          setFormData({ ...formData, [name]: value });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleDocumentTypeChange = (e) => {
    const newType = e.target.value;
    setFormData({
      ...formData,
      type_document: newType,
      number_docum: ''
    });
    
    if (errors.type_document || errors.number_docum) {
      setErrors({
        ...errors,
        type_document: '',
        number_docum: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setServerErrors({});

    try {
      const dataToSubmit = {
        ...formData,
        email: `${formData.email}@vallegrande.edu.pe`,
        semester: parseInt(formData.semester)
      };

      await onSubmit(dataToSubmit);
    } catch (error) {
      // Capturar error del servidor
      if (error.response?.data?.error) {
        const errorMsg = error.response.data.error;
        if (typeof errorMsg === 'object') {
          setServerErrors(errorMsg);
        } else {
          setServerErrors({ general: errorMsg });
        }
      } else if (error.message) {
        setServerErrors({ general: error.message });
      } else {
        setServerErrors({ general: 'Error al guardar el estudiante' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#003566]">
            {student ? 'Editar Estudiante' : 'Nuevo Estudiante'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {Object.keys(serverErrors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-medium text-red-800 mb-2">Errores de validación</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  {Object.entries(serverErrors).map(([key, msg]) => (
                    <li key={key}>• {typeof msg === 'string' ? msg : JSON.stringify(msg)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Tipo de Documento <span className="text-red-500">*</span>
              </label>
              <select
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

            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Número de Documento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.number_docum}
                onChange={(e) => handleChange({ target: { name: 'number_docum', value: e.target.value } })}
                maxLength={formData.type_document === 'DNI' ? 8 : 20}
                className={`w-full px-4 py-2 border ${errors.number_docum ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                placeholder={formData.type_document === 'DNI' ? 'Ej: 12345678' : 'Ej: CE12345678'}
              />
              {errors.number_docum && (
                <p className="text-red-500 text-xs mt-1">{errors.number_docum}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                {formData.type_document === 'DNI' 
                  ? '8 dígitos numéricos' 
                  : '9-20 caracteres alfanuméricos'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Nombres <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name_student}
                onChange={(e) => handleChange({ target: { name: 'name_student', value: e.target.value } })}
                maxLength="70"
                className={`w-full px-4 py-2 border ${errors.name_student ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                placeholder="Ej: Juan Carlos"
              />
              {errors.name_student && (
                <p className="text-red-500 text-xs mt-1">{errors.name_student}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Apellidos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastname}
                onChange={(e) => handleChange({ target: { name: 'lastname', value: e.target.value } })}
                maxLength="120"
                className={`w-full px-4 py-2 border ${errors.lastname ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                placeholder="Ej: Pérez López"
              />
              {errors.lastname && (
                <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Correo Institucional <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleChange({ target: { name: 'email', value: e.target.value } })}
                  maxLength="150"
                  className={`flex-1 px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                  placeholder="usuario"
                />
                <span className="px-4 py-2 bg-gray-100 border border-l-0 border-[#d9d9d9] rounded-r-lg text-gray-600 text-sm">
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

            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Semestre <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.semester}
                onChange={(e) => handleChange({ target: { name: 'semester', value: e.target.value } })}
                className={`w-full px-4 py-2 border ${errors.semester ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
              </select>
              {errors.semester && (
                <p className="text-red-500 text-xs mt-1">{errors.semester}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#d9d9d9] text-[#4a4a4a] rounded-full font-medium hover:bg-[#c0c0c0] transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#ffd60a] text-[#003566] rounded-full font-medium hover:bg-[#ffed4e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {student ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}