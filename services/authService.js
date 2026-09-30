import { apiRequest } from "../api";

const ENDPOINT = "/api/auth";

export const iniciarSesion = async (correo, clave) => {

    const credenciales = {
        correo,
        clave
    };

    return await apiRequest(
        `${ENDPOINT}/login`,
        "POST",
        credenciales
    );
};