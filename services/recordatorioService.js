import { apiRequest } from "../api";

const ENDPOINT = "/api/recordatorios";

export const obtenerRecordatorios = async (token) => {
    try {
        return await apiRequest(
            `${ENDPOINT}/lista`,
            "GET",
            null,
            token
        );
    } catch (error) {

        // Tu backend devuelve 404 cuando la lista está vacía.
        if (error.status === 404) {
            return [];
        }

        throw error;
    }
};

export const obtenerRecordatorioPorId = async (id, token) => {
    return await apiRequest(
        `${ENDPOINT}/${id}`,
        "GET",
        null,
        token
    );
};

export const crearRecordatorio = async (recordatorio, token) => {
    return await apiRequest(
        ENDPOINT,
        "POST",
        recordatorio,
        token
    );
};

export const editarRecordatorio = async (id, recordatorio, token) => {
    return await apiRequest(
        `${ENDPOINT}/${id}`,
        "PUT",
        recordatorio,
        token
    );
};

export const eliminarRecordatorio = async (id, token) => {
    return await apiRequest(
        `${ENDPOINT}/${id}`,
        "DELETE",
        null,
        token
    );
};