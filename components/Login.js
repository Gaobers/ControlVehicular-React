import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

export default function LoginScreen({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordar, setRecordar] = useState(false);

  const iniciarSesion = () => {
    if (!correo.trim() || !contrasena) {
      Alert.alert(
        "Campos obligatorios",
        "Por favor, ingresa tu correo y contraseña."
      );
      return;
    }

    const correoCorrecto =
      correo.trim().toLowerCase() === "admin@controlvehicular.com";

    const contrasenaCorrecta = contrasena === "CV2026Admin";

    if (correoCorrecto && contrasenaCorrecta) {
      Alert.alert(
        "Acceso correcto",
        "Bienvenido al Sistema de Control Vehicular.",
        [
          {
            text: "Continuar",
            onPress: () => {
              if (onLogin) {
                onLogin({ correo, recordar });
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Acceso denegado",
        "El correo electrónico o la contraseña son incorrectos."
      );
      setContrasena("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>CV</Text>
          </View>

          <Text style={styles.title}>CONTROL VEHICULAR</Text>
          <Text style={styles.subtitle}>Acceso al sistema</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar sesión</Text>
          <Text style={styles.description}>
            Ingresa tus credenciales para continuar.
          </Text>

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu correo"
            placeholderTextColor="#9CA3AF"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#9CA3AF"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRecordar(!recordar)}
          >
            <View
              style={[
                styles.checkbox,
                recordar && styles.checkboxSelected,
              ]}
            >
              {recordar && <Text style={styles.checkmark}>✓</Text>}
            </View>

            <Text style={styles.rememberText}>Recordar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={iniciarSesion}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>INGRESAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Recuperar contraseña",
                "Comunícate con el administrador del sistema para recuperar tu acceso."
              )
            }
          >
            <Text style={styles.forgotText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          <View style={styles.securityBox}>
            <Text style={styles.securityTitle}>Acceso seguro</Text>
            <Text style={styles.securityText}>
              Ingresa tus credenciales autorizadas para acceder al sistema
              de administración vehicular.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          CONTROL VEHICULAR © 2026
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1F3A",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 22,
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  logo: {
    width: 70,
    height: 70,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  logoText: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#0B1F3A",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    color: "#B8C7D9",
    fontSize: 14,
    marginTop: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#0B1F3A",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 25,
  },
  label: {
    color: "#1E293B",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#D9E2EF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
    marginBottom: 18,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    borderRadius: 5,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  checkmark: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  rememberText: {
    color: "#475569",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  forgotText: {
    color: "#2563EB",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
    fontSize: 14,
  },
  securityBox: {
    backgroundColor: "#EEF4FA",
    borderRadius: 12,
    padding: 15,
    marginTop: 25,
  },
  securityTitle: {
    color: "#0B1F3A",
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 14,
  },
  securityText: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    textAlign: "center",
    color: "#AAB8CA",
    fontSize: 12,
    marginTop: 25,
  },
});