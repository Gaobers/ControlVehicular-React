import API from "../api";

export const vehiculoService = {

    obtenerTodos: async () => {

        const response =
            await API.get("/api/vehiculos/lista");

        return response.data;
    },


    obtenerPorId: async (id) => {

        const response =
            await API.get(`/api/vehiculos/${id}`);

        return response.data;
    },


    crear: async (vehiculo) => {

        const response =
            await API.post(
                "/api/vehiculos",
                vehiculo
            );

        return response.data;
    },


    actualizar: async (id, vehiculo) => {

        const response =
            await API.put(
                `/api/vehiculos/${id}`,
                vehiculo
            );

        return response.data;
    },


    eliminar: async (id) => {

        const response =
            await API.delete(
                `/api/vehiculos/${id}`
            );

        return response.data;
    },


    obtenerPaginados: async (
        page = 0,
        size = 10
    ) => {

        const response =
            await API.get(
                `/api/vehiculos?page=${page}&size=${size}`
            );

        return response.data;
    }
};