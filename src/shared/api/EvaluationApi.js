const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE}/evaluation`;

export const getAllEvaluations = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al listar evaluaciones");
  return data.data || [];
};

export const getEvaluationById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al obtener evaluación");
  return data.data;
};

export const createEvaluation = async (payload) => {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Error al crear evaluación");
  }

  return response.json();
};

