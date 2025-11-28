const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const invitationApi = {
  getAuthUrl: async () => {
    const response = await fetch(`${API_URL}/api/invitations/auth/login`);
    
    if (!response.ok) {
      throw new Error('Error al obtener URL de autenticación');
    }
    
    return response.json();
  },

  getAuthStatus: async () => {
    const response = await fetch(`${API_URL}/api/invitations/auth/status`);
    
    if (!response.ok) {
      throw new Error('Error al verificar estado de autenticación');
    }
    
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/api/invitations/auth/logout`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Error al cerrar sesión');
    }
    
    return response.json();
  },

  sendInvitation: async (invitationData) => {
    const response = await fetch(`${API_URL}/api/invitations/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invitationData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al enviar invitaciones');
    }
    
    return response.json();
  },

  getStudentEmails: async () => {
    const response = await fetch(`${API_URL}/api/invitations/students/emails`);
    
    if (!response.ok) {
      throw new Error('Error al obtener correos de estudiantes');
    }
    
    return response.json();
  },
};
