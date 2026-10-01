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
import RecordatoriosScreen from "./components/RecordatoriosScreen";

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


    useEffect(() => {

        comprobarToken();

    }, []);


    if (verificando) {

        return (

            <SafeAreaView
                style={styles.loadingScreen}
            >

                <View style={styles.loadingLogo}>

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


                <Text style={styles.loadingText}>
                    Cargando sistema...
                </Text>

            </SafeAreaView>
        );
    }


    return estaAutenticado ? (

        <RecordatoriosScreen

            onLogout={() =>
                setEstaAutenticado(false)
            }

        />

    ) : (

        <LoginScreen

            onLoginSuccess={() =>
                setEstaAutenticado(true)
            }

        />
    );
}


const styles = StyleSheet.create({

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