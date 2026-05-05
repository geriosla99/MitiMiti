/**
 * AppNavigator
 *
 * Stack navigator con las 5 pantallas principales:
 *   Groups            → lista de grupos (home)
 *   CreateGroup       → formulario de creación
 *   GroupDetail       → gastos del grupo + acceso al resumen
 *   AddExpense        → formulario de gasto (crea o edita)
 *   Summary           → resumen final con balances y deudas
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GroupListScreen from '../screens/GroupListScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import GroupDetailScreen from '../screens/GroupDetailScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import SummaryScreen from '../screens/SummaryScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { fontWeight: '700' },
  headerBackTitleVisible: false,
  contentStyle: { backgroundColor: colors.background },
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Groups" screenOptions={screenOptions}>
        <Stack.Screen
          name="Groups"
          component={GroupListScreen}
          options={{ title: 'Mis viajes' }}
        />
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
