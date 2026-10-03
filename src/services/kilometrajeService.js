import API from "../api";


export const kilometrajeService = {

    obtenerTodos: async (
        vehiculoId = null,
        activo = null
    ) => {

        try {

            const params = {};

            if (vehiculoId !== null) {
                params.vehiculoId = vehiculoId;
            }

            if (activo !== null) {
                params.activo = activo;
            }


            const response = await API.get(
                "/api/kilometrajes/lista",
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
            `/api/kilometrajes/${id}`
        );

        return response.data;
    },


    obtenerActual: async (
        vehiculoId
    ) => {

        const response = await API.get(
            `/api/kilometrajes/vehiculo/${vehiculoId}/actual`
        );

        return response.data;
    },


    crear: async (
        registro
    ) => {

        const response = await API.post(
            "/api/kilometrajes",
            registro
        );

        return response.data;
    },


    actualizar: async (
        id,
        registro
    ) => {

        const response = await API.put(
            `/api/kilometrajes/${id}`,
            registro
        );

        return response.data;
    },


    eliminar: async (
        id
    ) => {

        const response = await API.delete(
            `/api/kilometrajes/${id}`
        );

        return response.data;
    },


    obtenerPaginados: async (
        page = 0,
        size = 10,
        vehiculoId = null,
        activo = null
    ) => {

        const params = {
            page,
            size
        };

        if (vehiculoId !== null) {
            params.vehiculoId = vehiculoId;
        }

        if (activo !== null) {
            params.activo = activo;
        }


        const response = await API.get(
            "/api/kilometrajes",
            {
                params
            }
        );


        return response.data;
    }
};