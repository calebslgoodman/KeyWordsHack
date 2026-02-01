import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from './types';
import { colors } from '../constants/colors';

// Screens
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import MealGoalScreen from '../screens/MealGoalScreen';
import SwipeScreen from '../screens/SwipeScreen';
import SwipeReviewScreen from '../screens/SwipeReviewScreen';
import MealPlanSummaryScreen from '../screens/MealPlanSummaryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const LoadingScreen = () => (
  <View style={styles.loading}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

const AppNavigator: React.FC = () => {
  const { user, loading, hasOnboarded } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  const linking = {
    prefixes: ['exp://', 'mealswipe://', 'http://localhost:8000'],
    config: {
      screens: {
        MealPlanSummary: 'callback',
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        {!user ? (
          // Unauthenticated
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : !hasOnboarded ? (
          // Authenticated but needs onboarding
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="MealGoal" component={MealGoalScreen} />
            <Stack.Screen name="Swipe" component={SwipeScreen} />
            <Stack.Screen name="SwipeReview" component={SwipeReviewScreen} />
            <Stack.Screen name="MealPlanSummary" component={MealPlanSummaryScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
          </>
        ) : (
          // Fully authenticated and onboarded
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="MealGoal" component={MealGoalScreen} />
            <Stack.Screen name="Swipe" component={SwipeScreen} />
            <Stack.Screen name="SwipeReview" component={SwipeReviewScreen} />
            <Stack.Screen name="MealPlanSummary" component={MealPlanSummaryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default AppNavigator;
