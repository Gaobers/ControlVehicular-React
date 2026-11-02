import React from "react";

import {
    fireEvent,
    render,
    screen
} from "@testing-library/react-native";

import ModuleCard from "../ModuleCard";


describe("ModuleCard", () => {

    test("renders the content provided through its props", () => {

        render(
            <ModuleCard
                icon="VH"
                title="Gestión de Vehículos"
                description="Consulta los vehículos registrados."
                statistic="3 vehículos registrados"
                actionText="Gestionar vehículos"
                onPress={() => {}}
            />
        );

        expect(
            screen.getByText("VH")
        ).toBeTruthy();

        expect(
            screen.getByText("Gestión de Vehículos")
        ).toBeTruthy();

        expect(
            screen.getByText("Consulta los vehículos registrados.")
        ).toBeTruthy();

        expect(
            screen.getByText("3 vehículos registrados")
        ).toBeTruthy();

        expect(
            screen.getByText("Gestionar vehículos")
        ).toBeTruthy();
    });


    test("calls the primary action when pressed", () => {

        const onPress = jest.fn();

        render(
            <ModuleCard
                icon="VH"
                title="Gestión de Vehículos"
                description="Consulta los vehículos registrados."
                actionText="Gestionar vehículos"
                onPress={onPress}
            />
        );

        fireEvent.press(
            screen.getByText("Gestionar vehículos")
        );

        expect(onPress).toHaveBeenCalledTimes(1);
    });


    test("renders and calls the optional secondary action", () => {

        const onSecondaryPress = jest.fn();

        render(
            <ModuleCard
                icon="VH"
                title="Gestión de Vehículos"
                description="Consulta los vehículos registrados."
                actionText="Gestionar vehículos"
                secondaryText="Ver resumen"
                onPress={() => {}}
                onSecondaryPress={onSecondaryPress}
            />
        );

        fireEvent.press(
            screen.getByText("Ver resumen")
        );

        expect(onSecondaryPress).toHaveBeenCalledTimes(1);
    });
});