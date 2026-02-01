# Quick Start: Enable AI Meals

Get AI-powered personalized meals in 5 minutes.

## Step 1: Get Keywords AI API Key (2 minutes)

1. Go to [https://keywordsai.co](https://keywordsai.co)
2. Sign up (free tier available)
3. Click "API Keys" in dashboard
4. Create new key → Copy it

## Step 2: Create Prompt (2 minutes)

1. In Keywords AI dashboard, go to "Prompts"
2. Click "New Prompt"
3. Name it: `recipe-generation-v1`
4. Add this prompt:

```
You are a creative chef and meal planning expert. Generate personalized meal recommendations based on user preferences.

Rules:
- Respect ALL dietary restrictions and allergies
- Match the user's spice tolerance and adventure level
- Stay within cooking time constraints
- Suggest diverse cuisines that match preferences
- Include breakfast, lunch, and dinner options

User Preferences:
- Allergies: {{allergies}}
- Dietary Restrictions: {{dietary_restrictions}}
- Disliked Ingredients: {{disliked_ingredients}}
- Preferred Cuisines: {{cuisines}}
- Spice Tolerance: {{spice_level}}
- Adventure Level: {{adventure_level}}
- Max Cook Time: {{max_cook_time}} minutes
- Budget: {{budget}}

Generate meals in JSON array format with these fields for each meal:
- name (string)
- meal_type (breakfast/lunch/dinner)
- cuisine (string)
- description (string)
- calories (number)
- cook_time_minutes (number)
- ingredients (array of strings)
- instructions (array of strings)

Return ONLY the JSON array, no other text.
```

5. Save prompt → Copy the **Prompt ID**

## Step 3: Add to .env (1 minute)

Open `.env` file and update:

```bash
EXPO_PUBLIC_KEYWORDS_AI_API_KEY=your_actual_api_key_here
EXPO_PUBLIC_KEYWORDS_AI_PROMPT_ID=your_actual_prompt_id_here
```

Replace the placeholder values with your actual credentials.

## Step 4: Restart App

```bash
npm start
```

## Verify It's Working

1. Log in to the app
2. Complete onboarding (if not done already)
3. Start meal planning
4. You should see:
   - "Generating personalized meals..." when loading
   - "AI Personalized ✨" in the swipe screen header
   - More meal options to swipe through

## Troubleshooting

### "Loading meals..." instead of "Generating personalized meals..."

- Check that API key and prompt ID are in `.env`
- Make sure you restarted the app after adding to `.env`

### No extra meals showing up?

- Complete the onboarding first (AI needs your taste profile)
- Check console for errors:
  - Look for 🤖 and ✨ emoji logs
  - Any red error messages about AI

### Still not working?

See [AI_INTEGRATION.md](AI_INTEGRATION.md) for detailed troubleshooting.

## What You Get

With AI enabled:
- **21 base meals** (hardcoded)
- **+10 AI meals** (personalized to your preferences)
- **= 31 total meal options** per session

The AI generates new meals each time you start the meal planning flow, so you get fresh recommendations every week!

## Cost

- Keywords AI free tier: Generous limits for personal use
- Gemini 2.0 Flash: ~$0.0001 per request (very cheap)
- 10 meals per session ≈ fractions of a penny per use

## Next Steps

- Read [AI_INTEGRATION.md](AI_INTEGRATION.md) for advanced features
- Customize number of AI meals in `src/screens/SwipeScreen.tsx:46`
- Add more AI features like meal variations and custom recipes
