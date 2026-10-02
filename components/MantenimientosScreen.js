import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";

import {
    mantenimientoService
} from "../services/mantenimientoService";

import {
    vehiculoService
} from "../services/vehiculoService";


const ESTADOS = [
    "PENDIENTE",
    "PROXIMO",
    "VENCIDO",
    "REALIZADO"
];


const crearFormularioInicial = () => ({

    vehiculoId: "",

    mantenimientoOrigenId: "",

    servicio: "",

    observaciones: "",

    fechaObjetivo: "",

    kilometrajeObjetivo: "",

    estado: "PENDIENTE",

    activo: true,

    fechaRealizacion: "",

    kilometrajeRealizacion: ""
});


export default function MantenimientosScreen({
    onVolver,
    onLogout
}) {

    const { width } =
        useWindowDimensions();

    const esMovil =
        width < 720;


    const [mantenimientos, setMantenimientos] =
        useState([]);

    const [vehiculos, setVehiculos] =
        useState([]);


    const [formulario, setFormulario] =
        useState(crearFormularioInicial());


    const [editandoId, setEditandoId] =
        useState(null);


    const [mostrarVehiculos, setMostrarVehiculos] =
        useState(false);

    const [mostrarEstados, setMostrarEstados] =
        useState(false);


    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [mensaje, setMensaje] =
        useState(null);


    useEffect(() => {

        cargarDatos();

    }, []);


    const cargarDatos = async () => {

        try {

            setCargando(true);


            const [
                listaMantenimientos,
                listaVehiculos
            ] = await Promise.all([

                mantenimientoService.obtenerTodos(),

                vehiculoService.obtenerTodos()

            ]);


            setMantenimientos(
                Array.isArray(listaMantenimientos)
                    ? listaMantenimientos
                    : []
            );


            setVehiculos(
                Array.isArray(listaVehiculos)
                    ? listaVehiculos
                    : []
            );

        } catch (error) {

            console.error(
                "Error cargando mantenimientos:",
                error
            );


            mostrarError(
                error,
                "No se pudieron cargar los mantenimientos."
            );

        } finally {

            setCargando(false);
        }
    };


    const mostrarError = (
        error,
        mensajePredeterminado
    ) => {

        const status =
            error.response?.status;


        let texto =
            error.response?.data?.message ||
            error.response?.data?.mensaje ||
            mensajePredeterminado;


        if (status === 401) {

            texto =
                "Tu sesión no es válida. Inicia sesión nuevamente.";

        } else if (status === 403) {

            texto =
                "No tienes autorización para realizar esta operación.";
        }


        setMensaje({
            tipo: "error",
            texto
        });
    };


    const mostrarExito = (
        texto
    ) => {

        setMensaje({
            tipo: "exito",
            texto
        });
    };


    const actualizarCampo = (
        campo,
        valor
    ) => {

        setFormulario(
            (anterior) => ({
                ...anterior,
                [campo]: valor
            })
        );
    };


    const limpiarFormulario = () => {

        setFormulario(
            crearFormularioInicial()
        );

        setEditandoId(null);

        setMostrarVehiculos(false);

        setMostrarEstados(false);
    };


    const obtenerNombreVehiculo = (
        vehiculo
    ) => {

        if (!vehiculo) {
            return "Vehículo";
        }


        const marca =
            vehiculo.marca || "";

        const modelo =
            vehiculo.modelo || "";

        const placa =
            vehiculo.placa
                ? ` - ${vehiculo.placa}`
                : "";


        return `${marca} ${modelo}${placa}`.trim();
    };


    const vehiculoSeleccionado =
        useMemo(() => {

            return vehiculos.find(
                (vehiculo) =>
                    String(vehiculo.id) ===
                    String(
                        formulario.vehiculoId
                    )
            );

        }, [
            vehiculos,
            formulario.vehiculoId
        ]);


    const obtenerVehiculoPorId = (
        vehiculoId
    ) => {

        const vehiculo =
            vehiculos.find(
                (item) =>
                    String(item.id) ===
                    String(vehiculoId)
            );


        return vehiculo
            ? obtenerNombreVehiculo(
                vehiculo
            )
            : `Vehículo #${vehiculoId}`;
    };


    const validarFormulario = () => {

        if (!formulario.vehiculoId) {

            setMensaje({
                tipo: "error",
                texto:
                    "Debes seleccionar un vehículo."
            });

            return false;
        }


        if (!formulario.servicio.trim()) {

            setMensaje({
                tipo: "error",
                texto:
                    "El servicio es obligatorio."
            });

            return false;
        }


        if (
            !formulario.fechaObjetivo &&
            !formulario.kilometrajeObjetivo
        ) {

            setMensaje({
                tipo: "error",
                texto:
                    "Debes indicar una fecha objetivo o un kilometraje objetivo."
            });

            return false;
        }


        if (
            formulario.fechaObjetivo &&
            !/^\d{4}-\d{2}-\d{2}$/.test(
                formulario.fechaObjetivo
            )
        ) {

            setMensaje({
                tipo: "error",
                texto:
                    "La fecha objetivo debe usar el formato AAAA-MM-DD."
            });

            return false;
        }


        if (
            formulario.fechaRealizacion &&
            !/^\d{4}-\d{2}-\d{2}$/.test(
                formulario.fechaRealizacion
            )
        ) {

            setMensaje({
                tipo: "error",
                texto:
                    "La fecha de realización debe usar AAAA-MM-DD."
            });

            return false;
        }


        if (
            formulario.kilometrajeObjetivo &&
            Number(
                formulario.kilometrajeObjetivo
            ) < 0
        ) {

            setMensaje({
                tipo: "error",
                texto:
                    "El kilometraje objetivo no puede ser negativo."
            });

            return false;
        }


        if (
            formulario.kilometrajeRealizacion &&
            Number(
                formulario.kilometrajeRealizacion
            ) < 0
        ) {

            setMensaje({
                tipo: "error",
                texto:
                    "El kilometraje de realización no puede ser negativo."
            });

            return false;
        }


        return true;
    };


    const construirMantenimiento = (
        incluirActivo
    ) => {

        const mantenimiento = {

            vehiculoId:
                Number(
                    formulario.vehiculoId
                ),

            mantenimientoOrigenId:
                formulario.mantenimientoOrigenId
                    ? Number(
                        formulario.mantenimientoOrigenId
                    )
                    : null,

            servicio:
                formulario.servicio.trim(),

            observaciones:
                formulario.observaciones.trim()
                    || null,

            fechaObjetivo:
                formulario.fechaObjetivo
                    || null,

            kilometrajeObjetivo:
                formulario.kilometrajeObjetivo
                    ? Number(
                        formulario.kilometrajeObjetivo
                    )
                    : null,

            estado:
                formulario.estado,

            fechaRealizacion:
                formulario.fechaRealizacion
                    || null,

            kilometrajeRealizacion:
                formulario.kilometrajeRealizacion
                    ? Number(
                        formulario.kilometrajeRealizacion
                    )
                    : null
        };


        if (incluirActivo) {

            mantenimiento.activo =
                formulario.activo;
        }


        return mantenimiento;
    };


    const guardarMantenimiento =
        async () => {

            setMensaje(null);


            if (!validarFormulario()) {
                return;
            }


            try {

                setGuardando(true);


                if (
                    editandoId !== null
                ) {

                    await mantenimientoService
                        .actualizar(
                            editandoId,
                            construirMantenimiento(
                                true
                            )
                        );


                    mostrarExito(
                        "Mantenimiento actualizado correctamente."
                    );

                } else {

                    await mantenimientoService
                        .crear(
                            construirMantenimiento(
                                false
                            )
                        );


                    mostrarExito(
                        "Mantenimiento registrado correctamente."
                    );
                }


                limpiarFormulario();

                await cargarDatos();

            } catch (error) {

                console.error(
                    "Error guardando mantenimiento:",
                    error
                );


                mostrarError(
                    error,
                    editandoId !== null
                        ? "No se pudo actualizar el mantenimiento."
                        : "No se pudo registrar el mantenimiento."
                );

            } finally {

                setGuardando(false);
            }
        };


    const editarMantenimiento = (
        item
    ) => {

        setEditandoId(
            item.id
        );


        setFormulario({

            vehiculoId:
                String(
                    item.vehiculoId ?? ""
                ),

            mantenimientoOrigenId:
                String(
                    item.mantenimientoOrigenId
                    ?? ""
                ),

            servicio:
                item.servicio || "",

            observaciones:
                item.observaciones || "",

            fechaObjetivo:
                item.fechaObjetivo || "",

            kilometrajeObjetivo:
                String(
                    item.kilometrajeObjetivo
                    ?? ""
                ),

            estado:
                item.estado || "PENDIENTE",

            activo:
                item.activo !== false,

            fechaRealizacion:
                item.fechaRealizacion || "",

            kilometrajeRealizacion:
                String(
                    item.kilometrajeRealizacion
                    ?? ""
                )
        });


        setMensaje(null);
    };


    const ejecutarDesactivacion =
        async (id) => {

            try {

                await mantenimientoService
                    .eliminar(id);


                mostrarExito(
                    "Mantenimiento desactivado correctamente."
                );


                if (
                    String(editandoId) ===
                    String(id)
                ) {

                    limpiarFormulario();
                }


                await cargarDatos();

            } catch (error) {

                mostrarError(
                    error,
                    "No se pudo desactivar el mantenimiento."
                );
            }
        };


    const desactivarMantenimiento = (
        id
    ) => {

        if (Platform.OS === "web") {

            const confirmar =
                globalThis.confirm
                    ? globalThis.confirm(
                        "¿Deseas desactivar este mantenimiento?"
                    )
                    : true;


            if (confirmar) {

                ejecutarDesactivacion(
                    id
                );
            }


            return;
        }


        Alert.alert(
            "Desactivar mantenimiento",
            "¿Deseas desactivar este mantenimiento?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Desactivar",
                    style: "destructive",
                    onPress: () =>
                        ejecutarDesactivacion(
                            id
                        )
                }
            ]
        );
    };


    const reactivarMantenimiento =
        async (item) => {

            try {

                const mantenimiento = {

                    vehiculoId:
                        item.vehiculoId,

                    mantenimientoOrigenId:
                        item.mantenimientoOrigenId
                        ?? null,

                    servicio:
                        item.servicio,

                    observaciones:
                        item.observaciones
                        ?? null,

                    fechaObjetivo:
                        item.fechaObjetivo
                        ?? null,

                    kilometrajeObjetivo:
                        item.kilometrajeObjetivo
                        ?? null,

                    estado:
                        item.estado,

                    activo: true,

                    fechaRealizacion:
                        item.fechaRealizacion
                        ?? null,

                    kilometrajeRealizacion:
                        item.kilometrajeRealizacion
                        ?? null
                };


                await mantenimientoService
                    .actualizar(
                        item.id,
                        mantenimiento
                    );


                mostrarExito(
                    "Mantenimiento reactivado correctamente."
                );


                await cargarDatos();

            } catch (error) {

                mostrarError(
                    error,
                    "No se pudo reactivar el mantenimiento."
                );
            }
        };


    const resumen =
        useMemo(() => {

            return {

                total:
                    mantenimientos.length,

                activos:
                    mantenimientos.filter(
                        (item) =>
                            item.activo !== false
                    ).length,

                pendientes:
                    mantenimientos.filter(
                        (item) =>
                            item.estado ===
                            "PENDIENTE"
                    ).length,

                realizados:
                    mantenimientos.filter(
                        (item) =>
                            item.estado ===
                            "REALIZADO"
                    ).length
            };

        }, [mantenimientos]);


    if (cargando) {

        return (

            <SafeAreaView
                style={styles.loading}
            >

                <ActivityIndicator
                    size="large"
                />

                <Text
                    style={styles.loadingText}
                >
                    Cargando mantenimientos...
                </Text>

            </SafeAreaView>
        );
    }


    return (

        <SafeAreaView
            style={styles.screen}
        >

            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={
                    styles.content
                }
            >

                <View
                    style={styles.container}
                >

                    {/* HEADER */}

                    <View
                        style={styles.header}
                    >

                        <View>

                            <Text
                                style={
                                    styles.headerTitle
                                }
                            >
                                CONTROL VEHICULAR
                            </Text>

                            <Text
                                style={
                                    styles.headerSubtitle
                                }
                            >
                                Administración de mantenimientos
                            </Text>

                        </View>


                        <View
                            style={
                                styles.headerActions
                            }
                        >

                            <TouchableOpacity
                                style={
                                    styles.menuButton
                                }
                                onPress={
                                    onVolver
                                }
                            >

                                <Text
                                    style={
                                        styles.menuButtonText
                                    }
                                >
                                    {esMovil
                                        ? "←"
                                        : "← MENÚ"}
                                </Text>

                            </TouchableOpacity>


                            <TouchableOpacity
                                style={
                                    styles.logoutButton
                                }
                                onPress={
                                    onLogout
                                }
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

                            </TouchableOpacity>

                        </View>

                    </View>


                    {/* MENSAJE */}

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
                                style={
                                    mensaje.tipo ===
                                    "error"
                                        ? styles.messageErrorText
                                        : styles.messageSuccessText
                                }
                            >
                                {mensaje.texto}
                            </Text>

                        </View>
                    )}


                    {/* RESUMEN */}

                    <View
                        style={[
                            styles.summaryRow,
                            esMovil &&
                            styles.summaryMobile
                        ]}
                    >

                        <Resumen
                            titulo="TOTAL"
                            valor={resumen.total}
                        />

                        <Resumen
                            titulo="ACTIVOS"
                            valor={resumen.activos}
                        />

                        <Resumen
                            titulo="PENDIENTES"
                            valor={resumen.pendientes}
                        />

                        <Resumen
                            titulo="REALIZADOS"
                            valor={resumen.realizados}
                        />

                    </View>


                    {/* FORMULARIO */}

                    <View
                        style={styles.card}
                    >

                        <Text
                            style={styles.cardTitle}
                        >
                            {editandoId !== null
                                ? "Editar mantenimiento"
                                : "Registrar mantenimiento"}
                        </Text>


                        <Text style={styles.label}>
                            Vehículo *
                        </Text>

                        <TouchableOpacity
                            style={styles.select}
                            onPress={() =>
                                setMostrarVehiculos(
                                    !mostrarVehiculos
                                )
                            }
                        >

                            <Text>
                                {vehiculoSeleccionado
                                    ? obtenerNombreVehiculo(
                                        vehiculoSeleccionado
                                    )
                                    : "Seleccionar vehículo"}
                            </Text>

                            <Text>
                                ▼
                            </Text>

                        </TouchableOpacity>


                        {mostrarVehiculos && (

                            <View
                                style={styles.dropdown}
                            >

                                {vehiculos.map(
                                    (vehiculo) => (

                                        <TouchableOpacity
                                            key={
                                                vehiculo.id
                                            }
                                            style={
                                                styles.dropdownItem
                                            }
                                            onPress={() => {

                                                actualizarCampo(
                                                    "vehiculoId",
                                                    String(
                                                        vehiculo.id
                                                    )
                                                );

                                                setMostrarVehiculos(
                                                    false
                                                );
                                            }}
                                        >

                                            <Text>
                                                {obtenerNombreVehiculo(
                                                    vehiculo
                                                )}
                                            </Text>

                                        </TouchableOpacity>
                                    )
                                )}

                            </View>
                        )}


                        <Text style={styles.label}>
                            Servicio *
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={
                                formulario.servicio
                            }
                            onChangeText={(valor) =>
                                actualizarCampo(
                                    "servicio",
                                    valor
                                )
                            }
                            placeholder="Ej. Cambio de aceite"
                        />


                        <Text style={styles.label}>
                            Observaciones
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                styles.textArea
                            ]}
                            value={
                                formulario.observaciones
                            }
                            onChangeText={(valor) =>
                                actualizarCampo(
                                    "observaciones",
                                    valor
                                )
                            }
                            multiline
                            placeholder="Observaciones..."
                        />


                        <Text style={styles.label}>
                            Fecha objetivo
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={
                                formulario.fechaObjetivo
                            }
                            onChangeText={(valor) =>
                                actualizarCampo(
                                    "fechaObjetivo",
                                    valor
                                )
                            }
                            placeholder="AAAA-MM-DD"
                        />


                        <Text style={styles.label}>
                            Kilometraje objetivo
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={
                                formulario.kilometrajeObjetivo
                            }
                            onChangeText={(valor) =>
                                actualizarCampo(
                                    "kilometrajeObjetivo",
                                    valor
                                )
                            }
                            keyboardType="decimal-pad"
                            placeholder="Ej. 45000.0"
                        />


                        <Text style={styles.label}>
                            Estado *
                        </Text>

                        <TouchableOpacity
                            style={styles.select}
                            onPress={() =>
                                setMostrarEstados(
                                    !mostrarEstados
                                )
                            }
                        >

                            <Text>
                                {formulario.estado}
                            </Text>

                            <Text>
                                ▼
                            </Text>

                        </TouchableOpacity>


                        {mostrarEstados && (

                            <View
                                style={styles.dropdown}
                            >

                                {ESTADOS.map(
                                    (estado) => (

                                        <TouchableOpacity
                                            key={estado}
                                            style={
                                                styles.dropdownItem
                                            }
                                            onPress={() => {

                                                actualizarCampo(
                                                    "estado",
                                                    estado
                                                );

                                                setMostrarEstados(
                                                    false
                                                );
                                            }}
                                        >

                                            <Text>
                                                {estado}
                                            </Text>

                                        </TouchableOpacity>
                                    )
                                )}

                            </View>
                        )}


                        <Text style={styles.label}>
                            ID mantenimiento origen
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={
                                formulario
                                    .mantenimientoOrigenId
                            }
                            onChangeText={(valor) =>
                                actualizarCampo(
                                    "mantenimientoOrigenId",
                                    valor.replace(
                                        /[^0-9]/g,
                                        ""
                                    )
                                )
                            }
                            keyboardType="numeric"
                            placeholder="Opcional"
                        />


                        <Text style={styles.label}>
                            Fecha de realización
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={
                                formulario
                                    .fechaRealizacion
                            }
                            onChangeText={(valor) =>
                                actualizarCampo(
                                    "fechaRealizacion",
                                    valor
                                )
                            }
                            placeholder="AAAA-MM-DD"
                        />


                        <Text style={styles.label}>
                            Kilometraje de realización
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={
                                formulario
                                    .kilometrajeRealizacion
                            }
                            onChangeText={(valor) =>
                                actualizarCampo(
                                    "kilometrajeRealizacion",
                                    valor
                                )
                            }
                            keyboardType="decimal-pad"
                            placeholder="Ej. 44850.5"
                        />


                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={
                                guardarMantenimiento
                            }
                            disabled={
                                guardando
                            }
                        >

                            {guardando ? (

                                <ActivityIndicator
                                    color="#ffffff"
                                />

                            ) : (

                                <Text
                                    style={
                                        styles.saveText
                                    }
                                >
                                    {editandoId !== null
                                        ? "ACTUALIZAR MANTENIMIENTO"
                                        : "REGISTRAR MANTENIMIENTO"}
                                </Text>
                            )}

                        </TouchableOpacity>


                        {editandoId !== null && (

                            <TouchableOpacity
                                style={
                                    styles.cancelButton
                                }
                                onPress={
                                    limpiarFormulario
                                }
                            >

                                <Text
                                    style={
                                        styles.cancelText
                                    }
                                >
                                    CANCELAR EDICIÓN
                                </Text>

                            </TouchableOpacity>
                        )}

                    </View>


                    {/* LISTA */}

                    <Text
                        style={styles.listTitle}
                    >
                        Mantenimientos registrados
                    </Text>


                    {mantenimientos.length === 0 ? (

                        <View
                            style={styles.empty}
                        >

                            <Text
                                style={styles.emptyTitle}
                            >
                                No hay mantenimientos registrados
                            </Text>

                        </View>

                    ) : (

                        mantenimientos.map(
                            (item) => (

                                <View
                                    key={item.id}
                                    style={[
                                        styles.maintenanceCard,

                                        item.activo === false &&
                                        styles.inactiveCard
                                    ]}
                                >

                                    <View
                                        style={
                                            styles.cardTop
                                        }
                                    >

                                        <View
                                            style={{
                                                flex: 1
                                            }}
                                        >

                                            <Text
                                                style={
                                                    styles.serviceTitle
                                                }
                                            >
                                                {item.servicio}
                                            </Text>

                                            <Text
                                                style={
                                                    styles.vehicleText
                                                }
                                            >
                                                {obtenerVehiculoPorId(
                                                    item.vehiculoId
                                                )}
                                            </Text>

                                        </View>


                                        <View
                                            style={
                                                styles.statusBadge
                                            }
                                        >

                                            <Text
                                                style={
                                                    styles.statusText
                                                }
                                            >
                                                {item.estado}
                                            </Text>

                                        </View>

                                    </View>


                                    <Text
                                        style={
                                            styles.detailText
                                        }
                                    >
                                        Fecha objetivo:{" "}
                                        {item.fechaObjetivo ||
                                            "Sin fecha"}
                                    </Text>


                                    <Text
                                        style={
                                            styles.detailText
                                        }
                                    >
                                        Km objetivo:{" "}
                                        {item.kilometrajeObjetivo ??
                                            "Sin kilometraje"}
                                    </Text>


                                    {item.observaciones ? (

                                        <Text
                                            style={
                                                styles.observations
                                            }
                                        >
                                            {item.observaciones}
                                        </Text>

                                    ) : null}


                                    <View
                                        style={[
                                            styles.actions,

                                            esMovil &&
                                            styles.actionsMobile
                                        ]}
                                    >

                                        <TouchableOpacity
                                            style={
                                                styles.editButton
                                            }
                                            onPress={() =>
                                                editarMantenimiento(
                                                    item
                                                )
                                            }
                                        >

                                            <Text
                                                style={
                                                    styles.editText
                                                }
                                            >
                                                EDITAR
                                            </Text>

                                        </TouchableOpacity>


                                        {item.activo !== false ? (

                                            <TouchableOpacity
                                                style={
                                                    styles.deleteButton
                                                }
                                                onPress={() =>
                                                    desactivarMantenimiento(
                                                        item.id
                                                    )
                                                }
                                            >

                                                <Text
                                                    style={
                                                        styles.deleteText
                                                    }
                                                >
                                                    DESACTIVAR
                                                </Text>

                                            </TouchableOpacity>

                                        ) : (

                                            <TouchableOpacity
                                                style={
                                                    styles.activateButton
                                                }
                                                onPress={() =>
                                                    reactivarMantenimiento(
                                                        item
                                                    )
                                                }
                                            >

                                                <Text
                                                    style={
                                                        styles.activateText
                                                    }
                                                >
                                                    REACTIVAR
                                                </Text>

                                            </TouchableOpacity>
                                        )}

                                    </View>

                                </View>
                            )
                        )
                    )}

                </View>

            </ScrollView>

        </SafeAreaView>
    );
}


function Resumen({
    titulo,
    valor
}) {

    return (

        <View
            style={styles.summaryCard}
        >

            <Text
                style={styles.summaryLabel}
            >
                {titulo}
            </Text>

            <Text
                style={styles.summaryValue}
            >
                {valor}
            </Text>

        </View>
    );
}


const styles = StyleSheet.create({

    screen: {
        flex: 1,
        backgroundColor: "#eef2f7"
    },

    content: {
        paddingBottom: 50
    },

    container: {
        width: "100%",
        maxWidth: 1100,
        alignSelf: "center",
        paddingHorizontal: 18
    },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eef2f7"
    },

    loadingText: {
        marginTop: 12,
        color: "#64748b"
    },

    header: {
        marginTop: 18,
        padding: 18,
        borderRadius: 15,
        backgroundColor: "#0d2340",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    headerTitle: {
        color: "#ffffff",
        fontSize: 17,
        fontWeight: "900"
    },

    headerSubtitle: {
        color: "#9fb0c5",
        fontSize: 11,
        marginTop: 3
    },

    headerActions: {
        flexDirection: "row",
        gap: 8
    },

    menuButton: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#ffffff"
    },

    menuButtonText: {
        color: "#0d2340",
        fontWeight: "800",
        fontSize: 10
    },

    logoutButton: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#17385f"
    },

    logoutText: {
        color: "#ffffff",
        fontWeight: "800",
        fontSize: 10
    },

    message: {
        padding: 12,
        marginTop: 15,
        borderRadius: 9
    },

    messageError: {
        backgroundColor: "#fee2e2"
    },

    messageSuccess: {
        backgroundColor: "#dcfce7"
    },

    messageErrorText: {
        color: "#b91c1c"
    },

    messageSuccessText: {
        color: "#15803d"
    },

    summaryRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 18
    },

    summaryMobile: {
        flexDirection: "column"
    },

    summaryCard: {
        flex: 1,
        padding: 15,
        backgroundColor: "#ffffff",
        borderRadius: 12
    },

    summaryLabel: {
        color: "#94a3b8",
        fontSize: 9,
        fontWeight: "900"
    },

    summaryValue: {
        marginTop: 4,
        color: "#172033",
        fontSize: 22,
        fontWeight: "900"
    },

    card: {
        marginTop: 18,
        backgroundColor: "#ffffff",
        borderRadius: 15,
        padding: 18
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: "900",
        color: "#172033",
        marginBottom: 5
    },

    label: {
        marginTop: 14,
        marginBottom: 6,
        color: "#334155",
        fontWeight: "800",
        fontSize: 12
    },

    input: {
        minHeight: 48,
        borderWidth: 1,
        borderColor: "#d9e0e8",
        borderRadius: 9,
        paddingHorizontal: 12,
        color: "#172033"
    },

    textArea: {
        minHeight: 90,
        paddingTop: 12,
        textAlignVertical: "top"
    },

    select: {
        minHeight: 48,
        borderWidth: 1,
        borderColor: "#d9e0e8",
        borderRadius: 9,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    dropdown: {
        borderWidth: 1,
        borderColor: "#d9e0e8",
        borderRadius: 9,
        marginTop: 5,
        overflow: "hidden"
    },

    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eef2f7"
    },

    saveButton: {
        minHeight: 50,
        marginTop: 20,
        borderRadius: 9,
        backgroundColor: "#2563eb",
        alignItems: "center",
        justifyContent: "center"
    },

    saveText: {
        color: "#ffffff",
        fontWeight: "900",
        fontSize: 11
    },

    cancelButton: {
        marginTop: 8,
        minHeight: 44,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f1f5f9",
        borderRadius: 9
    },

    cancelText: {
        color: "#64748b",
        fontSize: 10,
        fontWeight: "800"
    },

    listTitle: {
        marginTop: 25,
        marginBottom: 12,
        color: "#172033",
        fontSize: 20,
        fontWeight: "900"
    },

    empty: {
        backgroundColor: "#ffffff",
        padding: 25,
        borderRadius: 13,
        alignItems: "center"
    },

    emptyTitle: {
        color: "#64748b",
        fontWeight: "700"
    },

    maintenanceCard: {
        backgroundColor: "#ffffff",
        borderRadius: 13,
        padding: 16,
        marginBottom: 11
    },

    inactiveCard: {
        opacity: 0.65
    },

    cardTop: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between"
    },

    serviceTitle: {
        fontSize: 16,
        color: "#172033",
        fontWeight: "900"
    },

    vehicleText: {
        marginTop: 3,
        color: "#64748b",
        fontSize: 11
    },

    statusBadge: {
        backgroundColor: "#e8f0ff",
        paddingHorizontal: 9,
        paddingVertical: 6,
        borderRadius: 7
    },

    statusText: {
        color: "#2563eb",
        fontSize: 9,
        fontWeight: "900"
    },

    detailText: {
        marginTop: 9,
        color: "#475569",
        fontSize: 12
    },

    observations: {
        marginTop: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#f8fafc",
        color: "#64748b",
        fontSize: 12
    },

    actions: {
        flexDirection: "row",
        gap: 8,
        marginTop: 14
    },

    actionsMobile: {
        flexDirection: "column"
    },

    editButton: {
        flex: 1,
        minHeight: 39,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#bfdbfe",
        alignItems: "center",
        justifyContent: "center"
    },

    editText: {
        color: "#2563eb",
        fontWeight: "800",
        fontSize: 10
    },

    deleteButton: {
        flex: 1,
        minHeight: 39,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#fecaca",
        backgroundColor: "#fff7f7",
        alignItems: "center",
        justifyContent: "center"
    },

    deleteText: {
        color: "#dc2626",
        fontWeight: "800",
        fontSize: 10
    },

    activateButton: {
        flex: 1,
        minHeight: 39,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#bbf7d0",
        backgroundColor: "#f0fdf4",
        alignItems: "center",
        justifyContent: "center"
    },

    activateText: {
        color: "#15803d",
        fontWeight: "800",
        fontSize: 10
    }
});