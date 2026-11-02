import React from "react";

import {
    fireEvent,
    render,
    screen
} from "@testing-library/react-native";

import GastoFormulario from "../GastoFormulario";


jest.mock("@react-native-community/datetimepicker", () => {
    const React = require("react");
    const { Pressable, Text } = require("react-native");

    return function MockDateTimePicker({ onChange }) {
        return React.createElement(
            Pressable,
            {
                onPress: () => onChange(
                    { type: "set" },
                    new Date(2025, 2, 14)
                )
            },
            React.createElement(Text, null, "Confirmar fecha")
        );
    };
});


const vehiculos = [
    {
        id: 12,
        marca: "Toyota",
        modelo: "Corolla",
        placa: "ABC-123"
    }
];


function renderFormulario(props = {}) {
    return render(
        <GastoFormulario
            visible
            gasto={null}
            vehiculos={vehiculos}
            guardando={false}
            onCerrar={() => {}}
            onGuardar={() => {}}
            {...props}
        />
    );
}


function seleccionarVehiculo() {
    fireEvent.press(
        screen.getByText("Seleccionar vehículo")
    );

    fireEvent.press(
        screen.getByText("Toyota Corolla (ABC-123)")
    );
}


function seleccionarFecha() {
    fireEvent.press(
        screen.getByText("Seleccionar fecha")
    );

    fireEvent.press(
        screen.getByText("Confirmar fecha")
    );
}


describe("GastoFormulario", () => {

    test("renders the new expense fields and validates required values", () => {

        const onGuardar = jest.fn();

        renderFormulario({ onGuardar });

        expect(
            screen.getAllByText("Registrar gasto")[0]
        ).toBeTruthy();

        expect(
            screen.getByPlaceholderText("Ej. 1")
        ).toBeTruthy();

        expect(
            screen.getByPlaceholderText("0.00")
        ).toBeTruthy();

        expect(
            screen.getByText("Seleccionar fecha")
        ).toBeTruthy();

        fireEvent.press(
            screen.getAllByText("Registrar gasto")[1]
        );

        expect(
            screen.getByText("Completa los campos obligatorios.")
        ).toBeTruthy();

        expect(onGuardar).not.toHaveBeenCalled();
    });


    test("selects a vehicle and date and sends the normalized expense payload", () => {

        const onGuardar = jest.fn();

        renderFormulario({ onGuardar });

        seleccionarVehiculo();

        fireEvent.changeText(
            screen.getByPlaceholderText("Ej. 1"),
            "3"
        );

        fireEvent.changeText(
            screen.getByPlaceholderText("0.00"),
            "12,50"
        );

        seleccionarFecha();

        fireEvent.changeText(
            screen.getByPlaceholderText("Ej. Taller Central Toyota"),
            " Taller Central "
        );

        fireEvent.changeText(
            screen.getByPlaceholderText("Agrega detalles sobre el gasto"),
            " Cambio de aceite "
        );

        fireEvent.press(
            screen.getAllByText("Registrar gasto")[1]
        );

        expect(onGuardar).toHaveBeenCalledWith({
            vehiculoId: 12,
            categoriaId: 3,
            monto: 12.5,
            moneda: "USD",
            fecha: "2025-03-14",
            descripcion: "Cambio de aceite",
            numeroComprobante: null,
            proveedor: "Taller Central"
        });
    });


    test("rejects a zero amount", () => {

        const onGuardar = jest.fn();

        renderFormulario({ onGuardar });

        seleccionarVehiculo();

        fireEvent.changeText(
            screen.getByPlaceholderText("Ej. 1"),
            "3"
        );

        fireEvent.changeText(
            screen.getByPlaceholderText("0.00"),
            "0"
        );

        seleccionarFecha();

        fireEvent.press(
            screen.getAllByText("Registrar gasto")[1]
        );

        expect(
            screen.getByText("El monto debe ser mayor que cero.")
        ).toBeTruthy();

        expect(onGuardar).not.toHaveBeenCalled();
    });


    test("prefills and updates an existing expense", () => {

        const onGuardar = jest.fn();
        const gasto = {
            vehiculoId: 12,
            categoriaId: 4,
            monto: 45.75,
            moneda: "eur",
            fecha: "2024-12-05",
            descripcion: "Servicio previo",
            numeroComprobante: "F-100",
            proveedor: "Taller Norte",
            activo: false
        };

        renderFormulario({ gasto, onGuardar });

        expect(
            screen.getByText("Editar gasto")
        ).toBeTruthy();

        expect(
            screen.getByDisplayValue("45.75")
        ).toBeTruthy();

        expect(
            screen.getByText("2024-12-05")
        ).toBeTruthy();

        fireEvent.changeText(
            screen.getByPlaceholderText("Ej. Taller Central Toyota"),
            " Taller Sur "
        );

        fireEvent.press(
            screen.getByText("Guardar cambios")
        );

        expect(onGuardar).toHaveBeenCalledWith({
            vehiculoId: 12,
            categoriaId: 4,
            monto: 45.75,
            moneda: "EUR",
            fecha: "2024-12-05",
            descripcion: "Servicio previo",
            numeroComprobante: "F-100",
            proveedor: "Taller Sur",
            activo: false
        });
    });


    test("calls the close callback when cancelled", () => {

        const onCerrar = jest.fn();

        renderFormulario({ onCerrar });

        fireEvent.press(
            screen.getByText("← Cancelar")
        );

        expect(onCerrar).toHaveBeenCalledTimes(1);
    });
});