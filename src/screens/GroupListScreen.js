/**
 * GroupListScreen
 *
 * Pantalla principal: lista de grupos guardados localmente.
 * - Tap en un grupo  → abre el detalle.
 * - Long-press        → ofrece eliminarlo.
 * - FAB inferior     → crea un grupo nuevo.
 * - Header "?"       → reabre el tutorial.
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

export default function GroupListScreen({ navigation, onOpenTutorial }) {
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

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const confirmDelete = (group) => {
    Alert.alert(
      'Eliminar viaje',
      'Seguro que quieres eliminar "' + group.name + '"? Se borrarán también sus gastos.',
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
          <RefreshControl
            refreshing={loading}
            onRefresh={load}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          groups.length > 0 ? (
            <Text style={styles.sectionLabel}>
              {groups.length} viaje{groups.length === 1 ? '' : 's'} guardado{groups.length === 1 ? '' : 's'}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🌴</Text>
              <Text style={styles.emptyTitle}>Aún no hay viajes</Text>
              <Text style={styles.emptyText}>
                Toca el botón verde abajo para crear tu primer grupo y comenzar a registrar gastos compartidos.
              </Text>
              {onOpenTutorial && (
                <Pressable
                  onPress={onOpenTutorial}
                  style={({ pressed }) => [
                    styles.emptyTutorialBtn,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={styles.emptyTutorialText}>📖 Ver tutorial otra vez</Text>
                </Pressable>
              )}
            </View>
          )
        }
      />

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
        ]}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <Text style={styles.fabPlus}>+</Text>
        <Text style={styles.fabText}>Nuevo viaje</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: {
    padding: spacing.lg,
    paddingBottom: 110,
    flexGrow: 1,
  },
  sectionLabel: {
    ...typography.micro,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: { fontSize: 72, lineHeight: 88, marginBottom: spacing.lg },
  emptyTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyTutorialBtn: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySofter,
  },
  emptyTutorialText: {
    ...typography.bodyStrong,
    color: colors.primaryDark,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.floating,
  },
  fabPlus: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginRight: 8,
    lineHeight: 22,
  },
  fabText: {
    color: '#FFFFFF',
    ...typography.subtitle,
    fontSize: 16,
  },
});
