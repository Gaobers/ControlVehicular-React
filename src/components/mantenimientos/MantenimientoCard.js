import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import {
    formatearFecha,
    formatearKm,
    obtenerEstadoVisual
} from "./mantenimientoUtils";

export default function MantenimientoCard({
    mantenimiento,
    nombreVehiculo,
    onDetalle
}) {
    const estado = obtenerEstadoVisual(
        mantenimiento.estado
    );

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                {
                    borderLeftColor:
                        estado.borde
                },
                pressed && styles.pressed
            ]}
            onPress={() =>
                onDetalle?.(mantenimiento)
            }
        >
            <View style={styles.top}>
                <Text
                    style={styles.vehicle}
                    numberOfLines={1}
                >
                    {nombreVehiculo}
                </Text>

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
            </View>

            <Text
                style={styles.service}
                numberOfLines={2}
            >
                {mantenimiento.servicio}
            </Text>

            <View style={styles.targets}>
                {mantenimiento.fechaObjetivo && (
                    <View style={styles.targetItem}>
                        <Text style={styles.targetLabel}>
                            FECHA OBJETIVO
                        </Text>

                        <Text style={styles.targetValue}>
                            {formatearFecha(
                                mantenimiento.fechaObjetivo
                            )}
                        </Text>
                    </View>
                )}

                {mantenimiento.kilometrajeObjetivo !== null &&
                    mantenimiento.kilometrajeObjetivo !== undefined && (
                        <View style={styles.targetItem}>
                            <Text style={styles.targetLabel}>
                                KM OBJETIVO
                            </Text>

                            <Text style={styles.targetValue}>
                                {formatearKm(
                                    mantenimiento.kilometrajeObjetivo
                                )}
                            </Text>
                        </View>
                    )}
            </View>

            <View style={styles.footer}>
                <Text style={styles.id}>
                    Mantenimiento #{mantenimiento.id}
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
        justifyContent: "space-between",
        gap: 8
    },

    vehicle: {
        flex: 1,
        color: "#64748B",
        fontSize: 8,
        fontWeight: "700"
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

    service: {
        marginTop: 7,
        color: "#172033",
        fontSize: 13,
        lineHeight: 18,
        fontWeight: "900"
    },

    targets: {
        marginTop: 11,
        flexDirection: "row",
        gap: 8
    },

    targetItem: {
        flex: 1,
        backgroundColor: "#F7F9FC",
        borderRadius: 8,
        padding: 8
    },

    targetLabel: {
        color: "#94A3B8",
        fontSize: 7,
        fontWeight: "800"
    },

    targetValue: {
        marginTop: 3,
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

    id: {
        color: "#A0AABC",
        fontSize: 7
    },

    detail: {
        color: "#0D3559",
        fontSize: 8,
        fontWeight: "900"
    }
});