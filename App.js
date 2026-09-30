import React, { useEffect, useState } from "react";

import {
    SafeAreaView,
    View,
    Text,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    useWindowDimensions
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginScreen from "./components/LoginScreen";
import RecordatoriosScreen from "./components/RecordatoriosScreen";


export default function App() {

    const [token, setToken] = useState(null);
    const [cargandoSesion, setCargandoSesion] = useState(true);

    const { width } = useWindowDimensions();
    const esMovil = width < 600;


    useEffect(() => {
        cargarSesion();
    }, []);


    const cargarSesion = async () => {

        try {

            const tokenGuardado =
                await AsyncStorage.getItem("token");

            if (tokenGuardado) {
                setToken(tokenGuardado);
            }

        } catch (error) {

            console.error(
                "Error al cargar la sesión:",
                error
            );

        } finally {

            setCargandoSesion(false);
        }
    };


    const manejarLogin = async (nuevoToken) => {

        try {

            await AsyncStorage.setItem(
                "token",
                nuevoToken
            );

            setToken(nuevoToken);

        } catch (error) {

            console.error(
                "Error al guardar la sesión:",
                error
            );
        }
    };


    const cerrarSesion = async () => {

        try {

            await AsyncStorage.removeItem("token");

            setToken(null);

        } catch (error) {

            console.error(
                "Error al cerrar sesión:",
                error
            );
        }
    };


    if (cargandoSesion) {

        return (

            <SafeAreaView style={styles.loadingScreen}>

                <View style={styles.loadingLogo}>
                    <Text style={styles.loadingLogoText}>
                        CV
                    </Text>
                </View>

                <ActivityIndicator
                    size="large"
                    color="#2563eb"
                />

                <Text style={styles.loadingText}>
                    Cargando sistema...
                </Text>

            </SafeAreaView>
        );
    }


    if (!token) {

        return (

            <SafeAreaView style={styles.loginContainer}>

                <LoginScreen
                    onLogin={manejarLogin}
                />

            </SafeAreaView>
        );
    }


    return (

        <SafeAreaView style={styles.appContainer}>

            {/* HEADER PRINCIPAL */}
            <View style={styles.header}>

                <View style={styles.headerContent}>

                    <View style={styles.brandContainer}>

                        <View style={styles.logo}>
                            <Text style={styles.logoText}>
                                CV
                            </Text>
                        </View>

                        <View>

                            <Text style={styles.brandTitle}>
                                CONTROL VEHICULAR
                            </Text>

                            {!esMovil && (
                                <Text style={styles.brandSubtitle}>
                                    Sistema de administración vehicular
                                </Text>
                            )}

                        </View>

                    </View>


                    <Pressable
                        style={({ pressed }) => [
                            styles.logoutButton,
                            pressed &&
                            styles.buttonPressed
                        ]}
                        onPress={cerrarSesion}
                    >

                        <Text style={styles.logoutText}>
                            {esMovil
                                ? "SALIR"
                                : "CERRAR SESIÓN"}
                        </Text>

                    </Pressable>

                </View>

            </View>


            {/* CONTENIDO DE LA APLICACIÓN */}
            <View style={styles.main}>

                <RecordatoriosScreen
                    token={token}
                />

            </View>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({

    appContainer: {
        flex: 1,
        backgroundColor: "#eef2f7"
    },


    loginContainer: {
        flex: 1
    },


    loadingScreen: {
        flex: 1,
        backgroundColor: "#eef2f7",
        justifyContent: "center",
        alignItems: "center"
    },


    loadingLogo: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: "#0d2340",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20
    },


    loadingLogoText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "800"
    },


    loadingText: {
        color: "#6b7280",
        fontSize: 13,
        marginTop: 12
    },


    header: {
        backgroundColor: "#0d2340",
        borderBottomWidth: 1,
        borderBottomColor: "#17395f"
    },


    headerContent: {
        width: "100%",
        maxWidth: 1200,
        alignSelf: "center",

        minHeight: 72,

        paddingHorizontal: 20,
        paddingVertical: 12,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },


    brandContainer: {
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 1
    },


    logo: {
        width: 42,
        height: 42,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },


    logoText: {
        color: "#0d2340",
        fontSize: 15,
        fontWeight: "900"
    },


    brandTitle: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "800"
    },


    brandSubtitle: {
        color: "#aab8ca",
        fontSize: 10,
        marginTop: 3
    },


    logoutButton: {
        backgroundColor: "#17385f",
        borderWidth: 1,
        borderColor: "#345475",

        minHeight: 38,

        paddingHorizontal: 15,

        borderRadius: 8,

        justifyContent: "center",
        alignItems: "center",

        marginLeft: 10
    },


    logoutText: {
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "800"
    },


    buttonPressed: {
        opacity: 0.8
    },


    main: {
        flex: 1
    }

});