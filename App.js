import React, {
    useEffect,
    useState
} from "react";

import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator
} from "react-native";

import {
    SafeAreaProvider,
    SafeAreaView
} from "react-native-safe-area-context";

import LoginScreen from "./src/components/LoginScreen";
import MenuScreen from "./src/components/MenuScreen";
import RecordatoriosScreen from "./src/components/RecordatoriosScreen";
import VehiculosScreen from "./src/components/VehiculosScreen";
import GastosScreen from "./src/components/GastosScreen";
import MantenimientosScreen from "./src/components/MantenimientosScreen";
import KilometrajesScreen from "./src/components/KilometrajesScreen";
import ServiciosScreen from "./src/components/ServiciosScreen";

import { authService } from "./src/services/authService";


function AppContent() {

    const [
        estaAutenticado,
        setEstaAutenticado
    ] = useState(false);

    const [
        verificando,
        setVerificando
    ] = useState(true);

    const [
        pantallaActual,
        setPantallaActual
    ] = useState("menu");


    useEffect(() => {

        comprobarToken();

    }, []);


    const comprobarToken = async () => {

        try {

            const token =
                await authService.obtenerToken();

            setEstaAutenticado(
                !!token
            );

        } catch (error) {

            console.error(
                "Error al comprobar sesión:",
                error
            );

            setEstaAutenticado(false);

        } finally {

            setVerificando(false);
        }
    };


    const loginExitoso = () => {

        setEstaAutenticado(true);

        setPantallaActual("menu");
    };


    const cerrarSesion = async () => {

        try {

            await authService.logout();

            setEstaAutenticado(false);

            setPantallaActual("menu");

        } catch (error) {

            console.error(
                "Error al cerrar sesión:",
                error
            );
        }
    };


    const irAlMenu = () => {

        setPantallaActual("menu");
    };

    const irAServicios = () => {
    setPantallaActual("servicios");
    };

    const irAVehiculos = () => {
        setPantallaActual("vehiculos");
    };

    const irAMantenimientos = () => {
        setPantallaActual("mantenimientos");
    };

    const irARecordatorios = () => {
        setPantallaActual("recordatorios");
    };

    const irAKilometrajes = () => {
        setPantallaActual("kilometrajes");
    };

    const irAGastos = () => {
        setPantallaActual("gastos");
    };


    if (verificando) {

        return (

            <View
                style={styles.loadingScreen}
            >

                <View
                    style={styles.loadingLogo}
                >

                    <Text
                        style={
                            styles.loadingLogoText
                        }
                    >
                        CV
                    </Text>

                </View>


                <ActivityIndicator
                    size="large"
                    color="#2563eb"
                />


                <Text
                    style={styles.loadingText}
                >
                    Cargando sistema...
                </Text>

            </View>
        );
    }


    if (!estaAutenticado) {

        return (

            <LoginScreen
                onLoginSuccess={
                    loginExitoso
                }
            />

        );
    }


    /*
     * MENÚ PRINCIPAL
     */
if (pantallaActual === "menu") {

    return (
        <MenuScreen
            onVehiculos={irAVehiculos}
            onServicios={irAServicios}
            onLogout={cerrarSesion}
        />
    );
}


    /*
     * MÓDULO VEHÍCULOS
     */
    if (pantallaActual === "vehiculos") {

        return (

<VehiculosScreen
    onVolver={irAlMenu}
    onLogout={cerrarSesion}
/>
        );
    }


    /*
     * MÓDULO RECORDATORIOS
     */
    if (
        pantallaActual ===
        "recordatorios"
    ) {

        return (

            <RecordatoriosScreen
                onVolver={() =>
                    setPantallaActual(
                        "servicios"
                    )
                }
                onLogout={
                    cerrarSesion
                }
            />
        );
    }


    /**
 * MÓDULO GASTOS
 */
if (pantallaActual === "gastos") {

    return (

            <GastosScreen
                onVolver={() =>
                    setPantallaActual(
                        "servicios"
                    )
                }
                onLogout={
                    cerrarSesion
                }
            />
    );
}


/**
 * MÓDULO MANTENIMIENTOS
 */
if (pantallaActual === "mantenimientos") {

    return (
        <MantenimientosScreen
            onVolver={irAServicios}
            onLogout={cerrarSesion}
        />
    );
}


/**
 * MÓDULO KILOMETRAJES
 */
if (
    pantallaActual ===
    "kilometrajes"
) {

    return (

        <KilometrajesScreen
            onVolver={() =>
                setPantallaActual(
                    "servicios"
                )
            }
            onLogout={
                cerrarSesion
            }
        />
    );
}

/**
 * SERVICIOS
 */
if (pantallaActual === "servicios") {

    return (
        <ServiciosScreen
            onInicio={irAlMenu}
            onVehiculos={irAVehiculos}
            onMantenimientos={irAMantenimientos}
            onRecordatorios={irARecordatorios}
            onKilometrajes={irAKilometrajes}
            onGastos={irAGastos}
            onLogout={cerrarSesion}
        />
    );
}


    /*
     * RESPALDO
     * Si por algún motivo pantallaActual
     * contiene un valor desconocido.
     */
   return (

<MenuScreen

    onVehiculos={() =>
        setPantallaActual(
            "vehiculos"
        )
    }

    onServicios={() =>
        setPantallaActual(
            "servicios"
        )
    }

    onLogout={
        cerrarSesion
    }
/>
);
}

export default function App() {

    return (

        <SafeAreaProvider>

            <SafeAreaView
                style={styles.safeArea}
                edges={[
                    "top",
                    "right",
                    "bottom",
                    "left"
                ]}
            >

                <AppContent />

            </SafeAreaView>

        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({

    appContainer: {
        flex: 1,
        backgroundColor: "#eef2f7"
    },

    safeArea: {
    flex: 1,
    backgroundColor: "#eef2f7"
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
    }

});