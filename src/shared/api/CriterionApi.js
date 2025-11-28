const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = BASE + '/criterion';

export const criterionApi = {
  getAll: async () => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al obtener criterios');
    const result = await res.json();
    return result.data || [];
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Error al obtener criterio');
    const result = await res.json();
    return result.data || null;
  },

  create: async (data) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al crear criterio');
    }

    const result = await res.json();
    // el service devuelve { success, criterion_id }
    return result;
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al eliminar criterio');
    }

    const result = await res.json();
    return result;
  },

  // --- DETALLES ---

  createDetail: async (criterionId, detailData) => {
  const payload = {
    ...detailData,
    point_criterion: parseFloat(detailData.point_criterion) || 0,
  };

  const res = await fetch(`${API_URL}/${criterionId}/detail`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al crear detalle');
    }

    const result = await res.json();
    return result;
  },

  updateDetail: async (detailId, detailData) => {
    const res = await fetch(`${API_URL}/detail/${detailId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detailData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al actualizar detalle');
    }

    const result = await res.json();
    return result;
  },

  deleteDetail: async (detailId) => {
    const res = await fetch(`${API_URL}/detail/${detailId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Error al eliminar detalle');
    }

    const result = await res.json();
    return result;
  },
};

export const getCriterionDetailsByClassroom = async (code, section) => {
  const res = await fetch(`${API_URL}/classroom/${code}/${section}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Error en criterio");
  return data.data;
};