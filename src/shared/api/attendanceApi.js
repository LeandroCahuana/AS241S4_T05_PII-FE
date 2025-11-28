const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = BASE +'/attendance';

export const attendanceApi = {
  // GET - Obtener todas las asistencias
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener asistencias');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // GET - Obtener por estado (A = Presente, T = Tardanza, F = Falta)
  getByStatus: async (status) => {
    try {
      const response = await fetch(`${API_URL}/status/${status}`);
      if (!response.ok) throw new Error('Error al obtener asistencias por estado');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // GET - Accesos directos
  getPresent: async () => {
    try {
      const response = await fetch(`${API_URL}/A`);
      if (!response.ok) throw new Error('Error al obtener presentes');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getLate: async () => {
    try {
      const response = await fetch(`${API_URL}/T`);
      if (!response.ok) throw new Error('Error al obtener tardanzas');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getAbsent: async () => {
    try {
      const response = await fetch(`${API_URL}/F`);
      if (!response.ok) throw new Error('Error al obtener faltas');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // GET - Obtener por ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Error al obtener asistencia');
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // POST - Crear asistencia
  create: async (attendanceData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendanceData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear asistencia');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // PATCH - Actualizar observación
  updateObservation: async (id, observation) => {
    try {
      const response = await fetch(`${API_URL}/${id}/observation`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ observation }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar observación');
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};
