import React from "react";

import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";


function monto(
    valor,
    moneda = "USD"
) {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency:
                moneda || "USD"
        }
    ).format(
        Number(valor || 0)
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
                {value || "No disponible"}
            </Text>

        </View>
    );
}


export default function GastoDetalle({

    visible,

    gasto,

    obtenerNombreVehiculo,

    onCerrar,

    onEditar,

    onDesactivar,

    onReactivar

}) {

    if (!gasto) {
        return null;
    }


    const activo =
        gasto.activo !== false;


    return (

        <Modal
            visible={visible}

            animationType="slide"

            transparent={false}

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
                        Detalle del gasto
                    </Text>


                    <View style={styles.mainCard}>

                        <View style={styles.mainTop}>

                            <View style={styles.category}>

                                <Text style={styles.categoryText}>
                                    Categoría #{gasto.categoriaId}
                                </Text>

                            </View>


                            <View
                                style={[
                                    styles.status,

                                    activo
                                        ? styles.statusActive
                                        : styles.statusInactive
                                ]}
                            >

                                <Text
                                    style={[
                                        styles.statusText,

                                        activo
                                            ? styles.statusActiveText
                                            : styles.statusInactiveText
                                    ]}
                                >
                                    {activo
                                        ? "ACTIVO"
                                        : "INACTIVO"}
                                </Text>

                            </View>

                        </View>


                        <Text style={styles.amount}>
                            {monto(
                                gasto.monto,
                                gasto.moneda
                            )}
                        </Text>


                        <Text style={styles.description}>
                            {gasto.descripcion ||
                                "Sin descripción"}
                        </Text>

                    </View>


                    <View style={styles.card}>

                        <Text style={styles.cardTitle}>
                            Vehículo
                        </Text>


                        <View style={styles.vehicleBox}>

                            <View style={styles.vehicleIcon}>

                                <Text style={styles.vehicleIconText}>
                                    VH
                                </Text>

                            </View>


                            <Text
                                style={styles.vehicleName}
                                numberOfLines={2}
                            >
                                {obtenerNombreVehiculo(
                                    gasto.vehiculoId
                                )}
                            </Text>

                        </View>

                    </View>


                    <View style={styles.card}>

                        <Text style={styles.cardTitle}>
                            Datos del comprobante
                        </Text>

                        <Info
                            label="Fecha de emisión"
                            value={gasto.fecha}
                        />

                        <Info
                            label="N.º de factura"
                            value={
                                gasto.numeroComprobante
                            }
                        />

                        <Info
                            label="Taller / Proveedor"
                            value={
                                gasto.proveedor
                            }
                        />

                    </View>


                    <View style={styles.card}>

                        <Text style={styles.cardTitle}>
                            Descripción / observaciones
                        </Text>


                        <View style={styles.descriptionBox}>

                            <Text style={styles.descriptionLong}>
                                {gasto.descripcion ||
                                    "Sin observaciones registradas."}
                            </Text>

                        </View>

                    </View>


                    <View style={styles.actions}>

                        <Pressable
                            style={styles.editButton}

                            onPress={() =>
                                onEditar?.(gasto)
                            }
                        >

                            <Text style={styles.editText}>
                                Editar gasto
                            </Text>

                        </Pressable>


                        {activo ? (

                            <Pressable
                                style={styles.deleteButton}

                                onPress={() =>
                                    onDesactivar?.(
                                        gasto
                                    )
                                }
                            >

                                <Text style={styles.deleteText}>
                                    Desactivar gasto
                                </Text>

                            </Pressable>

                        ) : (

                            <Pressable
                                style={styles.activateButton}

                                onPress={() =>
                                    onReactivar?.(
                                        gasto
                                    )
                                }
                            >

                                <Text style={styles.activateText}>
                                    Reactivar gasto
                                </Text>

                            </Pressable>
                        )}

                    </View>

                </ScrollView>

            </View>

        </Modal>
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

        justifyContent: "space-between"
    },


    category: {
        backgroundColor: "#EAF3FF",

        borderRadius: 7,

        paddingHorizontal: 8,

        paddingVertical: 5
    },


    categoryText: {
        color: "#28548A",

        fontSize: 8,

        fontWeight: "800"
    },


    status: {
        borderRadius: 7,

        paddingHorizontal: 8,

        paddingVertical: 5
    },


    statusActive: {
        backgroundColor: "#DCFCE7"
    },


    statusInactive: {
        backgroundColor: "#FEE2E2"
    },


    statusText: {
        fontSize: 8,

        fontWeight: "900"
    },


    statusActiveText: {
        color: "#15803D"
    },


    statusInactiveText: {
        color: "#B91C1C"
    },


    amount: {
        marginTop: 13,

        color: "#172033",

        fontSize: 25,

        fontWeight: "900"
    },


    description: {
        marginTop: 7,

        color: "#64748B",

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

        fontSize: 14,

        fontWeight: "900",

        marginBottom: 11
    },


    vehicleBox: {
        backgroundColor: "#EEF3FF",

        borderRadius: 9,

        padding: 10,

        flexDirection: "row",

        alignItems: "center"
    },


    vehicleIcon: {
        width: 38,

        height: 38,

        borderRadius: 8,

        backgroundColor: "#DDE8FF",

        alignItems: "center",

        justifyContent: "center",

        marginRight: 10
    },


    vehicleIconText: {
        color: "#28548A",

        fontSize: 9,

        fontWeight: "900"
    },


    vehicleName: {
        flex: 1,

        color: "#172033",

        fontSize: 12,

        fontWeight: "800"
    },


    infoRow: {
        paddingVertical: 8,

        flexDirection: "row",

        justifyContent: "space-between",

        gap: 20,

        borderBottomWidth: 1,

        borderBottomColor: "#F0F2F5"
    },


    infoLabel: {
        color: "#94A3B8",

        fontSize: 9
    },


    infoValue: {
        flex: 1,

        textAlign: "right",

        color: "#334155",

        fontSize: 9,

        fontWeight: "700"
    },


    descriptionBox: {
        backgroundColor: "#F1F4FF",

        borderRadius: 8,

        padding: 12
    },


    descriptionLong: {
        color: "#64748B",

        fontSize: 10,

        lineHeight: 16
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

        fontSize: 10,

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