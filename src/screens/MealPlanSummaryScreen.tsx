import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { MEALS } from '../data/meals';
import { useMealPlan } from '../contexts/MealPlanContext';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { getTasteProfile } from '../lib/api';
import {
  generateAIGroceryList,
  getAIMealPlanInsights,
  isKeywordsAIConfigured,
  GroceryList,
  MealPlanAnalysis,
} from '../lib/keywords-ai';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MealPlanSummaryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { acceptedMeals, mealsOutCount, resetPlan, targetMeals } = useMealPlan();
  const { signOut, user } = useAuth();

  // AI-powered features state
  const [groceryList, setGroceryList] = useState<GroceryList | null>(null);
  const [mealInsights, setMealInsights] = useState<MealPlanAnalysis | null>(null);
  const [loadingGrocery, setLoadingGrocery] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showGroceryList, setShowGroceryList] = useState(false);
  const [expandedInsightIndex, setExpandedInsightIndex] = useState<number | null>(null);

  const getMealById = (mealId: string) => MEALS.find(m => m.meal_id === mealId);

  const breakfasts = acceptedMeals.filter(s => {
    const meal = getMealById(s.meal_id);
    return meal?.meal_type === 'breakfast';
  });
  const lunches = acceptedMeals.filter(s => {
    const meal = getMealById(s.meal_id);
    return meal?.meal_type === 'lunch';
  });
  const dinners = acceptedMeals.filter(s => {
    const meal = getMealById(s.meal_id);
    return meal?.meal_type === 'dinner';
  });

  // Load AI insights when screen mounts
  useEffect(() => {
    const loadAIFeatures = async () => {
      if (!isKeywordsAIConfigured()) {
        console.log('Keywords AI not configured, skipping AI features');
        return;
      }

      // Prepare meal data for AI analysis
      const mealData = acceptedMeals.map(swipe => {
        const meal = getMealById(swipe.meal_id);
        return meal ? { meal, quantity: 1 } : null;
      }).filter(Boolean) as Array<{ meal: typeof MEALS[0]; quantity: number }>;

      if (mealData.length === 0) return;

      // Get user's taste profile for context
      const tasteProfile = user?.id ? await getTasteProfile(user.id) : null;

      // Load AI meal plan insights
      setLoadingInsights(true);
      try {
        console.log('Requesting AI meal plan insights via Keywords AI Gateway...');
        const insights = await getAIMealPlanInsights(mealData, tasteProfile, targetMeals);
        setMealInsights(insights);
        console.log('AI insights loaded successfully');
      } catch (error) {
        // AI insights unavailable - continuing without
      } finally {
        setLoadingInsights(false);
      }
    };

    loadAIFeatures();
  }, [acceptedMeals, user?.id, targetMeals]);

  // Generate grocery list on demand
  const handleGenerateGroceryList = async () => {
    if (!isKeywordsAIConfigured()) {
      console.log('Keywords AI not configured');
      return;
    }

    const mealData = acceptedMeals.map(swipe => {
      const meal = getMealById(swipe.meal_id);
      return meal ? { meal, quantity: 1 } : null;
    }).filter(Boolean) as Array<{ meal: typeof MEALS[0]; quantity: number }>;

    if (mealData.length === 0) return;

    const tasteProfile = user?.id ? await getTasteProfile(user.id) : null;

    setLoadingGrocery(true);
    try {
      console.log('Requesting AI grocery list via Keywords AI Gateway...');
      const list = await generateAIGroceryList(mealData, tasteProfile);
      setGroceryList(list);
      setShowGroceryList(true);
      console.log('AI grocery list generated successfully');
    } catch (error) {
      // Grocery list unavailable - continuing without
    } finally {
      setLoadingGrocery(false);
    }
  };

  const handleStartNewWeek = () => {
    resetPlan();
    navigation.reset({
      index: 0,
      routes: [{ name: 'MealGoal' }],
    });
  };

  const handleBackToDashboard = () => {
    // Go back to meal goal screen without resetting
    navigation.reset({
      index: 0,
      routes: [{ name: 'MealGoal' }],
    });
  };

  const MealSection = ({ title, meals, color }: { title: string; meals: typeof acceptedMeals; color: string }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionDot, { backgroundColor: color }]} />
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionCount}>{meals.length}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {meals.map((swipe) => {
          const meal = getMealById(swipe.meal_id);
          if (!meal) return null;
          return (
            <View key={swipe.meal_id} style={styles.mealCard}>
              <Image source={{ uri: meal.image_url }} style={styles.mealImage} />
              <Text style={styles.mealName} numberOfLines={2}>{meal.name}</Text>
              <Text style={styles.mealMeta}>{meal.cook_time_minutes} min</Text>
            </View>
          );
        })}
        {meals.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No meals</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Success Header */}
        <View style={styles.header}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.title}>Your Week is Planned!</Text>
          <Text style={styles.subtitle}>
            {acceptedMeals.length} meals ready to cook
            {mealsOutCount > 0 && ` • ${mealsOutCount} eating out`}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{acceptedMeals.length}</Text>
            <Text style={styles.statLabel}>Total Meals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{breakfasts.length}</Text>
            <Text style={styles.statLabel}>Breakfasts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{lunches.length}</Text>
            <Text style={styles.statLabel}>Lunches</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{dinners.length}</Text>
            <Text style={styles.statLabel}>Dinners</Text>
          </View>
        </View>

        {/* Meal Sections */}
        <MealSection title="Breakfasts" meals={breakfasts} color={colors.swipeRight} />
        <MealSection title="Lunches" meals={lunches} color={colors.swipeMaybe} />
        <MealSection title="Dinners" meals={dinners} color={colors.primary} />

        {/* AI Insights Section - Powered by Keywords AI Gateway */}
        {isKeywordsAIConfigured() && (
          <View style={styles.aiSection}>
            <View style={styles.aiSectionHeader}>
              <Text style={styles.aiSectionEmoji}>🤖</Text>
              <Text style={styles.aiSectionTitle}>AI Insights</Text>
              <Text style={styles.aiPoweredBy}>via Keywords AI</Text>
            </View>

            {loadingInsights ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Analyzing your meal plan...</Text>
              </View>
            ) : mealInsights ? (
              <View style={styles.insightsContainer}>
                {/* Overall Score */}
                <View style={styles.scoreCard}>
                  <Text style={styles.scoreNumber}>{mealInsights.overall_score}</Text>
                  <Text style={styles.scoreLabel}>Plan Score</Text>
                </View>

                {/* Individual Insights */}
                {mealInsights.insights.slice(0, 3).map((insight, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.insightCard}
                    onPress={() => setExpandedInsightIndex(expandedInsightIndex === index ? null : index)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.insightEmoji}>{insight.emoji}</Text>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightTitle}>{insight.title}</Text>
                      <Text
                        style={styles.insightDescription}
                        numberOfLines={expandedInsightIndex === index ? undefined : 2}
                      >
                        {insight.description}
                      </Text>
                      {expandedInsightIndex !== index && insight.description.length > 60 && (
                        <Text style={styles.insightTapHint}>Tap to expand</Text>
                      )}
                    </View>
                    {insight.score !== undefined && (
                      <Text style={styles.insightScore}>{insight.score}%</Text>
                    )}
                  </TouchableOpacity>
                ))}

                {/* Weekly Prep Tips */}
                {mealInsights.weekly_prep_tips.length > 0 && (
                  <View style={styles.tipsCard}>
                    <Text style={styles.tipsTitle}>Weekly Prep Tips</Text>
                    {mealInsights.weekly_prep_tips.slice(0, 2).map((tip, index) => (
                      <Text key={index} style={styles.tipText}>• {tip}</Text>
                    ))}
                  </View>
                )}
              </View>
            ) : null}
          </View>
        )}

        {/* AI Grocery List Section */}
        <View style={styles.grocerySection}>
          {!showGroceryList ? (
            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateGroceryList}
              disabled={loadingGrocery || !isKeywordsAIConfigured()}
              activeOpacity={0.8}
            >
              {loadingGrocery ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.generateButtonEmoji}>🛒</Text>
                  <Text style={styles.generateButtonText}>
                    {isKeywordsAIConfigured()
                      ? 'Generate AI Grocery List'
                      : 'Grocery List (Configure Keywords AI)'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ) : groceryList ? (
            <View style={styles.groceryListContainer}>
              <View style={styles.groceryHeader}>
                <Text style={styles.groceryTitle}>Your Grocery List</Text>
                <Text style={styles.groceryEstimate}>
                  Est. ${groceryList.total_estimated_cost.toFixed(2)}
                </Text>
              </View>

              {/* Grocery Categories */}
              {Object.entries(groceryList.categories).map(([category, items]) => (
                <View key={category} style={styles.groceryCategory}>
                  <Text style={styles.categoryName}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                  {items.slice(0, 5).map((item, index) => (
                    <View key={index} style={styles.groceryItem}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>
                        {item.quantity} {item.unit}
                      </Text>
                    </View>
                  ))}
                  {items.length > 5 && (
                    <Text style={styles.moreItems}>+{items.length - 5} more items</Text>
                  )}
                </View>
              ))}

              {/* Shopping Tips */}
              {groceryList.tips.length > 0 && (
                <View style={styles.shoppingTips}>
                  <Text style={styles.tipsTitle}>Shopping Tips</Text>
                  {groceryList.tips.slice(0, 2).map((tip, index) => (
                    <Text key={index} style={styles.tipText}>💡 {tip}</Text>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.hideButton}
                onPress={() => setShowGroceryList(false)}
              >
                <Text style={styles.hideButtonText}>Hide Grocery List</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleBackToDashboard}
            activeOpacity={0.8}
          >
            <Text style={styles.homeButtonText}>← Back to Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartNewWeek}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Plan Next Week</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={signOut}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textMuted,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#8B7355',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.primary,
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.inputBorder,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  sectionCount: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textMuted,
  },
  horizontalScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  mealCard: {
    width: 140,
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    marginRight: 12,
    overflow: 'hidden',
  },
  mealImage: {
    width: 140,
    height: 100,
    backgroundColor: colors.inputBg,
  },
  mealName: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.text,
    padding: 10,
    paddingBottom: 4,
  },
  mealMeta: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  emptyCard: {
    width: 140,
    height: 140,
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textLight,
  },
  comingSoonCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  comingSoonEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  comingSoonTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.primaryDark,
    marginBottom: 4,
  },
  comingSoonText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.primaryDark,
    textAlign: 'center',
    opacity: 0.8,
  },
  actions: {
    gap: 12,
  },
  homeButton: {
    backgroundColor: colors.cardBg,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  homeButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.primary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: '#fff',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.textMuted,
  },
  // AI Section Styles - Keywords AI Integration
  aiSection: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  aiSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiSectionEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  aiSectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
    flex: 1,
  },
  aiPoweredBy: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginLeft: 10,
  },
  insightsContainer: {
    gap: 12,
  },
  scoreCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreNumber: {
    fontFamily: fonts.bold,
    fontSize: 42,
    color: colors.primary,
  },
  scoreLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.primaryDark,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 12,
  },
  insightEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.text,
  },
  insightDescription: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  insightTapHint: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  insightScore: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
  },
  tipsCard: {
    backgroundColor: colors.infoBg,
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  tipsTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.info,
    marginBottom: 8,
  },
  tipText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.info,
    marginBottom: 4,
  },
  // Grocery Section Styles
  grocerySection: {
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  generateButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#fff',
  },
  groceryListContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  groceryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  groceryTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
  },
  groceryEstimate: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.primary,
  },
  groceryCategory: {
    marginBottom: 16,
  },
  categoryName: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.primaryDark,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  groceryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.inputBorder,
  },
  itemName: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  itemQuantity: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  moreItems: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  shoppingTips: {
    backgroundColor: colors.infoBg,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  hideButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 12,
  },
  hideButtonText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
});

export default MealPlanSummaryScreen;
