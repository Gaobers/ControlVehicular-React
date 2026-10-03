import React from "react";

import {
    Pressable,
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


export default function RecordatorioCard({

    recordatorio,

    mantenimiento,

    vehiculo,

    onDetalle

}) {

    const estado =
        obtenerEstadoRecordatorio(
            recordatorio,
            mantenimiento,
            vehiculo
        );


    const fechaAviso =
        calcularFechaRecordatorio(
            mantenimiento,
            recordatorio
        );


    const kmAviso =
        calcularKmRecordatorio(
            mantenimiento,
            recordatorio
        );


    return (

        <Pressable
            style={({ pressed }) => [
                styles.card,

                {
                    borderLeftColor:
                        estado.borde
                },

                pressed &&
                styles.pressed
            ]}
            onPress={() =>
                onDetalle?.(
                    recordatorio
                )
            }
        >

            <View style={styles.top}>

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


                <Text style={styles.meta}>
                    #{recordatorio.id}
                </Text>

            </View>


            <Text
                style={styles.vehicle}
                numberOfLines={1}
            >
                {obtenerNombreVehiculo(
                    vehiculo
                )}
            </Text>


            <Text
                style={styles.service}
                numberOfLines={2}
            >
                {mantenimiento?.servicio ||
                    `Mantenimiento #${recordatorio.mantenimientoId}`}
            </Text>


            <View style={styles.reminders}>

                {fechaAviso && (

                    <View style={styles.reminder}>

                        <Text style={styles.reminderLabel}>
                            AVISO POR FECHA
                        </Text>

                        <Text style={styles.reminderValue}>
                            {formatearFecha(
                                fechaAviso
                                    .toISOString()
                                    .slice(
                                        0,
                                        10
                                    )
                            )}
                        </Text>

                    </View>
                )}


                {kmAviso !== null && (

                    <View style={styles.reminder}>

                        <Text style={styles.reminderLabel}>
                            AVISO POR KM
                        </Text>

                        <Text style={styles.reminderValue}>
                            {formatearKm(
                                kmAviso
                            )}
                        </Text>

                    </View>
                )}

            </View>


            <View style={styles.footer}>

                <Text style={styles.footerHint}>
                    Recordatorio de mantenimiento
                </Text>

                <Text style={styles.detail}>
                    Ver detalle →
                </Text>

            </View>

        </Pressable>
    );
}


const styles = StyleSheet.create({

    card: {
        backgroundColor: "#FFFFFF",

        borderRadius: 13,

        borderWidth: 1,

        borderColor: "#E6EBF2",

        borderLeftWidth: 3,

        padding: 13,

        marginBottom: 9
    },


    pressed: {
        opacity: 0.82
    },


    top: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between"
    },


    badge: {
        paddingHorizontal: 8,

        paddingVertical: 5,

        borderRadius: 999
    },


    badgeText: {
        fontSize: 7,

        fontWeight: "900"
    },


    meta: {
        color: "#94A3B8",

        fontSize: 8
    },


    vehicle: {
        marginTop: 10,

        color: "#64748B",

        fontSize: 8,

        fontWeight: "700"
    },


    service: {
        marginTop: 4,

        color: "#172033",

        fontSize: 13,

        lineHeight: 18,

        fontWeight: "900"
    },


    reminders: {
        marginTop: 11,

        flexDirection: "row",

        gap: 7
    },


    reminder: {
        flex: 1,

        borderRadius: 8,

        backgroundColor: "#F7F9FC",

        padding: 8
    },


    reminderLabel: {
        color: "#94A3B8",

        fontSize: 6,

        fontWeight: "900"
    },


    reminderValue: {
        marginTop: 4,

        color: "#334155",

        fontSize: 9,

        fontWeight: "800"
    },


    footer: {
        marginTop: 10,

        paddingTop: 8,

        borderTopWidth: 1,

        borderTopColor: "#EEF1F5",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between"
    },


    footerHint: {
        color: "#A0AABC",

        fontSize: 7
    },


    detail: {
        color: "#0D3559",

        fontSize: 8,

        fontWeight: "900"
    }
});