import React from "react";

import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";


function formatearKm(
    valor
) {

    return `${Number(
        valor || 0
    ).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }
    )} km`;
}


function formatearFecha(
    valor
) {

    if (!valor) {
        return "Sin fecha";
    }


    try {

        return new Date(
            valor
        ).toLocaleString(
            "es-SV"
        );

    } catch {

        return valor;
    }
}


export default function KilometrajeDetalle({

    visible,

    registro,

    obtenerNombreVehiculo,

    onCerrar,

    onEditar,

    onDesactivar,

    onReactivar

}) {

    if (!registro) {
        return null;
    }


    const activo =
        registro.activo !== false;


    return (

        <Modal
            visible={
                visible
            }

            animationType="slide"

            transparent={
                false
            }

            onRequestClose={
                onCerrar
            }
        >

            <View style={styles.screen}>

                <View style={styles.topBar}>

                    <Pressable
                        onPress={
                            onCerrar
                        }
                    >

                        <Text style={styles.back}>
                            ← Volver al historial
                        </Text>

                    </Pressable>

                </View>


                <ScrollView
                    contentContainerStyle={
                        styles.content
                    }
                >

                    <Text style={styles.title}>
                        Detalle del kilometraje
                    </Text>


                    <View style={styles.mainCard}>

                        <View style={styles.mainTop}>

                            <View
                                style={[
                                    styles.status,

                                    activo
                                        ? styles.active
                                        : styles.inactive
                                ]}
                            >

                                <Text
                                    style={[
                                        styles.statusText,

                                        activo
                                            ? styles.activeText
                                            : styles.inactiveText
                                    ]}
                                >
                                    {activo
                                        ? "ACTIVO"
                                        : "INACTIVO"}
                                </Text>

                            </View>


                            <Text style={styles.date}>
                                {formatearFecha(
                                    registro.fechaHora
                                )}
                            </Text>

                        </View>


                        <Text style={styles.km}>
                            {formatearKm(
                                registro.kilometraje
                            )}
                        </Text>


                        <Text style={styles.vehicle}>
                            {obtenerNombreVehiculo(
                                registro.vehiculoId
                            )}
                        </Text>

                    </View>


                    <View style={styles.card}>

                        <Text style={styles.cardTitle}>
                            Información del registro
                        </Text>


                        <Info
                            label="ID del registro"
                            value={
                                `#${registro.id}`
                            }
                        />


                        <Info
                            label="Vehículo"
                            value={
                                obtenerNombreVehiculo(
                                    registro.vehiculoId
                                )
                            }
                        />


                        <Info
                            label="Registrado por"
                            value={
                                registro.registradoPor
                                    ? `Usuario #${registro.registradoPor}`
                                    : "No disponible"
                            }
                        />


                        <Info
                            label="Fecha y hora"
                            value={
                                formatearFecha(
                                    registro.fechaHora
                                )
                            }
                        />

                    </View>


                    <View style={styles.card}>

                        <Text style={styles.cardTitle}>
                            Observación
                        </Text>


                        <View style={styles.observationBox}>

                            <Text style={styles.observation}>
                                {registro.observacion ||
                                    "No se registraron observaciones."}
                            </Text>

                        </View>

                    </View>


                    <Pressable
                        style={styles.editButton}

                        onPress={() =>
                            onEditar?.(
                                registro
                            )
                        }
                    >

                        <Text style={styles.editText}>
                            Editar registro
                        </Text>

                    </Pressable>


                    {activo ? (

                        <Pressable
                            style={styles.deleteButton}

                            onPress={() =>
                                onDesactivar?.(
                                    registro
                                )
                            }
                        >

                            <Text style={styles.deleteText}>
                                Desactivar registro
                            </Text>

                        </Pressable>

                    ) : (

                        <Pressable
                            style={styles.activateButton}

                            onPress={() =>
                                onReactivar?.(
                                    registro
                                )
                            }
                        >

                            <Text style={styles.activateText}>
                                Reactivar registro
                            </Text>

                        </Pressable>
                    )}

                </ScrollView>

            </View>

        </Modal>
    );
}


function Info({
    label,
    value
}) {

    return (

        <View style={styles.infoRow}>

            <Text style={styles.infoLabel}>
                {label}
            </Text>

            <Text style={styles.infoValue}>
                {value}
            </Text>

        </View>
    );
}


const styles = StyleSheet.create({

    screen: {
        flex: 1,

        backgroundColor: "#F5F7FB"
    },


    topBar: {
        paddingHorizontal: 16,

        paddingTop: 18
    },


    back: {
        color: "#2563EB",

        fontSize: 10,

        fontWeight: "700"
    },


    content: {
        padding: 16,

        paddingBottom: 35
    },


    title: {
        color: "#172033",

        fontSize: 21,

        fontWeight: "900",

        marginBottom: 13
    },


    mainCard: {
        backgroundColor: "#FFFFFF",

        borderRadius: 14,

        borderWidth: 1,

        borderColor: "#E7EBF1",

        padding: 14,

        marginBottom: 13
    },


    mainTop: {
        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center"
    },


    status: {
        paddingHorizontal: 8,

        paddingVertical: 5,

        borderRadius: 7
    },


    active: {
        backgroundColor: "#DCFCE7"
    },


    inactive: {
        backgroundColor: "#FEE2E2"
    },


    statusText: {
        fontSize: 8,

        fontWeight: "900"
    },


    activeText: {
        color: "#15803D"
    },


    inactiveText: {
        color: "#B91C1C"
    },


    date: {
        color: "#94A3B8",

        fontSize: 8
    },


    km: {
        marginTop: 14,

        color: "#17325C",

        fontSize: 27,

        fontWeight: "900"
    },


    vehicle: {
        color: "#64748B",

        marginTop: 5,

        fontSize: 11
    },


    card: {
        backgroundColor: "#FFFFFF",

        borderRadius: 14,

        borderWidth: 1,

        borderColor: "#E7EBF1",

        padding: 14,

        marginBottom: 13
    },


    cardTitle: {
        color: "#172033",

        fontSize: 13,

        fontWeight: "900",

        marginBottom: 8
    },


    infoRow: {
        paddingVertical: 8,

        borderBottomWidth: 1,

        borderBottomColor: "#F0F2F5",

        flexDirection: "row",

        justifyContent: "space-between",

        gap: 15
    },


    infoLabel: {
        color: "#94A3B8",

        fontSize: 8
    },


    infoValue: {
        flex: 1,

        color: "#334155",

        fontSize: 9,

        fontWeight: "700",

        textAlign: "right"
    },


    observationBox: {
        backgroundColor: "#F1F4FF",

        borderRadius: 8,

        padding: 11
    },


    observation: {
        color: "#64748B",

        fontSize: 10,

        lineHeight: 15
    },


    editButton: {
        minHeight: 46,

        backgroundColor: "#073B61",

        borderRadius: 9,

        alignItems: "center",

        justifyContent: "center"
    },


    editText: {
        color: "#FFFFFF",

        fontSize: 10,

        fontWeight: "900"
    },


    deleteButton: {
        minHeight: 44,

        marginTop: 8,

        borderRadius: 9,

        backgroundColor: "#FEF2F2",

        borderWidth: 1,

        borderColor: "#FECACA",

        alignItems: "center",

        justifyContent: "center"
    },


    deleteText: {
        color: "#DC2626",

        fontSize: 9,

        fontWeight: "800"
    },


    activateButton: {
        minHeight: 44,

        marginTop: 8,

        borderRadius: 9,

        backgroundColor: "#F0FDF4",

        alignItems: "center",

        justifyContent: "center"
    },


    activateText: {
        color: "#15803D",

        fontSize: 9,

        fontWeight: "800"
    }
});