import API from "../api";

export const mantenimientoService = {

    obtenerTodos: async (
        vehiculoId = null,
        estado = null,
        activo = null
    ) => {

        try {

            const params = {};

            if (vehiculoId !== null) {
                params.vehiculoId = vehiculoId;
            }

            if (estado) {
                params.estado = estado;
            }

            if (activo !== null) {
                params.activo = activo;
            }


            const response = await API.get(
                "/api/mantenimientos/lista",
                {
                    params
                }
            );

            return response.data;

        } catch (error) {

            if (error.response?.status === 404) {
                return [];
            }

            throw error;
        }
    },


    obtenerPorId: async (id) => {

        const response = await API.get(
            `/api/mantenimientos/${id}`
        );

        return response.data;
    },


    crear: async (mantenimiento) => {

        const response = await API.post(
            "/api/mantenimientos",
            mantenimiento
        );

        return response.data;
    },


    actualizar: async (
        id,
        mantenimiento
    ) => {

        const response = await API.put(
            `/api/mantenimientos/${id}`,
            mantenimiento
        );

        return response.data;
    },


    eliminar: async (id) => {

        const response = await API.delete(
            `/api/mantenimientos/${id}`
        );

        return response.data;
    },


    obtenerPaginados: async (
        page = 0,
        size = 10,
        vehiculoId = null,
        estado = null,
        activo = null
    ) => {

        const params = {
            page,
            size
        };

        if (vehiculoId !== null) {
            params.vehiculoId = vehiculoId;
        }

        if (estado) {
            params.estado = estado;
        }

        if (activo !== null) {
            params.activo = activo;
        }


        const response = await API.get(
            "/api/mantenimientos",
            {
                params
            }
        );

        return response.data;
    }
};