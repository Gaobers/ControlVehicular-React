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

import RecordatorioCard
    from "./recordatorios/RecordatorioCard";

import RecordatorioFiltros
    from "./recordatorios/RecordatorioFiltros";

import RecordatorioFormulario
    from "./recordatorios/RecordatorioFormulario";

import RecordatorioDetalle
    from "./recordatorios/RecordatorioDetalle";

import RecordatorioCalendario
    from "./recordatorios/RecordatorioCalendario";

import {
    styles
} from "./recordatorios/recordatorioStyles";

import {
    useRecordatorios
} from "../hooks/useRecordatorios";


export default function RecordatoriosScreen({

    onVolver,

    onLogout

}) {

    const {

        recordatorios,

        recordatoriosFiltrados,

        mantenimientos,

        vehiculos,

        resumen,

        cargando,

        guardando,

        mensaje,

        errorFormulario,

        filtro,

        setFiltro,

        vista,

        setVista,

        recordatorioSeleccionado,

        recordatorioEditando,

        formularioVisible,

        detalleVisible,

        cargarDatos,

        abrirNuevo,

        cerrarFormulario,

        abrirDetalle,

        cerrarDetalle,

        abrirEdicion,

        guardarRecordatorio,

        confirmarDesactivar,

        reactivar,

        obtenerContexto

    } = useRecordatorios();


    const contextoDetalle =
        recordatorioSeleccionado
            ? obtenerContexto(
                recordatorioSeleccionado
            )
            : {
                mantenimiento: null,
                vehiculo: null
            };


    return (

        <View style={styles.screen}>

            <ScreenContainer>

                <AppHeader
                    subtitle="Recordatorios"

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
                            style={styles.newButton}

                            onPress={
                                abrirNuevo
                            }
                        >

                            <Text style={styles.newButtonText}>
                                + Nuevo
                            </Text>

                        </Pressable>

                    </View>


                    <Text style={styles.title}>
                        Recordatorios
                    </Text>


                    <Text style={styles.subtitle}>
                        Controla avisos de mantenimiento por fecha y kilometraje.
                    </Text>


                    <View style={styles.viewSelector}>

                        <Pressable
                            style={[
                                styles.viewButton,

                                vista ===
                                "LISTA" &&
                                styles.viewButtonActive
                            ]}

                            onPress={() =>
                                setVista(
                                    "LISTA"
                                )
                            }
                        >

                            <Text
                                style={[
                                    styles.viewText,

                                    vista ===
                                    "LISTA" &&
                                    styles.viewTextActive
                                ]}
                            >
                                Notificaciones
                            </Text>

                        </Pressable>


                        <Pressable
                            style={[
                                styles.viewButton,

                                vista ===
                                "CALENDARIO" &&
                                styles.viewButtonActive
                            ]}

                            onPress={() =>
                                setVista(
                                    "CALENDARIO"
                                )
                            }
                        >

                            <Text
                                style={[
                                    styles.viewText,

                                    vista ===
                                    "CALENDARIO" &&
                                    styles.viewTextActive
                                ]}
                            >
                                Calendario
                            </Text>

                        </Pressable>

                    </View>

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


                {vista ===
                "LISTA" ? (

                    <>

                        <RecordatorioFiltros
                            filtro={
                                filtro
                            }

                            onFiltroChange={
                                setFiltro
                            }

                            resumen={
                                resumen
                            }
                        />


                        <View style={styles.listHeader}>

                            <View>

                                <Text style={styles.listTitle}>
                                    Recordatorios
                                </Text>

                                <Text style={styles.listSubtitle}>
                                    {recordatoriosFiltrados.length}{" "}
                                    {recordatoriosFiltrados.length === 1
                                        ? "resultado"
                                        : "resultados"}
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
                                    Cargando recordatorios...
                                </Text>

                            </View>

                        ) : recordatoriosFiltrados.length ===
                            0 ? (

                            <View style={styles.empty}>

                                <Text style={styles.emptyTitle}>
                                    No hay recordatorios
                                </Text>

                                <Text style={styles.emptyText}>
                                    Crea un recordatorio o cambia los filtros.
                                </Text>

                            </View>

                        ) : (

                            recordatoriosFiltrados.map(
                                (recordatorio) => {

                                    const {
                                        mantenimiento,
                                        vehiculo
                                    } =
                                        obtenerContexto(
                                            recordatorio
                                        );


                                    return (

                                        <RecordatorioCard
                                            key={
                                                recordatorio.id
                                            }

                                            recordatorio={
                                                recordatorio
                                            }

                                            mantenimiento={
                                                mantenimiento
                                            }

                                            vehiculo={
                                                vehiculo
                                            }

                                            onDetalle={
                                                abrirDetalle
                                            }
                                        />
                                    );
                                }
                            )
                        )}

                    </>

                ) : (

                    cargando ? (

                        <View style={styles.loading}>

                            <ActivityIndicator
                                size="large"
                                color="#073B61"
                            />

                            <Text style={styles.loadingText}>
                                Cargando calendario...
                            </Text>

                        </View>

                    ) : (

                        <RecordatorioCalendario
                            recordatorios={
                                recordatorios
                            }

                            mantenimientos={
                                mantenimientos
                            }

                            vehiculos={
                                vehiculos
                            }

                            onDetalle={
                                abrirDetalle
                            }
                        />
                    )
                )}

            </ScreenContainer>


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
                            {recordatorioEditando
                                ? "Editar recordatorio"
                                : "Nuevo recordatorio"}
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

<RecordatorioFormulario
    recordatorio={recordatorioEditando}
    recordatorios={recordatorios}
    mantenimientos={mantenimientos}
    vehiculos={vehiculos}
    guardando={guardando}
    errorExterno={errorFormulario}
    onGuardar={guardarRecordatorio}
    onCancelar={cerrarFormulario}
/>

                    </ScrollView>

                </View>

            </Modal>


            <RecordatorioDetalle
                visible={
                    detalleVisible
                }

                recordatorio={
                    recordatorioSeleccionado
                }

                mantenimiento={
                    contextoDetalle
                        .mantenimiento
                }

                vehiculo={
                    contextoDetalle
                        .vehiculo
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