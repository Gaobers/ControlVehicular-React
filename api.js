import { Platform } from "react-native";

const API_URL =
    Platform.OS === "web"
        ? "http://localhost:8080"
        : "http://192.168.1.42:8080";

export const apiRequest = async (
    endpoint,
    method = "GET",
    body = null,
    token = null
) => {

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        options
    );

    const texto = await response.text();

    let data = null;

    if (texto) {
        try {
            data = JSON.parse(texto);
        } catch {
            data = texto;
        }
    }

    if (!response.ok) {
        const mensaje =
            data?.mensaje ||
            data?.message ||
            data ||
            `Error HTTP ${response.status}`;

        const error = new Error(mensaje);
        error.status = response.status;

        throw error;
    }

    return data;
};

export default API_URL;