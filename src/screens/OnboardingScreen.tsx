import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { saveTasteProfile } from '../lib/api';
import OnboardingStep from '../components/OnboardingStep';
import {
  OnboardingData,
  ALLERGY_OPTIONS,
  DIETARY_OPTIONS,
  DISLIKED_INGREDIENTS,
  COOK_TIME_OPTIONS,
  BUDGET_OPTIONS,
  KITCHEN_TOOLS,
  CUISINE_OPTIONS,
  SPICE_OPTIONS,
  ADVENTURE_OPTIONS,
} from '../types';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TOTAL_STEPS = 9;

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Onboarding state
  const [data, setData] = useState<OnboardingData>({
    allergies: [],
    dietary_restrictions: [],
    disliked_ingredients: [],
    max_cook_time_minutes: 30,
    budget_range: 'moderate',
    kitchen_tools: [],
    preferred_cuisines: [],
    spice_tolerance: 'mild',
    adventure_level: 'balanced',
  });

  const [customDislikes, setCustomDislikes] = useState('');
  const [customKitchenTools, setCustomKitchenTools] = useState('');
  const [cuisine1, setCuisine1] = useState('');
  const [cuisine2, setCuisine2] = useState('');
  const [cuisine3, setCuisine3] = useState('');

  const toggleSelection = (
    key: keyof OnboardingData,
    value: string | number
  ) => {
    const current = data[key] as (string | number)[];
    if (Array.isArray(current)) {
      if (current.includes(value)) {
        setData({ ...data, [key]: current.filter(v => v !== value) });
      } else {
        setData({ ...data, [key]: [...current, value] });
      }
    }
  };

  const setSingleValue = (key: keyof OnboardingData, value: string | number) => {
    setData({ ...data, [key]: value });
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0: // Allergies - required (can be empty if none)
        return true;
      case 1: // Dietary - optional
        return true;
      case 2: // Dislikes - optional
        return true;
      case 3: // Cook time - required
        return data.max_cook_time_minutes > 0;
      case 4: // Budget - required
        return !!data.budget_range;
      case 5: // Kitchen tools - optional
        return true;
      case 6: // Cuisines - at least 1 required
        return cuisine1.trim().length > 0;
      case 7: // Spice - required
        return !!data.spice_tolerance;
      case 8: // Adventure - required
        return !!data.adventure_level;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (!canProceed()) {
      Alert.alert('Required', 'Please complete this step before continuing.');
      return;
    }

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      await handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setSaving(true);

    // Add custom dislikes to the list
    const customDislikesList = customDislikes
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Add custom kitchen tools to the list
    const customKitchenToolsList = customKitchenTools
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Collect cuisines from text inputs
    const cuisineList = [cuisine1, cuisine2, cuisine3]
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const finalData: OnboardingData = {
      ...data,
      disliked_ingredients: [...data.disliked_ingredients, ...customDislikesList],
      kitchen_tools: [...data.kitchen_tools, ...customKitchenToolsList],
      preferred_cuisines: cuisineList,
    };

    const result = await saveTasteProfile(user?.id || 'demo-user', finalData);

    setSaving(false);

    if (result.success) {
      completeOnboarding();
      navigation.reset({
        index: 0,
        routes: [{ name: 'MealGoal' }],
      });
    } else {
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <OnboardingStep
            title="Any food allergies?"
            subtitle="Select all that apply. We'll make sure to avoid these completely."
            options={ALLERGY_OPTIONS}
            selected={data.allergies}
            onSelect={(v) => toggleSelection('allergies', v)}
            required
          />
        );
      case 1:
        return (
          <OnboardingStep
            title="Dietary preferences?"
            subtitle="Optional - let us know if you follow any specific diets."
            options={DIETARY_OPTIONS}
            selected={data.dietary_restrictions}
            onSelect={(v) => toggleSelection('dietary_restrictions', v)}
          />
        );
      case 2:
        return (
          <OnboardingStep
            title="Foods you hate?"
            subtitle="We all have them - tell us what to avoid."
            options={DISLIKED_INGREDIENTS}
            selected={data.disliked_ingredients}
            onSelect={(v) => toggleSelection('disliked_ingredients', v)}
            showFreeText
            freeTextValue={customDislikes}
            onFreeTextChange={setCustomDislikes}
            freeTextPlaceholder="Add others (comma separated)..."
          />
        );
      case 3:
        return (
          <OnboardingStep
            title="How much time to cook?"
            subtitle="We'll find recipes that fit your schedule."
            options={COOK_TIME_OPTIONS}
            selected={[data.max_cook_time_minutes]}
            onSelect={(v) => setSingleValue('max_cook_time_minutes', v)}
            multiSelect={false}
            required
          />
        );
      case 4:
        return (
          <OnboardingStep
            title="What's your budget?"
            subtitle="Per meal - we'll keep costs in check."
            options={BUDGET_OPTIONS}
            selected={[data.budget_range]}
            onSelect={(v) => setSingleValue('budget_range', v)}
            multiSelect={false}
            required
          />
        );
      case 5:
        return (
          <OnboardingStep
            title="What's in your kitchen?"
            subtitle="Select the appliances you have access to."
            options={KITCHEN_TOOLS}
            selected={data.kitchen_tools}
            onSelect={(v) => toggleSelection('kitchen_tools', v)}
            showFreeText
            freeTextValue={customKitchenTools}
            onFreeTextChange={setCustomKitchenTools}
            freeTextPlaceholder="Other equipment (comma separated)..."
          />
        );
      case 6:
        return (
          <View style={styles.customStepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Favorite cuisines?</Text>
              <Text style={styles.stepSubtitle}>
                Enter your top 3 cuisines - we'll prioritize these.
              </Text>
              <Text style={styles.required}>Required (at least 1)</Text>
            </View>
            <View style={styles.cuisineInputsContainer}>
              <TextInput
                style={styles.cuisineInput}
                placeholder="1st favorite (e.g., Italian)"
                placeholderTextColor={colors.textLight}
                value={cuisine1}
                onChangeText={setCuisine1}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.cuisineInput}
                placeholder="2nd favorite (e.g., Mexican)"
                placeholderTextColor={colors.textLight}
                value={cuisine2}
                onChangeText={setCuisine2}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.cuisineInput}
                placeholder="3rd favorite (e.g., Japanese)"
                placeholderTextColor={colors.textLight}
                value={cuisine3}
                onChangeText={setCuisine3}
                autoCapitalize="words"
              />
            </View>
          </View>
        );
      case 7:
        return (
          <OnboardingStep
            title="Spice tolerance?"
            subtitle="Not all dishes will be spicy - this just tells us how spicy the spicy dishes should be when they do appear."
            options={SPICE_OPTIONS}
            selected={[data.spice_tolerance]}
            onSelect={(v) => setSingleValue('spice_tolerance', v)}
            multiSelect={false}
            required
          />
        );
      case 8:
        return (
          <OnboardingStep
            title="Adventure level?"
            subtitle="How open are you to trying new things?"
            options={ADVENTURE_OPTIONS}
            selected={[data.adventure_level]}
            onSelect={(v) => setSingleValue('adventure_level', v)}
            multiSelect={false}
            required
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          disabled={currentStep === 0}
        >
          <Text style={[styles.backText, currentStep === 0 && styles.backTextDisabled]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={styles.stepIndicator}>
          {currentStep + 1} of {TOTAL_STEPS}
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>{renderStep()}</View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={saving || !canProceed()}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>
              {currentStep === TOTAL_STEPS - 1 ? "Let's Go!" : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>

        {currentStep < 3 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleNext}
          >
            <Text style={styles.skipText}>Skip for now</Text>
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
    width: 60,
  },
  backText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  backTextDisabled: {
    color: colors.textLight,
  },
  stepIndicator: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBg: {
    height: 6,
    backgroundColor: colors.inputBorder,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  footer: {
    padding: 20,
    gap: 12,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: colors.primaryLight,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  customStepContainer: {
    flex: 1,
  },
  stepHeader: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  stepSubtitle: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
  },
  required: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  cuisineInputsContainer: {
    gap: 16,
  },
  cuisineInput: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
  },
});

export default OnboardingScreen;
