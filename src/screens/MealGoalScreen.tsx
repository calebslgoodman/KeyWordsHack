import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Slider from '@react-native-community/slider';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { useMealPlan } from '../contexts/MealPlanContext';
import { RootStackParamList } from '../navigation/types';
import { COOK_TIME_OPTIONS } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MealGoalScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setMealsOutCount } = useMealPlan();
  const [totalMeals, setTotalMeals] = useState(21);
  const [inputValue, setInputValue] = useState('21');
  const [maxCookTime, setMaxCookTime] = useState(30);

  const handleSliderChange = (value: number) => {
    const rounded = Math.round(value);
    setTotalMeals(rounded);
    setInputValue(rounded.toString());
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const numValue = parseInt(text);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 21) {
      setTotalMeals(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 0 || numValue > 21) {
      setInputValue(totalMeals.toString());
    }
  };

  const mealsToSwipe = totalMeals;
  const mealsOut = 21 - totalMeals;

  const handleContinue = () => {
    setMealsOutCount(mealsOut);
    navigation.navigate('Swipe');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>📅</Text>
          <Text style={styles.title}>Plan Your Week</Text>
          <Text style={styles.subtitle}>
            How many meals do you want to plan this week? (Max: 21 meals)
          </Text>
        </View>

        {/* Cooking Time Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How much time to cook this week?</Text>
          <View style={styles.cookTimeGrid}>
            {COOK_TIME_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.cookTimeCard,
                  maxCookTime === option.value && styles.cookTimeCardSelected,
                ]}
                onPress={() => setMaxCookTime(option.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.cookTimeLabel,
                    maxCookTime === option.value && styles.cookTimeLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Meal Selector with Slider and Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Total meals per week</Text>

          <View style={styles.sliderContainer}>
            <View style={styles.valueDisplay}>
              <Text style={styles.valueNumber}>{totalMeals}</Text>
              <Text style={styles.valueLabel}>meals to plan</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={21}
              step={1}
              value={totalMeals}
              onValueChange={handleSliderChange}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.inputBorder}
              thumbTintColor={colors.primary}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>0</Text>
              <Text style={styles.sliderLabel}>21</Text>
            </View>
          </View>

        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{mealsToSwipe}</Text>
              <Text style={styles.summaryLabel}>Meals to plan</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{mealsOut}</Text>
              <Text style={styles.summaryLabel}>Other/Skipping</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>21</Text>
              <Text style={styles.summaryLabel}>Max possible</Text>
            </View>
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
  cookTimeGrid: {
    gap: 12,
  },
  cookTimeCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.inputBorder,
  },
  cookTimeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  cookTimeLabel: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
  },
  cookTimeLabelSelected: {
    fontFamily: fonts.semiBold,
    color: colors.primaryDark,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  valueDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  valueNumber: {
    fontFamily: fonts.bold,
    fontSize: 48,
    color: colors.primary,
    lineHeight: 56,
  },
  valueLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: -4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
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
