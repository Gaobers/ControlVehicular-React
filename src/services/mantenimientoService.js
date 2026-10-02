import api from './api';

// Servicio con las operaciones CRUD de mantenimientos
export const mantenimientoService = {
  // Obtener la lista de todos los mantenimientos registrados
  obtenerTodos: async (vehiculoId = null) => {
    // Si pasas vehiculoId, filtra por vehiculo, si no, trae todos
    const url = vehiculoId ? `/mantenimientos/lista?vehiculoId=${vehiculoId}` : '/mantenimientos/lista';
    const response = await api.get(url);
    return response.data;
  },

  // Obtener un mantenimiento por su ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/mantenimientos/${id}`);
    return response.data;
  },

  // Registrar un nuevo mantenimiento
  crear: async (mantenimientoData) => {
    const response = await api.post('/mantenimientos', mantenimientoData);
    return response.data;
  },

  // Actualizar un mantenimiento existente
  actualizar: async (mantenimientoData) => {
    // El backend recibe el objeto completo incluyendo el "id" adentro
    const response = await api.put('/mantenimientos', mantenimientoData);
    return response.data;
  },

  // Eliminar / Desactivar un mantenimiento
  eliminar: async (id) => {
    const response = await api.delete(`/mantenimientos/${id}`);
    return response.data;
  },
};