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
    recordatorioService
} from "../services/recordatorioService";

import {
    mantenimientoService
} from "../services/mantenimientoService";

import {
    vehiculoService
} from "../services/vehiculoService";

import {
    buscarMantenimiento,
    buscarVehiculo,
    esActivo,
    obtenerEstadoRecordatorio
} from "../components/recordatorios/recordatorioUtils";


export function useRecordatorios() {

    const [
        recordatorios,
        setRecordatorios
    ] = useState([]);


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
        filtro,
        setFiltro
    ] = useState("TODOS");


    const [
        vista,
        setVista
    ] = useState("LISTA");


    const [
        recordatorioSeleccionado,
        setRecordatorioSeleccionado
    ] = useState(null);


    const [
        recordatorioEditando,
        setRecordatorioEditando
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
                listaRecordatorios,
                listaMantenimientos,
                listaVehiculos
            ] = await Promise.all([

                recordatorioService
                    .obtenerTodos(),

                mantenimientoService
                    .obtenerTodos({
                        activo: true
                    }),

                vehiculoService
                    .obtenerTodos()

            ]);


            setRecordatorios(
                Array.isArray(
                    listaRecordatorios
                )
                    ? listaRecordatorios
                    : []
            );


            setMantenimientos(
                Array.isArray(
                    listaMantenimientos
                )
                    ? listaMantenimientos
                    : []
            );


            setVehiculos(
                Array.isArray(
                    listaVehiculos
                )
                    ? listaVehiculos
                    : []
            );

        } catch (error) {

            setMensaje({
                tipo: "error",

                texto:
                    obtenerMensajeError(
                        error,
                        "No se pudieron cargar los recordatorios."
                    )
            });

        } finally {

            setCargando(false);
        }
    };


    const obtenerContexto = (
        recordatorio
    ) => {

        const mantenimiento =
            buscarMantenimiento(
                mantenimientos,
                recordatorio
                    .mantenimientoId
            );


        const vehiculo =
            mantenimiento
                ? buscarVehiculo(
                    vehiculos,
                    mantenimiento
                        .vehiculoId
                )
                : null;


        return {
            mantenimiento,
            vehiculo
        };
    };


    const abrirNuevo = () => {

        setRecordatorioEditando(
            null
        );

        setErrorFormulario("");

        setFormularioVisible(
            true
        );
    };


    const cerrarFormulario = () => {

        if (guardando) {
            return;
        }


        setFormularioVisible(
            false
        );

        setRecordatorioEditando(
            null
        );

        setErrorFormulario("");
    };


    const abrirDetalle = (
        recordatorio
    ) => {

        setRecordatorioSeleccionado(
            recordatorio
        );

        setDetalleVisible(
            true
        );
    };


    const cerrarDetalle = () => {

        setDetalleVisible(
            false
        );

        setRecordatorioSeleccionado(
            null
        );
    };


    const abrirEdicion = (
        recordatorio
    ) => {

        setDetalleVisible(
            false
        );

        setRecordatorioEditando(
            recordatorio
        );

        setFormularioVisible(
            true
        );

        setErrorFormulario("");
    };


    const guardarRecordatorio =
        async (datos) => {

            try {

                setGuardando(
                    true
                );

                setErrorFormulario(
                    ""
                );


                if (
                    recordatorioEditando
                ) {

                    await recordatorioService
                        .actualizar(
                            recordatorioEditando.id,
                            datos
                        );


                    setMensaje({
                        tipo: "exito",
                        texto:
                            "Recordatorio actualizado correctamente."
                    });

                } else {

                    await recordatorioService
                        .crear(
                            datos
                        );


                    setMensaje({
                        tipo: "exito",
                        texto:
                            "Recordatorio creado correctamente."
                    });
                }


                setFormularioVisible(
                    false
                );

                setRecordatorioEditando(
                    null
                );


                await cargarDatos();

            } catch (error) {

                setErrorFormulario(
                    obtenerMensajeError(
                        error,

                        recordatorioEditando
                            ? "No se pudo actualizar el recordatorio."
                            : "No se pudo crear el recordatorio."
                    )
                );

            } finally {

                setGuardando(
                    false
                );
            }
        };


    const desactivar =
        async (recordatorio) => {

            try {

                await recordatorioService
                    .eliminar(
                        recordatorio.id
                    );


                cerrarDetalle();


                setMensaje({
                    tipo: "exito",
                    texto:
                        "Recordatorio desactivado correctamente."
                });


                await cargarDatos();

            } catch (error) {

                setMensaje({
                    tipo: "error",

                    texto:
                        obtenerMensajeError(
                            error,
                            "No se pudo desactivar el recordatorio."
                        )
                });
            }
        };


    const confirmarDesactivar = (
        recordatorio
    ) => {

        const texto =
            "¿Deseas desactivar este recordatorio?";


        if (
            Platform.OS ===
            "web"
        ) {

            if (
                globalThis
                    .confirm?.(
                        texto
                    )
            ) {

                desactivar(
                    recordatorio
                );
            }

            return;
        }


        Alert.alert(
            "Desactivar recordatorio",
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
                            recordatorio
                        )
                }
            ]
        );
    };


    const reactivar =
        async (recordatorio) => {

            try {

                await recordatorioService
                    .actualizar(
                        recordatorio.id,
                        {
                            mantenimientoId:
                                recordatorio
                                    .mantenimientoId,

                            diasAnticipacion:
                                Number(
                                    recordatorio
                                        .diasAnticipacion ||
                                    0
                                ),

                            kilometrosAnticipacion:
                                Number(
                                    recordatorio
                                        .kilometrosAnticipacion ||
                                    0
                                ),

                            activo:
                                true
                        }
                    );


                cerrarDetalle();


                setMensaje({
                    tipo: "exito",
                    texto:
                        "Recordatorio reactivado correctamente."
                });


                await cargarDatos();

            } catch (error) {

                setMensaje({
                    tipo: "error",

                    texto:
                        obtenerMensajeError(
                            error,
                            "No se pudo reactivar el recordatorio."
                        )
                });
            }
        };


    const recordatoriosFiltrados =
        useMemo(() => {

            if (
                filtro ===
                "TODOS"
            ) {

                return recordatorios;
            }


            return recordatorios.filter(
                (recordatorio) => {

                    const {
                        mantenimiento,
                        vehiculo
                    } =
                        obtenerContexto(
                            recordatorio
                        );


                    return (
                        obtenerEstadoRecordatorio(
                            recordatorio,
                            mantenimiento,
                            vehiculo
                        ).id ===
                        filtro
                    );
                }
            );

        }, [
            recordatorios,
            mantenimientos,
            vehiculos,
            filtro
        ]);


    const resumen =
        useMemo(() => {

            const base = {
                total:
                    recordatorios.length,

                vencidos:
                    0,

                proximos:
                    0,

                pendientes:
                    0,

                realizados:
                    0,

                inactivos:
                    0
            };


            recordatorios.forEach(
                (recordatorio) => {

                    if (
                        !esActivo(
                            recordatorio.activo
                        )
                    ) {

                        base.inactivos++;

                        return;
                    }


                    const {
                        mantenimiento,
                        vehiculo
                    } =
                        obtenerContexto(
                            recordatorio
                        );


                    const estado =
                        obtenerEstadoRecordatorio(
                            recordatorio,
                            mantenimiento,
                            vehiculo
                        ).id;


                    if (
                        estado ===
                        "VENCIDO"
                    ) {
                        base.vencidos++;
                    }


                    if (
                        estado ===
                        "PROXIMO"
                    ) {
                        base.proximos++;
                    }


                    if (
                        estado ===
                        "PENDIENTE"
                    ) {
                        base.pendientes++;
                    }


                    if (
                        estado ===
                        "REALIZADO"
                    ) {
                        base.realizados++;
                    }
                }
            );


            return base;

        }, [
            recordatorios,
            mantenimientos,
            vehiculos
        ]);


    return {

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
    };
}