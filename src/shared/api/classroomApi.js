const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = BASE + "/classrooms";

export const getAllClassrooms = async () => {
    const response = await fetch(API_URL);
    const result = await response.json();
    return result.data || [];
};

export const getActive = async () => {
    try {
      const response = await fetch(`${API_URL}/status/A`);
      if (!response.ok) throw new Error('Error al obtener aulas activas');
      const result = await response.json();
      
      return result.data || [];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
};

export const autoGenerateClassrooms = async (payload) => {
    try {
        const response = await fetch(`${API_URL}/auto-generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || "Error al generar classrooms");
        }

        const result = await response.json();
        return result;
    } catch (err) {
        console.error("Error en autoGenerateClassrooms:", err);
        throw err;
    }
};

export const deleteClassroomGroup = async (code) => {
  try {
    const response = await fetch(`${API_URL}/delete-group/${code}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Error al eliminar classrooms");
    }

    return await response.json();
  } catch (err) {
    console.error("Error deleteClassroomGroup:", err);
    throw err;
  }
};

export const scheduleClassroom = async (code, section, date) => {
  try {
    const response = await fetch(`${API_URL}/${code}/${section}/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Error al asignar turno");

    return data;
  } catch (err) {
    console.error("Error scheduleClassroom:", err);
    throw err;
  }
};

export const getWeekSchedule = async (weekStart) => {
  try {
    const response = await fetch(`${API_URL}/schedule/week?week_start=${weekStart}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Error al obtener agenda");

    return data.data;
  } catch (err) {
    console.error("Error getWeekSchedule:", err);
    throw err;
  }
};

export const assignClassroomSchedule = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/assign-schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al asignar horarios");
    }

    return data;
  } catch (err) {
    console.error("Error assignClassroomSchedule:", err);
    throw err;
  }
};

export const assignClassroomAuto = async ({ week, date, code }) => {
  const res = await fetch(`${API_URL}/assign-auto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ week, date, code }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
};

export const classroomApi = {
  getAllClassrooms,
  getActive,
  autoGenerateClassrooms,
  deleteClassroomGroup,
  scheduleClassroom,
  getWeekSchedule,
  assignClassroomSchedule,
  assignClassroomAuto
};
