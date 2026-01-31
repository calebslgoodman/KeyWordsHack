# MealSwipe

Tinder for Food - Swipe-based food preference app with AI-powered recipe generation for students.

## Features

- **Swipe-based meal discovery** - Swipe right for yum, left for nope, up for maybe
- **9-step onboarding** - Capture dietary preferences, allergies, budget, and cooking constraints
- **21 meal cards** - 7 breakfast, 7 lunch, 7 dinner options
- **Confidence rating** - Rate how sure you are about each swipe (1-5)
- **Review & adjust** - Change your mind before confirming
- **Supabase backend** - Secure auth and data persistence

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase/schema.sql`
3. Enable Email auth in Authentication > Providers
4. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

5. Add your Supabase credentials to `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Configure Auth Redirect (for email verification)

In Supabase Dashboard:
1. Go to Authentication > URL Configuration
2. Set Site URL to: `mealswipe://`
3. Add Redirect URLs: `mealswipe://auth/callback`, `mealswipe://**`

### 4. Run the app

```bash
npm start
```

Press `i` for iOS simulator, `a` for Android, or `w` for web.

## Project Structure

```
├── App.tsx                          # Entry point
├── src/
│   ├── components/
│   │   ├── AnimatedLogo.tsx         # Swipe animation logo
│   │   ├── ConfidenceSelector.tsx   # Rate confidence modal
│   │   ├── MealDetailModal.tsx      # Meal details view
│   │   ├── OnboardingStep.tsx       # Reusable onboarding step
│   │   └── SwipeCard.tsx            # Swipeable meal card
│   ├── constants/
│   │   └── colors.ts                # App color palette
│   ├── contexts/
│   │   └── AuthContext.tsx          # Auth state management
│   ├── data/
│   │   └── meals.ts                 # 21 meal definitions
│   ├── hooks/
│   │   └── useEmailAuth.ts          # Email auth hook
│   ├── lib/
│   │   ├── api.ts                   # Supabase API helpers
│   │   └── supabase.ts              # Supabase client
│   ├── navigation/
│   │   ├── AppNavigator.tsx         # Navigation setup
│   │   └── types.ts                 # Navigation types
│   ├── screens/
│   │   ├── HomeScreen.tsx           # Main home
│   │   ├── LoginScreen.tsx          # Auth screen
│   │   ├── OnboardingScreen.tsx     # 9-step onboarding
│   │   ├── SwipeScreen.tsx          # Meal swiping
│   │   └── SwipeReviewScreen.tsx    # Review swipes
│   └── types/
│       └── index.ts                 # TypeScript types
└── supabase/
    └── schema.sql                   # Database schema
```

## User Flow

1. **Login** - Email/password authentication
2. **Onboarding** (new users only):
   - Allergies
   - Dietary restrictions
   - Disliked ingredients
   - Cooking time preference
   - Budget per meal
   - Kitchen appliances
   - Favorite cuisines (max 3)
   - Spice tolerance
   - Adventure level
3. **Swipe** - 21 meals with tap-to-view details
4. **Review** - Adjust choices before confirming
5. **Home** - Start swiping again anytime

## Data Structures

### Taste Profile (onboarding)
```json
{
  "user_id": "uuid",
  "hard_exclusions": {
    "allergies": ["Peanuts"],
    "dietary_restrictions": ["Vegetarian"]
  },
  "taste_profile": {
    "disliked_ingredients": ["Cilantro"],
    "preferred_cuisines": ["Italian", "Japanese"],
    "spice_tolerance": "medium",
    "adventure_level": "balanced"
  },
  "strategy_constraints": {
    "max_cook_time_minutes": 30,
    "budget_range": "moderate",
    "kitchen_tools": ["Stovetop", "Oven"]
  },
  "metadata": {
    "completed_at": "ISO8601"
  }
}
```

### Food Swipe
```json
{
  "user_id": "uuid",
  "meal_id": "breakfast_1",
  "meal_type": "breakfast",
  "swipe": "right",
  "confidence": 4,
  "timestamp": "ISO8601"
}
```
