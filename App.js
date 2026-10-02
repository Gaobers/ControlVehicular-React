import React, {
    useEffect,
    useState
} from "react";

import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ActivityIndicator
} from "react-native";

import LoginScreen from "./components/LoginScreen";
import MenuScreen from "./components/MenuScreen";
import RecordatoriosScreen from "./components/RecordatoriosScreen";
import VehiculosScreen from "./components/VehiculosScreen";
import GastosScreen from "./components/GastosScreen";

import { authService } from "./services/authService";


export default function App() {

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


    if (verificando) {

        return (

            <SafeAreaView
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

            </SafeAreaView>
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

                onVehiculos={() =>
                    setPantallaActual(
                        "vehiculos"
                    )
                }

                onRecordatorios={() =>
                    setPantallaActual(
                        "recordatorios"
                    )
                }

                onGastos={() =>
                    setPantallaActual(
                        "gastos"
                    )
                }

                onLogout={
                    cerrarSesion
                }

            />
        );
    }


    /*
     * MÓDULO VEHÍCULOS
     */
    if (pantallaActual === "vehiculos") {

        return (

            <SafeAreaView
                style={styles.appContainer}
            >

                <VehiculosScreen

                    onVolver={
                        irAlMenu
                    }

                    onLogout={
                        cerrarSesion
                    }

                />

            </SafeAreaView>
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

            <SafeAreaView
                style={styles.appContainer}
            >

                <RecordatoriosScreen

                    onVolver={
                        irAlMenu
                    }

                    onLogout={
                        cerrarSesion
                    }

                />

            </SafeAreaView>
        );
    }


    /**
 * MÓDULO GASTOS
 */
if (pantallaActual === "gastos") {

    return (

        <SafeAreaView
            style={styles.appContainer}
        >

            <GastosScreen

                onVolver={
                    irAlMenu
                }

                onLogout={
                    cerrarSesion
                }

            />

        </SafeAreaView>
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

        onRecordatorios={() =>
            setPantallaActual(
                "recordatorios"
            )
        }

        onGastos={() =>
            setPantallaActual(
                "gastos"
            )
        }

        onLogout={
            cerrarSesion
        }

    />
);
}


const styles = StyleSheet.create({

    appContainer: {
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