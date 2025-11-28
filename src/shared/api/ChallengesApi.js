const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = BASE + `/challenges`;

export const challengesApi = {
  getAll: async (includeDetails = false) => {
    try {
      const response = await fetch(`${API_URL}?details=${includeDetails}`);
      if (!response.ok) throw new Error('Error al obtener retos');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getActive: async (includeDetails = false) => {
    try {
      const response = await fetch(`${API_URL}/status/A?details=${includeDetails}`);
      if (!response.ok) throw new Error('Error al obtener retos activos');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getInactive: async (includeDetails = false) => {
    try {
      const response = await fetch(`${API_URL}/status/I?details=${includeDetails}`);
      if (!response.ok) throw new Error('Error al obtener retos inactivos');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getById: async (id, includeDetails = false) => {
    try {
      const response = await fetch(`${API_URL}/${id}?details=${includeDetails}`);
      if (!response.ok) throw new Error('Error al obtener reto');
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getByStatus: async (status, includeDetails = false) => {
    try {
      const response = await fetch(`${API_URL}/status/${status}?details=${includeDetails}`);
      if (!response.ok) throw new Error('Error al obtener retos por status');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getByClassroom: async (code, section, includeDetails = false) => {
    try {
      const response = await fetch(`${API_URL}/classroom/${code}/${section}?details=${includeDetails}`);
      if (!response.ok) throw new Error('Error al obtener retos por aula');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  create: async (challengeData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(challengeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear reto');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  update: async (id, challengeData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(challengeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar reto');
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
      const response = await fetch(`${API_URL}/${id}/delete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar reto');
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
      const response = await fetch(`${API_URL}/${id}/restore`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al restaurar reto');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  getDetails: async (challengeId) => {
    try {
      const response = await fetch(`${API_URL}/${challengeId}/details`);
      if (!response.ok) throw new Error('Error al obtener detalles');
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  createDetail: async (challengeId, detailData) => {
    try {
      const response = await fetch(`${API_URL}/${challengeId}/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(detailData)
      });

      if (!response.ok) {
        let errorMessage = 'Error al crear detalle';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = `Error ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  updateDetail: async (detailId, detailData) => {
    try {
      const response = await fetch(`${API_URL}/details/${detailId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(detailData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar detalle');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  deleteDetailLogical: async (detailId) => {
    try {
      const response = await fetch(`${API_URL}/details/${detailId}/delete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar detalle');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // PATCH - Restaurar detalle
  restoreDetail: async (detailId) => {
    try {
      const response = await fetch(`${API_URL}/details/${detailId}/restore`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al restaurar detalle');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // ---------- REPORTES ----------

  // GET - Generar reporte PDF
  generatePDF: async (challengeId) => {
    try {
      const response = await fetch(`${API_URL}/${challengeId}/report/pdf`, {
        method: 'GET',
      });

      if (!response.ok) {
        let errorMessage = 'Error al generar reporte PDF';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Descargar el PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_challenge_${challengeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    } catch (error) {
      console.error('Error generando PDF:', error);
      throw error;
    }
  },

  // POST - Generar Google Doc
  generateGoogleDoc: async (challengeId, options = {}) => {
    try {
      const { folder_id, owner_email, google_classroom_id } = options;
      
      const response = await fetch(`${API_URL}/${challengeId}/report/google-doc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folder_id,
          owner_email,
          google_classroom_id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al generar Google Doc');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // ---------- GOOGLE CLASSROOM ----------

  // POST - Publicar reto en Google Classroom
  publishToClassroom: async (challengeId) => {
    try {
      const response = await fetch(`${API_URL}/${challengeId}/publish-classroom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al publicar en Google Classroom');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // POST - Descargar reto (publica automáticamente en Classroom si está configurado)
  downloadChallenge: async (challengeId) => {
    try {
      const response = await fetch(`${API_URL}/${challengeId}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al descargar reto');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};