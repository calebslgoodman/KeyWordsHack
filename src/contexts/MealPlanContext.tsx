import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodSwipe, Meal } from '../types';
import { getFoodSwipes, getMealPlanGoal } from '../lib/api';
import { useAuth } from './AuthContext';

interface MealPlanContextType {
  mealsOutCount: number;
  mealsToSwipe: number;
  targetMeals: number;
  swipes: FoodSwipe[];
  acceptedMeals: FoodSwipe[];
  setMealsOutCount: (count: number) => void;
  setSwipes: (swipes: FoodSwipe[]) => void;
  addSwipe: (swipe: FoodSwipe) => void;
  removeSwipe: (mealId: string) => void;
  updateSwipe: (mealId: string, updates: Partial<FoodSwipe>) => void;
  resetPlan: () => void;
  getMealsToReswipe: () => number;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export const useMealPlan = () => {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
};

export const MealPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [mealsOutCount, setMealsOutCount] = useState(0);
  const [swipes, setSwipes] = useState<FoodSwipe[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load user's swipes and meal plan goal from Supabase on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id || loaded) return;

      console.log('Loading user meal plan data from Supabase...');

      // Load swipes
      const userSwipes = await getFoodSwipes(user.id);
      if (userSwipes.length > 0) {
        console.log(`Loaded ${userSwipes.length} swipes from Supabase`);
        setSwipes(userSwipes);
      }

      // Load meal plan goal
      const mealPlanGoal = await getMealPlanGoal(user.id);
      if (mealPlanGoal) {
        console.log('Loaded meal plan goal:', mealPlanGoal);
        const mealsOut = 21 - mealPlanGoal.meals_per_week;
        setMealsOutCount(mealsOut);
      }

      setLoaded(true);
    };

    loadUserData();
  }, [user?.id]);

  // Calculate derived values
  const mealsToSwipe = 21 - mealsOutCount; // Total meals in a week minus eating out
  const targetMeals = mealsToSwipe; // Number of "right" swipes needed
  const acceptedMeals = swipes.filter(s => s.swipe === 'right');

  const addSwipe = (swipe: FoodSwipe) => {
    setSwipes(prev => [...prev, swipe]);
  };

  const removeSwipe = (mealId: string) => {
    setSwipes(prev => prev.filter(s => s.meal_id !== mealId));
  };

  const updateSwipe = (mealId: string, updates: Partial<FoodSwipe>) => {
    setSwipes(prev =>
      prev.map(s => (s.meal_id === mealId ? { ...s, ...updates } : s))
    );
  };

  const resetPlan = () => {
    setMealsOutCount(0);
    setSwipes([]);
  };

  const getMealsToReswipe = () => {
    // How many more "right" swipes are needed
    return Math.max(0, targetMeals - acceptedMeals.length);
  };

  return (
    <MealPlanContext.Provider
      value={{
        mealsOutCount,
        mealsToSwipe,
        targetMeals,
        swipes,
        acceptedMeals,
        setMealsOutCount,
        setSwipes,
        addSwipe,
        removeSwipe,
        updateSwipe,
        resetPlan,
        getMealsToReswipe,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
};
