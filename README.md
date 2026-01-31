# SwipeMeal

Tinder for Food - Swipe-based food preference app with AI-powered recipe generation.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Enable Google Auth in Authentication > Providers
3. Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add `swipemeal://` as an authorized redirect URI
4. Add the credentials to your Supabase Google provider settings

### 4. Run the app

```bash
npm start
```

Then scan the QR code with Expo Go (Android) or Camera app (iOS).

## Project Structure

```
├── App.tsx                    # App entry point
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx    # Auth state management
│   ├── hooks/
│   │   └── useGoogleAuth.ts   # Google OAuth hook
│   ├── lib/
│   │   └── supabase.ts        # Supabase client
│   ├── navigation/
│   │   ├── AppNavigator.tsx   # Navigation setup
│   │   └── types.ts           # Navigation types
│   └── screens/
│       ├── LoginScreen.tsx    # Login UI
│       └── HomeScreen.tsx     # Home after login
```
