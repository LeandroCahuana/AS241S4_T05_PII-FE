const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = BASE + `/google-classroom`;

export const googleClassroomApi = {
  // Listar todos los cursos de Google Classroom
  getCourses: async () => {
    try {
      const response = await fetch(`${API_URL}/courses`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener cursos de Google Classroom');
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Obtener un curso específico
  getCourse: async (courseId) => {
    try {
      const response = await fetch(`${API_URL}/courses/${courseId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener curso');
      }
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Cerrar sesión de Google
  logout: async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cerrar sesión');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Verificar estado de autenticación
  checkAuthStatus: async () => {
    try {
      const response = await fetch(`${API_URL}/auth-status`);
      const result = await response.json();
      return {
        authenticated: response.ok,
        ...result
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        authenticated: false,
        message: 'Error al verificar autenticación'
      };
    }
  },
};
