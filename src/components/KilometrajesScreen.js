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

import KilometrajeCard
    from "./kilometrajes/KilometrajeCard";

import KilometrajeFiltros
    from "./kilometrajes/KilometrajeFiltros";

import KilometrajeFormulario
    from "./kilometrajes/KilometrajeFormulario";

import KilometrajeDetalle
    from "./kilometrajes/KilometrajeDetalle";

import {
    styles
} from "./kilometrajes/kilometrajeStyles";

import {
    useKilometrajes
} from "../hooks/useKilometrajes";


export default function KilometrajesScreen({

    onVolver,

    onLogout

}) {

    const {

        vehiculos,

        registrosFiltrados,

        resumen,

        cargando,

        guardando,

        mensaje,

        errorFormulario,

        busqueda,

        setBusqueda,

        filtroEstado,

        setFiltroEstado,

        registroSeleccionado,

        registroEditando,

        formularioVisible,

        detalleVisible,

        cargarDatos,

        abrirNuevo,

        cerrarFormulario,

        abrirDetalle,

        cerrarDetalle,

        abrirEdicion,

        guardarRegistro,

        confirmarDesactivar,

        reactivar,

        obtenerNombreVehiculo

    } = useKilometrajes();


    return (

        <View style={styles.screen}>

            <ScreenContainer>

                <AppHeader
                    subtitle="Historial de kilometraje"

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
                            style={
                                styles.registerButton
                            }

                            onPress={
                                abrirNuevo
                            }
                        >

                            <Text style={styles.registerText}>
                                + Registrar
                            </Text>

                        </Pressable>

                    </View>


                    <Text style={styles.title}>
                        Historial de Kilometraje
                    </Text>


                    <Text style={styles.subtitle}>
                        Consulta y administra las lecturas de tus vehículos.
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


                <View style={styles.totalCard}>

                    <Text style={styles.totalLabel}>
                        LECTURA MÁS ALTA REGISTRADA
                    </Text>


                    <Text style={styles.totalValue}>
                        {resumen.kmMayor.toLocaleString(
                            "en-US",
                            {
                                minimumFractionDigits: 1,
                                maximumFractionDigits: 1
                            }
                        )} km
                    </Text>


                    <Text style={styles.totalMeta}>
                        {resumen.activos} registros activos
                    </Text>

                </View>


                <KilometrajeFiltros
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
                            Lecturas recientes
                        </Text>

                        <Text style={styles.listSubtitle}>
                            {registrosFiltrados.length} resultados
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
                            Cargando kilometrajes...
                        </Text>

                    </View>

                ) : registrosFiltrados.length === 0 ? (

                    <View style={styles.empty}>

                        <Text style={styles.emptyTitle}>
                            No hay registros de kilometraje
                        </Text>

                        <Text style={styles.emptyText}>
                            Registra una lectura o cambia los filtros.
                        </Text>

                    </View>

                ) : (

                    registrosFiltrados.map(
                        (registro) => (

                            <KilometrajeCard
                                key={
                                    registro.id
                                }

                                registro={
                                    registro
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


            {/* FORMULARIO */}

            <Modal
                visible={
                    formularioVisible
                }

                animationType="slide"

                transparent={
                    false
                }

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
                            {registroEditando
                                ? "Editar kilometraje"
                                : "Registrar kilometraje"}
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

                        <KilometrajeFormulario
                            registro={
                                registroEditando
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
                                guardarRegistro
                            }

                            onCancelar={
                                cerrarFormulario
                            }
                        />

                    </ScrollView>

                </View>

            </Modal>


            <KilometrajeDetalle
                visible={
                    detalleVisible
                }

                registro={
                    registroSeleccionado
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