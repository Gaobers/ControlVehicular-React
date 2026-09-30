import React, { useState } from "react";

import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator
} from "react-native";

import { iniciarSesion } from "../services/authService";


export default function LoginScreen({ onLogin }) {

    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");

    const [recordarme, setRecordarme] = useState(false);

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");


    const manejarLogin = async () => {

        setError("");

        if (!correo.trim() || !clave.trim()) {

            setError(
                "Correo y contraseña son obligatorios"
            );

            return;
        }

        try {

            setCargando(true);

            const respuesta = await iniciarSesion(
                correo.trim(),
                clave
            );

            if (!respuesta?.token) {

                setError(
                    "El servidor no devolvió un token"
                );

                return;
            }

            onLogin(respuesta.token);

        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "No se pudo iniciar sesión"
            );

        } finally {

            setCargando(false);
        }
    };


    return (

        <View style={styles.pantalla}>

            <View style={styles.contenido}>

                {/* LOGO */}
                <View style={styles.logo}>
                    <Text style={styles.logoTexto}>
                        CV
                    </Text>
                </View>


                {/* NOMBRE DEL SISTEMA */}
                <Text style={styles.nombreSistema}>
                    CONTROL VEHICULAR
                </Text>

                <Text style={styles.accesoSistema}>
                    Acceso al sistema
                </Text>


                {/* TARJETA LOGIN */}
                <View style={styles.tarjeta}>

                    <Text style={styles.titulo}>
                        Iniciar sesión
                    </Text>

                    <Text style={styles.descripcion}>
                        Ingresa tus credenciales para continuar.
                    </Text>


                    {/* CORREO */}
                    <Text style={styles.label}>
                        Correo electrónico
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Ingresa tu correo"
                        placeholderTextColor="#9ca3af"
                        value={correo}
                        onChangeText={setCorreo}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />


                    {/* CONTRASEÑA */}
                    <Text style={styles.label}>
                        Contraseña
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Ingresa tu contraseña"
                        placeholderTextColor="#9ca3af"
                        value={clave}
                        onChangeText={setClave}
                        secureTextEntry
                    />


                    {/* RECORDAR SESIÓN */}
                    <Pressable
                        style={styles.recordarmeContainer}
                        onPress={() =>
                            setRecordarme(!recordarme)
                        }
                    >

                        <View
                            style={[
                                styles.checkbox,

                                recordarme &&
                                styles.checkboxActivo
                            ]}
                        >

                            {recordarme && (
                                <Text style={styles.check}>
                                    ✓
                                </Text>
                            )}

                        </View>

                        <Text style={styles.recordarmeTexto}>
                            Recordar sesión
                        </Text>

                    </Pressable>


                    {/* ERROR */}
                    {error ? (

                        <Text style={styles.error}>
                            {error}
                        </Text>

                    ) : null}


                    {/* BOTÓN */}
                    {cargando ? (

                        <View style={styles.cargando}>

                            <ActivityIndicator
                                size="small"
                                color="#ffffff"
                            />

                        </View>

                    ) : (

                        <Pressable
                            style={({ pressed }) => [
                                styles.boton,
                                pressed &&
                                styles.botonPresionado
                            ]}
                            onPress={manejarLogin}
                        >

                            <Text style={styles.botonTexto}>
                                INGRESAR
                            </Text>

                        </Pressable>

                    )}


                    {/* OLVIDÉ CONTRASEÑA */}
                    <Pressable
                        onPress={() => {
                            console.log(
                                "Recuperar contraseña"
                            );
                        }}
                    >

                        <Text style={styles.olvido}>
                            ¿Olvidaste tu contraseña?
                        </Text>

                    </Pressable>


                    {/* INFORMACIÓN */}
                    <View style={styles.info}>

                        <Text style={styles.infoTitulo}>
                            Acceso seguro
                        </Text>

                        <Text style={styles.infoTexto}>
                            Ingresa tus credenciales autorizadas
                            para acceder al sistema de
                            administración vehicular.
                        </Text>

                    </View>

                </View>


                {/* FOOTER */}
                <Text style={styles.footer}>
                    CONTROL VEHICULAR © 2026
                </Text>

            </View>

        </View>
    );
}


const styles = StyleSheet.create({

    pantalla: {
        flex: 1,
        backgroundColor: "#0d2340",
        alignItems: "center"
    },


    contenido: {
        flex: 1,
        width: "100%",
        maxWidth: 520,
        paddingHorizontal: 20,
        paddingTop: 35,
        paddingBottom: 18,
        justifyContent: "center"
    },


    logo: {
        width: 58,
        height: 58,
        backgroundColor: "#ffffff",
        borderRadius: 13,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16
    },


    logoTexto: {
        fontSize: 20,
        fontWeight: "800",
        color: "#0d2340"
    },


    nombreSistema: {
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "800",
        textAlign: "center"
    },


    accesoSistema: {
        color: "#a8b3c3",
        fontSize: 11,
        textAlign: "center",
        marginTop: 6,
        marginBottom: 25
    },


    tarjeta: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        paddingHorizontal: 23,
        paddingVertical: 25,

        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.18,
        shadowRadius: 12,

        elevation: 7
    },


    titulo: {
        color: "#111827",
        fontSize: 21,
        fontWeight: "800",
        textAlign: "center"
    },


    descripcion: {
        color: "#8a94a3",
        fontSize: 11,
        textAlign: "center",
        marginTop: 7,
        marginBottom: 24
    },


    label: {
        color: "#303846",
        fontSize: 11,
        fontWeight: "700",
        marginBottom: 7
    },


    input: {
        height: 46,
        borderWidth: 1,
        borderColor: "#dce1e8",
        backgroundColor: "#f8f9fb",
        borderRadius: 9,
        paddingHorizontal: 13,
        fontSize: 13,
        color: "#111827",
        marginBottom: 17
    },


    recordarmeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        alignSelf: "flex-start"
    },


    checkbox: {
        width: 17,
        height: 17,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#aeb6c2",
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center"
    },


    checkboxActivo: {
        backgroundColor: "#2563eb",
        borderColor: "#2563eb"
    },


    check: {
        color: "#ffffff",
        fontSize: 11,
        fontWeight: "bold"
    },


    recordarmeTexto: {
        color: "#4b5563",
        fontSize: 11,
        marginLeft: 7
    },


    boton: {
        backgroundColor: "#2868ed",
        borderRadius: 8,
        height: 48,
        justifyContent: "center",
        alignItems: "center"
    },


    botonPresionado: {
        opacity: 0.85
    },


    botonTexto: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "800"
    },


    cargando: {
        backgroundColor: "#2868ed",
        borderRadius: 8,
        height: 48,
        justifyContent: "center",
        alignItems: "center"
    },


    error: {
        color: "#dc2626",
        fontSize: 11,
        marginBottom: 12,
        textAlign: "center"
    },


    olvido: {
        color: "#2563eb",
        fontSize: 10,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 17,
        marginBottom: 21
    },


    info: {
        backgroundColor: "#f5f7fa",
        borderRadius: 8,
        padding: 13
    },


    infoTitulo: {
        color: "#374151",
        fontSize: 10,
        fontWeight: "800",
        marginBottom: 5
    },


    infoTexto: {
        color: "#8a94a3",
        fontSize: 9,
        lineHeight: 14
    },


    footer: {
        color: "#8592a5",
        fontSize: 8,
        textAlign: "center",
        marginTop: 22
    }

});