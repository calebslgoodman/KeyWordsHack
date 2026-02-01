import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { MEALS } from '../data/meals';
import { FoodSwipe, MealPlanEntry } from '../types';
import { saveFoodSwipes, saveMealPlan } from '../lib/api';
import { useMealPlan } from '../contexts/MealPlanContext';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SwipeReviewScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { acceptedMeals, targetMeals, removeSwipe, swipes } = useMealPlan();
  const [saving, setSaving] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<string[]>([]);

  const getMealById = (mealId: string) => MEALS.find(m => m.meal_id === mealId);

  const mealsNeeded = targetMeals - (acceptedMeals.length - selectedForDeletion.length);
  const canConfirm = selectedForDeletion.length === 0;
  const hasSelections = selectedForDeletion.length > 0;

  const toggleDeletion = (mealId: string) => {
    if (selectedForDeletion.includes(mealId)) {
      setSelectedForDeletion(prev => prev.filter(id => id !== mealId));
    } else {
      setSelectedForDeletion(prev => [...prev, mealId]);
    }
  };

  const handleDeleteAndReswipe = () => {
    Alert.alert(
      'Remove Meals?',
      `Remove ${selectedForDeletion.length} meal${selectedForDeletion.length > 1 ? 's' : ''} and swipe for ${selectedForDeletion.length} more?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove & Reswipe',
          style: 'destructive',
          onPress: () => {
            selectedForDeletion.forEach(mealId => removeSwipe(mealId));
            setSelectedForDeletion([]);
            navigation.navigate('Swipe');
          },
        },
      ]
    );
  };

  const handleConfirm = async () => {
    setSaving(true);

    // Count quantities of each accepted meal
    const mealCounts = new Map<string, number>();
    acceptedMeals.forEach(swipe => {
      const currentCount = mealCounts.get(swipe.meal_id) || 0;
      mealCounts.set(swipe.meal_id, currentCount + 1);
    });

    // Convert to MealPlanEntry format
    const mealPlanEntries: MealPlanEntry[] = Array.from(mealCounts.entries()).map(
      ([meal_id, quantity]) => ({ meal_id, quantity })
    );

    console.log('Saving meal plan:', mealPlanEntries);

    // Save swipes
    const swipesResult = await saveFoodSwipes(swipes);

    // Save meal plan with quantities
    let mealPlanResult = { success: true };
    if (user?.id) {
      mealPlanResult = await saveMealPlan(user.id, mealPlanEntries);
    }

    setSaving(false);

    if (swipesResult.success && mealPlanResult.success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MealPlanSummary' }],
      });
    } else {
      Alert.alert(
        'Error',
        'Failed to save your meal plan. Please try again.\n\n' +
        (!swipesResult.success ? `Swipes: ${swipesResult.error}\n` : '') +
        (!mealPlanResult.success ? `Meal Plan: ${mealPlanResult.error}` : '')
      );
    }
  };

  const handleBack = () => {
    if (hasSelections) {
      setSelectedForDeletion([]);
    } else {
      Alert.alert(
        'Go Back?',
        'Your selections will be kept. Go back to swipe more?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go Back', onPress: () => navigation.goBack() },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backText}>
            {hasSelections ? 'Cancel' : '← Back'}
          </Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>
            {hasSelections ? 'Select to Remove' : 'Your Meal Plan'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {hasSelections
              ? `${selectedForDeletion.length} selected`
              : `${acceptedMeals.length} meals for the week`}
          </Text>
        </View>
        <View style={styles.backButton} />
      </View>

      {/* Info Banner */}
      {!hasSelections && (
        <View style={styles.infoBanner}>
          <Text style={styles.infoEmoji}>💡</Text>
          <Text style={styles.infoText}>
            Tap any meal to remove it and swipe for a replacement
          </Text>
        </View>
      )}

      {hasSelections && (
        <View style={styles.deletionBanner}>
          <Text style={styles.deletionText}>
            {selectedForDeletion.length} meal{selectedForDeletion.length > 1 ? 's' : ''} will be removed.
            You'll swipe for {selectedForDeletion.length} replacement{selectedForDeletion.length > 1 ? 's' : ''}.
          </Text>
        </View>
      )}

      {/* Meal List */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {acceptedMeals.map((swipe, index) => {
          const meal = getMealById(swipe.meal_id);
          if (!meal) return null;

          const isSelected = selectedForDeletion.includes(swipe.meal_id);

          return (
            <TouchableOpacity
              key={swipe.meal_id}
              style={[styles.mealCard, isSelected && styles.mealCardSelected]}
              onPress={() => toggleDeletion(swipe.meal_id)}
              activeOpacity={0.7}
            >
              {isSelected && (
                <View style={styles.deleteOverlay}>
                  <Text style={styles.deleteIcon}>✕</Text>
                </View>
              )}
              <Image source={{ uri: meal.image_url }} style={styles.mealImage} />
              <View style={styles.mealInfo}>
                <View style={styles.mealTypeBadge}>
                  <Text style={styles.mealTypeText}>
                    {meal.meal_type.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.mealName} numberOfLines={1}>{meal.name}</Text>
                <Text style={styles.mealMeta}>
                  {meal.cuisine} • {meal.calories} cal • {meal.cook_time_minutes} min
                </Text>
              </View>
              <View style={styles.mealNumber}>
                <Text style={styles.mealNumberText}>{index + 1}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {hasSelections ? (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAndReswipe}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteButtonText}>
              Remove & Swipe for {selectedForDeletion.length} More
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmButtonText}>
                Confirm Meal Plan
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
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
    paddingVertical: 12,
  },
  backButton: {
    width: 70,
  },
  backText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.primary,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
  },
  headerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: colors.infoBg,
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  infoEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.info,
  },
  deletionBanner: {
    backgroundColor: colors.errorBg,
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  deletionText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
    gap: 12,
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  mealCardSelected: {
    borderWidth: 2,
    borderColor: colors.error,
    opacity: 0.7,
  },
  deleteOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  mealImage: {
    width: 80,
    height: 80,
    backgroundColor: colors.inputBg,
  },
  mealInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  mealTypeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  mealTypeText: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  mealName: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.text,
    marginBottom: 2,
  },
  mealMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  mealNumber: {
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
  },
  mealNumberText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.textMuted,
  },
  footer: {
    padding: 20,
    paddingBottom: 34,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: colors.error,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: '#fff',
  },
});

export default SwipeReviewScreen;
