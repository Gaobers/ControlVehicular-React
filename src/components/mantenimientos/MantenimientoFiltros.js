import React, {
    useState
} from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

export default function MantenimientoFiltros({
    vehiculos,
    vehiculoId,
    onVehiculoChange,
    estado,
    onEstadoChange,
    resumen
}) {
    const [
        mostrarVehiculos,
        setMostrarVehiculos
    ] = useState(false);

    const seleccionado =
        vehiculos.find(
            (vehiculo) =>
                String(vehiculo.id) ===
                String(vehiculoId)
        );

    const filtros = [
        {
            id: "TODOS",
            texto: "Todos",
            cantidad: resumen.total
        },
        {
            id: "VENCIDO",
            texto: "Vencidos",
            cantidad: resumen.vencidos
        },
        {
            id: "PROXIMO",
            texto: "Próximos",
            cantidad: resumen.proximos
        },
        {
            id: "PENDIENTE",
            texto: "Pendientes",
            cantidad: resumen.pendientes
        },
        {
            id: "REALIZADO",
            texto: "Realizados",
            cantidad: resumen.realizados
        }
    ];

    const nombreVehiculo = seleccionado
        ? `${seleccionado.marca} ${seleccionado.modelo}`
        : "Todos los vehículos";

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                VEHÍCULO
            </Text>

            <Pressable
                style={styles.vehicleSelect}
                onPress={() =>
                    setMostrarVehiculos(
                        !mostrarVehiculos
                    )
                }
            >
                <Text style={styles.vehicleSelectText}>
                    {nombreVehiculo}
                </Text>

                <Text style={styles.arrow}>
                    ⌄
                </Text>
            </Pressable>

            {mostrarVehiculos && (
                <View style={styles.dropdown}>
                    <Pressable
                        style={styles.dropdownItem}
                        onPress={() => {
                            onVehiculoChange(null);
                            setMostrarVehiculos(false);
                        }}
                    >
                        <Text style={styles.dropdownText}>
                            Todos los vehículos
                        </Text>
                    </Pressable>

                    {vehiculos.map(
                        (vehiculo) => (
                            <Pressable
                                key={vehiculo.id}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    onVehiculoChange(
                                        vehiculo.id
                                    );

                                    setMostrarVehiculos(
                                        false
                                    );
                                }}
                            >
                                <Text style={styles.dropdownText}>
                                    {vehiculo.marca}{" "}
                                    {vehiculo.modelo}
                                </Text>

                                <Text style={styles.dropdownPlate}>
                                    {vehiculo.placa}
                                </Text>
                            </Pressable>
                        )
                    )}
                </View>
            )}

            <View style={styles.filters}>
                {filtros.map(
                    (filtro) => {
                        const activo =
                            estado === filtro.id;

                        return (
                            <Pressable
                                key={filtro.id}
                                style={[
                                    styles.filter,
                                    activo &&
                                    styles.filterActive
                                ]}
                                onPress={() =>
                                    onEstadoChange(
                                        filtro.id
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
                                    {filtro.texto}
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

    label: {
        color: "#64748B",
        fontSize: 7,
        fontWeight: "900",
        marginBottom: 5
    },

    vehicleSelect: {
        minHeight: 43,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E3E8EF",
        borderRadius: 10,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    vehicleSelectText: {
        color: "#334155",
        fontSize: 10,
        fontWeight: "700"
    },

    arrow: {
        color: "#64748B"
    },

    dropdown: {
        marginTop: 5,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E3E8EF",
        borderRadius: 9,
        overflow: "hidden"
    },

    dropdownItem: {
        padding: 11,
        borderBottomWidth: 1,
        borderBottomColor: "#EEF1F5"
    },

    dropdownText: {
        color: "#334155",
        fontSize: 10,
        fontWeight: "700"
    },

    dropdownPlate: {
        marginTop: 2,
        color: "#94A3B8",
        fontSize: 8
    },

    filters: {
        marginTop: 9,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6
    },

    filter: {
        minHeight: 30,
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
        paddingHorizontal: 4,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
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