export type RootStackParamList = {
  Login: undefined;
  Onboarding: undefined;
  Home: undefined;
  MealGoal: undefined;
  Swipe: undefined;
  SwipeReview: undefined;
  MealPlanSummary: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
