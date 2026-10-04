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
    kilometrajeService
} from "../services/kilometrajeService";

import {
    vehiculoService
} from "../services/vehiculoService";


export function useKilometrajes() {

    const [
        registros,
        setRegistros
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
        busqueda,
        setBusqueda
    ] = useState("");


    const [
        filtroEstado,
        setFiltroEstado
    ] = useState("TODOS");


    const [
        registroSeleccionado,
        setRegistroSeleccionado
    ] = useState(null);


    const [
        registroEditando,
        setRegistroEditando
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


    const extraerMensajeError = (
        error,
        predeterminado
    ) => {

        const status =
            error?.response?.status;


        let texto =
            error?.response?.data?.message ||
            error?.response?.data?.mensaje ||
            predeterminado;


        if (
            typeof error?.response?.data ===
            "string"
        ) {

            texto =
                error.response.data;
        }


        if (status === 401) {

            return "Tu sesión no es válida. Inicia sesión nuevamente.";
        }


        if (status === 403) {

            return "No tienes autorización para realizar esta operación.";
        }


        return texto;
    };


    const cargarDatos = async () => {

        try {

            setCargando(true);


            const [
                listaRegistros,
                listaVehiculos
            ] = await Promise.all([

                kilometrajeService.obtenerTodos(),

                vehiculoService.obtenerTodos()

            ]);


            setRegistros(
                Array.isArray(listaRegistros)
                    ? listaRegistros
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
                    extraerMensajeError(
                        error,
                        "No se pudo cargar el historial de kilometraje."
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


    const mostrarError = (
        error,
        predeterminado
    ) => {

        setMensaje({
            tipo: "error",

            texto:
                extraerMensajeError(
                    error,
                    predeterminado
                )
        });
    };


    const abrirNuevo = () => {

        setRegistroEditando(null);

        setErrorFormulario("");

        setFormularioVisible(true);
    };


    const cerrarFormulario = () => {

        if (guardando) {
            return;
        }


        setFormularioVisible(false);

        setRegistroEditando(null);

        setErrorFormulario("");
    };


    const abrirDetalle = (
        registro
    ) => {

        setRegistroSeleccionado(
            registro
        );

        setDetalleVisible(true);
    };


    const cerrarDetalle = () => {

        setDetalleVisible(false);

        setRegistroSeleccionado(null);
    };


    const abrirEdicion = (
        registro
    ) => {

        setDetalleVisible(false);

        setRegistroEditando(
            registro
        );

        setErrorFormulario("");

        setFormularioVisible(true);
    };


    const guardarRegistro = async (
        datos
    ) => {

        try {

            setGuardando(true);

            setErrorFormulario("");


            if (registroEditando) {

                await kilometrajeService.actualizar(
                    registroEditando.id,
                    datos
                );


                mostrarExito(
                    "Registro de kilometraje actualizado correctamente."
                );

            } else {

                await kilometrajeService.crear(
                    datos
                );


                mostrarExito(
                    "Kilometraje registrado correctamente."
                );
            }


            setFormularioVisible(false);

            setRegistroEditando(null);


            await cargarDatos();

        } catch (error) {

            setErrorFormulario(
                extraerMensajeError(
                    error,

                    registroEditando
                        ? "No se pudo actualizar el registro."
                        : "No se pudo registrar el kilometraje."
                )
            );

        } finally {

            setGuardando(false);
        }
    };


    const desactivar = async (
        registro
    ) => {

        try {

            await kilometrajeService.eliminar(
                registro.id
            );


            cerrarDetalle();


            mostrarExito(
                "Registro de kilometraje desactivado correctamente."
            );


            await cargarDatos();

        } catch (error) {

            mostrarError(
                error,
                "No se pudo desactivar el registro."
            );
        }
    };


    const confirmarDesactivar = (
        registro
    ) => {

        const texto =
            "¿Deseas desactivar este registro de kilometraje?";


        if (Platform.OS === "web") {

            if (
                globalThis.confirm?.(
                    texto
                )
            ) {

                desactivar(
                    registro
                );
            }

            return;
        }


        Alert.alert(
            "Desactivar registro",
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
                            registro
                        )
                }
            ]
        );
    };


    const reactivar = async (
        registro
    ) => {

        try {

            await kilometrajeService.actualizar(
                registro.id,
                {
                    kilometraje:
                        Number(
                            registro.kilometraje
                        ),

                    observacion:
                        registro.observacion ??
                        null,

                    activo: true
                }
            );


            cerrarDetalle();


            mostrarExito(
                "Registro de kilometraje reactivado correctamente."
            );


            await cargarDatos();

        } catch (error) {

            mostrarError(
                error,
                "No se pudo reactivar el registro."
            );
        }
    };


    const obtenerVehiculo = (
        vehiculoId
    ) => {

        return vehiculos.find(
            (vehiculo) =>
                String(vehiculo.id) ===
                String(vehiculoId)
        );
    };


    const obtenerNombreVehiculo = (
        vehiculoId
    ) => {

        const vehiculo =
            obtenerVehiculo(
                vehiculoId
            );


        if (!vehiculo) {

            return `Vehículo #${vehiculoId}`;
        }


        return [
            vehiculo.marca,
            vehiculo.modelo,
            vehiculo.placa
                ? `(${vehiculo.placa})`
                : ""
        ]
            .filter(Boolean)
            .join(" ");
    };


    const registrosFiltrados =
        useMemo(() => {

            const texto =
                busqueda
                    .trim()
                    .toLowerCase();


            return registros.filter(
                (registro) => {

                    if (
                        filtroEstado ===
                        "ACTIVOS" &&
                        registro.activo === false
                    ) {

                        return false;
                    }


                    if (
                        filtroEstado ===
                        "INACTIVOS" &&
                        registro.activo !== false
                    ) {

                        return false;
                    }


                    if (!texto) {

                        return true;
                    }


                    const vehiculo =
                        vehiculos.find(
                            (item) =>
                                String(item.id) ===
                                String(
                                    registro.vehiculoId
                                )
                        );


                    const contenido = [
                        registro.kilometraje,
                        registro.observacion,
                        vehiculo?.marca,
                        vehiculo?.modelo,
                        vehiculo?.placa,
                        vehiculo?.color
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                    return contenido.includes(
                        texto
                    );
                }
            );

        }, [
            registros,
            vehiculos,
            busqueda,
            filtroEstado
        ]);


    const resumen =
        useMemo(() => {

            const activos =
                registros.filter(
                    (registro) =>
                        registro.activo !== false
                );


            const kmMayor =
                activos.reduce(
                    (
                        mayor,
                        registro
                    ) => {

                        const numero =
                            Number(
                                registro.kilometraje ||
                                0
                            );


                        return numero >
                            mayor
                            ? numero
                            : mayor;
                    },

                    0
                );


            return {

                total:
                    registros.length,

                activos:
                    activos.length,

                inactivos:
                    registros.filter(
                        (registro) =>
                            registro.activo ===
                            false
                    ).length,

                kmMayor
            };

        }, [registros]);


    return {

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

        obtenerVehiculo,

        obtenerNombreVehiculo
    };
}