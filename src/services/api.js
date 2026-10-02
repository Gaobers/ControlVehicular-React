import axios from 'axios';
import { API_URL } from '../config';

// Crear una instancia de Axios con la URL base de la API
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT si la API requiere autenticación
api.interceptors.request.use(
  async (config) => {
    // Si manejas token de sesión, lo adjuntas aquí
    // const token = await AsyncStorage.getItem('userToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;