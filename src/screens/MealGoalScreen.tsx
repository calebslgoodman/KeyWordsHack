import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useMealPlan } from '../contexts/MealPlanContext';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MealGoalScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setMealsOutCount } = useMealPlan();
  const [selectedEatOut, setSelectedEatOut] = useState(0);

  const mealsToSwipe = 21 - selectedEatOut;

  const handleContinue = () => {
    setMealsOutCount(selectedEatOut);
    navigation.navigate('Swipe');
  };

  const eatOutOptions = [0, 3, 5, 7, 10, 14];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>📅</Text>
          <Text style={styles.title}>Plan Your Week</Text>
          <Text style={styles.subtitle}>
            How many meals are you planning to eat out or skip this week?
          </Text>
        </View>

        {/* Eat Out Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meals eating out</Text>
          <View style={styles.optionsGrid}>
            {eatOutOptions.map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.optionCard,
                  selectedEatOut === count && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedEatOut(count)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionNumber,
                    selectedEatOut === count && styles.optionNumberSelected,
                  ]}
                >
                  {count}
                </Text>
                <Text
                  style={[
                    styles.optionLabel,
                    selectedEatOut === count && styles.optionLabelSelected,
                  ]}
                >
                  {count === 0 ? 'None' : count === 21 ? 'All' : 'meals'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{mealsToSwipe}</Text>
              <Text style={styles.summaryLabel}>Meals to cook</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{selectedEatOut}</Text>
              <Text style={styles.summaryLabel}>Eating out</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>21</Text>
              <Text style={styles.summaryLabel}>Total meals</Text>
            </View>
          </View>
        </View>

        {/* Breakdown */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Your week breakdown</Text>
          <View style={styles.breakdownRow}>
            <View style={[styles.dot, { backgroundColor: colors.swipeRight }]} />
            <Text style={styles.breakdownText}>
              {Math.ceil(mealsToSwipe / 3)} breakfasts to plan
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <View style={[styles.dot, { backgroundColor: colors.swipeMaybe }]} />
            <Text style={styles.breakdownText}>
              {Math.ceil(mealsToSwipe / 3)} lunches to plan
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <Text style={styles.breakdownText}>
              {Math.ceil(mealsToSwipe / 3)} dinners to plan
            </Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>💡</Text>
          <Text style={styles.infoText}>
            You'll swipe through meals until you've liked {mealsToSwipe} dishes.
            Take your time - you can always change your mind later!
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, mealsToSwipe === 0 && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={mealsToSwipe === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            Start Swiping ({mealsToSwipe} meals)
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: '30%',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.inputBorder,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionNumber: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.text,
  },
  optionNumberSelected: {
    color: colors.primaryDark,
  },
  optionLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  optionLabelSelected: {
    color: colors.primaryDark,
  },
  summaryCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#8B7355',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontFamily: fonts.bold,
    fontSize: 32,
    color: colors.primary,
  },
  summaryLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.inputBorder,
  },
  breakdownCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  breakdownTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  breakdownText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.infoBg,
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
  },
  infoEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.info,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.inputBorder,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: colors.primaryLight,
  },
  continueButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: '#fff',
  },
});

export default MealGoalScreen;
