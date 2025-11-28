import { useState, useEffect } from 'react';
import { X, AlertCircle, Loader, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { classroomApi } from '../shared/api/classroomApi';

export default function ChallengeForm({ challenge, onClose, onSubmit, formType = 'CASO' }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        classroom_code: '',
        classroom_section: '',
        name_challenge: '',
        description: '',
        objective: '',
        case: '',
        challenges: '',
        tools: '',
        specific_tasks: '',
        standards: '',
        restrictions: '',
        status: 'A',
        details: []
    });

    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [classrooms, setClassrooms] = useState([]);
    const [availableCodes, setAvailableCodes] = useState([]);
    const [availableSections, setAvailableSections] = useState([]);
    const [loadingClassrooms, setLoadingClassrooms] = useState(false);

    const totalSteps = formType === 'CASO' ? 4 : 3;

    // Cargar aulas desde la API
    useEffect(() => {
        loadClassrooms();
    }, []);

    const loadClassrooms = async () => {
        try {
            setLoadingClassrooms(true);
            const classroomsData = await classroomApi.getActive();
            
            // Ordenar alfabéticamente
            classroomsData.sort((a, b) => {
                const codeCompare = a.code.localeCompare(b.code);
                if (codeCompare !== 0) return codeCompare;
                return a.section.localeCompare(b.section);
            });
            
            setClassrooms(classroomsData);
            
            // Extraer códigos únicos
            const codes = [...new Set(classroomsData.map(c => c.code))].sort();
            setAvailableCodes(codes);
        } catch (error) {
            console.error('Error al cargar aulas:', error);
        } finally {
            setLoadingClassrooms(false);
        }
    };

    // Actualizar secciones disponibles cuando cambia el código
    useEffect(() => {
        if (formData.classroom_code) {
            const sections = classrooms
                .filter(c => c.code === formData.classroom_code)
                .map(c => c.section)
                .sort();
            setAvailableSections(sections);
            
            // Si la sección actual no está disponible, limpiarla
            if (!sections.includes(formData.classroom_section)) {
                setFormData(prev => ({ ...prev, classroom_section: '' }));
            }
        } else {
            setAvailableSections([]);
        }
    }, [formData.classroom_code, classrooms]);

    useEffect(() => {
        if (challenge) {
            setFormData({
                classroom_code: challenge.classroom_code || '',
                classroom_section: challenge.classroom_section || '',
                name_challenge: challenge.name_challenge || '',
                description: challenge.description || '',
                objective: challenge.objective || '',
                case: challenge.case || '',
                challenges: challenge.challenges || '',
                tools: challenge.tools || '',
                specific_tasks: challenge.specific_tasks || '',
                standards: challenge.standards || '',
                restrictions: challenge.restrictions || '',
                status: challenge.status || 'A',
                details: challenge.details || []
            });
        }
    }, [challenge]);

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.classroom_code) {
                newErrors.classroom_code = 'Seleccione un código de aula';
            }
            if (!formData.classroom_section) {
                newErrors.classroom_section = 'Seleccione una sección';
            }
            if (!formData.name_challenge.trim()) {
                newErrors.name_challenge = 'El nombre del reto es requerido';
            } else if (formData.name_challenge.length > 250) {
                newErrors.name_challenge = 'Máximo 250 caracteres';
            }
            if (!formData.description.trim()) {
                newErrors.description = 'La descripción es requerida';
            } else if (formData.description.length > 1000) {
                newErrors.description = 'Máximo 1000 caracteres';
            }
        }

        if (step === 2 && formType === 'CASO') {
            if (!formData.objective.trim()) {
                newErrors.objective = 'El objetivo es requerido';
            } else if (formData.objective.length > 255) {
                newErrors.objective = 'Máximo 255 caracteres';
            }
            if (!formData.case.trim()) {
                newErrors.case = 'El caso es requerido';
            } else if (formData.case.length > 1500) {
                newErrors.case = 'Máximo 1500 caracteres';
            }
        }

        if ((step === 3 && formType === 'CASO') || (step === 2 && formType === 'CRITERIO')) {
            if (formData.challenges && formData.challenges.length > 5000) {
                newErrors.challenges = 'Máximo 5000 caracteres';
            }
            if (formData.tools && formData.tools.length > 300) {
                newErrors.tools = 'Máximo 300 caracteres';
            }
            if (formData.specific_tasks && formData.specific_tasks.length > 5000) {
                newErrors.specific_tasks = 'Máximo 5000 caracteres';
            }
        }

        if ((step === 4 && formType === 'CASO') || (step === 3 && formType === 'CRITERIO')) {
            if (formData.standards && formData.standards.length > 5000) {
                newErrors.standards = 'Máximo 5000 caracteres';
            }
            if (formData.restrictions && formData.restrictions.length > 5000) {
                newErrors.restrictions = 'Máximo 5000 caracteres';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleClassroomCodeChange = (e) => {
        const code = e.target.value;
        setFormData({
            ...formData,
            classroom_code: code,
            classroom_section: ''
        });
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) {
            return;
        }

        setLoading(true);
        setServerErrors({});

        try {
            await onSubmit(formData);
        } catch (error) {
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
                setServerErrors({ general: 'Error al guardar el reto' });
            }
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {[...Array(totalSteps)].map((_, index) => (
                <div key={index} className="flex items-center">
                    <div className={`flex flex-col items-center ${index < totalSteps - 1 ? 'mr-4' : ''}`}>
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep > index + 1
                                    ? 'bg-green-500 text-white'
                                    : currentStep === index + 1
                                        ? 'bg-[#FFC300] text-white'
                                        : 'bg-gray-200 text-gray-400'
                                }`}
                        >
                            {currentStep > index + 1 ? <Check size={20} /> : index + 1}
                        </div>
                        <span className={`text-xs mt-1 ${currentStep === index + 1 ? 'text-[#003566] font-medium' : 'text-gray-400'}`}>
                            Paso {index + 1}
                        </span>
                    </div>
                    {index < totalSteps - 1 && (
                        <div className={`h-0.5 w-16 mb-5 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#003566]">
                        {challenge ? `Editar ${formType}` : `Nuevo ${formType}`}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {renderStepIndicator()}

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

                <div>
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-[#003566] mb-4">Información Básica</h3>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                                        Código de Aula <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.classroom_code}
                                        onChange={handleClassroomCodeChange}
                                        disabled={loadingClassrooms}
                                        className={`w-full px-4 py-2 border ${errors.classroom_code ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a] disabled:bg-gray-100`}
                                    >
                                        <option value="">
                                            {loadingClassrooms ? 'Cargando aulas...' : 'Seleccionar aula...'}
                                        </option>
                                        {availableCodes.map(code => (
                                            <option key={code} value={code}>{code}</option>
                                        ))}
                                    </select>
                                    {errors.classroom_code && (
                                        <p className="text-red-500 text-xs mt-1">{errors.classroom_code}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                                        Sección de Aula <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.classroom_section}
                                        onChange={(e) => handleChange({ target: { name: 'classroom_section', value: e.target.value } })}
                                        disabled={!formData.classroom_code || loadingClassrooms}
                                        className={`w-full px-4 py-2 border ${errors.classroom_section ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a] disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                    >
                                        <option value="">Seleccionar sección...</option>
                                        {availableSections.map(section => (
                                            <option key={section} value={section}>{section}</option>
                                        ))}
                                    </select>
                                    {errors.classroom_section && (
                                        <p className="text-red-500 text-xs mt-1">{errors.classroom_section}</p>
                                    )}
                                    {!formData.classroom_code && (
                                        <p className="text-gray-500 text-xs mt-1">Primero selecciona el código de aula</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                                    Nombre del {formType} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name_challenge"
                                    value={formData.name_challenge}
                                    onChange={handleChange}
                                    maxLength="250"
                                    className={`w-full px-4 py-2 border ${errors.name_challenge ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                                    placeholder="Ej: Sistema de Gestión Hospitalaria"
                                />
                                {errors.name_challenge && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name_challenge}</p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">{formData.name_challenge.length}/250 caracteres</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                                    Descripción <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    maxLength="1000"
                                    rows="4"
                                    className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                                    placeholder="Descripción breve del reto..."
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">{formData.description.length}/1000 caracteres</p>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && formType === 'CASO' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-[#003566] mb-4">Objetivo y Caso</h3>

                            <div>
                                <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                                    Objetivo <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="objective"
                                    value={formData.objective}
                                    onChange={handleChange}
                                    maxLength="255"
                                    rows="3"
                                    className={`w-full px-4 py-2 border ${errors.objective ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                                    placeholder="Objetivo del reto..."
                                />
                                {errors.objective && (
                                    <p className="text-red-500 text-xs mt-1">{errors.objective}</p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">{formData.objective.length}/255 caracteres</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                                    Caso <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="case"
                                    value={formData.case}
                                    onChange={handleChange}
                                    maxLength="1500"
                                    rows="6"
                                    className={`w-full px-4 py-2 border ${errors.case ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                                    placeholder="Descripción detallada del caso..."
                                />
                                {errors.case && (
                                    <p className="text-red-500 text-xs mt-1">{errors.case}</p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">{formData.case.length}/1500 caracteres</p>
                            </div>
                        </div>
                    )}

                    {((currentStep === 3 && formType === 'CASO') || (currentStep === 2 && formType === 'CRITERIO')) && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-[#003566] mb-4">Desafíos y Herramientas</h3>

                            <div>
                                <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                                    Desafíos
                                </label>
                                <textarea
                                    name="challenges"
                                    value={formData.challenges}
                                    onChange={handleChange}
                                    maxLength="5000"
                                    rows="4"
                                    className={`w-full px-4 py-2 border ${errors.challenges ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                                    placeholder="Desafíos del reto..."
                                />
                                {errors.challenges && (
                                    <p className="text-red-500 text-xs mt-1">{errors.challenges}</p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">{formData.challenges.length}/5000 caracteres</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                                    Herramientas
                                </label>
                                <input
                                    type="text"
                                    name="tools"
                                    value={formData.tools}
                                    onChange={handleChange}
                                    maxLength="300"
                                    className={`w-full px-4 py-2 border ${errors.tools ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                                    placeholder="Ej: Python, React, PostgreSQL"
                                />
                                {errors.tools && (
                                    <p className="text-red-500 text-xs mt-1">{errors.tools}</p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">{formData.tools.length}/300 caracteres</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                                    Tareas Específicas
                                </label>
                                <textarea
                                    name="specific_tasks"
                                    value={formData.specific_tasks}
                                    onChange={handleChange}
                                    maxLength="5000"
                                    rows="5"
                                    className={`w-full px-4 py-2 border ${errors.specific_tasks ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                                    placeholder="Tareas específicas a realizar..."
                                />
                                {errors.specific_tasks && (
                                    <p className="text-red-500 text-xs mt-1">{errors.specific_tasks}</p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">{formData.specific_tasks.length}/5000 caracteres</p>
                            </div>
                        </div>
                    )}

                    {((currentStep === 4 && formType === 'CASO') || (currentStep === 3 && formType === 'CRITERIO')) && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-[#003566] mb-4">Estándares y Restricciones</h3>

                            <div>
                                <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                                    Estándares
                                </label>
                                <textarea
                                    name="standards"
                                    value={formData.standards}
                                    onChange={handleChange}
                                    maxLength="5000"
                                    rows="5"
                                    className={`w-full px-4 py-2 border ${errors.standards ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                                    placeholder="Estándares de calidad y evaluación..."
                                />
                                {errors.standards && (
                                    <p className="text-red-500 text-xs mt-1">{errors.standards}</p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">{formData.standards.length}/5000 caracteres</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                                    Restricciones
                                </label>
                                <textarea
                                    name="restrictions"
                                    value={formData.restrictions}
                                    onChange={handleChange}
                                    maxLength="5000"
                                    rows="5"
                                    className={`w-full px-4 py-2 border ${errors.restrictions ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffd60a]`}
                                    placeholder="Restricciones y limitaciones..."
                                />
                                {errors.restrictions && (
                                    <p className="text-red-500 text-xs mt-1">{errors.restrictions}</p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">{formData.restrictions.length}/5000 caracteres</p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-6 mt-6 border-t">
                        {currentStep > 1 && (
                            <button
                                onClick={handlePrevious}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <ChevronLeft size={20} />
                                Anterior
                            </button>
                        )}

                        {currentStep < totalSteps ? (
                            <button
                                onClick={handleNext}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-[#003566] text-white rounded-full font-medium hover:bg-[#002244] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                Siguiente
                                <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-[#ffd60a] text-[#003566] rounded-full font-bold hover:bg-[#ffed4e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader className="w-4 h-4 animate-spin" />}
                                {challenge ? 'Actualizar' : 'Guardar'}
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-3 bg-[#d9d9d9] text-[#4a4a4a] rounded-full font-medium hover:bg-[#c0c0c0] transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}