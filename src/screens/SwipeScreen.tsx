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
import { saveFoodSwipe, getMeals, getTasteProfile } from '../lib/api';
import SwipeCard from '../components/SwipeCard';
import MealDetailModal from '../components/MealDetailModal';
import { RootStackParamList } from '../navigation/types';
import {
  getAIMealRecommendations,
  isKeywordsAIConfigured,
  MealRecommendation,
} from '../lib/keywords-ai';

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

  // AI-powered recommendations from Keywords AI Gateway
  const [aiRecommendations, setAiRecommendations] = useState<Map<string, MealRecommendation>>(new Map());
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiReasonExpanded, setAiReasonExpanded] = useState(false);

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

  // Load AI recommendations via Keywords AI Gateway
  useEffect(() => {
    const loadAIRecommendations = async () => {
      if (!isKeywordsAIConfigured()) {
        console.log('Keywords AI not configured, skipping AI recommendations');
        return;
      }

      setAiEnabled(true);

      try {
        // Get user's taste profile for personalized recommendations
        const tasteProfile = user?.id ? await getTasteProfile(user.id) : null;

        console.log('Requesting AI meal recommendations via Keywords AI Gateway...');
        const recommendations = await getAIMealRecommendations(
          tasteProfile,
          swipes,
          meals,
          'breakfast', // Start with breakfast
          10
        );

        // Create a map for quick lookup
        const recMap = new Map<string, MealRecommendation>();
        recommendations.forEach(rec => recMap.set(rec.meal_id, rec));
        setAiRecommendations(recMap);

        console.log(`Loaded ${recommendations.length} AI recommendations`);
      } catch (error) {
        // AI recommendations unavailable - continuing without
      }
    };

    if (meals.length > 0 && !loadingMeals) {
      loadAIRecommendations();
    }
  }, [meals, loadingMeals, user?.id, swipes.length]);

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

  // Get AI recommendation for current meal (if available)
  const currentRecommendation = currentMeal ? aiRecommendations.get(currentMeal.meal_id) : null;

  // Reset expanded state when meal changes
  useEffect(() => {
    setAiReasonExpanded(false);
  }, [currentIndex]);

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

      {/* AI Recommendation Banner - Powered by Keywords AI */}
      {aiEnabled && currentRecommendation && (
        <TouchableOpacity
          style={styles.aiRecommendationBanner}
          onPress={() => setAiReasonExpanded(!aiReasonExpanded)}
          activeOpacity={0.8}
        >
          <Text style={styles.aiRecommendationIcon}>🤖</Text>
          <View style={styles.aiRecommendationContent}>
            <Text style={styles.aiRecommendationLabel}>AI Pick for You</Text>
            <Text
              style={styles.aiRecommendationReason}
              numberOfLines={aiReasonExpanded ? undefined : 1}
            >
              {currentRecommendation.reason}
            </Text>
            {!aiReasonExpanded && (
              <Text style={styles.aiTapHint}>Tap to expand</Text>
            )}
          </View>
          <View style={styles.aiConfidenceBadge}>
            <Text style={styles.aiConfidenceText}>
              {Math.round(currentRecommendation.confidence_score * 100)}%
            </Text>
          </View>
        </TouchableOpacity>
      )}

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
  // AI Recommendation Banner Styles - Keywords AI Integration
  aiRecommendationBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primaryLight,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  aiRecommendationIcon: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 2,
  },
  aiRecommendationContent: {
    flex: 1,
  },
  aiRecommendationLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiRecommendationReason: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
    marginTop: 2,
  },
  aiTapHint: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
    fontStyle: 'italic',
  },
  aiConfidenceBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  aiConfidenceText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: '#fff',
  },
});

export default SwipeScreen;
