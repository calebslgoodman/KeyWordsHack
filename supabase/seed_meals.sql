-- Seed data for meals table
-- Run this after creating the meals table to populate it with initial data

-- Insert all 21 meals (7 breakfast, 7 lunch, 7 dinner)
INSERT INTO meals (meal_id, name, image_url, meal_type, cuisine, description, calories, cook_time_minutes, ingredients, instructions) VALUES

-- BREAKFAST (7)
('breakfast_1', 'Avocado Toast with Eggs', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop', 'breakfast', 'American', 'Creamy avocado on toasted sourdough topped with perfectly poached eggs.', 420, 15,
'["1 ripe avocado", "2 eggs", "2 slices sourdough bread", "1 tbsp olive oil", "1 tsp everything bagel seasoning", "salt and pepper (optional)"]'::jsonb,
'["Toast 2 slices sourdough until golden", "Poach 2 eggs in simmering water for 3-4 minutes", "Mash 1 avocado with salt and pepper", "Spread avocado on toast, top with eggs", "Sprinkle with everything seasoning and drizzle olive oil"]'::jsonb),

('breakfast_2', 'Berry Açaí Bowl', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop', 'breakfast', 'American', 'Thick açaí blend topped with fresh berries and granola.', 380, 10,
'["1 packet frozen açaí (100g)", "1 frozen banana", "1/4 cup almond milk", "1/2 cup mixed berries", "1/4 cup granola", "2 tbsp coconut flakes (optional)", "1 tbsp honey (optional)"]'::jsonb,
'["Blend açaí with banana and 1/4 cup almond milk until thick", "Pour into bowl", "Top with 1/2 cup berries and 1/4 cup granola", "Add coconut flakes and drizzle with honey if desired"]'::jsonb),

('breakfast_3', 'Classic Pancake Stack', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop', 'breakfast', 'American', 'Fluffy buttermilk pancakes with maple syrup and blueberries.', 520, 20,
'["1.5 cups flour", "2 tbsp sugar", "2 tsp baking powder", "1 tsp salt", "1.25 cups buttermilk", "1 egg", "3 tbsp melted butter", "1/2 cup blueberries", "1/4 cup maple syrup"]'::jsonb,
'["Mix dry: 1.5 cups flour, 2 tbsp sugar, 2 tsp baking powder, 1 tsp salt", "Whisk wet: 1.25 cups buttermilk, 1 egg, 3 tbsp melted butter", "Combine until just mixed", "Cook 1/4 cup portions on griddle, flip when bubbly", "Serve with butter, blueberries, and maple syrup"]'::jsonb),

('breakfast_4', 'Greek Yogurt Parfait', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop', 'breakfast', 'Mediterranean', 'Layers of Greek yogurt, granola, and fresh berries.', 320, 5,
'["1 cup Greek yogurt", "1/3 cup granola", "1/2 cup strawberries", "1/4 cup blueberries", "1 tbsp honey (optional)"]'::jsonb,
'["Layer 1/2 cup yogurt in glass", "Add half the granola and berries", "Repeat layers", "Drizzle with honey if desired"]'::jsonb),

('breakfast_5', 'Breakfast Burrito', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop', 'breakfast', 'Mexican', 'Scrambled eggs, bacon, and cheese in a flour tortilla.', 480, 15,
'["3 eggs", "3 strips bacon", "1/4 cup shredded cheese", "1 large flour tortilla", "2 tbsp salsa", "1/4 avocado (optional)"]'::jsonb,
'["Cook 3 strips bacon until crispy, crumble", "Scramble 3 eggs", "Warm tortilla, add eggs, bacon, cheese, salsa", "Add avocado if desired, fold and roll"]'::jsonb),

('breakfast_6', 'Overnight Oats', 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=400&fit=crop', 'breakfast', 'American', 'Creamy oats soaked overnight with almond milk.', 350, 5,
'["1/2 cup rolled oats", "3/4 cup almond milk", "1 tbsp chia seeds", "1 tbsp maple syrup", "1 banana", "2 tbsp almonds (optional)"]'::jsonb,
'["Mix 1/2 cup oats, 3/4 cup almond milk, 1 tbsp chia seeds, 1 tbsp maple syrup", "Refrigerate overnight", "Top with sliced banana and almonds"]'::jsonb),

('breakfast_7', 'Veggie Omelette', 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&h=400&fit=crop', 'breakfast', 'French', 'Three-egg omelette with sautéed vegetables.', 380, 12,
'["3 eggs", "1/4 cup bell peppers", "1/4 cup onions", "1/2 cup spinach", "1/4 cup cheese", "2 tbsp butter", "salt and pepper (optional)"]'::jsonb,
'["Sauté peppers, onions, spinach in 1 tbsp butter", "Whisk 3 eggs with salt and pepper", "Cook eggs in 1 tbsp butter until edges set", "Add vegetables and cheese, fold in half"]'::jsonb),

-- LUNCH (7)
('lunch_1', 'Chicken Caesar Salad', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=400&fit=crop', 'lunch', 'Italian', 'Romaine lettuce with grilled chicken, parmesan, and Caesar dressing.', 450, 20,
'["1 chicken breast (6 oz)", "4 cups romaine lettuce", "1/4 cup parmesan", "1/2 cup croutons", "3 tbsp Caesar dressing", "black pepper (optional)"]'::jsonb,
'["Grill chicken 6-7 minutes per side, let rest", "Slice chicken into strips", "Toss romaine with Caesar dressing", "Top with chicken, parmesan, and croutons"]'::jsonb),

('lunch_2', 'Spicy Tuna Poke Bowl', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop', 'lunch', 'Japanese', 'Fresh ahi tuna over sushi rice with vegetables.', 520, 15,
'["6 oz ahi tuna", "1 cup sushi rice", "1/2 avocado", "1/2 cup edamame", "1/2 cucumber", "2 tbsp spicy mayo", "1 tbsp soy sauce", "1 tsp sesame oil", "sesame seeds (optional)"]'::jsonb,
'["Dice tuna, toss with soy sauce and sesame oil", "Place rice in bowl", "Arrange tuna, avocado, edamame, cucumber on top", "Drizzle with spicy mayo, garnish with sesame seeds"]'::jsonb),

('lunch_3', 'Turkey Club Sandwich', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop', 'lunch', 'American', 'Triple-decker with turkey, bacon, lettuce, and tomato.', 580, 10,
'["4 oz turkey", "3 strips bacon", "3 slices bread", "2 lettuce leaves", "2 tomato slices", "2 tbsp mayo"]'::jsonb,
'["Cook bacon until crispy", "Toast 3 slices bread", "Layer: toast, mayo, turkey, bacon", "Add second toast, lettuce, tomato", "Top with third toast, cut diagonally"]'::jsonb),

('lunch_4', 'Falafel Wrap', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=400&fit=crop', 'lunch', 'Mediterranean', 'Crispy falafel with hummus and vegetables in pita.', 480, 25,
'["4-5 falafel", "1 pita bread", "3 tbsp hummus", "2 tbsp tahini", "1/2 cup cucumber", "1/2 cup tomatoes", "lettuce (optional)"]'::jsonb,
'["Cook falafel 15 minutes until golden", "Warm pita", "Spread hummus inside pita", "Add falafel, cucumber, tomatoes, drizzle tahini", "Add lettuce if desired, wrap tightly"]'::jsonb),

('lunch_5', 'Pad Thai', 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=400&fit=crop', 'lunch', 'Thai', 'Stir-fried rice noodles with shrimp and peanuts.', 550, 25,
'["6 oz rice noodles", "6 shrimp", "1/2 cup tofu", "1 cup bean sprouts", "3 tbsp peanuts", "1 lime", "3 tbsp fish sauce", "2 tbsp tamarind", "1 tbsp sugar", "1 egg (optional)"]'::jsonb,
'["Soak noodles 30 minutes", "Mix fish sauce, tamarind, sugar", "Stir-fry tofu and shrimp until cooked", "Add noodles and sauce", "Top with bean sprouts, peanuts, and lime"]'::jsonb),

('lunch_6', 'Margherita Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop', 'lunch', 'Italian', 'Classic pizza with mozzarella, tomato, and basil.', 680, 20,
'["1 pizza dough (12 inch)", "1/2 cup tomato sauce", "8 oz mozzarella", "8-10 basil leaves", "2 tbsp olive oil", "salt (optional)"]'::jsonb,
'["Preheat oven to 475°F", "Roll dough to 12-inch circle", "Spread sauce, leaving 1-inch border", "Top with torn mozzarella, drizzle olive oil", "Bake 12-15 minutes, add fresh basil"]'::jsonb),

('lunch_7', 'Chicken Quesadilla', 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&h=400&fit=crop', 'lunch', 'Mexican', 'Grilled tortilla with chicken, cheese, and peppers.', 520, 15,
'["1 cup cooked chicken", "1 flour tortilla", "1 cup cheese", "1/2 cup bell peppers", "1/4 cup onions", "1 tsp cumin", "sour cream (optional)", "salsa (optional)"]'::jsonb,
'["Sauté peppers and onions", "Season chicken with cumin", "Add cheese, chicken, vegetables to half of tortilla", "Fold in half, cook 2-3 minutes per side", "Serve with sour cream and salsa"]'::jsonb),

-- DINNER (7)
('dinner_1', 'Grilled Salmon', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop', 'dinner', 'American', 'Grilled salmon with lemon herb butter and asparagus.', 480, 25,
'["1 salmon fillet (6 oz)", "1 bunch asparagus", "2 tbsp butter", "1 lemon", "1 tsp herbs", "2 cloves garlic", "1 tbsp olive oil", "salt and pepper (optional)"]'::jsonb,
'["Roast asparagus with olive oil and garlic at 425°F for 15 min", "Sear salmon skin-up 3 minutes, flip", "Bake 8-10 minutes", "Mix butter with lemon juice and herbs", "Top salmon with lemon butter, serve with asparagus"]'::jsonb),

('dinner_2', 'Beef Stir Fry', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', 'dinner', 'Chinese', 'Beef and vegetables in ginger soy sauce over rice.', 520, 20,
'["8 oz beef sirloin", "2 cups broccoli", "1 bell pepper", "1 cup rice", "3 tbsp soy sauce", "1 tbsp cornstarch", "1 tsp ginger", "2 cloves garlic", "2 tbsp oil"]'::jsonb,
'["Mix soy sauce, cornstarch, ginger, garlic", "Stir-fry beef 2-3 minutes", "Stir-fry vegetables 3-4 minutes", "Add beef and sauce, cook 2 minutes", "Serve over rice"]'::jsonb),

('dinner_3', 'Chicken Tikka Masala', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop', 'dinner', 'Indian', 'Chicken in creamy tomato curry sauce.', 580, 35,
'["1 lb chicken breast", "1 can (14 oz) tomatoes", "1/2 cup cream", "1 onion", "2 tbsp garam masala", "1 tbsp ginger", "3 cloves garlic", "2 cups rice", "2 tbsp oil", "cilantro (optional)"]'::jsonb,
'["Brown chicken, set aside", "Sauté onion, ginger, garlic, add garam masala", "Add tomatoes, simmer 10 minutes", "Return chicken, add cream", "Simmer 15 minutes, serve over rice"]'::jsonb),

('dinner_4', 'Spaghetti Carbonara', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop', 'dinner', 'Italian', 'Pasta with pancetta, egg, and parmesan.', 620, 25,
'["12 oz spaghetti", "6 oz pancetta", "3 egg yolks", "1 cup parmesan", "1 tsp black pepper", "salt (optional)"]'::jsonb,
'["Cook spaghetti, reserve 1 cup pasta water", "Fry pancetta until crispy", "Whisk egg yolks with parmesan", "Toss hot pasta with pancetta off heat", "Add egg mixture, toss with pasta water to create sauce"]'::jsonb),

('dinner_5', 'Korean BBQ Bowl', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop', 'dinner', 'Korean', 'Marinated beef over rice with kimchi.', 560, 30,
'["8 oz beef", "2 cups rice", "1/2 cup kimchi", "3 tbsp soy sauce", "2 tbsp sesame oil", "2 tbsp sugar", "2 cloves garlic", "1 tbsp gochujang", "2 green onions", "sesame seeds (optional)"]'::jsonb,
'["Marinate beef in soy sauce, sesame oil, sugar, garlic", "Cook beef over high heat 3-4 minutes", "Serve over rice", "Top with kimchi and gochujang", "Garnish with green onions and sesame seeds"]'::jsonb),

('dinner_6', 'Shrimp Tacos', 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=400&fit=crop', 'dinner', 'Mexican', 'Grilled shrimp tacos with cabbage slaw.', 420, 20,
'["12 shrimp", "4 corn tortillas", "1 cup cabbage", "1 avocado", "1/4 cup sour cream", "1 lime", "1 tsp chili powder", "1 tsp cumin", "cilantro (optional)"]'::jsonb,
'["Season shrimp with chili powder and cumin", "Toss cabbage with lime juice", "Blend avocado with sour cream", "Grill shrimp 2-3 minutes per side", "Fill tortillas with slaw and shrimp, drizzle with avocado crema"]'::jsonb),

('dinner_7', 'Mushroom Risotto', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=400&fit=crop', 'dinner', 'Italian', 'Creamy arborio rice with mushrooms and parmesan.', 480, 40,
'["1.5 cups arborio rice", "2 cups mushrooms", "4 cups broth", "1/2 cup white wine", "1/2 cup parmesan", "1 shallot", "3 tbsp butter", "salt and pepper (optional)"]'::jsonb,
'["Keep broth warm", "Sauté mushrooms in butter, set aside", "Sauté shallot, add rice, toast 2 minutes", "Add wine, stir until absorbed", "Add broth one ladle at a time, stirring for 20-25 minutes", "Stir in mushrooms and parmesan"]'::jsonb)

ON CONFLICT (meal_id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  meal_type = EXCLUDED.meal_type,
  cuisine = EXCLUDED.cuisine,
  description = EXCLUDED.description,
  calories = EXCLUDED.calories,
  cook_time_minutes = EXCLUDED.cook_time_minutes,
  ingredients = EXCLUDED.ingredients,
  instructions = EXCLUDED.instructions,
  updated_at = NOW();
