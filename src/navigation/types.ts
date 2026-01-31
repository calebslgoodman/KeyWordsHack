export type RootStackParamList = {
  Login: undefined;
  Onboarding: undefined;
  Home: undefined;
  Swipe: undefined;
  Recipe: { recipeId: string };
  Checkout: { ingredients: string[] };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
