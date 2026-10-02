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

import { gastoService } from "../services/gastoService";
import { vehiculoService } from "../services/vehiculoService";


const obtenerFechaActual = () => {

    const fecha = new Date();

    const anio =
        fecha.getFullYear();

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
};


const crearFormularioInicial = () => ({
    vehiculoId: "",
    categoriaId: "",
    monto: "",
    moneda: "USD",
    fecha: obtenerFechaActual(),
    descripcion: "",
    numeroComprobante: "",
    proveedor: "",
    activo: true
});


export default function GastosScreen({
    onVolver,
    onLogout
}) {

    const { width } =
        useWindowDimensions();

    const esMovil =
        width < 720;


    // ==========================================
    // DATOS
    // ==========================================

    const [gastos, setGastos] =
        useState([]);

    const [vehiculos, setVehiculos] =
        useState([]);


    // ==========================================
    // ESTADOS
    // ==========================================

    const [formulario, setFormulario] =
        useState(crearFormularioInicial());

    const [editandoId, setEditandoId] =
        useState(null);

    const [mostrarVehiculos, setMostrarVehiculos] =
        useState(false);

    const [cargando, setCargando] =
        useState(true);

    const [guardando, setGuardando] =
        useState(false);

    const [mensaje, setMensaje] =
        useState(null);


    // ==========================================
    // CARGA INICIAL
    // ==========================================

    useEffect(() => {

        cargarDatos();

    }, []);


    const cargarDatos = async () => {

        try {

            setCargando(true);

            const [
                listaGastos,
                listaVehiculos
            ] = await Promise.all([

                gastoService.obtenerTodos(),

                vehiculoService.obtenerTodos()

            ]);


            setGastos(
                Array.isArray(listaGastos)
                    ? listaGastos
                    : []
            );


            setVehiculos(
                Array.isArray(listaVehiculos)
                    ? listaVehiculos
                    : []
            );

        } catch (error) {

            console.error(
                "Error al cargar gastos:",
                error
            );

            mostrarMensajeError(
                error,
                "No se pudieron cargar los datos."
            );

        } finally {

            setCargando(false);
        }
    };


    // ==========================================
    // MENSAJES
    // ==========================================

    const mostrarMensajeError = (
        error,
        mensajePredeterminado
    ) => {

        const estado =
            error.response?.status;

        let texto =
            error.response?.data?.message ||
            error.response?.data?.mensaje ||
            mensajePredeterminado;


        if (estado === 401) {

            texto =
                "Tu sesión no es válida. Inicia sesión nuevamente.";

        } else if (estado === 403) {

            texto =
                "No tienes autorización para realizar esta operación.";

        }


        setMensaje({
            tipo: "error",
            texto
        });
    };


    const mostrarMensajeExito = (
        texto
    ) => {

        setMensaje({
            tipo: "exito",
            texto
        });
    };


    // ==========================================
    // FORMULARIO
    // ==========================================

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
    };


    // ==========================================
    // VEHÍCULOS
    // ==========================================

    const nombreVehiculo = (
        vehiculo
    ) => {

        if (!vehiculo) {
            return "Vehículo no disponible";
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
                    String(formulario.vehiculoId)
            );

        }, [
            vehiculos,
            formulario.vehiculoId
        ]);


    const obtenerNombreVehiculoPorId = (
        id
    ) => {

        const encontrado =
            vehiculos.find(
                (vehiculo) =>
                    String(vehiculo.id) ===
                    String(id)
            );


        return encontrado
            ? nombreVehiculo(encontrado)
            : `Vehículo #${id}`;
    };


    // ==========================================
    // VALIDACIÓN
    // ==========================================

    const validarFormulario = () => {

        if (!formulario.vehiculoId) {

            setMensaje({
                tipo: "error",
                texto:
                    "Debes seleccionar un vehículo."
            });

            return false;
        }


        const categoriaId =
            Number(
                formulario.categoriaId
            );


        if (
            !categoriaId ||
            categoriaId <= 0
        ) {

            setMensaje({
                tipo: "error",
                texto:
                    "Ingresa un ID de categoría válido."
            });

            return false;
        }


        const monto =
            Number(
                String(
                    formulario.monto
                ).replace(",", ".")
            );


        if (
            !Number.isFinite(monto) ||
            monto <= 0
        ) {

            setMensaje({
                tipo: "error",
                texto:
                    "El monto debe ser mayor a cero."
            });

            return false;
        }


        const patronFecha =
            /^\d{4}-\d{2}-\d{2}$/;


        if (
            !patronFecha.test(
                formulario.fecha
            )
        ) {

            setMensaje({
                tipo: "error",
                texto:
                    "La fecha debe tener el formato AAAA-MM-DD."
            });

            return false;
        }


        if (
            formulario.moneda &&
            formulario.moneda.trim().length !== 3
        ) {

            setMensaje({
                tipo: "error",
                texto:
                    "La moneda debe contener exactamente 3 letras."
            });

            return false;
        }


        return true;
    };


    // ==========================================
    // CONSTRUIR JSON
    // ==========================================

    const construirGasto = (
        incluirActivo = false
    ) => {

        const gasto = {

            vehiculoId:
                Number(
                    formulario.vehiculoId
                ),

            categoriaId:
                Number(
                    formulario.categoriaId
                ),

            monto:
                Number(
                    String(
                        formulario.monto
                    ).replace(",", ".")
                ),

            moneda:
                formulario.moneda
                    ?.trim()
                    .toUpperCase() ||
                "USD",

            fecha:
                formulario.fecha,

            descripcion:
                formulario.descripcion
                    ?.trim() ||
                null,

            numeroComprobante:
                formulario.numeroComprobante
                    ?.trim() ||
                null,

            proveedor:
                formulario.proveedor
                    ?.trim() ||
                null
        };


        if (incluirActivo) {

            gasto.activo =
                formulario.activo;
        }


        return gasto;
    };


    // ==========================================
    // CREAR / EDITAR
    // ==========================================

    const guardarGasto = async () => {

        setMensaje(null);


        if (!validarFormulario()) {
            return;
        }


        try {

            setGuardando(true);


            if (editandoId !== null) {

                const gasto =
                    construirGasto(true);


                await gastoService.actualizar(
                    editandoId,
                    gasto
                );


                mostrarMensajeExito(
                    "Gasto actualizado correctamente."
                );

            } else {

                const gasto =
                    construirGasto(false);


                await gastoService.crear(
                    gasto
                );


                mostrarMensajeExito(
                    "Gasto registrado correctamente."
                );
            }


            limpiarFormulario();

            await cargarDatos();

        } catch (error) {

            console.error(
                "Error al guardar gasto:",
                error
            );


            mostrarMensajeError(
                error,
                editandoId !== null
                    ? "No se pudo actualizar el gasto."
                    : "No se pudo registrar el gasto."
            );

        } finally {

            setGuardando(false);
        }
    };


    // ==========================================
    // EDITAR
    // ==========================================

    const editarGasto = (
        gasto
    ) => {

        setEditandoId(
            gasto.id
        );


        setFormulario({

            vehiculoId:
                String(
                    gasto.vehiculoId ?? ""
                ),

            categoriaId:
                String(
                    gasto.categoriaId ?? ""
                ),

            monto:
                String(
                    gasto.monto ?? ""
                ),

            moneda:
                gasto.moneda ||
                "USD",

            fecha:
                gasto.fecha ||
                obtenerFechaActual(),

            descripcion:
                gasto.descripcion ||
                "",

            numeroComprobante:
                gasto.numeroComprobante ||
                "",

            proveedor:
                gasto.proveedor ||
                "",

            activo:
                gasto.activo !== false
        });


        setMostrarVehiculos(false);

        setMensaje(null);
    };


    // ==========================================
    // DESACTIVAR
    // ==========================================

    const ejecutarDesactivacion =
        async (id) => {

            try {

                await gastoService.eliminar(
                    id
                );


                if (
                    String(editandoId) ===
                    String(id)
                ) {

                    limpiarFormulario();
                }


                mostrarMensajeExito(
                    "Gasto desactivado correctamente."
                );


                await cargarDatos();

            } catch (error) {

                console.error(
                    "Error al desactivar gasto:",
                    error
                );


                mostrarMensajeError(
                    error,
                    "No se pudo desactivar el gasto."
                );
            }
        };


    const confirmarDesactivacion = (
        id
    ) => {

        if (
            Platform.OS === "web"
        ) {

            const confirmar =
                typeof globalThis.confirm ===
                "function"
                    ? globalThis.confirm(
                        "¿Deseas desactivar este gasto?"
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
            "Desactivar gasto",
            "¿Deseas desactivar este gasto?",
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


    // ==========================================
    // REACTIVAR
    // ==========================================

    const reactivarGasto = async (
        gasto
    ) => {

        try {

            const gastoModificar = {

                vehiculoId:
                    gasto.vehiculoId,

                categoriaId:
                    gasto.categoriaId,

                monto:
                    Number(
                        gasto.monto
                    ),

                moneda:
                    gasto.moneda ||
                    "USD",

                fecha:
                    gasto.fecha,

                descripcion:
                    gasto.descripcion ||
                    null,

                numeroComprobante:
                    gasto.numeroComprobante ||
                    null,

                proveedor:
                    gasto.proveedor ||
                    null,

                activo: true
            };


            await gastoService.actualizar(
                gasto.id,
                gastoModificar
            );


            mostrarMensajeExito(
                "Gasto reactivado correctamente."
            );


            await cargarDatos();

        } catch (error) {

            console.error(
                "Error al reactivar gasto:",
                error
            );


            mostrarMensajeError(
                error,
                "No se pudo reactivar el gasto."
            );
        }
    };


    // ==========================================
    // RESUMEN
    // ==========================================

    const resumen =
        useMemo(() => {

            const activos =
                gastos.filter(
                    (gasto) =>
                        gasto.activo !== false
                );


            const inactivos =
                gastos.filter(
                    (gasto) =>
                        gasto.activo === false
                );


            const total =
                activos.reduce(
                    (
                        acumulado,
                        gasto
                    ) =>
                        acumulado +
                        Number(
                            gasto.monto || 0
                        ),
                    0
                );


            return {
                activos:
                    activos.length,

                inactivos:
                    inactivos.length,

                total
            };

        }, [gastos]);


    const gastosOrdenados =
        useMemo(() => {

            return [
                ...gastos
            ].sort(
                (a, b) => {

                    const fechaA =
                        a.fecha || "";

                    const fechaB =
                        b.fecha || "";


                    const comparacion =
                        fechaB.localeCompare(
                            fechaA
                        );


                    if (
                        comparacion !== 0
                    ) {

                        return comparacion;
                    }


                    return (
                        Number(b.id) -
                        Number(a.id)
                    );
                }
            );

        }, [gastos]);


    // ==========================================
    // FORMATO
    // ==========================================

    const formatearMonto = (
        monto
    ) => {

        const numero =
            Number(monto || 0);


        return numero.toFixed(2);
    };


    const formatearFechaVisual = (
        fecha
    ) => {

        if (!fecha) {
            return "-";
        }


        const partes =
            fecha.split("-");


        if (
            partes.length !== 3
        ) {

            return fecha;
        }


        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (cargando) {

        return (
            <SafeAreaView
                style={styles.loadingContainer}
            >

                <ActivityIndicator
                    size="large"
                />

                <Text
                    style={styles.loadingText}
                >
                    Cargando gastos...
                </Text>

            </SafeAreaView>
        );
    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <SafeAreaView
            style={styles.screen}
        >

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={
                    styles.scrollContent
                }
            >

                <View
                    style={styles.container}
                >

                    {/* =========================
                        HEADER
                    ========================== */}

                    <View
                        style={styles.header}
                    >

                        <View>

                            <Text
                                style={styles.headerTitle}
                            >
                                CONTROL VEHICULAR
                            </Text>

                            <Text
                                style={styles.headerSubtitle}
                            >
                                Administración de gastos
                            </Text>

                        </View>


                        <View
                            style={styles.headerActions}
                        >

                            <TouchableOpacity
                                style={styles.menuButton}
                                onPress={() =>
                                    onVolver?.()
                                }
                            >

                                <Text
                                    style={styles.menuButtonText}
                                >
                                    {esMovil
                                        ? "←"
                                        : "← MENÚ"}
                                </Text>

                            </TouchableOpacity>


                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={() =>
                                    onLogout?.()
                                }
                            >

                                <Text
                                    style={styles.logoutButtonText}
                                >
                                    {esMovil
                                        ? "SALIR"
                                        : "CERRAR SESIÓN"}
                                </Text>

                            </TouchableOpacity>

                        </View>

                    </View>


                    {/* =========================
                        MENSAJE
                    ========================== */}

                    {mensaje && (

                        <View
                            style={[
                                styles.messageBox,

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


                    {/* =========================
                        RESUMEN
                    ========================== */}

                    <View
                        style={[
                            styles.summaryRow,
                            esMovil &&
                            styles.summaryRowMobile
                        ]}
                    >

                        <View
                            style={styles.summaryCard}
                        >

                            <Text
                                style={styles.summaryLabel}
                            >
                                ACTIVOS
                            </Text>

                            <Text
                                style={styles.summaryNumber}
                            >
                                {resumen.activos}
                            </Text>

                        </View>


                        <View
                            style={styles.summaryCard}
                        >

                            <Text
                                style={styles.summaryLabel}
                            >
                                INACTIVOS
                            </Text>

                            <Text
                                style={styles.summaryNumber}
                            >
                                {resumen.inactivos}
                            </Text>

                        </View>


                        <View
                            style={styles.summaryCard}
                        >

                            <Text
                                style={styles.summaryLabel}
                            >
                                TOTAL ACTIVO
                            </Text>

                            <Text
                                style={styles.summaryAmount}
                            >
                                ${formatearMonto(
                                    resumen.total
                                )}
                            </Text>

                        </View>

                    </View>


                    {/* =========================
                        CONTENIDO
                    ========================== */}

                    <View
                        style={[
                            styles.mainLayout,
                            esMovil &&
                            styles.mainLayoutMobile
                        ]}
                    >

                        {/* =====================
                            FORMULARIO
                        ====================== */}

                        <View
                            style={[
                                styles.formCard,
                                !esMovil &&
                                styles.formColumn
                            ]}
                        >

                            <View
                                style={styles.sectionHeader}
                            >

                                <View>

                                    <Text
                                        style={styles.sectionTitle}
                                    >
                                        {editandoId !== null
                                            ? "Editar gasto"
                                            : "Registrar gasto"}
                                    </Text>

                                    <Text
                                        style={styles.sectionSubtitle}
                                    >
                                        Completa la información del gasto
                                    </Text>

                                </View>

                            </View>


                            {/* VEHÍCULO */}

                            <Text
                                style={styles.label}
                            >
                                Vehículo *
                            </Text>


                            <TouchableOpacity
                                style={styles.selectBox}
                                onPress={() =>
                                    setMostrarVehiculos(
                                        !mostrarVehiculos
                                    )
                                }
                            >

                                <Text
                                    style={
                                        vehiculoSeleccionado
                                            ? styles.selectText
                                            : styles.placeholder
                                    }
                                    numberOfLines={1}
                                >

                                    {vehiculoSeleccionado
                                        ? nombreVehiculo(
                                            vehiculoSeleccionado
                                        )
                                        : "Seleccionar vehículo"}

                                </Text>


                                <Text
                                    style={styles.arrow}
                                >
                                    {mostrarVehiculos
                                        ? "▲"
                                        : "▼"}
                                </Text>

                            </TouchableOpacity>


                            {mostrarVehiculos && (

                                <View
                                    style={styles.dropdown}
                                >

                                    {vehiculos.length === 0 ? (

                                        <Text
                                            style={styles.dropdownEmpty}
                                        >
                                            No hay vehículos registrados
                                        </Text>

                                    ) : (

                                        vehiculos.map(
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

                                                    <Text
                                                        style={
                                                            styles.dropdownText
                                                        }
                                                    >
                                                        {nombreVehiculo(
                                                            vehiculo
                                                        )}
                                                    </Text>

                                                </TouchableOpacity>
                                            )
                                        )
                                    )}

                                </View>
                            )}


                            {/* CATEGORÍA */}

                            <Text
                                style={styles.label}
                            >
                                ID de categoría *
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={
                                    formulario.categoriaId
                                }
                                onChangeText={(valor) =>
                                    actualizarCampo(
                                        "categoriaId",
                                        valor
                                            .replace(
                                                /[^0-9]/g,
                                                ""
                                            )
                                    )
                                }
                                placeholder="Ej. 1"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                            />

                            <Text
                                style={styles.helper}
                            >
                                Por ahora se utiliza el ID real de categoria_gasto.
                            </Text>


                            {/* MONTO */}

                            <Text
                                style={styles.label}
                            >
                                Monto *
                            </Text>

                            <View
                                style={styles.amountContainer}
                            >

                                <Text
                                    style={styles.currencySymbol}
                                >
                                    $
                                </Text>

                                <TextInput
                                    style={styles.amountInput}
                                    value={
                                        formulario.monto
                                    }
                                    onChangeText={(valor) =>
                                        actualizarCampo(
                                            "monto",
                                            valor
                                        )
                                    }
                                    placeholder="0.00"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="decimal-pad"
                                />

                            </View>


                            {/* MONEDA */}

                            <Text
                                style={styles.label}
                            >
                                Moneda
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={
                                    formulario.moneda
                                }
                                onChangeText={(valor) =>
                                    actualizarCampo(
                                        "moneda",
                                        valor
                                            .toUpperCase()
                                            .slice(0, 3)
                                    )
                                }
                                placeholder="USD"
                                placeholderTextColor="#9CA3AF"
                                autoCapitalize="characters"
                                maxLength={3}
                            />


                            {/* FECHA */}

                            <View
                                style={styles.labelRow}
                            >

                                <Text
                                    style={styles.label}
                                >
                                    Fecha *
                                </Text>

                                <TouchableOpacity
                                    onPress={() =>
                                        actualizarCampo(
                                            "fecha",
                                            obtenerFechaActual()
                                        )
                                    }
                                >

                                    <Text
                                        style={styles.todayButton}
                                    >
                                        Usar hoy
                                    </Text>

                                </TouchableOpacity>

                            </View>


                            <TextInput
                                style={styles.input}
                                value={
                                    formulario.fecha
                                }
                                onChangeText={(valor) =>
                                    actualizarCampo(
                                        "fecha",
                                        valor
                                    )
                                }
                                placeholder="AAAA-MM-DD"
                                placeholderTextColor="#9CA3AF"
                                maxLength={10}
                            />


                            {/* PROVEEDOR */}

                            <Text
                                style={styles.label}
                            >
                                Proveedor
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={
                                    formulario.proveedor
                                }
                                onChangeText={(valor) =>
                                    actualizarCampo(
                                        "proveedor",
                                        valor
                                    )
                                }
                                placeholder="Ej. Taller Central"
                                placeholderTextColor="#9CA3AF"
                                maxLength={150}
                            />


                            {/* COMPROBANTE */}

                            <Text
                                style={styles.label}
                            >
                                N.º de comprobante
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={
                                    formulario.numeroComprobante
                                }
                                onChangeText={(valor) =>
                                    actualizarCampo(
                                        "numeroComprobante",
                                        valor
                                    )
                                }
                                placeholder="Ej. FAC-0001"
                                placeholderTextColor="#9CA3AF"
                                maxLength={100}
                            />


                            {/* DESCRIPCIÓN */}

                            <Text
                                style={styles.label}
                            >
                                Descripción
                            </Text>

                            <TextInput
                                style={[
                                    styles.input,
                                    styles.textArea
                                ]}
                                value={
                                    formulario.descripcion
                                }
                                onChangeText={(valor) =>
                                    actualizarCampo(
                                        "descripcion",
                                        valor
                                    )
                                }
                                placeholder="Detalles u observaciones del gasto..."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={4}
                            />


                            {/* BOTONES */}

                            <TouchableOpacity
                                style={[
                                    styles.saveButton,
                                    guardando &&
                                    styles.disabledButton
                                ]}
                                onPress={
                                    guardarGasto
                                }
                                disabled={
                                    guardando
                                }
                            >

                                {guardando ? (

                                    <ActivityIndicator
                                        color="#FFFFFF"
                                    />

                                ) : (

                                    <Text
                                        style={styles.saveButtonText}
                                    >
                                        {editandoId !== null
                                            ? "ACTUALIZAR GASTO"
                                            : "REGISTRAR GASTO"}
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
                                            styles.cancelButtonText
                                        }
                                    >
                                        CANCELAR EDICIÓN
                                    </Text>

                                </TouchableOpacity>
                            )}

                        </View>


                        {/* =====================
                            LISTADO
                        ====================== */}

                        <View
                            style={[
                                styles.listColumn,
                                !esMovil &&
                                styles.listColumnDesktop
                            ]}
                        >

                            <View
                                style={styles.listHeader}
                            >

                                <View>

                                    <Text
                                        style={styles.sectionTitle}
                                    >
                                        Gastos registrados
                                    </Text>

                                    <Text
                                        style={styles.sectionSubtitle}
                                    >
                                        {gastos.length} registro(s)
                                    </Text>

                                </View>


                                <TouchableOpacity
                                    style={styles.refreshButton}
                                    onPress={
                                        cargarDatos
                                    }
                                >

                                    <Text
                                        style={styles.refreshButtonText}
                                    >
                                        ACTUALIZAR
                                    </Text>

                                </TouchableOpacity>

                            </View>


                            {gastosOrdenados.length === 0 ? (

                                <View
                                    style={styles.emptyCard}
                                >

                                    <Text
                                        style={styles.emptyTitle}
                                    >
                                        No hay gastos registrados
                                    </Text>

                                    <Text
                                        style={styles.emptyText}
                                    >
                                        Los gastos que registres aparecerán aquí.
                                    </Text>

                                </View>

                            ) : (

                                gastosOrdenados.map(
                                    (gasto) => {

                                        const activo =
                                            gasto.activo !== false;


                                        return (

                                            <View
                                                key={gasto.id}
                                                style={[
                                                    styles.gastoCard,
                                                    !activo &&
                                                    styles.gastoCardInactive
                                                ]}
                                            >

                                                <View
                                                    style={
                                                        styles.gastoTop
                                                    }
                                                >

                                                    <View
                                                        style={{
                                                            flex: 1
                                                        }}
                                                    >

                                                        <View
                                                            style={
                                                                styles.titleStatusRow
                                                            }
                                                        >

                                                            <Text
                                                                style={
                                                                    styles.gastoTitle
                                                                }
                                                            >
                                                                Categoría #{gasto.categoriaId}
                                                            </Text>


                                                            <View
                                                                style={[
                                                                    styles.statusBadge,

                                                                    activo
                                                                        ? styles.statusActive
                                                                        : styles.statusInactive
                                                                ]}
                                                            >

                                                                <Text
                                                                    style={[
                                                                        styles.statusText,

                                                                        activo
                                                                            ? styles.statusActiveText
                                                                            : styles.statusInactiveText
                                                                    ]}
                                                                >
                                                                    {activo
                                                                        ? "ACTIVO"
                                                                        : "INACTIVO"}
                                                                </Text>

                                                            </View>

                                                        </View>


                                                        <Text
                                                            style={
                                                                styles.vehicleText
                                                            }
                                                        >
                                                            {obtenerNombreVehiculoPorId(
                                                                gasto.vehiculoId
                                                            )}
                                                        </Text>

                                                    </View>


                                                    <Text
                                                        style={
                                                            styles.amountTag
                                                        }
                                                    >
                                                        {gasto.moneda || "USD"}{" "}
                                                        {formatearMonto(
                                                            gasto.monto
                                                        )}
                                                    </Text>

                                                </View>


                                                <View
                                                    style={[
                                                        styles.infoGrid,
                                                        esMovil &&
                                                        styles.infoGridMobile
                                                    ]}
                                                >

                                                    <View
                                                        style={
                                                            styles.infoBlock
                                                        }
                                                    >

                                                        <Text
                                                            style={
                                                                styles.infoLabel
                                                            }
                                                        >
                                                            FECHA
                                                        </Text>

                                                        <Text
                                                            style={
                                                                styles.infoValue
                                                            }
                                                        >
                                                            {formatearFechaVisual(
                                                                gasto.fecha
                                                            )}
                                                        </Text>

                                                    </View>


                                                    <View
                                                        style={
                                                            styles.infoBlock
                                                        }
                                                    >

                                                        <Text
                                                            style={
                                                                styles.infoLabel
                                                            }
                                                        >
                                                            PROVEEDOR
                                                        </Text>

                                                        <Text
                                                            style={
                                                                styles.infoValue
                                                            }
                                                        >
                                                            {gasto.proveedor ||
                                                                "Sin proveedor"}
                                                        </Text>

                                                    </View>


                                                    <View
                                                        style={
                                                            styles.infoBlock
                                                        }
                                                    >

                                                        <Text
                                                            style={
                                                                styles.infoLabel
                                                            }
                                                        >
                                                            COMPROBANTE
                                                        </Text>

                                                        <Text
                                                            style={
                                                                styles.infoValue
                                                            }
                                                        >
                                                            {gasto.numeroComprobante ||
                                                                "Sin comprobante"}
                                                        </Text>

                                                    </View>

                                                </View>


                                                {gasto.descripcion ? (

                                                    <Text
                                                        style={
                                                            styles.description
                                                        }
                                                    >
                                                        {gasto.descripcion}
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
                                                            editarGasto(
                                                                gasto
                                                            )
                                                        }
                                                    >

                                                        <Text
                                                            style={
                                                                styles.editButtonText
                                                            }
                                                        >
                                                            EDITAR
                                                        </Text>

                                                    </TouchableOpacity>


                                                    {activo ? (

                                                        <TouchableOpacity
                                                            style={
                                                                styles.deactivateButton
                                                            }
                                                            onPress={() =>
                                                                confirmarDesactivacion(
                                                                    gasto.id
                                                                )
                                                            }
                                                        >

                                                            <Text
                                                                style={
                                                                    styles.deactivateButtonText
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
                                                                reactivarGasto(
                                                                    gasto
                                                                )
                                                            }
                                                        >

                                                            <Text
                                                                style={
                                                                    styles.activateButtonText
                                                                }
                                                            >
                                                                REACTIVAR
                                                            </Text>

                                                        </TouchableOpacity>
                                                    )}

                                                </View>

                                            </View>
                                        );
                                    }
                                )
                            )}

                        </View>

                    </View>

                </View>

            </ScrollView>

        </SafeAreaView>
    );
}


// ==========================================
// ESTILOS
// ==========================================

const styles = StyleSheet.create({

    screen: {
        flex: 1,
        backgroundColor: "#F4F7FB"
    },

    scrollContent: {
        paddingBottom: 50
    },

    container: {
        width: "100%",
        maxWidth: 1200,
        alignSelf: "center",
        paddingHorizontal: 18
    },


    // LOADING

    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F4F7FB"
    },

    loadingText: {
        marginTop: 12,
        color: "#64748B",
        fontWeight: "600"
    },


    // HEADER

    header: {
        minHeight: 85,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginTop: 18,
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 3
        },

        elevation: 2
    },

    headerTitle: {
        fontSize: 19,
        fontWeight: "900",
        color: "#172033"
    },

    headerSubtitle: {
        marginTop: 3,
        fontSize: 12,
        color: "#7C8798"
    },

    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },

    menuButton: {
        minHeight: 40,
        minWidth: 48,
        paddingHorizontal: 13,
        borderRadius: 9,
        backgroundColor: "#EFF6FF",
        alignItems: "center",
        justifyContent: "center"
    },

    menuButtonText: {
        color: "#2563EB",
        fontWeight: "800",
        fontSize: 12
    },

    logoutButton: {
        minHeight: 40,
        paddingHorizontal: 13,
        borderRadius: 9,
        backgroundColor: "#FEF2F2",
        alignItems: "center",
        justifyContent: "center"
    },

    logoutButtonText: {
        color: "#DC2626",
        fontWeight: "800",
        fontSize: 11
    },


    // MENSAJES

    messageBox: {
        marginTop: 15,
        padding: 13,
        borderRadius: 10,
        borderWidth: 1
    },

    messageError: {
        backgroundColor: "#FEF2F2",
        borderColor: "#FECACA"
    },

    messageSuccess: {
        backgroundColor: "#F0FDF4",
        borderColor: "#BBF7D0"
    },

    messageText: {
        fontSize: 13,
        fontWeight: "600"
    },

    messageErrorText: {
        color: "#B91C1C"
    },

    messageSuccessText: {
        color: "#15803D"
    },


    // RESUMEN

    summaryRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 18
    },

    summaryRowMobile: {
        flexDirection: "column"
    },

    summaryCard: {
        flex: 1,
        minHeight: 88,
        padding: 16,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",

        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,

        elevation: 1
    },

    summaryLabel: {
        fontSize: 10,
        fontWeight: "800",
        color: "#94A3B8"
    },

    summaryNumber: {
        marginTop: 5,
        fontSize: 24,
        fontWeight: "900",
        color: "#172033"
    },

    summaryAmount: {
        marginTop: 5,
        fontSize: 22,
        fontWeight: "900",
        color: "#15803D"
    },


    // CONTENIDO

    mainLayout: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 18,
        marginTop: 18
    },

    mainLayoutMobile: {
        flexDirection: "column"
    },

    formColumn: {
        width: "38%"
    },

    formCard: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 18,

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,

        elevation: 2
    },

    listColumn: {
        width: "100%"
    },

    listColumnDesktop: {
        flex: 1
    },

    sectionHeader: {
        marginBottom: 7
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "900",
        color: "#172033"
    },

    sectionSubtitle: {
        marginTop: 4,
        fontSize: 12,
        color: "#8490A1"
    },


    // FORMULARIO

    label: {
        marginTop: 15,
        marginBottom: 7,
        fontSize: 12,
        fontWeight: "800",
        color: "#334155"
    },

    labelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end"
    },

    helper: {
        marginTop: 5,
        color: "#94A3B8",
        fontSize: 10
    },

    todayButton: {
        color: "#2563EB",
        fontSize: 11,
        fontWeight: "800",
        marginBottom: 7
    },

    input: {
        minHeight: 49,
        borderWidth: 1,
        borderColor: "#D9E0E8",
        borderRadius: 10,
        paddingHorizontal: 13,
        backgroundColor: "#FFFFFF",
        color: "#172033",
        fontSize: 14
    },

    textArea: {
        minHeight: 100,
        paddingTop: 13,
        textAlignVertical: "top"
    },

    selectBox: {
        minHeight: 49,
        borderWidth: 1,
        borderColor: "#D9E0E8",
        borderRadius: 10,
        paddingHorizontal: 13,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    selectText: {
        flex: 1,
        color: "#172033",
        fontSize: 13
    },

    placeholder: {
        flex: 1,
        color: "#9CA3AF",
        fontSize: 13
    },

    arrow: {
        marginLeft: 10,
        color: "#64748B",
        fontSize: 11
    },

    dropdown: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: "#D9E0E8",
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#FFFFFF"
    },

    dropdownItem: {
        paddingHorizontal: 13,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F6"
    },

    dropdownText: {
        color: "#334155",
        fontSize: 13
    },

    dropdownEmpty: {
        padding: 14,
        color: "#94A3B8",
        fontSize: 12
    },

    amountContainer: {
        minHeight: 49,
        borderWidth: 1,
        borderColor: "#D9E0E8",
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 13
    },

    currencySymbol: {
        marginRight: 8,
        fontSize: 17,
        fontWeight: "800",
        color: "#64748B"
    },

    amountInput: {
        flex: 1,
        minHeight: 47,
        fontSize: 14,
        color: "#172033"
    },


    // BOTONES FORM

    saveButton: {
        minHeight: 51,
        marginTop: 22,
        borderRadius: 10,
        backgroundColor: "#2563EB",
        alignItems: "center",
        justifyContent: "center"
    },

    saveButtonText: {
        color: "#FFFFFF",
        fontWeight: "900",
        fontSize: 12
    },

    disabledButton: {
        opacity: 0.6
    },

    cancelButton: {
        minHeight: 45,
        marginTop: 8,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F1F5F9"
    },

    cancelButtonText: {
        color: "#64748B",
        fontWeight: "800",
        fontSize: 11
    },


    // LISTA

    listHeader: {
        minHeight: 65,
        paddingHorizontal: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    refreshButton: {
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 8,
        backgroundColor: "#E8F0FE"
    },

    refreshButtonText: {
        color: "#2563EB",
        fontWeight: "800",
        fontSize: 10
    },

    emptyCard: {
        marginTop: 7,
        padding: 30,
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        alignItems: "center"
    },

    emptyTitle: {
        fontWeight: "800",
        color: "#334155",
        fontSize: 15
    },

    emptyText: {
        marginTop: 5,
        color: "#94A3B8",
        textAlign: "center",
        fontSize: 12
    },


    // TARJETA GASTO

    gastoCard: {
        marginBottom: 12,
        padding: 17,
        borderRadius: 15,
        backgroundColor: "#FFFFFF",

        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 7,

        elevation: 1
    },

    gastoCardInactive: {
        opacity: 0.72
    },

    gastoTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12
    },

    titleStatusRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 7
    },

    gastoTitle: {
        fontSize: 16,
        fontWeight: "900",
        color: "#273449"
    },

    vehicleText: {
        marginTop: 4,
        color: "#7C8798",
        fontSize: 12
    },

    amountTag: {
        color: "#15803D",
        fontWeight: "900",
        fontSize: 15
    },

    statusBadge: {
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderRadius: 6
    },

    statusActive: {
        backgroundColor: "#DCFCE7"
    },

    statusInactive: {
        backgroundColor: "#FEE2E2"
    },

    statusText: {
        fontSize: 9,
        fontWeight: "900"
    },

    statusActiveText: {
        color: "#15803D"
    },

    statusInactiveText: {
        color: "#B91C1C"
    },

    infoGrid: {
        flexDirection: "row",
        gap: 12,
        marginTop: 16
    },

    infoGridMobile: {
        flexDirection: "column",
        gap: 8
    },

    infoBlock: {
        flex: 1,
        backgroundColor: "#F8FAFC",
        padding: 10,
        borderRadius: 9
    },

    infoLabel: {
        fontSize: 9,
        fontWeight: "800",
        color: "#94A3B8"
    },

    infoValue: {
        marginTop: 3,
        fontSize: 12,
        color: "#334155"
    },

    description: {
        marginTop: 12,
        padding: 11,
        borderRadius: 9,
        backgroundColor: "#F8FAFC",
        color: "#64748B",
        fontSize: 12,
        lineHeight: 18
    },


    // ACCIONES

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
        borderWidth: 1,
        borderColor: "#BFDBFE",
        borderRadius: 8,
        backgroundColor: "#F8FBFF",
        alignItems: "center",
        justifyContent: "center"
    },

    editButtonText: {
        color: "#2563EB",
        fontWeight: "800",
        fontSize: 10
    },

    deactivateButton: {
        flex: 1,
        minHeight: 39,
        borderWidth: 1,
        borderColor: "#FECACA",
        borderRadius: 8,
        backgroundColor: "#FFF7F7",
        alignItems: "center",
        justifyContent: "center"
    },

    deactivateButtonText: {
        color: "#DC2626",
        fontWeight: "800",
        fontSize: 10
    },

    activateButton: {
        flex: 1,
        minHeight: 39,
        borderWidth: 1,
        borderColor: "#BBF7D0",
        borderRadius: 8,
        backgroundColor: "#F0FDF4",
        alignItems: "center",
        justifyContent: "center"
    },

    activateButtonText: {
        color: "#15803D",
        fontWeight: "800",
        fontSize: 10
    }
});