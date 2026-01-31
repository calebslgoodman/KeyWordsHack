import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { MEALS } from '../data/meals';
import { Meal, SwipeDirection, FoodSwipe } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useMealPlan } from '../contexts/MealPlanContext';
import SwipeCard from '../components/SwipeCard';
import MealDetailModal from '../components/MealDetailModal';
import ConfidenceSelector from '../components/ConfidenceSelector';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SwipeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { targetMeals, swipes, addSwipe, acceptedMeals } = useMealPlan();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [pendingSwipe, setPendingSwipe] = useState<{
    meal: Meal;
    direction: SwipeDirection;
  } | null>(null);

  // Shuffle meals for variety, excluding already swiped meals
  const availableMeals = useMemo(() => {
    const swipedIds = swipes.map(s => s.meal_id);
    const unswipedMeals = MEALS.filter(m => !swipedIds.includes(m.meal_id));
    return [...unswipedMeals].sort(() => Math.random() - 0.5);
  }, [swipes.length === 0]); // Only reshuffle when starting fresh

  const rightSwipeCount = acceptedMeals.length;
  const progress = (rightSwipeCount / targetMeals) * 100;
  const remainingNeeded = targetMeals - rightSwipeCount;

  // Check if we've reached the target
  useEffect(() => {
    if (rightSwipeCount >= targetMeals && targetMeals > 0) {
      navigation.navigate('SwipeReview');
    }
  }, [rightSwipeCount, targetMeals]);

  const handleSwipe = (direction: SwipeDirection) => {
    if (currentIndex >= availableMeals.length) return;
    const meal = availableMeals[currentIndex];
    setPendingSwipe({ meal, direction });
  };

  const handleConfidenceSelect = (confidence: number) => {
    if (!pendingSwipe) return;

    const newSwipe: FoodSwipe = {
      user_id: user?.id || 'demo-user',
      meal_id: pendingSwipe.meal.meal_id,
      meal_type: pendingSwipe.meal.meal_type,
      swipe: pendingSwipe.direction,
      confidence,
      timestamp: new Date().toISOString(),
    };

    addSwipe(newSwipe);
    setPendingSwipe(null);
    setCurrentIndex(currentIndex + 1);
  };

  const handleConfidenceSkip = () => {
    handleConfidenceSelect(3);
  };

  const handleTap = (meal: Meal) => {
    setSelectedMeal(meal);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedMeal(null);
  };

  const currentMeal = availableMeals[currentIndex];
  const nextMeal = availableMeals[currentIndex + 1];

  const hasMoreMeals = currentIndex < availableMeals.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Find Your Meals</Text>
          <Text style={styles.subtitle}>
            {rightSwipeCount} of {targetMeals} meals selected
          </Text>
        </View>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{remainingNeeded}</Text>
          <Text style={styles.counterLabel}>to go</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Swipe right on {remainingNeeded} more {remainingNeeded === 1 ? 'meal' : 'meals'}
        </Text>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {hasMoreMeals ? (
          <>
            {nextMeal && (
              <SwipeCard
                key={nextMeal.meal_id + '_back'}
                meal={nextMeal}
                onSwipe={() => {}}
                onTap={() => {}}
                isTop={false}
              />
            )}
            {currentMeal && (
              <SwipeCard
                key={currentMeal.meal_id}
                meal={currentMeal}
                onSwipe={handleSwipe}
                onTap={() => handleTap(currentMeal)}
                isTop={true}
              />
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🤔</Text>
            <Text style={styles.emptyTitle}>No more meals!</Text>
            <Text style={styles.emptyText}>
              You've gone through all available meals. You have {rightSwipeCount} meals selected.
            </Text>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => navigation.navigate('SwipeReview')}
            >
              <Text style={styles.reviewButtonText}>Review My Selections</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      {hasMoreMeals && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.nopeButton]}
            onPress={() => handleSwipe('left')}
          >
            <Text style={[styles.actionIcon, { color: colors.swipeLeft }]}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.maybeButton]}
            onPress={() => handleSwipe('maybe')}
          >
            <Text style={[styles.actionIcon, { color: colors.swipeMaybe }]}>?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => handleSwipe('right')}
          >
            <Text style={[styles.actionIcon, { color: '#fff' }]}>♥</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Instructions */}
      {hasMoreMeals && (
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Swipe right to add • Swipe left to skip • Tap for details
          </Text>
        </View>
      )}

      {/* Modals */}
      <MealDetailModal
        meal={selectedMeal}
        visible={showDetail}
        onClose={handleCloseDetail}
      />

      <ConfidenceSelector
        visible={!!pendingSwipe}
        direction={pendingSwipe?.direction || 'right'}
        onSelect={handleConfidenceSelect}
        onSkip={handleConfidenceSkip}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  counterBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  counterText: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: '#fff',
  },
  counterLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: -2,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  progressBg: {
    height: 8,
    backgroundColor: colors.inputBorder,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.swipeRight,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  reviewButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  reviewButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 16,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  nopeButton: {
    backgroundColor: colors.cardBg,
    borderWidth: 2,
    borderColor: colors.swipeLeft,
  },
  maybeButton: {
    backgroundColor: colors.cardBg,
    borderWidth: 2,
    borderColor: colors.swipeMaybe,
  },
  likeButton: {
    backgroundColor: colors.swipeRight,
  },
  actionIcon: {
    fontSize: 24,
    fontWeight: '700',
  },
  instructions: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  instructionText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textLight,
  },
});

export default SwipeScreen;
