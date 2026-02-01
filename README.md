# MealSwipe

Tinder for Food - AI-powered swipe-based meal planning app for students.

Built for the Keywords AI Hackathon - all LLM calls routed through **Keywords AI Gateway** with **Prompt Management**.

## AI-Powered Features (via Keywords AI)

| Feature | Description | Prompt ID |
|---------|-------------|-----------|
| **Smart Recommendations** | Personalized meal suggestions based on taste profile & swipe history | `meal_recommendation_v1` |
| **AI Grocery List** | Organized shopping list by store section with cost estimates | `grocery_list_generator_v1` |
| **Meal Plan Insights** | Nutritional analysis, variety scoring, and weekly prep tips | `meal_plan_insights_v1` |
| **Recipe Adaptation** | Adapts recipes for allergies and dietary restrictions | `recipe_adaptation_v1` |

## Core Features

- **Swipe-based meal discovery** - Swipe right for yum, left for nope
- **9-step onboarding** - Capture dietary preferences, allergies, budget, and cooking constraints
- **Weekly meal planning** - Set goals and build your meal plan
- **AI recommendation banners** - Expandable AI suggestions with confidence scores
- **Smart grocery lists** - AI-generated shopping lists organized by store section
- **Meal plan analysis** - AI scores and insights for your weekly plan
- **Supabase backend** - Secure auth and data persistence

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MealSwipe Mobile App                            │
│                      (React Native + Expo)                              │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Keywords AI Gateway                                  │
│              https://api.keywordsai.co/api/chat/completions             │
│                                                                          │
│  Features Used:                                                          │
│  ✓ Unified API for 250+ LLMs (using Gemini 1.5 Flash)                  │
│  ✓ Prompt Management (versioned, deployed prompts)                      │
│  ✓ Variable substitution in prompts                                     │
│  ✓ Request monitoring and analytics                                     │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Google Gemini 1.5 Flash                              │
│              (LLM Provider via Keywords AI Gateway)                      │
└─────────────────────────────────────────────────────────────────────────┘
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase/schema.sql`
3. Enable Email auth in Authentication > Providers

### 3. Configure Keywords AI

1. Create account at [platform.keywordsai.co](https://platform.keywordsai.co)
2. Generate an API key
3. Add your Gemini API key to Keywords AI credentials
4. Create the 4 prompts (see `KEYWORDS_AI_SETUP.md` for full details)

### 4. Environment Variables

Create `.env` file:

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Keywords AI Gateway
EXPO_PUBLIC_KEYWORDS_AI_API_KEY=your_keywords_ai_key
EXPO_PUBLIC_KEYWORDS_AI_BASE_URL=https://api.keywordsai.co/api

# Keywords AI Prompt IDs
EXPO_PUBLIC_PROMPT_MEAL_RECOMMENDATION=your_prompt_id
EXPO_PUBLIC_PROMPT_GROCERY_LIST=your_prompt_id
EXPO_PUBLIC_PROMPT_MEAL_INSIGHTS=your_prompt_id
EXPO_PUBLIC_PROMPT_RECIPE_ADAPTATION=your_prompt_id
```

### 5. Run the app

```bash
npm start
```

Press `i` for iOS simulator, `a` for Android, or `w` for web.

## Project Structure

```
├── App.tsx                          # Entry point
├── KEYWORDS_AI_SETUP.md             # Complete Keywords AI setup guide
├── src/
│   ├── components/
│   │   ├── AnimatedLogo.tsx         # Swipe animation logo
│   │   ├── MealDetailModal.tsx      # Meal details view
│   │   ├── OnboardingStep.tsx       # Reusable onboarding step
│   │   └── SwipeCard.tsx            # Swipeable meal card
│   ├── constants/
│   │   ├── colors.ts                # App color palette
│   │   └── fonts.ts                 # Typography
│   ├── contexts/
│   │   ├── AuthContext.tsx          # Auth state management
│   │   └── MealPlanContext.tsx      # Meal plan state
│   ├── data/
│   │   └── meals.ts                 # Meal definitions
│   ├── lib/
│   │   ├── api.ts                   # Supabase API helpers
│   │   ├── keywords-ai.ts           # Keywords AI Gateway integration
│   │   └── supabase.ts              # Supabase client
│   ├── navigation/
│   │   ├── AppNavigator.tsx         # Navigation setup
│   │   └── types.ts                 # Navigation types
│   ├── screens/
│   │   ├── HomeScreen.tsx           # Main dashboard
│   │   ├── LoginScreen.tsx          # Auth screen
│   │   ├── MealGoalScreen.tsx       # Set weekly meal goals
│   │   ├── MealPlanSummaryScreen.tsx # AI insights & grocery list
│   │   ├── OnboardingScreen.tsx     # 9-step onboarding
│   │   ├── SwipeScreen.tsx          # Meal swiping with AI recs
│   │   └── SwipeReviewScreen.tsx    # Review & confirm plan
│   └── types/
│       └── index.ts                 # TypeScript types (incl. AI types)
└── supabase/
    └── schema.sql                   # Database schema
```

## User Flow

1. **Login** - Email/password authentication
2. **Onboarding** (new users):
   - Allergies, dietary restrictions, disliked ingredients
   - Cooking time, budget, kitchen appliances
   - Favorite cuisines, spice tolerance, adventure level
3. **Set Goal** - Choose meals per week and max cook time
4. **Swipe** - Discover meals with AI recommendation banners
5. **Review** - Adjust selections before confirming
6. **Summary** - View AI insights, scores, and generate grocery list

## Keywords AI Integration

All AI features are powered through Keywords AI Gateway:

```typescript
// Example: How MealSwipe calls Keywords AI
const response = await fetch('https://api.keywordsai.co/api/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${KEYWORDS_AI_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'gemini/gemini-1.5-flash',
    messages: [{ role: 'user', content: 'placeholder' }],
    prompt: {
      prompt_id: 'meal_recommendation_v1',
      variables: {
        allergies: 'Peanuts, Tree Nuts',
        dietary_restrictions: 'Vegetarian',
        preferred_cuisines: 'Italian, Mexican',
        // ... dynamic user data
      },
      override: true,
    },
  }),
});
```

Key files:
- `src/lib/keywords-ai.ts` - Gateway service layer
- `src/types/index.ts` - AI response types
- `KEYWORDS_AI_SETUP.md` - Complete prompt configurations

## Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Supabase (Auth + PostgreSQL)
- **AI Gateway**: Keywords AI
- **LLM**: Google Gemini 1.5 Flash
- **Language**: TypeScript

## Hackathon Submission Checklist

- [x] All LLM calls routed through Keywords AI Gateway
- [x] Prompts managed via Keywords AI Prompt Management
- [x] Variable substitution (not hardcoded prompts)
- [x] Multiple AI features (recommendations, grocery, insights, adaptation)
- [x] Graceful fallbacks when AI unavailable
- [x] TypeScript types for all AI responses
- [x] Clean service layer architecture
