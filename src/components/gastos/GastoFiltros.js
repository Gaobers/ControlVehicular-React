import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";


export default function GastoFiltros({

    busqueda,
    onBusquedaChange,

    filtroEstado,
    onFiltroEstadoChange,

    total,
    activos,
    inactivos
}) {

    const filtros = [
        {
            id: "TODOS",
            texto: "Todos",
            cantidad: total
        },
        {
            id: "ACTIVOS",
            texto: "Activos",
            cantidad: activos
        },
        {
            id: "INACTIVOS",
            texto: "Inactivos",
            cantidad: inactivos
        }
    ];


    return (

        <View style={styles.container}>

            <View style={styles.searchBox}>

                <Text style={styles.searchIcon}>
                    ⌕
                </Text>

                <TextInput
                    style={styles.input}

                    value={busqueda}

                    onChangeText={
                        onBusquedaChange
                    }

                    placeholder="Buscar vehículo, proveedor o descripción..."

                    placeholderTextColor="#94A3B8"
                />


                {busqueda ? (

                    <Pressable
                        onPress={() =>
                            onBusquedaChange("")
                        }
                    >

                        <Text style={styles.clear}>
                            ✕
                        </Text>

                    </Pressable>

                ) : null}

            </View>


            <View style={styles.filters}>

                {filtros.map(
                    (filtro) => {

                        const seleccionado =
                            filtroEstado ===
                            filtro.id;


                        return (

                            <Pressable
                                key={filtro.id}

                                style={[
                                    styles.filter,

                                    seleccionado &&
                                    styles.filterActive
                                ]}

                                onPress={() =>
                                    onFiltroEstadoChange(
                                        filtro.id
                                    )
                                }
                            >

                                <Text
                                    style={[
                                        styles.filterText,

                                        seleccionado &&
                                        styles.filterTextActive
                                    ]}
                                >
                                    {filtro.texto}
                                </Text>


                                <View
                                    style={[
                                        styles.counter,

                                        seleccionado &&
                                        styles.counterActive
                                    ]}
                                >

                                    <Text
                                        style={[
                                            styles.counterText,

                                            seleccionado &&
                                            styles.counterTextActive
                                        ]}
                                    >
                                        {filtro.cantidad}
                                    </Text>

                                </View>

                            </Pressable>
                        );
                    }
                )}

            </View>

        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        marginBottom: 14
    },


    searchBox: {
        minHeight: 43,

        backgroundColor: "#FFFFFF",

        borderWidth: 1,

        borderColor: "#E3E8EF",

        borderRadius: 10,

        flexDirection: "row",

        alignItems: "center",

        paddingHorizontal: 11
    },


    searchIcon: {
        color: "#94A3B8",

        fontSize: 15,

        marginRight: 7
    },


    input: {
        flex: 1,

        minHeight: 41,

        color: "#172033",

        fontSize: 10
    },


    clear: {
        color: "#64748B",

        padding: 6,

        fontSize: 9
    },


    filters: {
        marginTop: 8,

        flexDirection: "row",

        flexWrap: "wrap",

        gap: 7
    },


    filter: {
        flexDirection: "row",

        alignItems: "center",

        paddingLeft: 11,

        paddingRight: 6,

        minHeight: 32,

        borderRadius: 18,

        backgroundColor: "#EDF1F6"
    },


    filterActive: {
        backgroundColor: "#0D3559"
    },


    filterText: {
        color: "#64748B",

        fontSize: 8,

        fontWeight: "800"
    },


    filterTextActive: {
        color: "#FFFFFF"
    },


    counter: {
        minWidth: 21,

        height: 21,

        marginLeft: 6,

        paddingHorizontal: 5,

        borderRadius: 11,

        backgroundColor: "#FFFFFF",

        alignItems: "center",

        justifyContent: "center"
    },


    counterActive: {
        backgroundColor: "#244E75"
    },


    counterText: {
        color: "#475569",

        fontSize: 8,

        fontWeight: "900"
    },


    counterTextActive: {
        color: "#FFFFFF"
    }
});