import API from "../api";

export const gastoService = {

    obtenerTodos: async () => {
        try {
            const response =
                await API.get("/api/gastos/lista");

            return response.data;
        } catch (error) {

            // Tu controlador devuelve 404 cuando la lista está vacía.
            if (error.response?.status === 404) {
                return [];
            }

            throw error;
        }
    },


    obtenerPorId: async (id) => {
        const response =
            await API.get(`/api/gastos/${id}`);

        return response.data;
    },


    crear: async (gasto) => {
        const response =
            await API.post(
                "/api/gastos",
                gasto
            );

        return response.data;
    },


    actualizar: async (id, gasto) => {
        const response =
            await API.put(
                `/api/gastos/${id}`,
                gasto
            );

        return response.data;
    },


    eliminar: async (id) => {
        const response =
            await API.delete(
                `/api/gastos/${id}`
            );

        return response.data;
    },


    obtenerPaginados: async (
        page = 0,
        size = 10
    ) => {

        const response =
            await API.get(
                `/api/gastos?page=${page}&size=${size}`
            );

        return response.data;
    }
};