// src/shared/api/attendanceConfigApi.js
const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = BASE + '/attendance-config';

export const attendanceConfigApi = {
  // GET - Obtener todas las configuraciones
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener configuraciones');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // GET - Obtener configuración por ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Error al obtener configuración');
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // GET - Obtener configuración por aula y fecha (opcional)
  getByClassroom: async (classroomCode, classroomSection, date = null) => {
    try {
      let url = `${API_URL}/classroom/${classroomCode}/${classroomSection}`;
      if (date) {
        url += `?date=${date}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No hay configuración para esta aula
        }
        throw new Error('Error al obtener configuración por aula');
      }
      
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // GET - Obtener configuración activa con estado actual
  getActiveConfig: async (classroomCode, classroomSection) => {
    try {
      const response = await fetch(`${API_URL}/active/${classroomCode}/${classroomSection}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null; // No hay configuración activa
        }
        throw new Error('Error al obtener configuración activa');
      }
      
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // POST - Crear nueva configuración
  create: async (configData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear configuración');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // PUT - Actualizar configuración existente
  update: async (id, configData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar configuración');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // PATCH - Habilitar/Deshabilitar configuración
  toggle: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar estado');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // DELETE - Eliminar configuración
  delete: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar configuración');
      }
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};
