import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, signOut } = useAuth();

  const firstName = user?.email?.split('@')[0] || 'there';

  const handleStartPlanning = () => {
    navigation.navigate('MealGoal');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey {firstName}!</Text>
            <Text style={styles.subGreeting}>Ready to plan your week?</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={signOut}>
            <Text style={styles.profileEmoji}>👋</Text>
          </TouchableOpacity>
        </View>

        {/* Main Card */}
        <View style={styles.mainCard}>
          <View style={styles.cardIconContainer}>
            <Text style={styles.cardIcon}>📅</Text>
          </View>
          <Text style={styles.cardTitle}>Plan Your Meals</Text>
          <Text style={styles.cardDescription}>
            Set your weekly goal, swipe on dishes you love, and get a personalized meal plan.
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartPlanning}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Planning</Text>
          </TouchableOpacity>
        </View>

        {/* How It Works */}
        <View style={styles.howItWorks}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.steps}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Set Your Goal</Text>
                <Text style={styles.stepDescription}>
                  Tell us how many meals you'll eat out this week
                </Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Swipe on Meals</Text>
                <Text style={styles.stepDescription}>
                  Right for yum, left for nope until you've got your week
                </Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Review & Confirm</Text>
                <Text style={styles.stepDescription}>
                  Remove any you've reconsidered, swipe for replacements
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresRow}>
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🤖</Text>
            <Text style={styles.featureTitle}>AI-Powered</Text>
            <Text style={styles.featureDescription}>
              Learns your taste preferences
            </Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🛒</Text>
            <Text style={styles.featureTitle}>Easy Shopping</Text>
            <Text style={styles.featureDescription}>
              Grocery lists coming soon
            </Text>
          </View>
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
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.text,
  },
  subGreeting: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 2,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B7355',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  profileEmoji: {
    fontSize: 22,
  },
  mainCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#8B7355',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    marginBottom: 24,
  },
  cardIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 40,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: '#fff',
  },
  howItWorks: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
  },
  steps: {
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primaryDark,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.text,
  },
  stepDescription: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default HomeScreen;
