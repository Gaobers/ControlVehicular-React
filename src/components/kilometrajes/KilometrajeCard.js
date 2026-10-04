import React from "react";

import {
    Pressable,
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


export default function KilometrajeCard({

    registro,

    obtenerNombreVehiculo,

    onDetalle

}) {

    const activo =
        registro.activo !== false;


    return (

        <Pressable
            style={({ pressed }) => [
                styles.card,

                !activo &&
                styles.inactivo,

                pressed &&
                styles.pressed
            ]}

            onPress={() =>
                onDetalle?.(
                    registro
                )
            }
        >

            <View style={styles.top}>

                <View style={{ flex: 1 }}>

                    <Text
                        style={styles.vehiculo}
                        numberOfLines={1}
                    >
                        {obtenerNombreVehiculo(
                            registro.vehiculoId
                        )}
                    </Text>


                    <Text style={styles.fecha}>
                        {formatearFecha(
                            registro.fechaHora
                        )}
                    </Text>

                </View>


                <View style={styles.kmBadge}>

                    <Text style={styles.kmBadgeText}>
                        {formatearKm(
                            registro.kilometraje
                        )}
                    </Text>

                </View>

            </View>


            <View style={styles.estadoFila}>

                <View
                    style={[
                        styles.estado,

                        activo
                            ? styles.estadoActivo
                            : styles.estadoInactivo
                    ]}
                >

                    <Text
                        style={[
                            styles.estadoText,

                            activo
                                ? styles.estadoActivoText
                                : styles.estadoInactivoText
                        ]}
                    >
                        {activo
                            ? "ACTIVO"
                            : "INACTIVO"}
                    </Text>

                </View>


                <Text style={styles.id}>
                    Registro #{registro.id}
                </Text>

            </View>


            {registro.observacion ? (

                <Text
                    style={styles.observacion}
                    numberOfLines={2}
                >
                    {registro.observacion}
                </Text>

            ) : null}


            <View style={styles.footer}>

                <Text style={styles.footerText}>
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

        borderLeftColor: "#38BDF8",

        padding: 13,

        marginBottom: 9
    },


    inactivo: {
        borderLeftColor: "#EF4444",

        opacity: 0.65
    },


    pressed: {
        opacity: 0.82
    },


    top: {
        flexDirection: "row",

        alignItems: "flex-start",

        gap: 10
    },


    vehiculo: {
        color: "#172033",

        fontSize: 12,

        fontWeight: "900"
    },


    fecha: {
        marginTop: 4,

        color: "#94A3B8",

        fontSize: 8
    },


    kmBadge: {
        backgroundColor: "#E8F1FF",

        borderRadius: 8,

        paddingHorizontal: 9,

        paddingVertical: 7
    },


    kmBadgeText: {
        color: "#2563EB",

        fontSize: 11,

        fontWeight: "900"
    },


    estadoFila: {
        marginTop: 11,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between"
    },


    estado: {
        paddingHorizontal: 7,

        paddingVertical: 4,

        borderRadius: 6
    },


    estadoActivo: {
        backgroundColor: "#DCFCE7"
    },


    estadoInactivo: {
        backgroundColor: "#FEE2E2"
    },


    estadoText: {
        fontSize: 7,

        fontWeight: "900"
    },


    estadoActivoText: {
        color: "#15803D"
    },


    estadoInactivoText: {
        color: "#B91C1C"
    },


    id: {
        color: "#A0AABC",

        fontSize: 8
    },


    observacion: {
        marginTop: 10,

        backgroundColor: "#F8FAFC",

        padding: 9,

        borderRadius: 7,

        color: "#64748B",

        fontSize: 9,

        lineHeight: 14
    },


    footer: {
        marginTop: 9,

        paddingTop: 8,

        borderTopWidth: 1,

        borderTopColor: "#EEF1F5",

        alignItems: "flex-end"
    },


    footerText: {
        color: "#0D3559",

        fontSize: 8,

        fontWeight: "900"
    }
});