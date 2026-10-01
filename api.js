import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const BASE_URL =
    Platform.OS === "web"
        ? "http://localhost:8080"
        : "http://192.168.1.42:8080";

const API = axios.create({
    baseURL: "http://localhost:8080",

    headers: {
        "Content-Type": "application/json"
    }
});


API.interceptors.request.use(

    async (config) => {

        const token =
            await AsyncStorage.getItem("userToken");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {

        return Promise.reject(error);
    }
);


export default API;