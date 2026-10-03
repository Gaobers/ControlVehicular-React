import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";


function formatearKilometraje(valor) {
    const numero = Number(valor || 0);

    return `${numero.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    })} km`;
}


function obtenerEstadoVisual(estado) {

    if (estado === "ARCHIVADO") {
        return {
            texto: "Archivado",
            fondo: "#FEE2E2",
            color: "#B91C1C",
            borde: "#EF4444"
        };
    }


    return {
        texto: "Al día",
        fondo: "#EAF3FF",
        color: "#2563EB",
        borde: "#38BDF8"
    };
}


export default function VehiculoCard({
    vehiculo,
    onDetalle
}) {

    const estado =
        obtenerEstadoVisual(
            vehiculo?.estado
        );


    const nombre =
        [
            vehiculo?.marca,
            vehiculo?.modelo
        ]
            .filter(Boolean)
            .join(" ");


    const descripcion = [
        vehiculo?.anio,
        vehiculo?.color
    ]
        .filter(Boolean)
        .join(" • ");


    return (

        <Pressable
            style={({ pressed }) => [
                styles.card,

                {
                    borderLeftColor:
                        estado.borde
                },

                pressed &&
                styles.cardPressed
            ]}
            onPress={() =>
                onDetalle?.(vehiculo)
            }
        >

            {/* PARTE SUPERIOR */}

            <View style={styles.mainRow}>

                {/* ESPACIO RESERVADO PARA IMAGEN */}

                <View style={styles.imagePlaceholder}>

                    <Text style={styles.imageText}>
                        VH
                    </Text>

                </View>


                {/* INFORMACIÓN */}

                <View style={styles.info}>

                    <View style={styles.titleRow}>

                        <Text
                            style={styles.title}
                            numberOfLines={1}
                        >
                            {nombre || "Vehículo"}
                        </Text>


                        <View style={styles.plateBadge}>

                            <Text
                                style={
                                    styles.plateText
                                }
                            >
                                {vehiculo?.placa ||
                                    "SIN PLACA"}
                            </Text>

                        </View>

                    </View>


                    <Text
                        style={styles.secondary}
                        numberOfLines={1}
                    >
                        Propietario #
                        {vehiculo?.propietarioId ??
                            "-"}
                    </Text>


                    <Text
                        style={styles.secondary}
                        numberOfLines={1}
                    >
                        {descripcion ||
                            "Sin datos adicionales"}
                    </Text>

                </View>

            </View>


            {/* FILA DE ESTADO */}

            <View style={styles.statusRow}>

                <View>

                    <Text style={styles.kmLabel}>
                        Kilometraje actual
                    </Text>

                    <Text style={styles.kmValue}>
                        {formatearKilometraje(
                            vehiculo?.kilometrajeActual
                        )}
                    </Text>

                </View>


                <View
                    style={[
                        styles.statusBadge,

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
                        {estado.texto}
                    </Text>

                </View>

            </View>


            {/* ACCIÓN */}

            <View style={styles.footer}>

                <Text style={styles.footerHint}>
                    ID #{vehiculo?.id}
                </Text>


                <Text style={styles.detailText}>
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

        borderColor: "#E5EAF0",

        borderLeftWidth: 3,

        padding: 12,

        marginBottom: 10,

        shadowColor: "#000000",

        shadowOffset: {
            width: 0,
            height: 2
        },

        shadowOpacity: 0.04,

        shadowRadius: 5,

        elevation: 1
    },


    cardPressed: {
        opacity: 0.82,

        transform: [
            {
                scale: 0.995
            }
        ]
    },


    mainRow: {
        flexDirection: "row",

        alignItems: "flex-start"
    },


    imagePlaceholder: {
        width: 72,

        height: 58,

        borderRadius: 9,

        backgroundColor: "#E9EEF5",

        borderWidth: 1,

        borderColor: "#DDE4EC",

        justifyContent: "center",

        alignItems: "center",

        marginRight: 11
    },


    imageText: {
        color: "#94A3B8",

        fontSize: 11,

        fontWeight: "900"
    },


    info: {
        flex: 1
    },


    titleRow: {
        flexDirection: "row",

        alignItems: "flex-start",

        justifyContent: "space-between",

        gap: 8
    },


    title: {
        flex: 1,

        color: "#172033",

        fontSize: 14,

        lineHeight: 18,

        fontWeight: "900"
    },


    plateBadge: {
        backgroundColor: "#E9F1FF",

        borderRadius: 6,

        paddingHorizontal: 7,

        paddingVertical: 4
    },


    plateText: {
        color: "#24528A",

        fontSize: 9,

        fontWeight: "900",

        letterSpacing: 0.3
    },


    secondary: {
        marginTop: 3,

        color: "#778395",

        fontSize: 10,

        lineHeight: 14
    },


    statusRow: {
        marginTop: 12,

        paddingTop: 10,

        borderTopWidth: 1,

        borderTopColor: "#F0F2F5",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between"
    },


    kmLabel: {
        color: "#94A3B8",

        fontSize: 8,

        fontWeight: "800",

        textTransform: "uppercase"
    },


    kmValue: {
        marginTop: 2,

        color: "#25364D",

        fontSize: 12,

        fontWeight: "800"
    },


    statusBadge: {
        paddingHorizontal: 9,

        paddingVertical: 5,

        borderRadius: 999
    },


    statusText: {
        fontSize: 8,

        fontWeight: "900"
    },


    footer: {
        marginTop: 10,

        paddingTop: 8,

        borderTopWidth: 1,

        borderTopColor: "#F0F2F5",

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between"
    },


    footerHint: {
        color: "#A0AABC",

        fontSize: 8
    },


    detailText: {
        color: "#0D3559",

        fontSize: 9,

        fontWeight: "900"
    }
});