const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = BASE + '/teachings';

export const teachingApi = {

  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener evaluadores');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getActive: async () => {
    try {
      const response = await fetch(`${API_URL}/status/A`);
      if (!response.ok) throw new Error('Error al obtener los evaluadores activos');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getInactive: async () => {
    try {
      const response = await fetch(`${API_URL}/status/I`);
      if (!response.ok) throw new Error('Error al obtener los evaluadores inactivos');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Error al obtener evaluador');
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  create: async (teachingData) => {
    try {
      const response = await fetch(`${API_URL}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teachingData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear evaluador');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  update: async (id, teachingData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teachingData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar evaluador');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  deleteLogical: async (id) => {
    try {
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar evaluador');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  restore: async (id) => {
    try {
      const response = await fetch(`${API_URL}/restore/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al restaurar evaluador');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};