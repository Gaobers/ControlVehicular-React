import React, { useEffect, useState } from "react";

import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    Pressable,
    Switch,
    useWindowDimensions
} from "react-native";

import {
    recordatorioService
} from "../services/recordatorioService";

import {
    authService
} from "../services/authService";


export default function RecordatoriosScreen({
    onLogout
}) {

    const [recordatorios, setRecordatorios] =
        useState([]);

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [error, setError] =
        useState("");

    const [mensaje, setMensaje] =
        useState("");

    const [
        mantenimientoId,
        setMantenimientoId
    ] = useState("");

    const [
        diasAnticipacion,
        setDiasAnticipacion
    ] = useState("");

    const [
        kilometrosAnticipacion,
        setKilometrosAnticipacion
    ] = useState("");

    const [
        editandoId,
        setEditandoId
    ] = useState(null);

    const [activo, setActivo] =
        useState(true);


    const { width } =
        useWindowDimensions();

    const esMovil =
        width < 600;


    useEffect(() => {

        cargarRecordatorios();

    }, []);


    const obtenerMensajeError = (error) => {

        return (
            error?.response?.data?.mensaje ||
            error?.response?.data?.message ||
            error?.message ||
            "Ocurrió un error inesperado"
        );
    };


    const cargarRecordatorios = async () => {

        try {

            setCargando(true);
            setError("");

            const datos =
                await recordatorioService.obtenerTodos();

            setRecordatorios(datos);

        } catch (error) {

            console.error(
                "Error al cargar recordatorios:",
                error
            );

            setError(
                obtenerMensajeError(error)
            );

        } finally {

            setCargando(false);
        }
    };


    const limpiarFormulario = () => {

        setMantenimientoId("");
        setDiasAnticipacion("");
        setKilometrosAnticipacion("");

        setEditandoId(null);
        setActivo(true);
    };


    const guardarRecordatorio = async () => {

        setError("");
        setMensaje("");


        if (
            !diasAnticipacion ||
            !kilometrosAnticipacion
        ) {

            setError(
                "Los días y kilómetros de anticipación son obligatorios."
            );

            return;
        }


        if (
            editandoId === null &&
            !mantenimientoId
        ) {

            setError(
                "El ID del mantenimiento es obligatorio."
            );

            return;
        }


        try {

            setGuardando(true);


            /*
             * EDITAR
             */
            if (editandoId !== null) {

                const recordatorioModificado = {

                    diasAnticipacion:
                        Number(
                            diasAnticipacion
                        ),

                    kilometrosAnticipacion:
                        Number(
                            kilometrosAnticipacion
                        ),

                    activo
                };


                await recordatorioService.actualizar(
                    editandoId,
                    recordatorioModificado
                );


                setMensaje(
                    "Recordatorio actualizado correctamente."
                );

            }


            /*
             * CREAR
             */
            else {

                const nuevoRecordatorio = {

                    mantenimientoId:
                        Number(
                            mantenimientoId
                        ),

                    diasAnticipacion:
                        Number(
                            diasAnticipacion
                        ),

                    kilometrosAnticipacion:
                        Number(
                            kilometrosAnticipacion
                        )
                };


                await recordatorioService.crear(
                    nuevoRecordatorio
                );


                setMensaje(
                    "Recordatorio creado correctamente."
                );
            }


            limpiarFormulario();

            await cargarRecordatorios();


        } catch (error) {

            console.error(
                "Error al guardar recordatorio:",
                error
            );

            setError(
                obtenerMensajeError(error)
            );

        } finally {

            setGuardando(false);
        }
    };


    const seleccionarParaEditar = (
        recordatorio
    ) => {

        setError("");
        setMensaje("");

        setEditandoId(
            recordatorio.id
        );

        setMantenimientoId(
            String(
                recordatorio.mantenimientoId
            )
        );

        setDiasAnticipacion(
            String(
                recordatorio.diasAnticipacion
            )
        );

        setKilometrosAnticipacion(
            String(
                recordatorio
                    .kilometrosAnticipacion
            )
        );

        setActivo(
            recordatorio.activo
        );
    };


    const cancelarEdicion = () => {

        limpiarFormulario();

        setError("");
        setMensaje("");
    };


    const desactivarRecordatorio =
        async (id) => {

            try {

                setError("");
                setMensaje("");


                await recordatorioService.eliminar(
                    id
                );


                setMensaje(
                    "Recordatorio desactivado correctamente."
                );


                await cargarRecordatorios();


            } catch (error) {

                console.error(
                    "Error al desactivar:",
                    error
                );

                setError(
                    obtenerMensajeError(error)
                );
            }
        };


    const activarRecordatorio =
        async (recordatorio) => {

            try {

                setError("");
                setMensaje("");


                const recordatorioModificado = {

                    diasAnticipacion:
                        recordatorio
                            .diasAnticipacion,

                    kilometrosAnticipacion:
                        recordatorio
                            .kilometrosAnticipacion,

                    activo: true
                };


                await recordatorioService.actualizar(
                    recordatorio.id,
                    recordatorioModificado
                );


                setMensaje(
                    "Recordatorio activado correctamente."
                );


                await cargarRecordatorios();


            } catch (error) {

                console.error(
                    "Error al activar:",
                    error
                );

                setError(
                    obtenerMensajeError(error)
                );
            }
        };


    const cerrarSesion = async () => {

        try {

            await authService.logout();

            onLogout();

        } catch (error) {

            console.error(
                "Error al cerrar sesión:",
                error
            );
        }
    };


    const cantidadActivos =
        recordatorios.filter(
            item => item.activo
        ).length;


    if (cargando) {

        return (

            <View
                style={
                    styles.loadingContainer
                }
            >

                <ActivityIndicator
                    size="large"
                    color="#2563eb"
                />

                <Text
                    style={
                        styles.loadingText
                    }
                >
                    Cargando recordatorios...
                </Text>

            </View>
        );
    }


    return (

        <View style={styles.screen}>

            {/* HEADER GENERAL */}

            <View style={styles.appHeader}>

                <View
                    style={
                        styles.appHeaderContent
                    }
                >

                    <View
                        style={
                            styles.brandContainer
                        }
                    >

                        <View style={styles.logo}>

                            <Text
                                style={
                                    styles.logoText
                                }
                            >
                                CV
                            </Text>

                        </View>


                        <View>

                            <Text
                                style={
                                    styles.brandTitle
                                }
                            >
                                CONTROL VEHICULAR
                            </Text>

                            {!esMovil && (

                                <Text
                                    style={
                                        styles.brandSubtitle
                                    }
                                >
                                    Sistema de administración vehicular
                                </Text>

                            )}

                        </View>

                    </View>


                    <Pressable
                        style={({ pressed }) => [

                            styles.logoutButton,

                            pressed &&
                            styles.buttonPressed

                        ]}
                        onPress={cerrarSesion}
                    >

                        <Text
                            style={
                                styles.logoutText
                            }
                        >
                            {esMovil
                                ? "SALIR"
                                : "CERRAR SESIÓN"}
                        </Text>

                    </Pressable>

                </View>

            </View>


            {/* CONTENIDO */}

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={
                    styles.scrollContent
                }
            >

                <View style={styles.container}>


                    {/* TÍTULO */}

                    <View style={styles.pageHeader}>

                        <Text
                            style={
                                styles.pageTitle
                            }
                        >
                            Recordatorios de mantenimiento
                        </Text>

                        <Text
                            style={
                                styles.pageSubtitle
                            }
                        >
                            Administra avisos por días y kilometraje.
                        </Text>

                    </View>


                    {/* FORMULARIO */}

                    <View style={styles.card}>

                        <View
                            style={
                                styles.cardHeader
                            }
                        >

                            <Text
                                style={
                                    styles.cardTitle
                                }
                            >

                                {editandoId !== null
                                    ? "Editar recordatorio"
                                    : "Registrar recordatorio"}

                            </Text>


                            <Text
                                style={
                                    styles.cardSubtitle
                                }
                            >

                                {editandoId !== null
                                    ? "Modifica la configuración del recordatorio seleccionado."
                                    : "Ingresa los datos para crear un nuevo recordatorio."}

                            </Text>

                        </View>


                        {editandoId !== null && (

                            <View
                                style={
                                    styles.editInfo
                                }
                            >

                                <View>

                                    <Text
                                        style={
                                            styles.editLabel
                                        }
                                    >
                                        RECORDATORIO
                                    </Text>

                                    <Text
                                        style={
                                            styles.editValue
                                        }
                                    >
                                        #{editandoId}
                                    </Text>

                                </View>


                                <View>

                                    <Text
                                        style={
                                            styles.editLabel
                                        }
                                    >
                                        MANTENIMIENTO
                                    </Text>

                                    <Text
                                        style={
                                            styles.editValue
                                        }
                                    >
                                        #{mantenimientoId}
                                    </Text>

                                </View>

                            </View>

                        )}


                        {editandoId === null && (

                            <View style={styles.field}>

                                <Text
                                    style={
                                        styles.label
                                    }
                                >
                                    ID del mantenimiento
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej. 5"
                                    placeholderTextColor="#9ca3af"
                                    value={
                                        mantenimientoId
                                    }
                                    onChangeText={
                                        setMantenimientoId
                                    }
                                    keyboardType="numeric"
                                />

                            </View>

                        )}


                        <View
                            style={[

                                styles.fieldsRow,

                                esMovil &&
                                styles.fieldsRowMobile

                            ]}
                        >

                            <View
                                style={[

                                    styles.field,
                                    styles.fieldHalf,

                                    esMovil &&
                                    styles.fieldMobile

                                ]}
                            >

                                <Text
                                    style={
                                        styles.label
                                    }
                                >
                                    Días de anticipación
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej. 15"
                                    placeholderTextColor="#9ca3af"
                                    value={
                                        diasAnticipacion
                                    }
                                    onChangeText={
                                        setDiasAnticipacion
                                    }
                                    keyboardType="numeric"
                                />

                            </View>


                            <View
                                style={[

                                    styles.field,
                                    styles.fieldHalf,

                                    esMovil &&
                                    styles.fieldMobile

                                ]}
                            >

                                <Text
                                    style={
                                        styles.label
                                    }
                                >
                                    Kilómetros de anticipación
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej. 500"
                                    placeholderTextColor="#9ca3af"
                                    value={
                                        kilometrosAnticipacion
                                    }
                                    onChangeText={
                                        setKilometrosAnticipacion
                                    }
                                    keyboardType="numeric"
                                />

                            </View>

                        </View>


                        {editandoId !== null && (

                            <View
                                style={
                                    styles.switchCard
                                }
                            >

                                <View>

                                    <Text
                                        style={
                                            styles.switchTitle
                                        }
                                    >
                                        Estado del recordatorio
                                    </Text>

                                    <Text
                                        style={
                                            styles.switchSubtitle
                                        }
                                    >
                                        Define si el recordatorio se encuentra activo.
                                    </Text>

                                </View>


                                <Switch
                                    value={activo}
                                    onValueChange={
                                        setActivo
                                    }
                                    trackColor={{
                                        false: "#d1d5db",
                                        true: "#93b4f8"
                                    }}
                                    thumbColor={
                                        activo
                                            ? "#2563eb"
                                            : "#f3f4f6"
                                    }
                                />

                            </View>

                        )}


                        {error ? (

                            <View
                                style={
                                    styles.errorBox
                                }
                            >

                                <Text
                                    style={
                                        styles.errorText
                                    }
                                >
                                    {error}
                                </Text>

                            </View>

                        ) : null}


                        {mensaje ? (

                            <View
                                style={
                                    styles.successBox
                                }
                            >

                                <Text
                                    style={
                                        styles.successText
                                    }
                                >
                                    {mensaje}
                                </Text>

                            </View>

                        ) : null}


                        <Pressable
                            disabled={
                                guardando
                            }
                            style={({ pressed }) => [

                                styles.primaryButton,

                                pressed &&
                                styles.buttonPressed,

                                guardando &&
                                styles.buttonDisabled

                            ]}
                            onPress={
                                guardarRecordatorio
                            }
                        >

                            {guardando ? (

                                <ActivityIndicator
                                    size="small"
                                    color="#ffffff"
                                />

                            ) : (

                                <Text
                                    style={
                                        styles.primaryButtonText
                                    }
                                >

                                    {editandoId !== null
                                        ? "GUARDAR CAMBIOS"
                                        : "REGISTRAR RECORDATORIO"}

                                </Text>

                            )}

                        </Pressable>


                        {editandoId !== null && (

                            <Pressable
                                style={({ pressed }) => [

                                    styles.secondaryButton,

                                    pressed &&
                                    styles.buttonPressed

                                ]}
                                onPress={
                                    cancelarEdicion
                                }
                            >

                                <Text
                                    style={
                                        styles.secondaryButtonText
                                    }
                                >
                                    CANCELAR EDICIÓN
                                </Text>

                            </Pressable>

                        )}

                    </View>


                    {/* RESUMEN */}

                    <View
                        style={[
                            styles.summaryRow,
                            esMovil &&
                            styles.summaryRowMobile
                        ]}
                    >

                        <View
                            style={
                                styles.summaryCard
                            }
                        >

                            <Text
                                style={
                                    styles.summaryNumber
                                }
                            >
                                {recordatorios.length}
                            </Text>

                            <Text
                                style={
                                    styles.summaryLabel
                                }
                            >
                                Registrados
                            </Text>

                        </View>


                        <View
                            style={
                                styles.summaryCard
                            }
                        >

                            <Text
                                style={
                                    styles.summaryNumber
                                }
                            >
                                {cantidadActivos}
                            </Text>

                            <Text
                                style={
                                    styles.summaryLabel
                                }
                            >
                                Activos
                            </Text>

                        </View>


                        <View
                            style={
                                styles.summaryCard
                            }
                        >

                            <Text
                                style={
                                    styles.summaryNumber
                                }
                            >
                                {
                                    recordatorios.length -
                                    cantidadActivos
                                }
                            </Text>

                            <Text
                                style={
                                    styles.summaryLabel
                                }
                            >
                                Inactivos
                            </Text>

                        </View>

                    </View>


                    {/* LISTADO */}

                    <View
                        style={
                            styles.listHeader
                        }
                    >

                        <View>

                            <Text
                                style={
                                    styles.listTitle
                                }
                            >
                                Recordatorios registrados
                            </Text>

                            <Text
                                style={
                                    styles.listSubtitle
                                }
                            >
                                Consulta y administra los registros existentes.
                            </Text>

                        </View>


                        <View
                            style={
                                styles.counter
                            }
                        >

                            <Text
                                style={
                                    styles.counterText
                                }
                            >
                                {recordatorios.length}
                            </Text>

                        </View>

                    </View>


                    {recordatorios.length === 0 ? (

                        <View
                            style={
                                styles.emptyCard
                            }
                        >

                            <Text
                                style={
                                    styles.emptyTitle
                                }
                            >
                                No hay recordatorios
                            </Text>

                            <Text
                                style={
                                    styles.emptyText
                                }
                            >
                                Registra un recordatorio para comenzar.
                            </Text>

                        </View>

                    ) : (

                        recordatorios.map(
                            (item) => (

                                <View
                                    key={item.id}
                                    style={
                                        styles.recordCard
                                    }
                                >

                                    <View
                                        style={[
                                            styles.recordAccent,

                                            item.activo
                                                ? styles.recordAccentActive
                                                : styles.recordAccentInactive
                                        ]}
                                    />


                                    <View
                                        style={
                                            styles.recordContent
                                        }
                                    >

                                        <View
                                            style={
                                                styles.recordHeader
                                            }
                                        >

                                            <View>

                                                <Text
                                                    style={
                                                        styles.recordId
                                                    }
                                                >
                                                    Recordatorio #{item.id}
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.maintenanceText
                                                    }
                                                >
                                                    Mantenimiento #{item.mantenimientoId}
                                                </Text>

                                            </View>


                                            <View
                                                style={[
                                                    styles.statusBadge,

                                                    item.activo
                                                        ? styles.statusBadgeActive
                                                        : styles.statusBadgeInactive
                                                ]}
                                            >

                                                <Text
                                                    style={[
                                                        styles.statusText,

                                                        item.activo
                                                            ? styles.statusTextActive
                                                            : styles.statusTextInactive
                                                    ]}
                                                >
                                                    {item.activo
                                                        ? "ACTIVO"
                                                        : "INACTIVO"}
                                                </Text>

                                            </View>

                                        </View>


                                        <View
                                            style={[
                                                styles.detailsRow,

                                                esMovil &&
                                                styles.detailsRowMobile
                                            ]}
                                        >

                                            <View
                                                style={
                                                    styles.detailItem
                                                }
                                            >

                                                <Text
                                                    style={
                                                        styles.detailLabel
                                                    }
                                                >
                                                    DÍAS DE ANTICIPACIÓN
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.detailValue
                                                    }
                                                >
                                                    {item.diasAnticipacion}
                                                </Text>

                                            </View>


                                            <View
                                                style={
                                                    styles.detailItem
                                                }
                                            >

                                                <Text
                                                    style={
                                                        styles.detailLabel
                                                    }
                                                >
                                                    KILÓMETROS
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.detailValue
                                                    }
                                                >
                                                    {item.kilometrosAnticipacion}
                                                </Text>

                                            </View>

                                        </View>


                                        <View
                                            style={
                                                styles.actionsRow
                                            }
                                        >

                                            <Pressable
                                                style={({ pressed }) => [

                                                    styles.actionButton,
                                                    styles.editButton,

                                                    pressed &&
                                                    styles.buttonPressed

                                                ]}
                                                onPress={() =>
                                                    seleccionarParaEditar(
                                                        item
                                                    )
                                                }
                                            >

                                                <Text
                                                    style={
                                                        styles.actionButtonText
                                                    }
                                                >
                                                    EDITAR
                                                </Text>

                                            </Pressable>


                                            {item.activo ? (

                                                <Pressable
                                                    style={({ pressed }) => [

                                                        styles.actionButton,
                                                        styles.deactivateButton,

                                                        pressed &&
                                                        styles.buttonPressed

                                                    ]}
                                                    onPress={() =>
                                                        desactivarRecordatorio(
                                                            item.id
                                                        )
                                                    }
                                                >

                                                    <Text
                                                        style={
                                                            styles.actionButtonText
                                                        }
                                                    >
                                                        DESACTIVAR
                                                    </Text>

                                                </Pressable>

                                            ) : (

                                                <Pressable
                                                    style={({ pressed }) => [

                                                        styles.actionButton,
                                                        styles.activateButton,

                                                        pressed &&
                                                        styles.buttonPressed

                                                    ]}
                                                    onPress={() =>
                                                        activarRecordatorio(
                                                            item
                                                        )
                                                    }
                                                >

                                                    <Text
                                                        style={
                                                            styles.actionButtonText
                                                        }
                                                    >
                                                        ACTIVAR
                                                    </Text>

                                                </Pressable>

                                            )}

                                        </View>

                                    </View>

                                </View>

                            )
                        )

                    )}

                </View>

            </ScrollView>

        </View>
    );
}


const styles = StyleSheet.create({

    screen: {
        flex: 1,
        backgroundColor: "#eef2f7"
    },

    scroll: {
        flex: 1,
        backgroundColor: "#eef2f7"
    },

    scrollContent: {
        paddingBottom: 40
    },

    appHeader: {
        backgroundColor: "#0d2340",
        borderBottomWidth: 1,
        borderBottomColor: "#17395f"
    },

    appHeaderContent: {
        width: "100%",
        maxWidth: 1200,
        alignSelf: "center",
        minHeight: 72,
        paddingHorizontal: 20,
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    brandContainer: {
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 1
    },

    logo: {
        width: 42,
        height: 42,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },

    logoText: {
        color: "#0d2340",
        fontSize: 15,
        fontWeight: "900"
    },

    brandTitle: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "800"
    },

    brandSubtitle: {
        color: "#aab8ca",
        fontSize: 10,
        marginTop: 3
    },

    logoutButton: {
        backgroundColor: "#17385f",
        borderWidth: 1,
        borderColor: "#345475",
        minHeight: 38,
        paddingHorizontal: 15,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10
    },

    logoutText: {
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "800"
    },

    container: {
        width: "100%",
        maxWidth: 1050,
        alignSelf: "center",
        paddingHorizontal: 18,
        paddingTop: 24
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eef2f7"
    },

    loadingText: {
        marginTop: 12,
        color: "#6b7280",
        fontSize: 13
    },

    pageHeader: {
        marginBottom: 18
    },

    pageTitle: {
        color: "#18212f",
        fontSize: 24,
        fontWeight: "800"
    },

    pageSubtitle: {
        color: "#6b7280",
        fontSize: 13,
        marginTop: 5
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 18,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#e1e6ed",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3
    },

    cardHeader: {
        marginBottom: 16
    },

    cardTitle: {
        color: "#1f2937",
        fontSize: 18,
        fontWeight: "800"
    },

    cardSubtitle: {
        color: "#7c8798",
        fontSize: 11,
        marginTop: 4
    },

    editInfo: {
        flexDirection: "row",
        gap: 35,
        backgroundColor: "#f6f8fb",
        borderRadius: 10,
        padding: 13,
        marginBottom: 14
    },

    editLabel: {
        color: "#8a94a4",
        fontSize: 9,
        fontWeight: "700"
    },

    editValue: {
        color: "#1f2937",
        fontSize: 14,
        fontWeight: "800",
        marginTop: 3
    },

    fieldsRow: {
        flexDirection: "row",
        gap: 12
    },

    fieldsRowMobile: {
        flexDirection: "column",
        gap: 0
    },

    field: {
        marginBottom: 12
    },

    fieldHalf: {
        flex: 1
    },

    fieldMobile: {
        width: "100%"
    },

    label: {
        color: "#374151",
        fontSize: 11,
        fontWeight: "700",
        marginBottom: 6
    },

    input: {
        height: 46,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#d9dfe7",
        borderRadius: 9,
        paddingHorizontal: 12,
        color: "#111827",
        fontSize: 13
    },

    switchCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e1e6ed",
        borderRadius: 10,
        padding: 12,
        marginBottom: 14
    },

    switchTitle: {
        color: "#374151",
        fontWeight: "700",
        fontSize: 12
    },

    switchSubtitle: {
        color: "#8a94a4",
        fontSize: 10,
        marginTop: 3
    },

    errorBox: {
        backgroundColor: "#fff1f2",
        borderWidth: 1,
        borderColor: "#fecdd3",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12
    },

    errorText: {
        color: "#be123c",
        fontSize: 11
    },

    successBox: {
        backgroundColor: "#f0fdf4",
        borderWidth: 1,
        borderColor: "#bbf7d0",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12
    },

    successText: {
        color: "#15803d",
        fontSize: 11
    },

    primaryButton: {
        height: 46,
        backgroundColor: "#2563eb",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center"
    },

    primaryButtonText: {
        color: "#ffffff",
        fontSize: 11,
        fontWeight: "800"
    },

    secondaryButton: {
        height: 44,
        backgroundColor: "#eef1f5",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 9
    },

    secondaryButtonText: {
        color: "#4b5563",
        fontSize: 11,
        fontWeight: "800"
    },

    buttonPressed: {
        opacity: 0.82
    },

    buttonDisabled: {
        opacity: 0.7
    },

    summaryRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20
    },

    summaryRowMobile: {
        gap: 8
    },

    summaryCard: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e1e6ed",
        borderRadius: 10,
        padding: 13
    },

    summaryNumber: {
        color: "#0d2340",
        fontSize: 20,
        fontWeight: "900"
    },

    summaryLabel: {
        color: "#7c8798",
        fontSize: 10,
        marginTop: 3
    },

    listHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
    },

    listTitle: {
        color: "#1f2937",
        fontSize: 17,
        fontWeight: "800"
    },

    listSubtitle: {
        color: "#8a94a4",
        fontSize: 10,
        marginTop: 3
    },

    counter: {
        minWidth: 27,
        height: 27,
        paddingHorizontal: 8,
        backgroundColor: "#2563eb",
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center"
    },

    counterText: {
        color: "#ffffff",
        fontWeight: "800",
        fontSize: 11
    },

    emptyCard: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e1e6ed",
        borderRadius: 12,
        padding: 25,
        alignItems: "center"
    },

    emptyTitle: {
        color: "#374151",
        fontSize: 14,
        fontWeight: "800"
    },

    emptyText: {
        color: "#8a94a4",
        fontSize: 11,
        marginTop: 5
    },

    recordCard: {
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e1e6ed",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 12,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.06,
        shadowRadius: 5,
        elevation: 2
    },

    recordAccent: {
        width: 5
    },

    recordAccentActive: {
        backgroundColor: "#2563eb"
    },

    recordAccentInactive: {
        backgroundColor: "#9ca3af"
    },

    recordContent: {
        flex: 1,
        padding: 15
    },

    recordHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 14
    },

    recordId: {
        color: "#1f2937",
        fontSize: 14,
        fontWeight: "800"
    },

    maintenanceText: {
        color: "#6b7280",
        fontSize: 11,
        marginTop: 3
    },

    statusBadge: {
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 20
    },

    statusBadgeActive: {
        backgroundColor: "#e8f0ff"
    },

    statusBadgeInactive: {
        backgroundColor: "#f0f1f3"
    },

    statusText: {
        fontSize: 9,
        fontWeight: "800"
    },

    statusTextActive: {
        color: "#2563eb"
    },

    statusTextInactive: {
        color: "#6b7280"
    },

    detailsRow: {
        flexDirection: "row",
        backgroundColor: "#f8fafc",
        borderRadius: 9,
        marginBottom: 13,
        padding: 11,
        gap: 35
    },

    detailsRowMobile: {
        gap: 20
    },

    detailItem: {
        flex: 1
    },

    detailLabel: {
        color: "#8a94a4",
        fontSize: 8,
        fontWeight: "700"
    },

    detailValue: {
        color: "#1f2937",
        fontSize: 15,
        fontWeight: "800",
        marginTop: 4
    },

    actionsRow: {
        flexDirection: "row",
        gap: 9
    },

    actionButton: {
        flex: 1,
        height: 40,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center"
    },

    editButton: {
        backgroundColor: "#2563eb"
    },

    deactivateButton: {
        backgroundColor: "#dc2626"
    },

    activateButton: {
        backgroundColor: "#16a34a"
    },

    actionButtonText: {
        color: "#ffffff",
        fontSize: 10,
        fontWeight: "800"
    }

});