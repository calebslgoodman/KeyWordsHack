import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { MEALS } from '../data/meals';
import { Meal, SwipeDirection, FoodSwipe } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useMealPlan } from '../contexts/MealPlanContext';
import { saveFoodSwipe, getMeals } from '../lib/api';
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
  const [meals, setMeals] = useState<Meal[]>(MEALS); // Default to local data
  const [loadingMeals, setLoadingMeals] = useState(true);

  // Load meals from Supabase on mount
  useEffect(() => {
    const loadMeals = async () => {
      setLoadingMeals(true);
      const dbMeals = await getMeals();

      if (dbMeals.length > 0) {
        console.log(`Loaded ${dbMeals.length} meals from Supabase`);
        setMeals(dbMeals);
      } else {
        console.log(`Using ${MEALS.length} meals from local data`);
        setMeals(MEALS);
      }

      setLoadingMeals(false);
    };

    loadMeals();
  }, []);

  // Reset index when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('SwipeScreen focused - resetting index');
      setCurrentIndex(0);
    }, [])
  );

  console.log('SwipeScreen - Context values:', {
    targetMeals,
    totalSwipes: swipes.length,
    acceptedCount: acceptedMeals.length,
  });

  // Filter out already swiped meals and shuffle
  const availableMeals = useMemo(() => {
    const swipedIds = swipes.map(s => s.meal_id);
    const unswipedMeals = meals.filter(m => !swipedIds.includes(m.meal_id));
    console.log('Available meals:', unswipedMeals.length, 'out of', meals.length);
    return [...unswipedMeals].sort(() => Math.random() - 0.5);
  }, [swipes.length, meals]);

  const acceptedCount = acceptedMeals.length;
  const progress = (acceptedCount / targetMeals) * 100;
  const remainingNeeded = targetMeals - acceptedCount;

  console.log('Progress:', {
    acceptedCount,
    targetMeals,
    remainingNeeded,
    progress: `${progress.toFixed(1)}%`
  });

  // Navigate to review when target is reached
  useEffect(() => {
    if (acceptedCount >= targetMeals && targetMeals > 0) {
      console.log('Target reached! Navigating to review');
      navigation.navigate('SwipeReview');
    }
  }, [acceptedCount, targetMeals, navigation]);

  const handleSwipe = async (direction: SwipeDirection) => {
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

    // Add to local state immediately
    addSwipe(newSwipe);
    setCurrentIndex(currentIndex + 1);

    // Save to Supabase in background
    if (user?.id) {
      const result = await saveFoodSwipe(newSwipe);
      if (!result.success) {
        console.error('Failed to save swipe:', result.error);
      }
    }
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

  // Show loading state while fetching meals
  if (loadingMeals) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>🍳</Text>
          <Text style={styles.loadingText}>Loading meals...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Find Your Meals</Text>
          <Text style={styles.subtitle}>
            {acceptedCount} of {targetMeals} selected
          </Text>
        </View>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{acceptedCount}/{targetMeals}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
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
              You've gone through all available meals. You have {acceptedCount} of {targetMeals} meals selected.
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  loadingText: {
    fontFamily: fonts.regular,
    fontSize: 18,
    color: colors.textMuted,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerContent: {
    flex: 1,
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
    fontSize: 18,
    color: '#fff',
  },
  progressBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.inputBorder,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
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
