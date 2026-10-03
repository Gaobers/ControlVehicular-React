import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Alert,
    Platform
} from "react-native";

import {
    mantenimientoService
} from "../services/mantenimientoService";

import {
    vehiculoService
} from "../services/vehiculoService";

export function useMantenimientos() {
    const [
        mantenimientos,
        setMantenimientos
    ] = useState([]);

    const [
        vehiculos,
        setVehiculos
    ] = useState([]);

    const [
        cargando,
        setCargando
    ] = useState(true);

    const [
        guardando,
        setGuardando
    ] = useState(false);

    const [
        filtroVehiculo,
        setFiltroVehiculo
    ] = useState(null);

    const [
        filtroEstado,
        setFiltroEstado
    ] = useState("TODOS");

    const [
        mantenimientoSeleccionado,
        setMantenimientoSeleccionado
    ] = useState(null);

    const [
        mantenimientoEditando,
        setMantenimientoEditando
    ] = useState(null);

    const [
        formularioVisible,
        setFormularioVisible
    ] = useState(false);

    const [
        detalleVisible,
        setDetalleVisible
    ] = useState(false);

    const [
        mensaje,
        setMensaje
    ] = useState(null);

    const [
        errorFormulario,
        setErrorFormulario
    ] = useState("");

    useEffect(() => {
        cargarDatos();
    }, []);

    const obtenerMensajeError = (
        error,
        predeterminado
    ) => {
        if (
            typeof error?.response?.data ===
            "string"
        ) {
            return error.response.data;
        }

        if (
            error?.response?.status ===
            401
        ) {
            return "Tu sesión no es válida.";
        }

        if (
            error?.response?.status ===
            403
        ) {
            return "No tienes autorización para realizar esta operación.";
        }

        return (
            error?.response?.data?.mensaje ||
            error?.response?.data?.message ||
            predeterminado
        );
    };

    const cargarDatos = async () => {
        try {
            setCargando(true);

            const [
                activos,
                listaVehiculos
            ] = await Promise.all([
                mantenimientoService
                    .obtenerTodos({
                        activo: true
                    }),

                vehiculoService
                    .obtenerTodos()
            ]);

            setMantenimientos(
                Array.isArray(activos)
                    ? activos
                    : []
            );

            setVehiculos(
                Array.isArray(listaVehiculos)
                    ? listaVehiculos
                    : []
            );
        } catch (error) {
            setMensaje({
                tipo: "error",
                texto:
                    obtenerMensajeError(
                        error,
                        "No se pudieron cargar los mantenimientos."
                    )
            });
        } finally {
            setCargando(false);
        }
    };

    const mostrarExito = (
        texto
    ) => {
        setMensaje({
            tipo: "exito",
            texto
        });
    };

    const abrirNuevo = () => {
        setMantenimientoEditando(null);
        setErrorFormulario("");
        setFormularioVisible(true);
    };

    const cerrarFormulario = () => {
        if (guardando) {
            return;
        }

        setFormularioVisible(false);
        setMantenimientoEditando(null);
        setErrorFormulario("");
    };

    const abrirDetalle = (
        mantenimiento
    ) => {
        setMantenimientoSeleccionado(
            mantenimiento
        );

        setDetalleVisible(true);
    };

    const cerrarDetalle = () => {
        setDetalleVisible(false);
        setMantenimientoSeleccionado(null);
    };

    const abrirEdicion = (
        mantenimiento
    ) => {
        setDetalleVisible(false);

        setMantenimientoEditando(
            mantenimiento
        );

        setErrorFormulario("");
        setFormularioVisible(true);
    };

    const guardarMantenimiento =
        async (datos) => {
            try {
                setGuardando(true);
                setErrorFormulario("");

                if (mantenimientoEditando) {
                    await mantenimientoService
                        .actualizar(
                            mantenimientoEditando.id,
                            datos
                        );

                    mostrarExito(
                        "Mantenimiento actualizado correctamente."
                    );
                } else {
                    await mantenimientoService
                        .crear(
                            datos
                        );

                    mostrarExito(
                        "Mantenimiento programado correctamente."
                    );
                }

                setFormularioVisible(false);
                setMantenimientoEditando(null);

                await cargarDatos();
            } catch (error) {
                setErrorFormulario(
                    obtenerMensajeError(
                        error,
                        mantenimientoEditando
                            ? "No se pudo actualizar el mantenimiento."
                            : "No se pudo programar el mantenimiento."
                    )
                );
            } finally {
                setGuardando(false);
            }
        };

    const marcarRealizado =
        async (mantenimiento) => {
            try {
                await mantenimientoService
                    .actualizar(
                        mantenimiento.id,
                        {
                            vehiculoId:
                                mantenimiento.vehiculoId,

                            servicio:
                                mantenimiento.servicio,

                            estado:
                                "REALIZADO",

                            fechaObjetivo:
                                mantenimiento.fechaObjetivo ??
                                null,

                            kilometrajeObjetivo:
                                mantenimiento.kilometrajeObjetivo ??
                                null
                        }
                    );

                cerrarDetalle();

                mostrarExito(
                    "Mantenimiento marcado como realizado."
                );

                await cargarDatos();
            } catch (error) {
                setMensaje({
                    tipo: "error",
                    texto:
                        obtenerMensajeError(
                            error,
                            "No se pudo marcar el mantenimiento como realizado."
                        )
                });
            }
        };

    const confirmarRealizado = (
        mantenimiento
    ) => {
        const texto =
            `¿Marcar "${mantenimiento.servicio}" como realizado?`;

        if (Platform.OS === "web") {
            if (
                globalThis.confirm?.(
                    texto
                )
            ) {
                marcarRealizado(
                    mantenimiento
                );
            }

            return;
        }

        Alert.alert(
            "Completar mantenimiento",
            texto,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Marcar realizado",
                    onPress: () =>
                        marcarRealizado(
                            mantenimiento
                        )
                }
            ]
        );
    };

    const desactivar =
        async (mantenimiento) => {
            try {
                await mantenimientoService
                    .eliminar(
                        mantenimiento.id
                    );

                cerrarDetalle();

                mostrarExito(
                    "Mantenimiento desactivado correctamente."
                );

                await cargarDatos();
            } catch (error) {
                setMensaje({
                    tipo: "error",
                    texto:
                        obtenerMensajeError(
                            error,
                            "No se pudo desactivar el mantenimiento."
                        )
                });
            }
        };

    const confirmarDesactivar = (
        mantenimiento
    ) => {
        const texto =
            `¿Deseas desactivar "${mantenimiento.servicio}"?`;

        if (Platform.OS === "web") {
            if (
                globalThis.confirm?.(
                    texto
                )
            ) {
                desactivar(
                    mantenimiento
                );
            }

            return;
        }

        Alert.alert(
            "Desactivar mantenimiento",
            texto,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Desactivar",
                    style: "destructive",
                    onPress: () =>
                        desactivar(
                            mantenimiento
                        )
                }
            ]
        );
    };

    const mantenimientosFiltrados =
        useMemo(() => {
            return mantenimientos.filter(
                (mantenimiento) => {
                    if (
                        filtroVehiculo !== null &&
                        String(
                            mantenimiento.vehiculoId
                        ) !==
                        String(
                            filtroVehiculo
                        )
                    ) {
                        return false;
                    }

                    if (
                        filtroEstado !==
                        "TODOS" &&
                        mantenimiento.estado !==
                        filtroEstado
                    ) {
                        return false;
                    }

                    return true;
                }
            );
        }, [
            mantenimientos,
            filtroVehiculo,
            filtroEstado
        ]);

    const resumen =
        useMemo(() => ({
            total:
                mantenimientos.length,

            vencidos:
                mantenimientos.filter(
                    (item) =>
                        item.estado ===
                        "VENCIDO"
                ).length,

            proximos:
                mantenimientos.filter(
                    (item) =>
                        item.estado ===
                        "PROXIMO"
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
        }), [mantenimientos]);

    const obtenerVehiculo = (
        id
    ) => {
        return vehiculos.find(
            (vehiculo) =>
                String(vehiculo.id) ===
                String(id)
        );
    };

    const obtenerNombreVehiculo = (
        id
    ) => {
        const vehiculo =
            obtenerVehiculo(id);

        if (!vehiculo) {
            return `Vehículo #${id}`;
        }

        return `${vehiculo.marca} ${vehiculo.modelo} • ${vehiculo.placa}`;
    };

    return {
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
    };
}