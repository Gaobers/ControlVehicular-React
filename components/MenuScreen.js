import React from "react";

import {
    SafeAreaView,
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    useWindowDimensions
} from "react-native";


export default function MenuScreen({
    onVehiculos,
    onRecordatorios,
    onLogout
}) {

    const { width } =
        useWindowDimensions();

    const esMovil =
        width < 700;


    return (

        <SafeAreaView
            style={styles.screen}
        >

            {/* HEADER */}

            <View style={styles.header}>

                <View
                    style={
                        styles.headerContent
                    }
                >

                    <View
                        style={
                            styles.brandContainer
                        }
                    >

                        <View
                            style={
                                styles.logo
                            }
                        >

                            <Text
                                style={
                                    styles.logoText
                                }
                            >
                                CV
                            </Text>

                        </View>


                        <View>

                            <Text
                                style={
                                    styles.brandTitle
                                }
                            >
                                CONTROL VEHICULAR
                            </Text>

                            <Text
                                style={
                                    styles.brandSubtitle
                                }
                            >
                                Sistema de administración vehicular
                            </Text>

                        </View>

                    </View>


                    <Pressable
                        style={({ pressed }) => [

                            styles.logoutButton,

                            pressed &&
                            styles.buttonPressed

                        ]}
                        onPress={onLogout}
                    >

                        <Text
                            style={
                                styles.logoutText
                            }
                        >
                            {esMovil
                                ? "SALIR"
                                : "CERRAR SESIÓN"}
                        </Text>

                    </Pressable>

                </View>

            </View>


            {/* CONTENIDO */}

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={
                    styles.scrollContent
                }
            >

                <View
                    style={
                        styles.container
                    }
                >

                    {/* BIENVENIDA */}

                    <View
                        style={
                            styles.welcome
                        }
                    >

                        <Text
                            style={
                                styles.welcomeLabel
                            }
                        >
                            PANEL PRINCIPAL
                        </Text>

                        <Text
                            style={
                                styles.title
                            }
                        >
                            Menú principal
                        </Text>

                        <Text
                            style={
                                styles.subtitle
                            }
                        >
                            Selecciona el módulo que deseas administrar.
                        </Text>

                    </View>


                    {/* TARJETAS */}

                    <View
                        style={[
                            styles.modulesGrid,

                            esMovil &&
                            styles.modulesGridMobile
                        ]}
                    >


                        {/* VEHÍCULOS */}

                        <Pressable
                            style={({ pressed }) => [

                                styles.moduleCard,

                                pressed &&
                                styles.moduleCardPressed

                            ]}
                            onPress={onVehiculos}
                        >

                            <View
                                style={
                                    styles.moduleTop
                                }
                            >

                                <View
                                    style={[
                                        styles.moduleIcon,
                                        styles.vehicleIcon
                                    ]}
                                >

                                    <Text
                                        style={
                                            styles.moduleIconText
                                        }
                                    >
                                        VH
                                    </Text>

                                </View>


                                <View
                                    style={
                                        styles.moduleBadge
                                    }
                                >

                                    <Text
                                        style={
                                            styles.moduleBadgeText
                                        }
                                    >
                                        MÓDULO
                                    </Text>

                                </View>

                            </View>


                            <Text
                                style={
                                    styles.moduleTitle
                                }
                            >
                                Vehículos
                            </Text>


                            <Text
                                style={
                                    styles.moduleDescription
                                }
                            >
                                Registra, consulta, modifica,
                                archiva y reactiva los vehículos
                                del sistema.
                            </Text>


                            <View
                                style={
                                    styles.moduleFooter
                                }
                            >

                                <Text
                                    style={
                                        styles.moduleLink
                                    }
                                >
                                    ADMINISTRAR
                                </Text>

                                <Text
                                    style={
                                        styles.arrow
                                    }
                                >
                                    →
                                </Text>

                            </View>

                        </Pressable>


                        {/* RECORDATORIOS */}

                        <Pressable
                            style={({ pressed }) => [

                                styles.moduleCard,

                                pressed &&
                                styles.moduleCardPressed

                            ]}
                            onPress={
                                onRecordatorios
                            }
                        >

                            <View
                                style={
                                    styles.moduleTop
                                }
                            >

                                <View
                                    style={[
                                        styles.moduleIcon,
                                        styles.reminderIcon
                                    ]}
                                >

                                    <Text
                                        style={
                                            styles.moduleIconText
                                        }
                                    >
                                        RM
                                    </Text>

                                </View>


                                <View
                                    style={
                                        styles.moduleBadge
                                    }
                                >

                                    <Text
                                        style={
                                            styles.moduleBadgeText
                                        }
                                    >
                                        MÓDULO
                                    </Text>

                                </View>

                            </View>


                            <Text
                                style={
                                    styles.moduleTitle
                                }
                            >
                                Recordatorios
                            </Text>


                            <Text
                                style={
                                    styles.moduleDescription
                                }
                            >
                                Administra recordatorios de
                                mantenimiento por días y
                                kilometraje.
                            </Text>


                            <View
                                style={
                                    styles.moduleFooter
                                }
                            >

                                <Text
                                    style={
                                        styles.moduleLink
                                    }
                                >
                                    ADMINISTRAR
                                </Text>

                                <Text
                                    style={
                                        styles.arrow
                                    }
                                >
                                    →
                                </Text>

                            </View>

                        </Pressable>

                    </View>


                    {/* INFORMACIÓN */}

                    <View
                        style={
                            styles.infoCard
                        }
                    >

                        <View>

                            <Text
                                style={
                                    styles.infoTitle
                                }
                            >
                                Control Vehicular
                            </Text>

                            <Text
                                style={
                                    styles.infoText
                                }
                            >
                                Los módulos disponibles aparecerán
                                en este panel a medida que sean
                                integrados al sistema.
                            </Text>

                        </View>

                    </View>


                    {/* FOOTER */}

                    <Text
                        style={
                            styles.footer
                        }
                    >
                        CONTROL VEHICULAR © 2026
                    </Text>

                </View>

            </ScrollView>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({

    screen: {
        flex: 1,
        backgroundColor: "#eef2f7"
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

        minHeight: 74,

        paddingHorizontal: 20,
        paddingVertical: 12,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between"
    },


    brandContainer: {

        flexDirection: "row",

        alignItems: "center",

        flexShrink: 1
    },


    logo: {

        width: 44,
        height: 44,

        borderRadius: 11,

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

        color: "#9fb0c5",

        fontSize: 10,

        marginTop: 3
    },


    logoutButton: {

        minHeight: 39,

        paddingHorizontal: 15,

        backgroundColor: "#17385f",

        borderWidth: 1,

        borderColor: "#345475",

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


    scroll: {
        flex: 1
    },


    scrollContent: {
        paddingBottom: 35
    },


    container: {

        width: "100%",

        maxWidth: 1050,

        alignSelf: "center",

        paddingHorizontal: 20,

        paddingTop: 35
    },


    welcome: {

        marginBottom: 25
    },


    welcomeLabel: {

        color: "#2563eb",

        fontSize: 10,

        fontWeight: "800",

        letterSpacing: 1
    },


    title: {

        color: "#172033",

        fontSize: 28,

        fontWeight: "900",

        marginTop: 7
    },


    subtitle: {

        color: "#64748b",

        fontSize: 13,

        marginTop: 7
    },


    modulesGrid: {

        flexDirection: "row",

        gap: 16,

        marginBottom: 22
    },


    modulesGridMobile: {

        flexDirection: "column"
    },


    moduleCard: {

        flex: 1,

        minHeight: 230,

        backgroundColor: "#ffffff",

        borderWidth: 1,

        borderColor: "#e1e7ef",

        borderRadius: 16,

        padding: 20,

        shadowColor: "#000000",

        shadowOffset: {
            width: 0,
            height: 2
        },

        shadowOpacity: 0.06,

        shadowRadius: 7,

        elevation: 2
    },


    moduleCardPressed: {

        opacity: 0.85,

        transform: [
            {
                scale: 0.99
            }
        ]
    },


    moduleTop: {

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        marginBottom: 20
    },


    moduleIcon: {

        width: 48,
        height: 48,

        borderRadius: 12,

        justifyContent: "center",

        alignItems: "center"
    },


    vehicleIcon: {

        backgroundColor: "#e8f0ff"
    },


    reminderIcon: {

        backgroundColor: "#e9f8ef"
    },


    moduleIconText: {

        color: "#0d2340",

        fontSize: 13,

        fontWeight: "900"
    },


    moduleBadge: {

        backgroundColor: "#f1f5f9",

        paddingHorizontal: 9,

        paddingVertical: 5,

        borderRadius: 20
    },


    moduleBadgeText: {

        color: "#64748b",

        fontSize: 8,

        fontWeight: "800"
    },


    moduleTitle: {

        color: "#172033",

        fontSize: 19,

        fontWeight: "800"
    },


    moduleDescription: {

        color: "#64748b",

        fontSize: 12,

        lineHeight: 19,

        marginTop: 9,

        flex: 1
    },


    moduleFooter: {

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center",

        marginTop: 22,

        paddingTop: 14,

        borderTopWidth: 1,

        borderTopColor: "#edf0f4"
    },


    moduleLink: {

        color: "#2563eb",

        fontSize: 10,

        fontWeight: "900"
    },


    arrow: {

        color: "#2563eb",

        fontSize: 20,

        fontWeight: "700"
    },


    infoCard: {

        backgroundColor: "#f8fafc",

        borderWidth: 1,

        borderColor: "#dfe5ed",

        borderRadius: 12,

        padding: 16
    },


    infoTitle: {

        color: "#334155",

        fontSize: 12,

        fontWeight: "800"
    },


    infoText: {

        color: "#7c8798",

        fontSize: 10,

        lineHeight: 16,

        marginTop: 5
    },


    footer: {

        color: "#94a3b8",

        fontSize: 9,

        textAlign: "center",

        marginTop: 30
    },


    buttonPressed: {

        opacity: 0.8
    }

});