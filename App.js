import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

// Importar las pantallas
import WelcomeScreen from "./components/Bienvenida";
import LoginScreen from "./components/Login";
import VehiculosScreen from "./components/Vehiculos";

export default function App() {
  const [pantalla, setPantalla] = useState("bienvenida");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {pantalla === "bienvenida" ? (
        <WelcomeScreen
          onContinue={() => setPantalla("login")}
        />
      ) : pantalla === "login" ? (
        <LoginScreen
          onLogin={() => setPantalla("vehiculos")}
        />
      ) : (
        <VehiculosScreen />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1F3A",
  },
});