import React from "react";

import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import {
    calcularFechaRecordatorio,
    calcularKmRecordatorio,
    formatearFecha,
    formatearKm,
    obtenerEstadoRecordatorio,
    obtenerNombreVehiculo
} from "./recordatorioUtils";


export default function RecordatorioDetalle({

    visible,

    recordatorio,

    mantenimiento,

    vehiculo,

    onCerrar,

    onEditar,

    onDesactivar,

    onReactivar

}) {

    if (!recordatorio) {
        return null;
    }


    const estado =
        obtenerEstadoRecordatorio(
            recordatorio,
            mantenimiento,
            vehiculo
        );


    const fechaRecordatorio =
        calcularFechaRecordatorio(
            mantenimiento,
            recordatorio
        );


    const kmRecordatorio =
        calcularKmRecordatorio(
            mantenimiento,
            recordatorio
        );


    const activo =
        estado.id !==
        "INACTIVO";


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
                            ← Volver a recordatorios
                        </Text>

                    </Pressable>

                </View>


                <ScrollView
                    contentContainerStyle={
                        styles.content
                    }
                >

                    <Text style={styles.pageTitle}>
                        Detalle del recordatorio
                    </Text>


                    <View style={styles.mainCard}>

                        <View
                            style={[
                                styles.badge,
                                {
                                    backgroundColor:
                                        estado.fondo
                                }
                            ]}
                        >

                            <Text
                                style={[
                                    styles.badgeText,
                                    {
                                        color:
                                            estado.color
                                    }
                                ]}
                            >
                                {estado.texto.toUpperCase()}
                            </Text>

                        </View>


                        <Text style={styles.service}>
                            {mantenimiento?.servicio ||
                                "Mantenimiento"}
                        </Text>


                        <Text style={styles.vehicle}>
                            {obtenerNombreVehiculo(
                                vehiculo
                            )}
                        </Text>

                    </View>


                    <View style={styles.card}>

                        <Text style={styles.cardTitle}>
                            Configuración del aviso
                        </Text>


                        <Info
                            label="Días de anticipación"

                            value={`${recordatorio.diasAnticipacion ?? 0} días`}
                        />


                        <Info
                            label="Kilómetros de anticipación"

                            value={`${Number(
                                recordatorio.kilometrosAnticipacion ||
                                0
                            ).toLocaleString("en-US")} km`}
                        />


                        <Info
                            label="Fecha del aviso"

                            value={
                                fechaRecordatorio
                                    ? formatearFecha(
                                        fechaRecordatorio
                                            .toISOString()
                                            .slice(
                                                0,
                                                10
                                            )
                                    )
                                    : "Sin fecha"
                            }
                        />


                        <Info
                            label="Kilometraje del aviso"

                            value={
                                kmRecordatorio !==
                                null
                                    ? formatearKm(
                                        kmRecordatorio
                                    )
                                    : "Sin objetivo"
                            }
                        />

                    </View>


                    <View style={styles.card}>

                        <Text style={styles.cardTitle}>
                            Meta del mantenimiento
                        </Text>


                        <Info
                            label="Fecha objetivo"

                            value={
                                formatearFecha(
                                    mantenimiento
                                        ?.fechaObjetivo
                                )
                            }
                        />


                        <Info
                            label="Kilometraje objetivo"

                            value={
                                formatearKm(
                                    mantenimiento
                                        ?.kilometrajeObjetivo
                                )
                            }
                        />


                        <Info
                            label="Kilometraje actual"

                            value={
                                formatearKm(
                                    vehiculo
                                        ?.kilometrajeActual
                                )
                            }
                        />

                    </View>


                    <View style={styles.actions}>

                        <Pressable
                            style={styles.editButton}

                            onPress={() =>
                                onEditar?.(
                                    recordatorio
                                )
                            }
                        >

                            <Text style={styles.editText}>
                                Editar recordatorio
                            </Text>

                        </Pressable>


                        {activo ? (

                            <Pressable
                                style={styles.deleteButton}

                                onPress={() =>
                                    onDesactivar?.(
                                        recordatorio
                                    )
                                }
                            >

                                <Text style={styles.deleteText}>
                                    Desactivar recordatorio
                                </Text>

                            </Pressable>

                        ) : (

                            <Pressable
                                style={styles.activateButton}

                                onPress={() =>
                                    onReactivar?.(
                                        recordatorio
                                    )
                                }
                            >

                                <Text style={styles.activateText}>
                                    Reactivar recordatorio
                                </Text>

                            </Pressable>
                        )}

                    </View>

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

        <View style={styles.info}>

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


    pageTitle: {
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


    badge: {
        alignSelf: "flex-start",

        paddingHorizontal: 9,

        paddingVertical: 5,

        borderRadius: 999
    },


    badgeText: {
        fontSize: 8,

        fontWeight: "900"
    },


    service: {
        marginTop: 12,

        color: "#172033",

        fontSize: 19,

        lineHeight: 24,

        fontWeight: "900"
    },


    vehicle: {
        marginTop: 5,

        color: "#64748B",

        fontSize: 10
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


    info: {
        paddingVertical: 8,

        borderBottomWidth: 1,

        borderBottomColor: "#EEF1F5",

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

        textAlign: "right",

        fontSize: 9,

        fontWeight: "700"
    },


    actions: {
        gap: 8
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

        fontSize: 9,

        fontWeight: "900"
    },


    deleteButton: {
        minHeight: 44,

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