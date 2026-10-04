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
    calcularKmRestantes,
    formatearFecha,
    formatearKm,
    obtenerEstadoVisual
} from "./mantenimientoUtils";

export default function MantenimientoDetalle({
    visible,
    mantenimiento,
    vehiculo,
    onCerrar,
    onEditar,
    onMarcarRealizado,
    onDesactivar
}) {
    if (!mantenimiento) {
        return null;
    }

    const estado =
        obtenerEstadoVisual(
            mantenimiento.estado
        );

    const kmRestantes =
        calcularKmRestantes(
            mantenimiento,
            vehiculo
        );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onCerrar}
        >
            <View style={styles.screen}>
                <View style={styles.topBar}>
                    <Pressable onPress={onCerrar}>
                        <Text style={styles.back}>
                            ← Volver a mantenimientos
                        </Text>
                    </Pressable>
                </View>

                <ScrollView
                    contentContainerStyle={
                        styles.content
                    }
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.mainCard}>
                        <View
                            style={[
                                styles.status,
                                {
                                    backgroundColor:
                                        estado.fondo
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statusText,
                                    {
                                        color:
                                            estado.color
                                    }
                                ]}
                            >
                                {estado.texto.toUpperCase()}
                            </Text>
                        </View>

                        <Text style={styles.title}>
                            {mantenimiento.servicio}
                        </Text>

                        <Text style={styles.vehicle}>
                            {vehiculo
                                ? `${vehiculo.marca} ${vehiculo.modelo} • ${vehiculo.placa}`
                                : `Vehículo #${mantenimiento.vehiculoId}`}
                        </Text>

                        {vehiculo && (
                            <View style={styles.currentKm}>
                                <Text style={styles.currentKmLabel}>
                                    Kilometraje actual
                                </Text>

                                <Text style={styles.currentKmValue}>
                                    {formatearKm(
                                        vehiculo.kilometrajeActual
                                    )}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>
                            Objetivos del mantenimiento
                        </Text>

                        <View style={styles.targets}>
                            <DatoObjetivo
                                label="Fecha objetivo"
                                value={
                                    formatearFecha(
                                        mantenimiento.fechaObjetivo
                                    )
                                }
                            />

                            <DatoObjetivo
                                label="Kilometraje objetivo"
                                value={
                                    formatearKm(
                                        mantenimiento.kilometrajeObjetivo
                                    )
                                }
                            />
                        </View>

                        {kmRestantes !== null && (
                            <View
                                style={[
                                    styles.remainingBox,
                                    kmRestantes < 0 &&
                                    styles.remainingDanger
                                ]}
                            >
                                <Text style={styles.remainingLabel}>
                                    {kmRestantes < 0
                                        ? "Kilometraje excedido"
                                        : "Kilometraje restante"}
                                </Text>

                                <Text
                                    style={[
                                        styles.remainingValue,
                                        kmRestantes < 0 &&
                                        styles.remainingDangerText
                                    ]}
                                >
                                    {Math.abs(
                                        kmRestantes
                                    ).toLocaleString(
                                        "en-US",
                                        {
                                            maximumFractionDigits: 1
                                        }
                                    )} km
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>
                            Información técnica
                        </Text>

                        <Info
                            label="ID"
                            value={
                                `#${mantenimiento.id}`
                            }
                        />

                        <Info
                            label="Estado"
                            value={
                                estado.texto
                            }
                        />

                        <Info
                            label="Vehículo"
                            value={
                                vehiculo
                                    ? `${vehiculo.marca} ${vehiculo.modelo}`
                                    : `#${mantenimiento.vehiculoId}`
                            }
                        />
                    </View>

                    <View style={styles.actions}>
                        {mantenimiento.estado !==
                            "REALIZADO" && (
                            <Pressable
                                style={styles.completeButton}
                                onPress={() =>
                                    onMarcarRealizado?.(
                                        mantenimiento
                                    )
                                }
                            >
                                <Text style={styles.completeText}>
                                    ✓ Marcar como realizado
                                </Text>
                            </Pressable>
                        )}

                        <Pressable
                            style={styles.editButton}
                            onPress={() =>
                                onEditar?.(
                                    mantenimiento
                                )
                            }
                        >
                            <Text style={styles.editText}>
                                Editar / Reprogramar
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.archiveButton}
                            onPress={() =>
                                onDesactivar?.(
                                    mantenimiento
                                )
                            }
                        >
                            <Text style={styles.archiveText}>
                                Desactivar mantenimiento
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}

function DatoObjetivo({
    label,
    value
}) {
    return (
        <View style={styles.target}>
            <Text style={styles.targetLabel}>
                {label}
            </Text>

            <Text style={styles.targetValue}>
                {value}
            </Text>
        </View>
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
        paddingTop: 18,
        paddingHorizontal: 16
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

    mainCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E7EBF1",
        padding: 14,
        marginBottom: 13
    },

    status: {
        alignSelf: "flex-start",
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 999
    },

    statusText: {
        fontSize: 8,
        fontWeight: "900"
    },

    title: {
        marginTop: 12,
        color: "#172033",
        fontSize: 20,
        lineHeight: 25,
        fontWeight: "900"
    },

    vehicle: {
        marginTop: 6,
        color: "#64748B",
        fontSize: 10
    },

    currentKm: {
        marginTop: 14,
        padding: 11,
        borderRadius: 9,
        backgroundColor: "#F1F4FF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    currentKmLabel: {
        color: "#64748B",
        fontSize: 8,
        fontWeight: "700"
    },

    currentKmValue: {
        color: "#17325C",
        fontSize: 15,
        fontWeight: "900"
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
        marginBottom: 11
    },

    targets: {
        flexDirection: "row",
        gap: 8
    },

    target: {
        flex: 1,
        backgroundColor: "#F1F4FF",
        borderRadius: 8,
        padding: 10
    },

    targetLabel: {
        color: "#64748B",
        fontSize: 7,
        fontWeight: "800"
    },

    targetValue: {
        marginTop: 5,
        color: "#172033",
        fontSize: 10,
        fontWeight: "900"
    },

    remainingBox: {
        marginTop: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#ECFDF5",
        flexDirection: "row",
        justifyContent: "space-between"
    },

    remainingDanger: {
        backgroundColor: "#FEF2F2"
    },

    remainingLabel: {
        color: "#64748B",
        fontSize: 8,
        fontWeight: "700"
    },

    remainingValue: {
        color: "#15803D",
        fontSize: 10,
        fontWeight: "900"
    },

    remainingDangerText: {
        color: "#DC2626"
    },

    info: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 15,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#EEF1F5"
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

    actions: {
        gap: 8
    },

    completeButton: {
        minHeight: 47,
        borderRadius: 9,
        backgroundColor: "#073B61",
        alignItems: "center",
        justifyContent: "center"
    },

    completeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "900"
    },

    editButton: {
        minHeight: 44,
        borderRadius: 9,
        backgroundColor: "#EEF3FF",
        alignItems: "center",
        justifyContent: "center"
    },

    editText: {
        color: "#1D4ED8",
        fontSize: 9,
        fontWeight: "800"
    },

    archiveButton: {
        minHeight: 44,
        borderRadius: 9,
        backgroundColor: "#FEF2F2",
        alignItems: "center",
        justifyContent: "center"
    },

    archiveText: {
        color: "#DC2626",
        fontSize: 9,
        fontWeight: "800"
    }
});