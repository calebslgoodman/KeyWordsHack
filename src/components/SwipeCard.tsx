import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors } from '../constants/colors';
import { Meal, SwipeDirection } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

interface SwipeCardProps {
  meal: Meal;
  onSwipe: (direction: SwipeDirection) => void;
  onTap: () => void;
  isTop: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ meal, onSwipe, onTap, isTop }) => {
  const position = useRef(new Animated.ValueXY()).current;

  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const maybeOpacity = position.y.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const swipeOut = (direction: SwipeDirection) => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : direction === 'left' ? -SCREEN_WIDTH * 1.5 : 0;
    const y = direction === 'maybe' ? -SCREEN_WIDTH : 0;

    Animated.timing(position, {
      toValue: { x, y },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true,
    }).start(() => {
      onSwipe(direction);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeOut('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeOut('left');
        } else if (gesture.dy < -100) {
          swipeOut('maybe');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate: rotation },
    ],
  };

  if (!isTop) {
    return (
      <View style={[styles.card, styles.cardBack]}>
        <Image source={{ uri: meal.image_url }} style={styles.image} />
      </View>
    );
  }

  return (
    <Animated.View
      style={[styles.card, cardStyle]}
      {...panResponder.panHandlers}
    >
      <Image source={{ uri: meal.image_url }} style={styles.image} />

      {/* Overlays */}
      <Animated.View style={[styles.overlay, styles.likeOverlay, { opacity: likeOpacity }]}>
        <Text style={styles.overlayText}>YUM!</Text>
      </Animated.View>

      <Animated.View style={[styles.overlay, styles.nopeOverlay, { opacity: nopeOpacity }]}>
        <Text style={styles.overlayText}>NOPE</Text>
      </Animated.View>

      <Animated.View style={[styles.overlay, styles.maybeOverlay, { opacity: maybeOpacity }]}>
        <Text style={styles.overlayText}>MAYBE</Text>
      </Animated.View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <View style={styles.mealTypeBadge}>
          <Text style={styles.mealTypeText}>{meal.meal_type.toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{meal.name}</Text>
        <Text style={styles.cuisine}>{meal.cuisine}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>🔥 {meal.calories} cal</Text>
          <Text style={styles.metaText}>⏱️ {meal.cook_time_minutes} min</Text>
        </View>
        <TouchableOpacity style={styles.recipeButton} onPress={onTap} activeOpacity={0.8}>
          <Text style={styles.recipeButtonText}>View Recipe</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    height: SCREEN_WIDTH * 1.3,
    borderRadius: 20,
    backgroundColor: colors.cardBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  cardBack: {
    transform: [{ scale: 0.95 }],
  },
  image: {
    width: '100%',
    height: '65%',
    backgroundColor: colors.inputBg,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 4,
  },
  likeOverlay: {
    right: 20,
    borderColor: colors.swipeRight,
    transform: [{ rotate: '15deg' }],
  },
  nopeOverlay: {
    left: 20,
    borderColor: colors.swipeLeft,
    transform: [{ rotate: '-15deg' }],
  },
  maybeOverlay: {
    alignSelf: 'center',
    borderColor: colors.swipeMaybe,
  },
  overlayText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  infoContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  mealTypeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  mealTypeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  recipeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  recipeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SwipeCard;
