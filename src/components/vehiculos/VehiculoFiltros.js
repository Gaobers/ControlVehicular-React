import React from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";


export default function VehiculoFiltros({

    busqueda,
    onBusquedaChange,

    filtroEstado,
    onFiltroEstadoChange,

    total,
    activos,
    archivados
}) {

    const filtros = [
        {
            id: "TODOS",
            texto: "Todos",
            cantidad: total
        },
        {
            id: "ACTIVO",
            texto: "Activos",
            cantidad: activos
        },
        {
            id: "ARCHIVADO",
            texto: "Archivados",
            cantidad: archivados
        }
    ];


    return (

        <View style={styles.container}>

            {/* BUSCADOR */}

            <View style={styles.searchContainer}>

                <Text style={styles.searchIcon}>
                    ⌕
                </Text>

                <TextInput
                    style={styles.buscador}

                    value={busqueda}

                    onChangeText={
                        onBusquedaChange
                    }

                    placeholder="Buscar por placa, marca o modelo..."

                    placeholderTextColor="#94A3B8"

                    autoCapitalize="none"

                    autoCorrect={false}
                />

                {busqueda ? (

                    <Pressable
                        style={styles.clearButton}
                        onPress={() =>
                            onBusquedaChange("")
                        }
                    >

                        <Text style={styles.clearText}>
                            ✕
                        </Text>

                    </Pressable>

                ) : null}

            </View>


            {/* FILTROS */}

            <View style={styles.filtros}>

                {filtros.map(
                    (filtro) => {

                        const seleccionado =
                            filtroEstado ===
                            filtro.id;


                        return (

                            <Pressable
                                key={filtro.id}

                                style={({ pressed }) => [
                                    styles.filtro,

                                    seleccionado &&
                                    styles.filtroActivo,

                                    pressed &&
                                    styles.pressed
                                ]}

                                onPress={() =>
                                    onFiltroEstadoChange(
                                        filtro.id
                                    )
                                }
                            >

                                <Text
                                    style={[
                                        styles.filtroTexto,

                                        seleccionado &&
                                        styles.filtroTextoActivo
                                    ]}
                                >
                                    {filtro.texto}
                                </Text>


                                <View
                                    style={[
                                        styles.contador,

                                        seleccionado &&
                                        styles.contadorActivo
                                    ]}
                                >

                                    <Text
                                        style={[
                                            styles.contadorTexto,

                                            seleccionado &&
                                            styles.contadorTextoActivo
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
        marginBottom: 15
    },


    searchContainer: {
        minHeight: 44,

        flexDirection: "row",

        alignItems: "center",

        backgroundColor: "#FFFFFF",

        borderWidth: 1,

        borderColor: "#E3E8EF",

        borderRadius: 10,

        paddingHorizontal: 11
    },


    searchIcon: {
        marginRight: 7,

        color: "#94A3B8",

        fontSize: 16,

        fontWeight: "700"
    },


    buscador: {
        flex: 1,

        minHeight: 42,

        color: "#172033",

        fontSize: 11
    },


    clearButton: {
        width: 28,

        height: 28,

        borderRadius: 14,

        alignItems: "center",

        justifyContent: "center",

        backgroundColor: "#F1F5F9",

        marginLeft: 5
    },


    clearText: {
        color: "#64748B",

        fontSize: 9,

        fontWeight: "800"
    },


    filtros: {
        flexDirection: "row",

        flexWrap: "wrap",

        gap: 7,

        marginTop: 9
    },


    filtro: {
        minHeight: 34,

        flexDirection: "row",

        alignItems: "center",

        paddingLeft: 12,

        paddingRight: 6,

        borderRadius: 18,

        backgroundColor: "#EDF1F6",

        borderWidth: 1,

        borderColor: "transparent"
    },


    filtroActivo: {
        backgroundColor: "#0D3559",

        borderColor: "#0D3559"
    },


    filtroTexto: {
        color: "#64748B",

        fontSize: 9,

        fontWeight: "800"
    },


    filtroTextoActivo: {
        color: "#FFFFFF"
    },


    contador: {
        minWidth: 22,

        height: 22,

        marginLeft: 7,

        borderRadius: 11,

        backgroundColor: "#FFFFFF",

        alignItems: "center",

        justifyContent: "center",

        paddingHorizontal: 5
    },


    contadorActivo: {
        backgroundColor: "#244E75"
    },


    contadorTexto: {
        color: "#475569",

        fontSize: 8,

        fontWeight: "900"
    },


    contadorTextoActivo: {
        color: "#FFFFFF"
    },


    pressed: {
        opacity: 0.78
    }
});