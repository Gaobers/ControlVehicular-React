import Constants from 'expo-constants';

// Extrae automáticamente la IP de tu PC desde el servidor de desarrollo de Expo
const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
const localhost = debuggerHost ? debuggerHost.split(':').shift() : 'localhost';

export const BASE_URL = `http://${localhost}:8080/api`;

console.log('Conectando a la API en:', BASE_URL);