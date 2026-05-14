/**
 * OnboardingScreen
 *
 * Tutorial inicial de 4 pasos. Se muestra la primera vez que se abre la app
 * (la decisión la toma App.js leyendo `hasSeenOnboarding` desde SQLite),
 * y también se puede reabrir desde el botón "?" en la pantalla principal.
 *
 * El primer slide usa la imagen de bienvenida del logo Mitimiti
 * (assets/onboarding-welcome.png). Los siguientes 3 usan emojis genéricos.
 */
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { setSetting } from '../data/repository';
import { spacing, radius, typography, shadow } from '../theme';

const { width } = Dimensions.get('window');

// Imágenes de marca
const WELCOME_IMG = require('../../assets/onboarding-welcome.png');

const SLIDES = [
  {
    id: 'welcome',
    kind: 'image',
    image: WELCOME_IMG,
    subtitle:
      'Mitimiti te ayuda a llevar las cuentas claras "por partes iguales" en viajes y salidas con amigos.',
    bg: '#FAF6EB',
    titleColor: '#0F1628',
    subtitleColor: '#4B5563',
    btnBg: '#10B981',
    btnTextColor: '#FFFFFF',
  },
  {
    id: 'create',
    kind: 'emoji',
    emoji: '👥',
    title: 'Crea tu primer grupo',
    subtitle:
      'Toca "+ Nuevo viaje" y agrega los nombres de las personas que comparten gastos.\n\nMínimo 2, sin límite máximo.',
    bg: '#10B981',
    bgSoft: '#D1FAE5',
    titleColor: '#FFFFFF',
    subtitleColor: 'rgba(255,255,255,0.92)',
    btnBg: '#FFFFFF',
    btnTextColor: '#059669',
  },
  {
    id: 'expenses',
    kind: 'emoji',
    emoji: '💸',
    title: 'Registra cada gasto',
    subtitle:
      'Anota el monto, quién pagó y una descripción opcional.\n\nMitimiti divide el gasto entre todos automáticamente.',
    bg: '#7C3AED',
    bgSoft: '#EDE9FE',
    titleColor: '#FFFFFF',
    subtitleColor: 'rgba(255,255,255,0.92)',
    btnBg: '#FFFFFF',
    btnTextColor: '#6D28D9',
  },
  {
    id: 'settle',
    kind: 'emoji',
    emoji: '🤝',
    title: 'Mira quién le debe a quién',
    subtitle:
      'Toca "Ver resumen" y obtienes el cálculo final con el mínimo de transferencias para saldar.\n\n¡Listo! Sin matemáticas mentales.',
    bg: '#0F1628',
    bgSoft: '#1F2937',
    titleColor: '#FFFFFF',
    subtitleColor: 'rgba(255,255,255,0.85)',
    btnBg: '#10B981',
    btnTextColor: '#FFFFFF',
  },
];

export default function OnboardingScreen({ onDone }) {
  const [index, setIndex] = useState(0);
  const ref = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const finish = async () => {
    try {
      await setSetting('hasSeenOnboarding', '1');
    } catch (e) {
      console.warn('No se pudo guardar setting de onboarding:', e);
    }
    onDone?.();
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      ref.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      finish();
    }
  };

  const current = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: current.bg }]}>
      <StatusBar
        barStyle={current.bg === '#FAF6EB' ? 'dark-content' : 'light-content'}
        backgroundColor={current.bg}
      />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable onPress={finish} hitSlop={12}>
            <Text style={[styles.skipText, { color: current.subtitleColor }]}>
              Saltar →
            </Text>
          </Pressable>
        </View>

        <Animated.FlatList
          ref={ref}
          data={SLIDES}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.x / width);
            setIndex(i);
          }}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}>
              {item.kind === 'image' ? (
                <Image
                  source={item.image}
                  style={styles.welcomeImage}
                  resizeMode="contain"
                />
              ) : (
                <View
                  style={[styles.emojiCircle, { backgroundColor: item.bgSoft }]}
                >
                  <Text style={styles.emoji}>{item.emoji}</Text>
                </View>
              )}

              {item.title && (
                <Text style={[styles.title, { color: item.titleColor }]}>
                  {item.title}
                </Text>
              )}

              <Text style={[styles.subtitle, { color: item.subtitleColor }]}>
                {item.subtitle}
              </Text>
            </View>
          )}
        />

        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            const dotColor =
              current.bg === '#FAF6EB' ? '#0F1628' : '#FFFFFF';
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  { width: dotWidth, opacity, backgroundColor: dotColor },
                ]}
              />
            );
          })}
        </View>

        <Pressable
          onPress={next}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: current.btnBg },
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={[styles.ctaText, { color: current.btnTextColor }]}>
            {isLast ? '¡Empezar!' : 'Siguiente'}
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  skipText: { ...typography.bodyStrong },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  // Imagen del logo en el primer slide
  welcomeImage: {
    width: width * 0.85,
    height: width * 0.85,
    maxWidth: 360,
    maxHeight: 360,
    marginBottom: spacing.lg,
  },

  // Hero genérico (slides 2-4) con emoji
  emojiCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    ...shadow.cardLg,
  },
  emoji: { fontSize: 80, lineHeight: 96 },

  title: {
    ...typography.hero,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  cta: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    ...shadow.cardLg,
  },
  ctaText: {
    ...typography.subtitle,
    fontSize: 16,
  },
});
