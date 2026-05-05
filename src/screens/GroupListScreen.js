/**
 * GroupListScreen
 *
 * Pantalla principal: lista de grupos guardados localmente.
 * - Tap en un grupo  → abre el detalle.
 * - Long-press        → ofrece eliminarlo.
 * - FAB inferior     → crea un grupo nuevo.
 *
 * Usamos useFocusEffect para refrescar la lista cada vez que la pantalla
 * vuelve al frente (por ejemplo, después de crear o borrar un grupo).
 */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GroupCard from '../components/GroupCard';
import { listGroups, deleteGroup } from '../data/repository';
import { colors, spacing, radius, typography, shadow } from '../theme';

export default function GroupListScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const rows = await listGroups();
      setGroups(rows);
    } catch (e) {
      Alert.alert('Error', e.message ?? 'No se pudieron cargar los grupos.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarga cada vez que la pantalla recibe foco.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const confirmDelete = (group) => {
    Alert.alert(
      'Eliminar viaje',
      `¿Seguro que quieres eliminar "${group.name}"? Se borrarán también sus gastos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGroup(group.id);
              load();
            } catch (e) {
              Alert.alert('Error', e.message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={groups}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <GroupCard
            group={item}
            onPress={() =>
              navigation.navigate('GroupDetail', {
                groupId: item.id,
                groupName: item.name,
              })
            }
            onLongPress={() => confirmDelete(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Aún no tienes viajes</Text>
              <Text style={styles.emptyText}>
                Crea tu primer grupo para empezar a registrar gastos.
              </Text>
            </View>
          )
        }
      />

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <Text style={styles.fabText}>+ Nuevo viaje</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: {
    padding: spacing.lg,
    paddingBottom: 100, // espacio para el FAB
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    ...shadow.card,
  },
  fabText: {
    ...typography.label,
    color: '#FFFFFF',
    fontSize: 15,
  },
});
