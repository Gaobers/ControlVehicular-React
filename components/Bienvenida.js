
import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export default function WelcomeScreen({ onContinue }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#14243A"
        barStyle="light-content"
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ENCABEZADO CORPORATIVO */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>CV</Text>
          </View>

          <Text style={styles.systemName}>
            CONTROL VEHICULAR
          </Text>

          <Text style={styles.systemSubtitle}>
            SISTEMA DE GESTIÓN DE VEHICULOS
          </Text>

          <View style={styles.headerLine} />
        </View>

        {/* TARJETA PRINCIPAL */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionLabel}>
              BIENVENIDO AL SISTEMA
            </Text>

            <View style={styles.status}>
              <View style={styles.statusDot} />

              <Text style={styles.statusText}>
                SISTEMA ACTIVO
              </Text>
            </View>
          </View>

          {/* IDENTIDAD DEL SISTEMA */}
          <View style={styles.vehicleIcon}>
            <View style={styles.vehicleTop}>
              <View style={styles.vehicleWindow} />
            </View>

            <View style={styles.vehicleBody}>
              <View style={styles.vehicleLight} />
              <View style={styles.vehicleLight} />
            </View>

            <View style={styles.vehicleWheels}>
              <View style={styles.wheel} />
              <View style={styles.wheel} />
            </View>
          </View>

          <Text style={styles.title}>
            Gestión y Control
            {'\n'}
            Vehicular
          </Text>

          <Text style={styles.description}>
            Plataforma destinada a la administración,
            mantenimiento y control de vehículos,
            facilitando la gestión eficiente
            de la gestión vehicular.
          </Text>

          {/* BOTÓN PRINCIPAL: ABRIR LOGIN */}
          <TouchableOpacity
            style={styles.button}
            onPress={onContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>
              INGRESAR AL SISTEMA
            </Text>

            <Text style={styles.arrow}>
              →
            </Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            Seleccione ingresar para continuar.
          </Text>
        </View>

        {/* PIE DE PÁGINA */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            CONTROL VEHICULAR
          </Text>

          <Text style={styles.footerText}>
            Sistema de administración de Gestión Vehicular
          </Text>

          <View style={styles.footerLine} />

          <Text style={styles.version}>
            Versión 1.0.0 | Fase 1
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14243A',
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 30,
  },

  // ENCABEZADO
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logo: {
    width: 76,
    height: 76,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#A9C7E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#14243A',
    letterSpacing: 1,
  },

  systemName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    textAlign: 'center',
  },

  systemSubtitle: {
    fontSize: 11,
    color: '#A9C7E5',
    letterSpacing: 2,
    marginTop: 9,
    textAlign: 'center',
  },

  headerLine: {
    width: 55,
    height: 3,
    backgroundColor: '#4C9BE8',
    marginTop: 20,
    borderRadius: 2,
  },

  // TARJETA
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 23,
    paddingVertical: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  cardHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },

  sectionLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  status: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EE',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 5,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#26945A',
    marginRight: 8,
  },

  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#247748',
    letterSpacing: 0.5,
  },

  // ICONO VEHICULAR
  vehicleIcon: {
    height: 95,
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },

  vehicleTop: {
    width: 72,
    height: 30,
    backgroundColor: '#4C9BE8',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vehicleWindow: {
    width: 48,
    height: 17,
    backgroundColor: '#14243A',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginTop: 6,
  },

  vehicleBody: {
    width: 112,
    height: 28,
    backgroundColor: '#4C9BE8',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },

  vehicleLight: {
    width: 9,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },

  vehicleWheels: {
    width: 78,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -5,
  },

  wheel: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#14243A',
    borderWidth: 3,
    borderColor: '#8CA2BC',
  },

  // TEXTOS
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#14243A',
    textAlign: 'center',
    lineHeight: 35,
    marginBottom: 18,
  },

  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: 25,
  },

  // INFORMACIÓN
  infoBox: {
    backgroundColor: '#F3F6FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoNumber: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#DCEBFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  numberText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2466A5',
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#14243A',
    marginBottom: 4,
  },

  infoDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },

  separator: {
    height: 1,
    backgroundColor: '#DCE3EB',
    marginVertical: 15,
  },

  // BOTÓN
  button: {
    height: 56,
    backgroundColor: '#1D5E9D',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    elevation: 3,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 12,
  },

  note: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 18,
  },

  // CONFIRMACIÓN
  successBox: {
    backgroundColor: '#EAF5EE',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },

  successTitle: {
    color: '#247748',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  successDescription: {
    fontSize: 14,
    color: '#526B5B',
    textAlign: 'center',
    lineHeight: 22,
  },

  // PIE DE PÁGINA
  footer: {
    alignItems: 'center',
    marginTop: 28,
  },

  footerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },

  footerText: {
    fontSize: 11,
    color: '#A9C7E5',
    marginTop: 7,
    textAlign: 'center',
  },

  footerLine: {
    width: 35,
    height: 1,
    backgroundColor: '#4C9BE8',
    marginVertical: 15,
  },

  version: {
    fontSize: 10,
    color: '#8297B4',
    textAlign: 'center',
  },
});