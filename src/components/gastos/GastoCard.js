import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";


function formatearMonto(
    monto,
    moneda = "USD"
) {

    const numero =
        Number(monto || 0);

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency:
                moneda || "USD"
        }
    ).format(numero);
}


function formatearFecha(fecha) {

    if (!fecha) {
        return "Sin fecha";
    }

    try {

        return new Date(
            `${fecha}T00:00:00`
        ).toLocaleDateString(
            "es-SV",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    } catch {

        return fecha;
    }
}


export default function GastoCard({
    gasto,
    obtenerNombreVehiculo,
    onDetalle
}) {

    const activo =
        gasto.activo !== false;


    return (

        <Pressable
            style={({ pressed }) => [
                styles.card,

                !activo &&
                styles.cardInactivo,

                pressed &&
                styles.pressed
            ]}
            onPress={() =>
                onDetalle?.(gasto)
            }
        >

            <View style={styles.top}>

                <View style={{ flex: 1 }}>

                    <Text style={styles.fecha}>
                        {formatearFecha(
                            gasto.fecha
                        )}
                    </Text>


                    <Text
                        style={styles.vehiculo}
                        numberOfLines={1}
                    >
                        {obtenerNombreVehiculo(
                            gasto.vehiculoId
                        )}
                    </Text>

                </View>


                <View style={styles.categoriaBadge}>

                    <Text style={styles.categoriaText}>
                        Categoría #{gasto.categoriaId}
                    </Text>

                </View>

            </View>


            <Text
                style={styles.descripcion}
                numberOfLines={2}
            >
                {gasto.descripcion ||
                    "Sin descripción"}
            </Text>


            <View style={styles.bottom}>

                <Text style={styles.monto}>
                    {formatearMonto(
                        gasto.monto,
                        gasto.moneda
                    )}
                </Text>


                <View style={styles.arrowButton}>

                    <Text style={styles.arrow}>
                        ›
                    </Text>

                </View>

            </View>


            {!activo && (

                <View style={styles.inactivoBadge}>

                    <Text style={styles.inactivoText}>
                        INACTIVO
                    </Text>

                </View>
            )}

        </Pressable>
    );
}


const styles = StyleSheet.create({

    card: {
        backgroundColor: "#FFFFFF",

        borderRadius: 13,

        borderWidth: 1,

        borderColor: "#E6EBF2",

        padding: 13,

        marginBottom: 9
    },


    cardInactivo: {
        opacity: 0.62
    },


    pressed: {
        opacity: 0.82
    },


    top: {
        flexDirection: "row",

        alignItems: "flex-start",

        gap: 8
    },


    fecha: {
        color: "#64748B",

        fontSize: 9,

        fontWeight: "700"
    },


    vehiculo: {
        color: "#172033",

        fontSize: 11,

        fontWeight: "800",

        marginTop: 3
    },


    categoriaBadge: {
        backgroundColor: "#EAF3FF",

        paddingHorizontal: 7,

        paddingVertical: 4,

        borderRadius: 5
    },


    categoriaText: {
        color: "#28548A",

        fontSize: 8,

        fontWeight: "800"
    },


    descripcion: {
        marginTop: 8,

        color: "#64748B",

        fontSize: 10,

        lineHeight: 15
    },


    bottom: {
        marginTop: 10,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between"
    },


    monto: {
        color: "#172033",

        fontSize: 16,

        fontWeight: "900"
    },


    arrowButton: {
        width: 29,

        height: 29,

        borderRadius: 15,

        backgroundColor: "#EFF3FF",

        alignItems: "center",

        justifyContent: "center"
    },


    arrow: {
        color: "#37517A",

        fontSize: 17,

        fontWeight: "800"
    },


    inactivoBadge: {
        marginTop: 9,

        alignSelf: "flex-start",

        paddingHorizontal: 7,

        paddingVertical: 4,

        borderRadius: 5,

        backgroundColor: "#FEE2E2"
    },


    inactivoText: {
        color: "#B91C1C",

        fontSize: 8,

        fontWeight: "900"
    }
});