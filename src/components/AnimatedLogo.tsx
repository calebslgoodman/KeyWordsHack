import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const FOOD_ITEMS = ['🍕', '🍔', '🌮', '🍜', '🍣', '🥗'];

const AnimatedLogo: React.FC = () => {
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const [currentFood, setCurrentFood] = React.useState(0);
  const [swipeDirection, setSwipeDirection] = React.useState<'left' | 'right'>('right');

  useEffect(() => {
    const animate = () => {
      // Randomly decide swipe direction (70% right, 30% left)
      const nextDirection = Math.random() > 0.3 ? 'right' : 'left';
      setSwipeDirection(nextDirection);

      Animated.sequence([
        // Pause at center
        Animated.delay(1200),
        // Swipe in chosen direction
        Animated.timing(swipeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Reset instantly
        Animated.timing(swipeAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentFood((prev) => (prev + 1) % FOOD_ITEMS.length);
        animate();
      });
    };

    animate();
  }, []);

  const rotation = swipeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', swipeDirection === 'right' ? '15deg' : '-15deg'],
  });

  const translateX = swipeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, swipeDirection === 'right' ? 120 : -120],
  });

  const opacity = swipeAnim.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 1, 0],
  });

  const indicatorOpacity = swipeAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 1, 1],
  });

  return (
    <View style={styles.container}>
      {/* Background cards for depth */}
      <View style={[styles.card, styles.cardBack2]}>
        <Text style={styles.foodEmoji}>
          {FOOD_ITEMS[(currentFood + 2) % FOOD_ITEMS.length]}
        </Text>
      </View>
      <View style={[styles.card, styles.cardBack1]}>
        <Text style={styles.foodEmoji}>
          {FOOD_ITEMS[(currentFood + 1) % FOOD_ITEMS.length]}
        </Text>
      </View>

      {/* Main animated card */}
      <Animated.View
        style={[
          styles.card,
          styles.cardMain,
          {
            transform: [
              { translateX },
              { rotate: rotation },
            ],
            opacity,
          },
        ]}
      >
        <Text style={styles.foodEmoji}>{FOOD_ITEMS[currentFood]}</Text>

        {/* Like indicator (right swipe) */}
        {swipeDirection === 'right' && (
          <Animated.View
            style={[
              styles.indicator,
              styles.likeIndicator,
              { opacity: indicatorOpacity },
            ]}
          >
            <Text style={styles.indicatorText}>YUM!</Text>
          </Animated.View>
        )}

        {/* Nope indicator (left swipe) */}
        {swipeDirection === 'left' && (
          <Animated.View
            style={[
              styles.indicator,
              styles.nopeIndicator,
              { opacity: indicatorOpacity },
            ]}
          >
            <Text style={styles.indicatorText}>NOPE</Text>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: 100,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#F5E6E0',
  },
  cardMain: {
    zIndex: 3,
    borderColor: '#E8D5CE',
  },
  cardBack1: {
    zIndex: 2,
    transform: [{ scale: 0.95 }, { translateY: 6 }],
    opacity: 0.8,
  },
  cardBack2: {
    zIndex: 1,
    transform: [{ scale: 0.9 }, { translateY: 12 }],
    opacity: 0.5,
  },
  foodEmoji: {
    fontSize: 48,
  },
  indicator: {
    position: 'absolute',
    top: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  likeIndicator: {
    left: 8,
    backgroundColor: '#4CAF50',
    transform: [{ rotate: '-15deg' }],
  },
  nopeIndicator: {
    right: 8,
    backgroundColor: '#E53935',
    transform: [{ rotate: '15deg' }],
  },
  indicatorText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
});

export default AnimatedLogo;
