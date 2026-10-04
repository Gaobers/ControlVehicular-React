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
    gastoService
} from "../services/gastoService";

import {
    vehiculoService
} from "../services/vehiculoService";


export function useGastos() {

    const [
        gastos,
        setGastos
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
        gastoSeleccionado,
        setGastoSeleccionado
    ] = useState(null);


    const [
        gastoEditando,
        setGastoEditando
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

            if (
                error.response?.status === 404
            ) {

                setGastos([]);

                return;
            }


            mostrarError(
                error,
                "No se pudieron cargar los gastos."
            );

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


        setMensaje({
            tipo: "error",
            texto
        });
    };


    const abrirNuevo = () => {

        setGastoEditando(null);

        setFormularioVisible(true);

        setMensaje(null);
    };


    const abrirDetalle = (
        gasto
    ) => {

        setGastoSeleccionado(
            gasto
        );

        setDetalleVisible(true);
    };


    const cerrarDetalle = () => {

        setDetalleVisible(false);

        setGastoSeleccionado(null);
    };


    const abrirEdicion = (
        gasto
    ) => {

        setDetalleVisible(false);

        setGastoEditando(
            gasto
        );

        setFormularioVisible(true);
    };


    const cerrarFormulario = () => {

        if (guardando) {
            return;
        }


        setFormularioVisible(false);

        setGastoEditando(null);
    };


    const guardarGasto = async (
        datos
    ) => {

        try {

            setGuardando(true);


            if (gastoEditando) {

                await gastoService.actualizar(
                    gastoEditando.id,
                    datos
                );


                mostrarExito(
                    "Gasto actualizado correctamente."
                );

            } else {

                await gastoService.crear(
                    datos
                );


                mostrarExito(
                    "Gasto registrado correctamente."
                );
            }


            setFormularioVisible(false);

            setGastoEditando(null);


            await cargarDatos();

        } catch (error) {

            mostrarError(
                error,
                gastoEditando
                    ? "No se pudo actualizar el gasto."
                    : "No se pudo registrar el gasto."
            );

        } finally {

            setGuardando(false);
        }
    };


    const desactivar =
        async (gasto) => {

            try {

                await gastoService.eliminar(
                    gasto.id
                );


                cerrarDetalle();


                mostrarExito(
                    "Gasto desactivado correctamente."
                );


                await cargarDatos();

            } catch (error) {

                mostrarError(
                    error,
                    "No se pudo desactivar el gasto."
                );
            }
        };


    const confirmarDesactivar = (
        gasto
    ) => {

        const texto =
            "¿Deseas desactivar este gasto?";


        if (Platform.OS === "web") {

            if (
                globalThis.confirm?.(
                    texto
                )
            ) {

                desactivar(
                    gasto
                );
            }

            return;
        }


        Alert.alert(
            "Desactivar gasto",
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
                            gasto
                        )
                }
            ]
        );
    };


    const reactivar =
        async (gasto) => {

            try {

                await gastoService.actualizar(
                    gasto.id,
                    {
                        vehiculoId:
                            gasto.vehiculoId,

                        categoriaId:
                            gasto.categoriaId,

                        monto:
                            gasto.monto,

                        moneda:
                            gasto.moneda,

                        fecha:
                            gasto.fecha,

                        descripcion:
                            gasto.descripcion ??
                            null,

                        numeroComprobante:
                            gasto.numeroComprobante ??
                            null,

                        proveedor:
                            gasto.proveedor ??
                            null,

                        activo: true
                    }
                );


                cerrarDetalle();


                mostrarExito(
                    "Gasto reactivado correctamente."
                );


                await cargarDatos();

            } catch (error) {

                mostrarError(
                    error,
                    "No se pudo reactivar el gasto."
                );
            }
        };


    const gastosFiltrados =
        useMemo(() => {

            const texto =
                busqueda
                    .trim()
                    .toLowerCase();


            return gastos.filter(
                (gasto) => {

                    if (
                        filtroEstado ===
                        "ACTIVOS" &&
                        gasto.activo === false
                    ) {

                        return false;
                    }


                    if (
                        filtroEstado ===
                        "INACTIVOS" &&
                        gasto.activo !== false
                    ) {

                        return false;
                    }


                    if (!texto) {

                        return true;
                    }


                    const vehiculo =
                        vehiculos.find(
                            (v) =>
                                String(v.id) ===
                                String(
                                    gasto.vehiculoId
                                )
                        );


                    const contenido = [
                        gasto.descripcion,
                        gasto.proveedor,
                        gasto.numeroComprobante,
                        gasto.categoriaId,
                        vehiculo?.marca,
                        vehiculo?.modelo,
                        vehiculo?.placa
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
            gastos,
            vehiculos,
            busqueda,
            filtroEstado
        ]);


    const resumen =
        useMemo(() => {

            const activos =
                gastos.filter(
                    (g) =>
                        g.activo !== false
                );


            return {

                total:
                    gastos.length,

                activos:
                    activos.length,

                inactivos:
                    gastos.filter(
                        (g) =>
                            g.activo === false
                    ).length,

                monto:
                    activos.reduce(
                        (suma, gasto) =>
                            suma +
                            Number(
                                gasto.monto || 0
                            ),
                        0
                    )
            };

        }, [gastos]);


    const obtenerNombreVehiculo = (
        id
    ) => {

        const vehiculo =
            vehiculos.find(
                (item) =>
                    String(item.id) ===
                    String(id)
            );


        if (!vehiculo) {

            return `Vehículo #${id}`;
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


    return {
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
    };
}