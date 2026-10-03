import React from "react";

import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import AppHeader
    from "./common/AppHeader";

import ScreenContainer
    from "./common/ScreenContainer";

import GastoCard
    from "./gastos/GastoCard";

import GastoFiltros
    from "./gastos/GastoFiltros";

import GastoFormulario
    from "./gastos/GastoFormulario";

import GastoDetalle
    from "./gastos/GastoDetalle";

import {
    useGastos
} from "../hooks/useGastos";


export default function GastosScreen({
    onVolver,
    onLogout
}) {

    const {
        vehiculos,
        gastosFiltrados,
        resumen,

        cargando,
        guardando,
        mensaje,

        busqueda,
        setBusqueda,

        filtroEstado,
        setFiltroEstado,

        gastoSeleccionado,
        gastoEditando,

        formularioVisible,
        detalleVisible,

        cargarDatos,

        abrirNuevo,
        abrirDetalle,
        cerrarDetalle,

        abrirEdicion,
        cerrarFormulario,

        guardarGasto,

        confirmarDesactivar,
        reactivar,

        obtenerNombreVehiculo
    } = useGastos();


    return (

        <View style={styles.screen}>

            <ScreenContainer>

                <AppHeader
                    subtitle="Historial de gastos"
                    onLogout={
                        onLogout
                    }
                />


                <View style={styles.header}>

                    <View style={styles.headerTop}>

                        <Pressable
                            onPress={
                                onVolver
                            }
                        >

                            <Text style={styles.back}>
                                ← Servicios
                            </Text>

                        </Pressable>


                        <Pressable
                            style={styles.registerButton}
                            onPress={
                                abrirNuevo
                            }
                        >

                            <Text style={styles.registerText}>
                                + Registrar gasto
                            </Text>

                        </Pressable>

                    </View>


                    <Text style={styles.title}>
                        Historial de Gastos
                    </Text>


                    <Text style={styles.subtitle}>
                        Consulta los gastos registrados de tus vehículos
                    </Text>

                </View>


                {mensaje && (

                    <View
                        style={[
                            styles.message,

                            mensaje.tipo ===
                            "error"
                                ? styles.messageError
                                : styles.messageSuccess
                        ]}
                    >

                        <Text
                            style={[
                                styles.messageText,

                                mensaje.tipo ===
                                "error"
                                    ? styles.messageErrorText
                                    : styles.messageSuccessText
                            ]}
                        >
                            {mensaje.texto}
                        </Text>

                    </View>
                )}


                <View style={styles.totalCard}>

                    <Text style={styles.totalLabel}>
                        TOTAL REGISTRADO
                    </Text>

                    <Text style={styles.totalValue}>
                        ${resumen.monto.toLocaleString(
                            "en-US",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}
                    </Text>

                    <Text style={styles.totalMeta}>
                        {resumen.total} gastos registrados
                    </Text>

                </View>


                <GastoFiltros
                    busqueda={
                        busqueda
                    }

                    onBusquedaChange={
                        setBusqueda
                    }

                    filtroEstado={
                        filtroEstado
                    }

                    onFiltroEstadoChange={
                        setFiltroEstado
                    }

                    total={
                        resumen.total
                    }

                    activos={
                        resumen.activos
                    }

                    inactivos={
                        resumen.inactivos
                    }
                />


                <View style={styles.listHeader}>

                    <View>

                        <Text style={styles.listTitle}>
                            Gastos recientes
                        </Text>

                        <Text style={styles.listSubtitle}>
                            {gastosFiltrados.length} resultados
                        </Text>

                    </View>


                    <Pressable
                        style={styles.refresh}
                        onPress={
                            cargarDatos
                        }
                    >

                        <Text style={styles.refreshText}>
                            Actualizar
                        </Text>

                    </Pressable>

                </View>


                {cargando ? (

                    <View style={styles.loading}>

                        <ActivityIndicator
                            size="large"
                            color="#073B61"
                        />

                        <Text style={styles.loadingText}>
                            Cargando gastos...
                        </Text>

                    </View>

                ) : gastosFiltrados.length === 0 ? (

                    <View style={styles.empty}>

                        <Text style={styles.emptyTitle}>
                            No hay gastos registrados
                        </Text>

                        <Text style={styles.emptyText}>
                            Registra un gasto o cambia los filtros.
                        </Text>

                    </View>

                ) : (

                    gastosFiltrados.map(
                        (gasto) => (

                            <GastoCard
                                key={
                                    gasto.id
                                }

                                gasto={
                                    gasto
                                }

                                obtenerNombreVehiculo={
                                    obtenerNombreVehiculo
                                }

                                onDetalle={
                                    abrirDetalle
                                }
                            />
                        )
                    )
                )}

            </ScreenContainer>


            <GastoFormulario
                visible={
                    formularioVisible
                }

                gasto={
                    gastoEditando
                }

                vehiculos={
                    vehiculos
                }

                guardando={
                    guardando
                }

                onCerrar={
                    cerrarFormulario
                }

                onGuardar={
                    guardarGasto
                }
            />


            <GastoDetalle
                visible={
                    detalleVisible
                }

                gasto={
                    gastoSeleccionado
                }

                obtenerNombreVehiculo={
                    obtenerNombreVehiculo
                }

                onCerrar={
                    cerrarDetalle
                }

                onEditar={
                    abrirEdicion
                }

                onDesactivar={
                    confirmarDesactivar
                }

                onReactivar={
                    reactivar
                }
            />

        </View>
    );
}


const styles = StyleSheet.create({

    screen: {
        flex: 1,

        backgroundColor: "#F5F7FB"
    },


    header: {
        paddingTop: 16,

        paddingBottom: 13
    },


    headerTop: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        marginBottom: 12
    },


    back: {
        color: "#64748B",

        fontSize: 9,

        fontWeight: "700"
    },


    registerButton: {
        minHeight: 36,

        paddingHorizontal: 13,

        borderRadius: 8,

        backgroundColor: "#073B61",

        justifyContent: "center"
    },


    registerText: {
        color: "#FFFFFF",

        fontSize: 9,

        fontWeight: "900"
    },


    title: {
        color: "#172033",

        fontSize: 21,

        fontWeight: "900"
    },


    subtitle: {
        color: "#64748B",

        marginTop: 4,

        fontSize: 10
    },


    message: {
        padding: 10,

        borderRadius: 8,

        marginBottom: 11
    },


    messageError: {
        backgroundColor: "#FEE2E2"
    },


    messageSuccess: {
        backgroundColor: "#DCFCE7"
    },


    messageText: {
        fontSize: 9,

        fontWeight: "700"
    },


    messageErrorText: {
        color: "#B91C1C"
    },


    messageSuccessText: {
        color: "#15803D"
    },


    totalCard: {
        backgroundColor: "#073B61",

        borderRadius: 12,

        padding: 14,

        marginBottom: 10
    },


    totalLabel: {
        color: "#A9C5DA",

        fontSize: 8,

        fontWeight: "800"
    },


    totalValue: {
        color: "#FFFFFF",

        marginTop: 5,

        fontSize: 24,

        fontWeight: "900"
    },


    totalMeta: {
        color: "#C3D8E7",

        marginTop: 5,

        fontSize: 9
    },


    listHeader: {
        marginTop: 4,

        marginBottom: 9,

        flexDirection: "row",

        justifyContent: "space-between",

        alignItems: "center"
    },


    listTitle: {
        color: "#172033",

        fontSize: 12,

        fontWeight: "900",

        textTransform: "uppercase"
    },


    listSubtitle: {
        color: "#94A3B8",

        fontSize: 8,

        marginTop: 2
    },


    refresh: {
        paddingHorizontal: 9,

        paddingVertical: 6,

        borderRadius: 6,

        backgroundColor: "#EEF3FF"
    },


    refreshText: {
        color: "#2563EB",

        fontSize: 8,

        fontWeight: "800"
    },


    loading: {
        paddingVertical: 40,

        alignItems: "center"
    },


    loadingText: {
        marginTop: 8,

        color: "#64748B",

        fontSize: 9
    },


    empty: {
        backgroundColor: "#FFFFFF",

        borderRadius: 12,

        padding: 28,

        alignItems: "center",

        borderWidth: 1,

        borderColor: "#E7EBF1"
    },


    emptyTitle: {
        color: "#334155",

        fontSize: 13,

        fontWeight: "800"
    },


    emptyText: {
        color: "#94A3B8",

        marginTop: 4,

        fontSize: 9
    }
});