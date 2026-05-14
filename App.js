/**
 * Punto de entrada de la aplicación.
 *
 * Aquí inicializamos:
 *  - El esquema de base de datos SQLite (tablas si no existen).
 *  - Decidimos si mostrar el tutorial de bienvenida (primera apertura) o el
 *    navegador principal (siguientes aperturas).
 *  - El SafeAreaProvider para respetar notch/status-bar en cada plataforma.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { initDatabase } from './src/data/database';
import { getSetting } from './src/data/repository';
import { colors } from './src/theme';

export default function App() {
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        await initDatabase();
        const seen = await getSetting('hasSeenOnboarding');
        setShowOnboarding(seen !== '1');
        setReady(true);
      } catch (err) {
        console.error('Error inicializando app:', err);
        setError(err?.message ?? 'Error desconocido');
      }
    })();
  }, []);

  // Permite reabrir el tutorial desde la pantalla principal (botón "?").
  const openOnboarding = useCallback(() => setShowOnboarding(true), []);
  const closeOnboarding = useCallback(() => setShowOnboarding(false), []);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Algo salió mal</Text>
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
      {showOnboarding ? (
        <OnboardingScreen onDone={closeOnboarding} />
      ) : (
        <AppNavigator onOpenTutorial={openOnboarding} />
      )}
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
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.danger,
    marginBottom: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});
