import React from "react";

import {
    fireEvent,
    render,
    screen
} from "@testing-library/react-native";

import RecordatorioFormulario from "../RecordatorioFormulario";


const vehiculos = [
    {
        id: 1,
        marca: "Toyota",
        modelo: "Corolla",
        placa: "P-111",
        estado: "ACTIVO"
    },
    {
        id: 2,
        marca: "Honda",
        modelo: "Civic",
        placa: "P-222",
        estado: "ARCHIVADO"
    }
];


const mantenimientos = [
    {
        id: 101,
        servicio: "Cambio de aceite",
        vehiculoId: 1,
        estado: "PENDIENTE"
    },
    {
        id: 102,
        servicio: "Ajuste de frenos",
        vehiculoId: 2,
        estado: "PENDIENTE"
    },
    {
        id: 103,
        servicio: "Inspección completada",
        vehiculoId: 1,
        estado: "REALIZADO"
    },
    {
        id: 104,
        servicio: "Cambio de filtro",
        vehiculoId: 1,
        estado: "PENDIENTE"
    }
];


function renderFormulario(props = {}) {
    return render(
        <RecordatorioFormulario
            mantenimientos={mantenimientos}
            vehiculos={vehiculos}
            recordatorios={[
                {
                    id: 900,
                    mantenimientoId: 104,
                    activo: true
                }
            ]}
            onGuardar={() => {}}
            onCancelar={() => {}}
            {...props}
        />
    );
}


function seleccionarMantenimiento(nombre = "Cambio de aceite") {
    fireEvent.press(
        screen.getByText("Seleccionar mantenimiento")
    );

    fireEvent.press(
        screen.getByText(nombre)
    );
}


describe("RecordatorioFormulario", () => {

    test("renders defaults and filters unavailable maintenance options", () => {

        renderFormulario();

        expect(
            screen.getByText("Mantenimiento asociado")
        ).toBeTruthy();

        expect(
            screen.getByDisplayValue("7")
        ).toBeTruthy();

        expect(
            screen.getByDisplayValue("500")
        ).toBeTruthy();

        fireEvent.press(
            screen.getByText("Seleccionar mantenimiento")
        );

        expect(
            screen.getByText("Cambio de aceite")
        ).toBeTruthy();

        expect(
            screen.queryByText("Ajuste de frenos")
        ).toBeNull();

        expect(
            screen.queryByText("Inspección completada")
        ).toBeNull();

        expect(
            screen.queryByText("Cambio de filtro")
        ).toBeNull();
    });


    test("requires a maintenance selection", () => {

        const onGuardar = jest.fn();

        renderFormulario({
            mantenimientos: [],
            onGuardar
        });

        fireEvent.press(
            screen.getByText("CREAR RECORDATORIO")
        );

        expect(
            screen.getByText("Selecciona un mantenimiento.")
        ).toBeTruthy();

        expect(onGuardar).not.toHaveBeenCalled();
    });


    test("rejects malformed kilometer anticipation", () => {

        const onGuardar = jest.fn();

        renderFormulario({ onGuardar });

        seleccionarMantenimiento();

        fireEvent.changeText(
            screen.getByDisplayValue("500"),
            "1..2"
        );

        fireEvent.press(
            screen.getByText("CREAR RECORDATORIO")
        );

        expect(
            screen.getByText("Los kilómetros de anticipación deben ser válidos.")
        ).toBeTruthy();

        expect(onGuardar).not.toHaveBeenCalled();
    });


    test("creates a reminder with the selected maintenance and numeric values", () => {

        const onGuardar = jest.fn();

        renderFormulario({ onGuardar });

        seleccionarMantenimiento();

        fireEvent.changeText(
            screen.getByDisplayValue("7"),
            "3"
        );

        fireEvent.changeText(
            screen.getByDisplayValue("500"),
            "250.5"
        );

        fireEvent.press(
            screen.getByText("CREAR RECORDATORIO")
        );

        expect(onGuardar).toHaveBeenCalledWith({
            mantenimientoId: 101,
            diasAnticipacion: 3,
            kilometrosAnticipacion: 250.5
        });
    });


    test("prefills and saves an existing reminder even when its current maintenance is unavailable for new reminders", () => {

        const onGuardar = jest.fn();
        const recordatorio = {
            id: 901,
            mantenimientoId: 102,
            diasAnticipacion: 10,
            kilometrosAnticipacion: 750,
            activo: true
        };

        renderFormulario({ recordatorio, onGuardar });

        expect(
            screen.getAllByText("Ajuste de frenos")[0]
        ).toBeTruthy();

        expect(
            screen.getByDisplayValue("10")
        ).toBeTruthy();

        expect(
            screen.getByDisplayValue("750")
        ).toBeTruthy();

        fireEvent.press(
            screen.getByText("GUARDAR CAMBIOS")
        );

        expect(onGuardar).toHaveBeenCalledWith({
            mantenimientoId: 102,
            diasAnticipacion: 10,
            kilometrosAnticipacion: 750
        });
    });


    test("shows external errors, keeps an empty option list empty, and calls cancel", () => {

        const onCancelar = jest.fn();

        renderFormulario({
            mantenimientos: [],
            errorExterno: "No se pudo guardar el recordatorio.",
            onCancelar
        });

        expect(
            screen.getByText("No se pudo guardar el recordatorio.")
        ).toBeTruthy();

        fireEvent.press(
            screen.getByText("Seleccionar mantenimiento")
        );

        expect(
            screen.queryByText("Cambio de aceite")
        ).toBeNull();

        fireEvent.press(
            screen.getByText("Cancelar")
        );

        expect(onCancelar).toHaveBeenCalledTimes(1);
    });
});