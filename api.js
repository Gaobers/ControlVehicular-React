import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";


const LOCAL_URL =
    Platform.OS === "web"
        ? "http://localhost:8080"
        : "http://10.147.250.137:8080";


const RENDER_URL =
    "https://controlvehicular-6s7g.onrender.com";


/*
 * Usa LOCAL_URL para desarrollo local.
 * Usa RENDER_URL para APK / producción.
 */
//const BASE_URL = RENDER_URL;

const BASE_URL = LOCAL_URL;


const API = axios.create({

    baseURL: BASE_URL,

    headers: {
        "Content-Type": "application/json"
    }

});


API.interceptors.request.use(

    async (config) => {

        const token =
            await AsyncStorage.getItem(
                "userToken"
            );

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