import React, {
    useEffect,
    useState
} from "react";

import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import AppHeader
    from "../common/AppHeader";

import ScreenContainer
    from "../common/ScreenContainer";

import KilometrajeFormulario
    from "./KilometrajeFormulario";

import {
    kilometrajeService
} from "../../services/kilometrajeService";


export default function RegistroKilometrajeVehiculo({

    vehiculo,

    onVolver,

    onRegistrado,

    onLogout

}) {

    const [
        referencia,
        setReferencia
    ] = useState(
        Number(
            vehiculo?.kilometrajeActual ||
            0
        )
    );


    const [
        cargando,
        setCargando
    ] = useState(true);


    const [
        guardando,
        setGuardando
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    /*
     * Al entrar consultamos el último
     * kilometraje registrado para este
     * vehículo.
     */
    useEffect(() => {

        cargarReferencia();

    }, [
        vehiculo?.id
    ]);


    const cargarReferencia =
        async () => {

            if (!vehiculo?.id) {

                setCargando(false);

                return;
            }


            try {

                setCargando(true);


                const actual =
                    await kilometrajeService
                        .obtenerActual(
                            vehiculo.id
                        );


                /*
                 * Primero usamos el historial.
                 * Si por alguna razón no viene,
                 * usamos kilometrajeActual.
                 */
                setReferencia(
                    Number(
                        actual?.kilometraje ??
                        vehiculo.kilometrajeActual ??
                        0
                    )
                );

            } catch (error) {

                /*
                 * Si nunca se ha registrado
                 * kilometraje, el endpoint
                 * puede devolver 404.
                 *
                 * En ese caso usamos el km
                 * actual del vehículo.
                 */
                if (
                    error.response?.status ===
                    404
                ) {

                    setReferencia(
                        Number(
                            vehiculo
                                ?.kilometrajeActual ||
                            0
                        )
                    );

                    return;
                }


                console.error(
                    "Error obteniendo kilometraje actual:",
                    error
                );


                setReferencia(
                    Number(
                        vehiculo
                            ?.kilometrajeActual ||
                        0
                    )
                );

            } finally {

                setCargando(false);
            }
        };


    const guardarRegistro =
        async (datos) => {

            try {

                setGuardando(true);

                setError("");


                const registro =
                    await kilometrajeService
                        .crear(
                            datos
                        );


                /*
                 * Le avisamos a VehiculosScreen
                 * que ya terminó.
                 */
                if (onRegistrado) {

                    await onRegistrado(
                        registro
                    );
                }

            } catch (error) {

                console.error(
                    "Error registrando kilometraje:",
                    error
                );


                let texto =
                    error?.response?.data
                        ?.message ||
                    error?.response?.data
                        ?.mensaje ||
                    "No se pudo registrar el kilometraje.";


                if (
                    typeof
                    error?.response?.data ===
                    "string"
                ) {

                    texto =
                        error.response.data;
                }


                if (
                    error?.response?.status ===
                    401
                ) {

                    texto =
                        "Tu sesión no es válida. Inicia sesión nuevamente.";
                }


                if (
                    error?.response?.status ===
                    403
                ) {

                    texto =
                        "No tienes autorización para registrar kilometraje.";
                }


                setError(
                    texto
                );

            } finally {

                setGuardando(false);
            }
        };


    return (

        <View style={styles.screen}>

            <ScreenContainer>

                <AppHeader
                    subtitle="Registro de kilometraje"
                    onLogout={
                        onLogout
                    }
                />


                {/* CABECERA */}

                <View style={styles.header}>

                    <Pressable
                        style={styles.backButton}
                        onPress={
                            onVolver
                        }
                    >

                        <Text style={styles.backText}>
                            ← Volver al vehículo
                        </Text>

                    </Pressable>


                    <Text style={styles.title}>
                        Registrar Kilometraje
                    </Text>


                    <Text style={styles.subtitle}>
                        Actualiza la lectura actual de tu vehículo.
                    </Text>

                </View>


                {/* CARGANDO */}

                {cargando ? (

                    <View style={styles.loading}>

                        <ActivityIndicator
                            size="large"
                            color="#073B61"
                        />


                        <Text style={styles.loadingText}>
                            Consultando última lectura...
                        </Text>

                    </View>

                ) : (

                    <KilometrajeFormulario

                        vehiculoPreseleccionado={
                            vehiculo
                        }

                        kilometrajeReferencia={
                            referencia
                        }

                        guardando={
                            guardando
                        }

                        errorExterno={
                            error
                        }

                        onGuardar={
                            guardarRegistro
                        }

                        onCancelar={
                            onVolver
                        }

                    />
                )}

            </ScreenContainer>

        </View>
    );
}


const styles = StyleSheet.create({

    screen: {
        flex: 1,

        backgroundColor:
            "#F5F7FB"
    },


    header: {
        paddingTop: 16,

        paddingBottom: 10
    },


    backButton: {
        alignSelf:
            "flex-start",

        paddingVertical: 6,

        marginBottom: 12
    },


    backText: {
        color: "#2563EB",

        fontSize: 10,

        fontWeight: "700"
    },


    title: {
        color: "#172033",

        fontSize: 22,

        fontWeight: "900"
    },


    subtitle: {
        marginTop: 4,

        color: "#64748B",

        fontSize: 10,

        lineHeight: 15
    },


    loading: {
        minHeight: 250,

        alignItems: "center",

        justifyContent:
            "center"
    },


    loadingText: {
        marginTop: 10,

        color: "#64748B",

        fontSize: 10
    }
});