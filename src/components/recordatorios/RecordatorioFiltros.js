import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";


export default function RecordatorioFiltros({

    filtro,

    onFiltroChange,

    resumen

}) {

    const filtros = [

        {
            id: "TODOS",
            texto: "Todos",
            cantidad:
                resumen.total
        },

        {
            id: "VENCIDO",
            texto: "Vencidos",
            cantidad:
                resumen.vencidos
        },

        {
            id: "PROXIMO",
            texto: "Próximos",
            cantidad:
                resumen.proximos
        },

        {
            id: "PENDIENTE",
            texto: "Pendientes",
            cantidad:
                resumen.pendientes
        },

        {
            id: "REALIZADO",
            texto: "Atendidos",
            cantidad:
                resumen.realizados
        }

    ];


    return (

        <View style={styles.filters}>

            {filtros.map(
                (item) => {

                    const activo =
                        filtro ===
                        item.id;


                    return (

                        <Pressable
                            key={
                                item.id
                            }

                            style={[
                                styles.filter,

                                activo &&
                                styles.filterActive
                            ]}

                            onPress={() =>
                                onFiltroChange(
                                    item.id
                                )
                            }
                        >

                            <Text
                                style={[
                                    styles.filterText,

                                    activo &&
                                    styles.filterTextActive
                                ]}
                            >
                                {item.texto}
                            </Text>


                            <View
                                style={[
                                    styles.counter,

                                    activo &&
                                    styles.counterActive
                                ]}
                            >

                                <Text
                                    style={[
                                        styles.counterText,

                                        activo &&
                                        styles.counterTextActive
                                    ]}
                                >
                                    {item.cantidad}
                                </Text>

                            </View>

                        </Pressable>
                    );
                }
            )}

        </View>
    );
}


const styles = StyleSheet.create({

    filters: {
        flexDirection: "row",

        flexWrap: "wrap",

        gap: 6,

        marginBottom: 13
    },


    filter: {
        minHeight: 31,

        flexDirection: "row",

        alignItems: "center",

        paddingLeft: 10,

        paddingRight: 5,

        borderRadius: 16,

        backgroundColor: "#EDF1F6"
    },


    filterActive: {
        backgroundColor: "#073B61"
    },


    filterText: {
        color: "#64748B",

        fontSize: 7,

        fontWeight: "800"
    },


    filterTextActive: {
        color: "#FFFFFF"
    },


    counter: {
        minWidth: 19,

        height: 19,

        marginLeft: 5,

        borderRadius: 10,

        backgroundColor: "#FFFFFF",

        paddingHorizontal: 4,

        alignItems: "center",

        justifyContent: "center"
    },


    counterActive: {
        backgroundColor: "#245477"
    },


    counterText: {
        color: "#475569",

        fontSize: 7,

        fontWeight: "900"
    },


    counterTextActive: {
        color: "#FFFFFF"
    }
});