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
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SwipeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { targetMeals, swipes, addSwipe, acceptedMeals } = useMealPlan();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentMealType, setCurrentMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');

  // Filter meals by current type and shuffle
  const availableMeals = useMemo(() => {
    const swipedIds = swipes.map(s => s.meal_id);
    const unswipedMeals = MEALS.filter(m => !swipedIds.includes(m.meal_id) && m.meal_type === currentMealType);
    return [...unswipedMeals].sort(() => Math.random() - 0.5);
  }, [swipes.length, currentMealType]); // Reshuffle when meal type changes

  // Calculate meal distribution
  const breakfastNeeded = Math.floor(targetMeals / 3) - (targetMeals % 3 === 1 ? 1 : targetMeals % 3 === 2 ? 1 : 0);
  const lunchNeeded = Math.ceil(targetMeals / 3);
  const dinnerNeeded = Math.ceil(targetMeals / 3);

  const breakfastCount = acceptedMeals.filter(m => {
    const meal = MEALS.find(ml => ml.meal_id === m.meal_id);
    return meal?.meal_type === 'breakfast';
  }).length;

  const lunchCount = acceptedMeals.filter(m => {
    const meal = MEALS.find(ml => ml.meal_id === m.meal_id);
    return meal?.meal_type === 'lunch';
  }).length;

  const dinnerCount = acceptedMeals.filter(m => {
    const meal = MEALS.find(ml => ml.meal_id === m.meal_id);
    return meal?.meal_type === 'dinner';
  }).length;

  const rightSwipeCount = acceptedMeals.length;
  const progress = (rightSwipeCount / targetMeals) * 100;
  const remainingNeeded = targetMeals - rightSwipeCount;

  // Auto-advance to next meal type when current type is complete
  useEffect(() => {
    if (currentMealType === 'breakfast' && breakfastCount >= breakfastNeeded && breakfastNeeded > 0) {
      setCurrentMealType('lunch');
      setCurrentIndex(0);
    } else if (currentMealType === 'lunch' && lunchCount >= lunchNeeded && lunchNeeded > 0) {
      setCurrentMealType('dinner');
      setCurrentIndex(0);
    } else if (currentMealType === 'dinner' && dinnerCount >= dinnerNeeded && dinnerNeeded > 0) {
      navigation.navigate('SwipeReview');
    }
  }, [breakfastCount, lunchCount, dinnerCount, currentMealType, breakfastNeeded, lunchNeeded, dinnerNeeded, navigation]);

  // Check if we've reached the target
  useEffect(() => {
    if (rightSwipeCount >= targetMeals && targetMeals > 0) {
      navigation.navigate('SwipeReview');
    }
  }, [rightSwipeCount, targetMeals]);

  const handleSwipe = (direction: SwipeDirection) => {
    if (currentIndex >= availableMeals.length) return;
    const meal = availableMeals[currentIndex];

    const newSwipe: FoodSwipe = {
      user_id: user?.id || 'demo-user',
      meal_id: meal.meal_id,
      meal_type: meal.meal_type,
      swipe: direction,
      confidence: 3, // Default confidence level
      timestamp: new Date().toISOString(),
    };

    addSwipe(newSwipe);
    setCurrentIndex(currentIndex + 1);
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
          <Text style={styles.title}>
            {currentMealType === 'breakfast' ? 'Breakfast' : currentMealType === 'lunch' ? 'Lunch' : 'Dinner'}
          </Text>
          <Text style={styles.subtitle}>
            {currentMealType === 'breakfast' ? `${breakfastCount} of ${breakfastNeeded}` :
             currentMealType === 'lunch' ? `${lunchCount} of ${lunchNeeded}` :
             `${dinnerCount} of ${dinnerNeeded}`} selected
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.sectionProgress}>
          <View style={styles.sectionBar}>
            <View style={[styles.sectionFill, {
              width: `${(breakfastCount / breakfastNeeded) * 100}%`,
              backgroundColor: colors.swipeRight
            }]} />
          </View>
          <Text style={styles.sectionLabel}>B</Text>
        </View>
        <View style={styles.sectionProgress}>
          <View style={styles.sectionBar}>
            <View style={[styles.sectionFill, {
              width: `${(lunchCount / lunchNeeded) * 100}%`,
              backgroundColor: colors.swipeMaybe
            }]} />
          </View>
          <Text style={styles.sectionLabel}>L</Text>
        </View>
        <View style={styles.sectionProgress}>
          <View style={styles.sectionBar}>
            <View style={[styles.sectionFill, {
              width: `${(dinnerCount / dinnerNeeded) * 100}%`,
              backgroundColor: colors.primary
            }]} />
          </View>
          <Text style={styles.sectionLabel}>D</Text>
        </View>
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


      {/* Instructions */}
      {hasMoreMeals && (
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Swipe right to add • Swipe left to skip
          </Text>
        </View>
      )}

      {/* Modals */}
      <MealDetailModal
        meal={selectedMeal}
        visible={showDetail}
        onClose={handleCloseDetail}
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
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  sectionProgress: {
    flex: 1,
    alignItems: 'center',
  },
  sectionBar: {
    width: '100%',
    height: 6,
    backgroundColor: colors.inputBorder,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  sectionFill: {
    height: '100%',
    borderRadius: 3,
  },
  sectionLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.textMuted,
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
