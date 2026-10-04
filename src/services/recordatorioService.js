import API from "../api";


export const recordatorioService = {

    obtenerTodos: async () => {

        try {

            const response = await API.get(
                "/api/recordatorios/lista"
            );

            return response.data;

        } catch (error) {

            if (error.response?.status === 404) {
                return [];
            }

            throw error;
        }
    },


    obtenerPaginados: async (
        page = 0,
        size = 10
    ) => {

        const response = await API.get(
            "/api/recordatorios",
            {
                params: {
                    page,
                    size
                }
            }
        );

        return response.data;
    },


    obtenerPorId: async (id) => {

        const response = await API.get(
            `/api/recordatorios/${id}`
        );

        return response.data;
    },


    crear: async (recordatorio) => {

        const response = await API.post(
            "/api/recordatorios",
            recordatorio
        );

        return response.data;
    },


    actualizar: async (
        id,
        recordatorio
    ) => {

        const response = await API.put(
            `/api/recordatorios/${id}`,
            recordatorio
        );

        return response.data;
    },


    eliminar: async (id) => {

        const response = await API.delete(
            `/api/recordatorios/${id}`
        );

        return response.data;
    }
};