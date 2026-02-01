import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MealPlanSummaryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { acceptedMeals, mealsOutCount, resetPlan } = useMealPlan();
  const { signOut } = useAuth();

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

        {/* Coming Soon */}
        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonEmoji}>🛒</Text>
          <Text style={styles.comingSoonTitle}>Grocery List Coming Soon!</Text>
          <Text style={styles.comingSoonText}>
            We're working on AI-powered grocery lists with one-tap Instacart checkout.
          </Text>
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
});

export default MealPlanSummaryScreen;
