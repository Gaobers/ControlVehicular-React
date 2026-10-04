import React, {
    useMemo,
    useState
} from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

import {
    calcularFechaRecordatorio,
    obtenerEstadoRecordatorio,
    obtenerNombreVehiculo
} from "./recordatorioUtils";


const DIAS = [
    "L",
    "M",
    "M",
    "J",
    "V",
    "S",
    "D"
];


const MESES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];


export default function RecordatorioCalendario({

    recordatorios,

    mantenimientos,

    vehiculos,

    onDetalle

}) {

    const hoy =
        new Date();


    const [
        fechaActual,
        setFechaActual
    ] = useState(
        new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            1
        )
    );


    const [
        diaSeleccionado,
        setDiaSeleccionado
    ] = useState(
        hoy.getDate()
    );


    const anio =
        fechaActual.getFullYear();


    const mes =
        fechaActual.getMonth();


    const eventos =
        useMemo(() => {

            return recordatorios
                .map(
                    (recordatorio) => {

                        const mantenimiento =
                            mantenimientos.find(
                                (item) =>
                                    String(
                                        item.id
                                    ) ===
                                    String(
                                        recordatorio
                                            .mantenimientoId
                                    )
                            );


                        const vehiculo =
                            mantenimiento
                                ? vehiculos.find(
                                    (item) =>
                                        String(
                                            item.id
                                        ) ===
                                        String(
                                            mantenimiento
                                                .vehiculoId
                                        )
                                )
                                : null;


                        const fecha =
                            calcularFechaRecordatorio(
                                mantenimiento,
                                recordatorio
                            );


                        return {
                            recordatorio,
                            mantenimiento,
                            vehiculo,
                            fecha
                        };
                    }
                )
                .filter(
                    (item) =>
                        item.fecha
                );

        }, [
            recordatorios,
            mantenimientos,
            vehiculos
        ]);


    const primerDia =
        new Date(
            anio,
            mes,
            1
        );


    const ultimoDia =
        new Date(
            anio,
            mes + 1,
            0
        );


    let offset =
        primerDia.getDay() - 1;


    if (offset < 0) {
        offset = 6;
    }


    const celdas = [];


    for (
        let i = 0;
        i < offset;
        i++
    ) {

        celdas.push(null);
    }


    for (
        let dia = 1;
        dia <= ultimoDia.getDate();
        dia++
    ) {

        celdas.push(dia);
    }


    const eventosDia =
        eventos.filter(
            (item) =>
                item.fecha.getFullYear() ===
                anio &&

                item.fecha.getMonth() ===
                mes &&

                item.fecha.getDate() ===
                diaSeleccionado
        );


    const tieneEvento = (
        dia
    ) => {

        return eventos.some(
            (item) =>
                item.fecha.getFullYear() ===
                anio &&

                item.fecha.getMonth() ===
                mes &&

                item.fecha.getDate() ===
                dia
        );
    };


    const moverMes = (
        cantidad
    ) => {

        const nueva =
            new Date(
                anio,
                mes + cantidad,
                1
            );


        setFechaActual(
            nueva
        );

        setDiaSeleccionado(
            1
        );
    };


    return (

        <View>

            <View style={styles.calendarCard}>

                <View style={styles.header}>

                    <Pressable
                        style={styles.arrowButton}

                        onPress={() =>
                            moverMes(-1)
                        }
                    >
                        <Text>‹</Text>
                    </Pressable>


                    <Text style={styles.month}>
                        {MESES[mes]} {anio}
                    </Text>


                    <Pressable
                        style={styles.arrowButton}

                        onPress={() =>
                            moverMes(1)
                        }
                    >
                        <Text>›</Text>
                    </Pressable>

                </View>


                <View style={styles.week}>

                    {DIAS.map(
                        (
                            dia,
                            index
                        ) => (

                            <Text
                                key={
                                    `${dia}-${index}`
                                }

                                style={styles.weekDay}
                            >
                                {dia}
                            </Text>
                        )
                    )}

                </View>


                <View style={styles.grid}>

                    {celdas.map(
                        (
                            dia,
                            index
                        ) => {

                            if (!dia) {

                                return (
                                    <View
                                        key={
                                            `vacio-${index}`
                                        }

                                        style={
                                            styles.dayCell
                                        }
                                    />
                                );
                            }


                            const seleccionado =
                                dia ===
                                diaSeleccionado;


                            const esHoy =
                                dia ===
                                hoy.getDate() &&

                                mes ===
                                hoy.getMonth() &&

                                anio ===
                                hoy.getFullYear();


                            return (

                                <Pressable
                                    key={
                                        dia
                                    }

                                    style={
                                        styles.dayCell
                                    }

                                    onPress={() =>
                                        setDiaSeleccionado(
                                            dia
                                        )
                                    }
                                >

                                    <View
                                        style={[
                                            styles.dayCircle,

                                            seleccionado &&
                                            styles.selectedDay,

                                            !seleccionado &&
                                            esHoy &&
                                            styles.today
                                        ]}
                                    >

                                        <Text
                                            style={[
                                                styles.dayText,

                                                seleccionado &&
                                                styles.selectedDayText
                                            ]}
                                        >
                                            {dia}
                                        </Text>

                                    </View>


                                    {tieneEvento(
                                        dia
                                    ) && (

                                        <View
                                            style={
                                                styles.eventDot
                                            }
                                        />
                                    )}

                                </Pressable>
                            );
                        }
                    )}

                </View>

            </View>


            <Text style={styles.eventsTitle}>
                Eventos del {diaSeleccionado} de {MESES[mes]}
            </Text>


            {eventosDia.length === 0 ? (

                <View style={styles.empty}>

                    <Text style={styles.emptyText}>
                        No hay recordatorios para esta fecha.
                    </Text>

                </View>

            ) : (

                eventosDia.map(
                    (item) => {

                        const estado =
                            obtenerEstadoRecordatorio(
                                item.recordatorio,
                                item.mantenimiento,
                                item.vehiculo
                            );


                        return (

                            <Pressable
                                key={
                                    item.recordatorio.id
                                }

                                style={styles.eventCard}

                                onPress={() =>
                                    onDetalle?.(
                                        item.recordatorio
                                    )
                                }
                            >

                                <View
                                    style={[
                                        styles.eventBadge,
                                        {
                                            backgroundColor:
                                                estado.fondo
                                        }
                                    ]}
                                >

                                    <Text
                                        style={[
                                            styles.eventBadgeText,
                                            {
                                                color:
                                                    estado.color
                                            }
                                        ]}
                                    >
                                        {estado.texto.toUpperCase()}
                                    </Text>

                                </View>


                                <Text style={styles.eventService}>
                                    {item.mantenimiento
                                        ?.servicio ||
                                        "Mantenimiento"}
                                </Text>


                                <Text style={styles.eventVehicle}>
                                    {obtenerNombreVehiculo(
                                        item.vehiculo
                                    )}
                                </Text>


                                <Text style={styles.eventLink}>
                                    Ver recordatorio →
                                </Text>

                            </Pressable>
                        );
                    }
                )
            )}

        </View>
    );
}


const styles = StyleSheet.create({

    calendarCard: {
        backgroundColor: "#FFFFFF",

        borderRadius: 13,

        borderWidth: 1,

        borderColor: "#E7EBF1",

        padding: 12,

        marginBottom: 15
    },


    header: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        marginBottom: 12
    },


    arrowButton: {
        width: 30,

        height: 30,

        borderRadius: 7,

        backgroundColor: "#F1F4FF",

        alignItems: "center",

        justifyContent: "center"
    },


    month: {
        color: "#172033",

        fontSize: 13,

        fontWeight: "900"
    },


    week: {
        flexDirection: "row",

        marginBottom: 4
    },


    weekDay: {
        width: "14.285%",

        textAlign: "center",

        color: "#94A3B8",

        fontSize: 7,

        fontWeight: "800"
    },


    grid: {
        flexDirection: "row",

        flexWrap: "wrap"
    },


    dayCell: {
        width: "14.285%",

        height: 43,

        alignItems: "center",

        justifyContent: "center"
    },


    dayCircle: {
        width: 28,

        height: 28,

        borderRadius: 14,

        alignItems: "center",

        justifyContent: "center"
    },


    selectedDay: {
        backgroundColor: "#073B61"
    },


    today: {
        borderWidth: 1,

        borderColor: "#073B61"
    },


    dayText: {
        color: "#334155",

        fontSize: 8,

        fontWeight: "700"
    },


    selectedDayText: {
        color: "#FFFFFF"
    },


    eventDot: {
        width: 4,

        height: 4,

        borderRadius: 2,

        backgroundColor: "#EF4444",

        marginTop: 1
    },


    eventsTitle: {
        color: "#172033",

        fontSize: 12,

        fontWeight: "900",

        marginBottom: 8
    },


    empty: {
        padding: 20,

        borderRadius: 11,

        backgroundColor: "#FFFFFF",

        borderWidth: 1,

        borderColor: "#E7EBF1"
    },


    emptyText: {
        color: "#94A3B8",

        textAlign: "center",

        fontSize: 9
    },


    eventCard: {
        backgroundColor: "#FFFFFF",

        borderRadius: 12,

        borderWidth: 1,

        borderColor: "#E7EBF1",

        padding: 12,

        marginBottom: 9
    },


    eventBadge: {
        alignSelf: "flex-start",

        paddingHorizontal: 7,

        paddingVertical: 4,

        borderRadius: 999
    },


    eventBadgeText: {
        fontSize: 7,

        fontWeight: "900"
    },


    eventService: {
        marginTop: 8,

        color: "#172033",

        fontSize: 12,

        fontWeight: "900"
    },


    eventVehicle: {
        marginTop: 3,

        color: "#64748B",

        fontSize: 8
    },


    eventLink: {
        marginTop: 10,

        color: "#2563EB",

        fontSize: 8,

        fontWeight: "800",

        textAlign: "right"
    }
});