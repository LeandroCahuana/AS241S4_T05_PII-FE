const BASE = import.meta.env.VITE_API_BASE_URL;
const API_URL = BASE + '/reports';

export const reportsApi = {
    /**
     * Genera y descarga un reporte en formato PDF
     * @param {Array} students - Array de estudiantes a incluir en el reporte
     * @param {Object} filters - Filtros aplicados (para mostrar en el reporte)
     * @returns {Promise<boolean>} - True si la descarga fue exitosa
     */
    generatePDF: async (students, filters = {}) => {
        try {
            const response = await fetch(`${API_URL}/students/pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ students, filters })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al generar PDF');
            }

            // Obtener el blob del PDF
            const blob = await response.blob();

            // Crear URL temporal y descargar
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte_estudiantes_${new Date().getTime()}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Limpiar
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            return true;
        } catch (error) {
            console.error('Error al generar PDF:', error);
            throw error;
        }
    },

    /**
     * Genera y descarga un reporte en formato CSV
     * @param {Array} students - Array de estudiantes a incluir en el reporte
     * @returns {Promise<boolean>} - True si la descarga fue exitosa
     */
    generateCSV: async (students) => {
        try {
            const response = await fetch(`${API_URL}/students/csv`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ students })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al generar CSV');
            }

            // Obtener el blob del CSV
            const blob = await response.blob();

            // Crear URL temporal y descargar
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte_estudiantes_${new Date().getTime()}.csv`;
            document.body.appendChild(a);
            a.click();

            // Limpiar
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            return true;
        } catch (error) {
            console.error('Error al generar CSV:', error);
            throw error;
        }
    },

    /**
     * Genera y descarga un reporte en formato Excel
     * @param {Array} students - Array de estudiantes a incluir en el reporte
     * @returns {Promise<boolean>} - True si la descarga fue exitosa
     */
    generateExcel: async (students) => {
        try {
            const response = await fetch(`${API_URL}/students/excel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ students })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al generar Excel');
            }

            // Obtener el blob del Excel
            const blob = await response.blob();

            // Crear URL temporal y descargar
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte_estudiantes_${new Date().getTime()}.xlsx`;
            document.body.appendChild(a);
            a.click();

            // Limpiar
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            return true;
        } catch (error) {
            console.error('Error al generar Excel:', error);
            throw error;
        }
    },

    /**
     * Genera todos los reportes a la vez (PDF, CSV, Excel)
     * @param {Array} students - Array de estudiantes a incluir en los reportes
     * @param {Object} filters - Filtros aplicados
     * @returns {Promise<Object>} - Objeto con el resultado de cada formato
     */
    generateAll: async (students, filters = {}) => {
        const results = {
            pdf: { success: false, error: null },
            csv: { success: false, error: null },
            excel: { success: false, error: null }
        };

        try {
            await reportsApi.generatePDF(students, filters);
            results.pdf.success = true;
        } catch (error) {
            results.pdf.error = error.message;
        }

        try {
            await reportsApi.generateCSV(students);
            results.csv.success = true;
        } catch (error) {
            results.csv.error = error.message;
        }

        try {
            await reportsApi.generateExcel(students);
            results.excel.success = true;
        } catch (error) {
            results.excel.error = error.message;
        }

        return results;
    },

    /**
     * Genera un reporte en Google Sheets
     * @param {Array} students - Array de estudiantes a incluir en el reporte
     * @param {Object} filters - Filtros aplicados
     * @param {boolean} makePublic - Si la hoja debe ser pública
     * @returns {Promise<Object>} - URL y datos de la hoja creada
     */
    generateGoogleSheet: async (students, filters = {}, makePublic = true) => {
        try {
            const response = await fetch(`${API_URL}/students/google-sheets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ students, filters, make_public: makePublic })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al generar Google Sheet');
            }

            const result = await response.json();

            // Abrir la hoja en una nueva pestaña
            window.open(result.url, '_blank');

            return result;
        } catch (error) {
            console.error('Error al generar Google Sheet:', error);
            throw error;
        }
    },

    /**
     * Comparte una hoja de Google Sheets con un usuario
     * @param {string} spreadsheetId - ID de la hoja
     * @param {string} email - Email del usuario
     * @param {string} role - Rol (reader, writer, owner)
     * @returns {Promise<boolean>}
     */
    shareGoogleSheet: async (spreadsheetId, email, role = 'reader') => {
        try {
            const response = await fetch(`${API_URL}/students/google-sheets/share`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ spreadsheet_id: spreadsheetId, email, role })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al compartir Google Sheet');
            }

            return true;
        } catch (error) {
            console.error('Error al compartir Google Sheet:', error);
            throw error;
        }
    }
};