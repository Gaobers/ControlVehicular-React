import React from "react";

import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Text,
    View
} from "react-native";

import AppHeader
    from "./common/AppHeader";

import ScreenContainer
    from "./common/ScreenContainer";

import MantenimientoCard
    from "./mantenimientos/MantenimientoCard";

import MantenimientoFiltros
    from "./mantenimientos/MantenimientoFiltros";

import MantenimientoFormulario
    from "./mantenimientos/MantenimientoFormulario";

import MantenimientoDetalle
    from "./mantenimientos/MantenimientoDetalle";

import {
    styles
} from "./mantenimientos/mantenimientoStyles";

import {
    useMantenimientos
} from "../hooks/useMantenimientos";

export default function MantenimientosScreen({
    onVolver,
    onLogout
}) {
    const {
        vehiculos,
        mantenimientosFiltrados,
        resumen,

        cargando,
        guardando,
        mensaje,
        errorFormulario,

        filtroVehiculo,
        setFiltroVehiculo,

        filtroEstado,
        setFiltroEstado,

        mantenimientoSeleccionado,
        mantenimientoEditando,

        formularioVisible,
        detalleVisible,

        cargarDatos,

        abrirNuevo,
        cerrarFormulario,

        abrirDetalle,
        cerrarDetalle,

        abrirEdicion,
        guardarMantenimiento,

        confirmarRealizado,
        confirmarDesactivar,

        obtenerVehiculo,
        obtenerNombreVehiculo
    } = useMantenimientos();

    return (
        <View style={styles.screen}>
            <ScreenContainer>
                <AppHeader
                    subtitle="Mantenimientos"
                    onLogout={onLogout}
                />

                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <Pressable
                            onPress={onVolver}
                        >
                            <Text style={styles.back}>
                                ← Servicios
                            </Text>
                        </Pressable>

                        <Pressable
                            style={
                                styles.programButton
                            }
                            onPress={abrirNuevo}
                        >
                            <Text style={styles.programText}>
                                + Programar
                            </Text>
                        </Pressable>
                    </View>

                    <Text style={styles.title}>
                        Mantenimientos
                    </Text>

                    <Text style={styles.subtitle}>
                        Programa y controla los servicios de tus vehículos.
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
                                    ? styles.errorText
                                    : styles.successText
                            ]}
                        >
                            {mensaje.texto}
                        </Text>
                    </View>
                )}

                <MantenimientoFiltros
                    vehiculos={vehiculos}
                    vehiculoId={
                        filtroVehiculo
                    }
                    onVehiculoChange={
                        setFiltroVehiculo
                    }
                    estado={
                        filtroEstado
                    }
                    onEstadoChange={
                        setFiltroEstado
                    }
                    resumen={resumen}
                />

                <View style={styles.listHeader}>
                    <View>
                        <Text style={styles.listTitle}>
                            Mantenimientos
                        </Text>

                        <Text style={styles.listSubtitle}>
                            {mantenimientosFiltrados.length}{" "}
                            {mantenimientosFiltrados.length === 1
                                ? "resultado"
                                : "resultados"}
                        </Text>
                    </View>

                    <Pressable
                        style={styles.refresh}
                        onPress={cargarDatos}
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
                            Cargando mantenimientos...
                        </Text>
                    </View>
                ) : mantenimientosFiltrados.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyTitle}>
                            No hay mantenimientos
                        </Text>

                        <Text style={styles.emptyText}>
                            Programa un mantenimiento o cambia los filtros.
                        </Text>
                    </View>
                ) : (
                    mantenimientosFiltrados.map(
                        (mantenimiento) => (
                            <MantenimientoCard
                                key={
                                    mantenimiento.id
                                }
                                mantenimiento={
                                    mantenimiento
                                }
                                nombreVehiculo={
                                    obtenerNombreVehiculo(
                                        mantenimiento.vehiculoId
                                    )
                                }
                                onDetalle={
                                    abrirDetalle
                                }
                            />
                        )
                    )
                )}
            </ScreenContainer>

            <Modal
                visible={
                    formularioVisible
                }
                animationType="slide"
                transparent={false}
                onRequestClose={
                    cerrarFormulario
                }
            >
                <View style={styles.modalScreen}>
                    <View style={styles.modalHeader}>
                        <Pressable
                            onPress={
                                cerrarFormulario
                            }
                        >
                            <Text style={styles.modalBack}>
                                ← Cancelar
                            </Text>
                        </Pressable>

                        <Text style={styles.modalTitle}>
                            {mantenimientoEditando
                                ? "Editar mantenimiento"
                                : "Programar mantenimiento"}
                        </Text>

                        <View
                            style={{
                                width: 50
                            }}
                        />
                    </View>

                    <ScrollView
                        contentContainerStyle={
                            styles.modalContent
                        }
                        keyboardShouldPersistTaps="handled"
                    >
                        <MantenimientoFormulario
                            mantenimiento={
                                mantenimientoEditando
                            }
                            vehiculos={
                                vehiculos
                            }
                            guardando={
                                guardando
                            }
                            errorExterno={
                                errorFormulario
                            }
                            onGuardar={
                                guardarMantenimiento
                            }
                            onCancelar={
                                cerrarFormulario
                            }
                        />
                    </ScrollView>
                </View>
            </Modal>

            <MantenimientoDetalle
                visible={
                    detalleVisible
                }
                mantenimiento={
                    mantenimientoSeleccionado
                }
                vehiculo={
                    mantenimientoSeleccionado
                        ? obtenerVehiculo(
                            mantenimientoSeleccionado.vehiculoId
                        )
                        : null
                }
                onCerrar={
                    cerrarDetalle
                }
                onEditar={
                    abrirEdicion
                }
                onMarcarRealizado={
                    confirmarRealizado
                }
                onDesactivar={
                    confirmarDesactivar
                }
            />
        </View>
    );
}