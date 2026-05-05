/**
 * Punto de entrada de la aplicación.
 *
 * Aquí inicializamos:
 *  - El esquema de base de datos SQLite (tablas si no existen).
 *  - El navegador raíz que contiene todas las pantallas.
 *  - El SafeAreaProvider para respetar notch/status-bar en cada plataforma.
 */
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/data/database';
import { colors } from './src/theme';

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Crea las tablas de SQLite la primera vez que se abre la app.
    initDatabase()
      .then(() => setReady(true))
      .catch((err) => {
        console.error('Error inicializando DB:', err);
        setError(err?.message ?? 'Error desconocido');
      });
  }, []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No se pudo iniciar la base de datos:</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
