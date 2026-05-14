/**
 * AppNavigator
 *
 * Stack navigator con las 5 pantallas principales:
 *   Groups            → lista de grupos (home)
 *   CreateGroup       → formulario de creación
 *   GroupDetail       → gastos del grupo + acceso al resumen
 *   AddExpense        → formulario de gasto (crea o edita)
 *   Summary           → resumen final con balances y deudas
 *
 * `onOpenTutorial` se propaga a la pantalla principal, que muestra un
 * botón "?" en el header para reabrir el onboarding.
 */
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GroupListScreen from '../screens/GroupListScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import GroupDetailScreen from '../screens/GroupDetailScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import SummaryScreen from '../screens/SummaryScreen';
import { colors, spacing } from '../theme';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '700' },
  headerBackTitleVisible: false,
  contentStyle: { backgroundColor: colors.background },
};

export default function AppNavigator({ onOpenTutorial }) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Groups" screenOptions={screenOptions}>
        <Stack.Screen
          name="Groups"
          options={{
            title: 'Mis viajes',
            headerRight: () => (
              <Pressable
                onPress={onOpenTutorial}
                hitSlop={12}
                style={({ pressed }) => [styles.helpBtn, pressed && { opacity: 0.7 }]}
              >
                <Text style={styles.helpBtnText}>?</Text>
              </Pressable>
            ),
          }}
        >
          {(props) => <GroupListScreen {...props} onOpenTutorial={onOpenTutorial} />}
        </Stack.Screen>
        <Stack.Screen
          name="CreateGroup"
          component={CreateGroupScreen}
          options={{ title: 'Nuevo viaje' }}
        />
        <Stack.Screen
          name="GroupDetail"
          component={GroupDetailScreen}
          options={({ route }) => ({ title: route.params?.groupName ?? 'Viaje' })}
        />
        <Stack.Screen
          name="AddExpense"
          component={AddExpenseScreen}
          options={({ route }) => ({
            title: route.params?.expense ? 'Editar gasto' : 'Nuevo gasto',
          })}
        />
        <Stack.Screen
          name="Summary"
          component={SummaryScreen}
          options={{ title: 'Resumen final' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  helpBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: spacing.xs,
  },
  helpBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 18,
  },
});
