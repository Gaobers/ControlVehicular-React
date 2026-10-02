import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api";


export const authService = {

    login: async (correo, clave) => {

        const response = await API.post(
            "/api/auth/login",
            {
                correo,
                clave
            }
        );

        if (response.data?.token) {

            await AsyncStorage.setItem(
                "userToken",
                response.data.token
            );
        }

        return response.data;
    },


    logout: async () => {

        await AsyncStorage.removeItem(
            "userToken"
        );
    },


    obtenerToken: async () => {

        return await AsyncStorage.getItem(
            "userToken"
        );
    }
};