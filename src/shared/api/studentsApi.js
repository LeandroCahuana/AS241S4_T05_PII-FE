const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = BASE + '/students';

export const studentsApi = {
  // GET - Obtener todos los estudiantes
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener estudiantes');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // GET - Obtener estudiantes activos
  getActive: async () => {
    try {
      const response = await fetch(`${API_URL}/status/A`); // ✅ CORREGIDO
      if (!response.ok) throw new Error('Error al obtener estudiantes activos');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // GET - Obtener estudiantes inactivos
  getInactive: async () => {
    try {
      const response = await fetch(`${API_URL}/status/I`); // ✅ CORREGIDO
      if (!response.ok) throw new Error('Error al obtener estudiantes inactivos');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // GET - Obtener un estudiante por ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Error al obtener estudiante');
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // GET - Obtener estudiantes por semestre
  getBySemester: async (semester) => {
    try {
      const response = await fetch(`${API_URL}/semester/${semester}`);
      if (!response.ok) throw new Error('Error al obtener estudiantes por semestre');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // GET - Obtener estudiantes por classroom (código + sección)
  getByClassroom: async (code, section) => {
    try {
      const response = await fetch(`${API_URL}/classroom/${code}/${section}`);
      if (!response.ok) throw new Error('Error al obtener estudiantes por aula');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // POST - Crear nuevo estudiante
  create: async (studentData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear estudiante');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // PUT - Actualizar estudiante existente
  update: async (id, studentData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar estudiante');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // PATCH - Eliminación lógica (cambiar status a 'I')
  deleteLogical: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/delete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar estudiante');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // PATCH - Restaurar estudiante (cambiar status a 'A')
  restore: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/restore`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al restaurar estudiante');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};