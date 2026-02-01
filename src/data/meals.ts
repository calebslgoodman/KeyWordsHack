import { Meal } from '../types';

// 21 meals: 7 breakfast, 7 lunch, 7 dinner
export const MEALS: Meal[] = [
  // BREAKFAST (7)
  {
    meal_id: 'breakfast_1',
    name: 'Avocado Toast with Eggs',
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop',
    meal_type: 'breakfast',
    cuisine: 'American',
    description: 'Creamy avocado on toasted sourdough topped with perfectly poached eggs.',
    calories: 420,
    cook_time_minutes: 15,
    ingredients: ['1 ripe avocado', '2 eggs', '2 slices sourdough bread', '1 tbsp olive oil', '1 tsp everything bagel seasoning', 'salt and pepper (optional)'],
    instructions: [
      'Toast 2 slices sourdough until golden',
      'Poach 2 eggs in simmering water for 3-4 minutes',
      'Mash 1 avocado with salt and pepper',
      'Spread avocado on toast, top with eggs',
      'Sprinkle with everything seasoning and drizzle olive oil'
    ],
  },
  {
    meal_id: 'breakfast_2',
    name: 'Berry Açaí Bowl',
    image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop',
    meal_type: 'breakfast',
    cuisine: 'American',
    description: 'Thick açaí blend topped with fresh berries and granola.',
    calories: 380,
    cook_time_minutes: 10,
    ingredients: ['1 packet frozen açaí (100g)', '1 frozen banana', '1/4 cup almond milk', '1/2 cup mixed berries', '1/4 cup granola', '2 tbsp coconut flakes (optional)', '1 tbsp honey (optional)'],
    instructions: [
      'Blend açaí with banana and 1/4 cup almond milk until thick',
      'Pour into bowl',
      'Top with 1/2 cup berries and 1/4 cup granola',
      'Add coconut flakes and drizzle with honey if desired'
    ],
  },
  {
    meal_id: 'breakfast_3',
    name: 'Classic Pancake Stack',
    image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    meal_type: 'breakfast',
    cuisine: 'American',
    description: 'Fluffy buttermilk pancakes with maple syrup and blueberries.',
    calories: 520,
    cook_time_minutes: 20,
    ingredients: ['1.5 cups flour', '2 tbsp sugar', '2 tsp baking powder', '1 tsp salt', '1.25 cups buttermilk', '1 egg', '3 tbsp melted butter', '1/2 cup blueberries', '1/4 cup maple syrup'],
    instructions: [
      'Mix dry: 1.5 cups flour, 2 tbsp sugar, 2 tsp baking powder, 1 tsp salt',
      'Whisk wet: 1.25 cups buttermilk, 1 egg, 3 tbsp melted butter',
      'Combine until just mixed',
      'Cook 1/4 cup portions on griddle, flip when bubbly',
      'Serve with butter, blueberries, and maple syrup'
    ],
  },
  {
    meal_id: 'breakfast_4',
    name: 'Greek Yogurt Parfait',
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
    meal_type: 'breakfast',
    cuisine: 'Mediterranean',
    description: 'Layers of Greek yogurt, granola, and fresh berries.',
    calories: 320,
    cook_time_minutes: 5,
    ingredients: ['1 cup Greek yogurt', '1/3 cup granola', '1/2 cup strawberries', '1/4 cup blueberries', '1 tbsp honey (optional)'],
    instructions: [
      'Layer 1/2 cup yogurt in glass',
      'Add half the granola and berries',
      'Repeat layers',
      'Drizzle with honey if desired'
    ],
  },
  {
    meal_id: 'breakfast_5',
    name: 'Breakfast Burrito',
    image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop',
    meal_type: 'breakfast',
    cuisine: 'Mexican',
    description: 'Scrambled eggs, bacon, and cheese in a flour tortilla.',
    calories: 480,
    cook_time_minutes: 15,
    ingredients: ['3 eggs', '3 strips bacon', '1/4 cup shredded cheese', '1 large flour tortilla', '2 tbsp salsa', '1/4 avocado (optional)'],
    instructions: [
      'Cook 3 strips bacon until crispy, crumble',
      'Scramble 3 eggs',
      'Warm tortilla, add eggs, bacon, cheese, salsa',
      'Add avocado if desired, fold and roll'
    ],
  },
  {
    meal_id: 'breakfast_6',
    name: 'Overnight Oats',
    image_url: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=400&fit=crop',
    meal_type: 'breakfast',
    cuisine: 'American',
    description: 'Creamy oats soaked overnight with almond milk.',
    calories: 350,
    cook_time_minutes: 5,
    ingredients: ['1/2 cup rolled oats', '3/4 cup almond milk', '1 tbsp chia seeds', '1 tbsp maple syrup', '1 banana', '2 tbsp almonds (optional)'],
    instructions: [
      'Mix 1/2 cup oats, 3/4 cup almond milk, 1 tbsp chia seeds, 1 tbsp maple syrup',
      'Refrigerate overnight',
      'Top with sliced banana and almonds'
    ],
  },
  {
    meal_id: 'breakfast_7',
    name: 'Veggie Omelette',
    image_url: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&h=400&fit=crop',
    meal_type: 'breakfast',
    cuisine: 'French',
    description: 'Three-egg omelette with sautéed vegetables.',
    calories: 380,
    cook_time_minutes: 12,
    ingredients: ['3 eggs', '1/4 cup bell peppers', '1/4 cup onions', '1/2 cup spinach', '1/4 cup cheese', '2 tbsp butter', 'salt and pepper (optional)'],
    instructions: [
      'Sauté peppers, onions, spinach in 1 tbsp butter',
      'Whisk 3 eggs with salt and pepper',
      'Cook eggs in 1 tbsp butter until edges set',
      'Add vegetables and cheese, fold in half'
    ],
  },

  // LUNCH (7)
  {
    meal_id: 'lunch_1',
    name: 'Chicken Caesar Salad',
    image_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=400&fit=crop',
    meal_type: 'lunch',
    cuisine: 'Italian',
    description: 'Romaine lettuce with grilled chicken, parmesan, and Caesar dressing.',
    calories: 450,
    cook_time_minutes: 20,
    ingredients: ['1 chicken breast (6 oz)', '4 cups romaine lettuce', '1/4 cup parmesan', '1/2 cup croutons', '3 tbsp Caesar dressing', 'black pepper (optional)'],
    instructions: [
      'Grill chicken 6-7 minutes per side, let rest',
      'Slice chicken into strips',
      'Toss romaine with Caesar dressing',
      'Top with chicken, parmesan, and croutons'
    ],
  },
  {
    meal_id: 'lunch_2',
    name: 'Spicy Tuna Poke Bowl',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    meal_type: 'lunch',
    cuisine: 'Japanese',
    description: 'Fresh ahi tuna over sushi rice with vegetables.',
    calories: 520,
    cook_time_minutes: 15,
    ingredients: ['6 oz ahi tuna', '1 cup sushi rice', '1/2 avocado', '1/2 cup edamame', '1/2 cucumber', '2 tbsp spicy mayo', '1 tbsp soy sauce', '1 tsp sesame oil', 'sesame seeds (optional)'],
    instructions: [
      'Dice tuna, toss with soy sauce and sesame oil',
      'Place rice in bowl',
      'Arrange tuna, avocado, edamame, cucumber on top',
      'Drizzle with spicy mayo, garnish with sesame seeds'
    ],
  },
  {
    meal_id: 'lunch_3',
    name: 'Turkey Club Sandwich',
    image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop',
    meal_type: 'lunch',
    cuisine: 'American',
    description: 'Triple-decker with turkey, bacon, lettuce, and tomato.',
    calories: 580,
    cook_time_minutes: 10,
    ingredients: ['4 oz turkey', '3 strips bacon', '3 slices bread', '2 lettuce leaves', '2 tomato slices', '2 tbsp mayo'],
    instructions: [
      'Cook bacon until crispy',
      'Toast 3 slices bread',
      'Layer: toast, mayo, turkey, bacon',
      'Add second toast, lettuce, tomato',
      'Top with third toast, cut diagonally'
    ],
  },
  {
    meal_id: 'lunch_4',
    name: 'Falafel Wrap',
    image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=400&fit=crop',
    meal_type: 'lunch',
    cuisine: 'Mediterranean',
    description: 'Crispy falafel with hummus and vegetables in pita.',
    calories: 480,
    cook_time_minutes: 25,
    ingredients: ['4-5 falafel', '1 pita bread', '3 tbsp hummus', '2 tbsp tahini', '1/2 cup cucumber', '1/2 cup tomatoes', 'lettuce (optional)'],
    instructions: [
      'Cook falafel 15 minutes until golden',
      'Warm pita',
      'Spread hummus inside pita',
      'Add falafel, cucumber, tomatoes, drizzle tahini',
      'Add lettuce if desired, wrap tightly'
    ],
  },
  {
    meal_id: 'lunch_5',
    name: 'Pad Thai',
    image_url: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=400&fit=crop',
    meal_type: 'lunch',
    cuisine: 'Thai',
    description: 'Stir-fried rice noodles with shrimp and peanuts.',
    calories: 550,
    cook_time_minutes: 25,
    ingredients: ['6 oz rice noodles', '6 shrimp', '1/2 cup tofu', '1 cup bean sprouts', '3 tbsp peanuts', '1 lime', '3 tbsp fish sauce', '2 tbsp tamarind', '1 tbsp sugar', '1 egg (optional)'],
    instructions: [
      'Soak noodles 30 minutes',
      'Mix fish sauce, tamarind, sugar',
      'Stir-fry tofu and shrimp until cooked',
      'Add noodles and sauce',
      'Top with bean sprouts, peanuts, and lime'
    ],
  },
  {
    meal_id: 'lunch_6',
    name: 'Margherita Pizza',
    image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop',
    meal_type: 'lunch',
    cuisine: 'Italian',
    description: 'Classic pizza with mozzarella, tomato, and basil.',
    calories: 680,
    cook_time_minutes: 20,
    ingredients: ['1 pizza dough (12 inch)', '1/2 cup tomato sauce', '8 oz mozzarella', '8-10 basil leaves', '2 tbsp olive oil', 'salt (optional)'],
    instructions: [
      'Preheat oven to 475°F',
      'Roll dough to 12-inch circle',
      'Spread sauce, leaving 1-inch border',
      'Top with torn mozzarella, drizzle olive oil',
      'Bake 12-15 minutes, add fresh basil'
    ],
  },
  {
    meal_id: 'lunch_7',
    name: 'Chicken Quesadilla',
    image_url: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&h=400&fit=crop',
    meal_type: 'lunch',
    cuisine: 'Mexican',
    description: 'Grilled tortilla with chicken, cheese, and peppers.',
    calories: 520,
    cook_time_minutes: 15,
    ingredients: ['1 cup cooked chicken', '1 flour tortilla', '1 cup cheese', '1/2 cup bell peppers', '1/4 cup onions', '1 tsp cumin', 'sour cream (optional)', 'salsa (optional)'],
    instructions: [
      'Sauté peppers and onions',
      'Season chicken with cumin',
      'Add cheese, chicken, vegetables to half of tortilla',
      'Fold in half, cook 2-3 minutes per side',
      'Serve with sour cream and salsa'
    ],
  },

  // DINNER (7)
  {
    meal_id: 'dinner_1',
    name: 'Grilled Salmon',
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop',
    meal_type: 'dinner',
    cuisine: 'American',
    description: 'Grilled salmon with lemon herb butter and asparagus.',
    calories: 480,
    cook_time_minutes: 25,
    ingredients: ['1 salmon fillet (6 oz)', '1 bunch asparagus', '2 tbsp butter', '1 lemon', '1 tsp herbs', '2 cloves garlic', '1 tbsp olive oil', 'salt and pepper (optional)'],
    instructions: [
      'Roast asparagus with olive oil and garlic at 425°F for 15 min',
      'Sear salmon skin-up 3 minutes, flip',
      'Bake 8-10 minutes',
      'Mix butter with lemon juice and herbs',
      'Top salmon with lemon butter, serve with asparagus'
    ],
  },
  {
    meal_id: 'dinner_2',
    name: 'Beef Stir Fry',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop',
    meal_type: 'dinner',
    cuisine: 'Chinese',
    description: 'Beef and vegetables in ginger soy sauce over rice.',
    calories: 520,
    cook_time_minutes: 20,
    ingredients: ['8 oz beef sirloin', '2 cups broccoli', '1 bell pepper', '1 cup rice', '3 tbsp soy sauce', '1 tbsp cornstarch', '1 tsp ginger', '2 cloves garlic', '2 tbsp oil'],
    instructions: [
      'Mix soy sauce, cornstarch, ginger, garlic',
      'Stir-fry beef 2-3 minutes',
      'Stir-fry vegetables 3-4 minutes',
      'Add beef and sauce, cook 2 minutes',
      'Serve over rice'
    ],
  },
  {
    meal_id: 'dinner_3',
    name: 'Chicken Tikka Masala',
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop',
    meal_type: 'dinner',
    cuisine: 'Indian',
    description: 'Chicken in creamy tomato curry sauce.',
    calories: 580,
    cook_time_minutes: 35,
    ingredients: ['1 lb chicken breast', '1 can (14 oz) tomatoes', '1/2 cup cream', '1 onion', '2 tbsp garam masala', '1 tbsp ginger', '3 cloves garlic', '2 cups rice', '2 tbsp oil', 'cilantro (optional)'],
    instructions: [
      'Brown chicken, set aside',
      'Sauté onion, ginger, garlic, add garam masala',
      'Add tomatoes, simmer 10 minutes',
      'Return chicken, add cream',
      'Simmer 15 minutes, serve over rice'
    ],
  },
  {
    meal_id: 'dinner_4',
    name: 'Spaghetti Carbonara',
    image_url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop',
    meal_type: 'dinner',
    cuisine: 'Italian',
    description: 'Pasta with pancetta, egg, and parmesan.',
    calories: 620,
    cook_time_minutes: 25,
    ingredients: ['12 oz spaghetti', '6 oz pancetta', '3 egg yolks', '1 cup parmesan', '1 tsp black pepper', 'salt (optional)'],
    instructions: [
      'Cook spaghetti, reserve 1 cup pasta water',
      'Fry pancetta until crispy',
      'Whisk egg yolks with parmesan',
      'Toss hot pasta with pancetta off heat',
      'Add egg mixture, toss with pasta water to create sauce'
    ],
  },
  {
    meal_id: 'dinner_5',
    name: 'Korean BBQ Bowl',
    image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop',
    meal_type: 'dinner',
    cuisine: 'Korean',
    description: 'Marinated beef over rice with kimchi.',
    calories: 560,
    cook_time_minutes: 30,
    ingredients: ['8 oz beef', '2 cups rice', '1/2 cup kimchi', '3 tbsp soy sauce', '2 tbsp sesame oil', '2 tbsp sugar', '2 cloves garlic', '1 tbsp gochujang', '2 green onions', 'sesame seeds (optional)'],
    instructions: [
      'Marinate beef in soy sauce, sesame oil, sugar, garlic',
      'Cook beef over high heat 3-4 minutes',
      'Serve over rice',
      'Top with kimchi and gochujang',
      'Garnish with green onions and sesame seeds'
    ],
  },
  {
    meal_id: 'dinner_6',
    name: 'Shrimp Tacos',
    image_url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=400&fit=crop',
    meal_type: 'dinner',
    cuisine: 'Mexican',
    description: 'Grilled shrimp tacos with cabbage slaw.',
    calories: 420,
    cook_time_minutes: 20,
    ingredients: ['12 shrimp', '4 corn tortillas', '1 cup cabbage', '1 avocado', '1/4 cup sour cream', '1 lime', '1 tsp chili powder', '1 tsp cumin', 'cilantro (optional)'],
    instructions: [
      'Season shrimp with chili powder and cumin',
      'Toss cabbage with lime juice',
      'Blend avocado with sour cream',
      'Grill shrimp 2-3 minutes per side',
      'Fill tortillas with slaw and shrimp, drizzle with avocado crema'
    ],
  },
  {
    meal_id: 'dinner_7',
    name: 'Mushroom Risotto',
    image_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=400&fit=crop',
    meal_type: 'dinner',
    cuisine: 'Italian',
    description: 'Creamy arborio rice with mushrooms and parmesan.',
    calories: 480,
    cook_time_minutes: 40,
    ingredients: ['1.5 cups arborio rice', '2 cups mushrooms', '4 cups broth', '1/2 cup white wine', '1/2 cup parmesan', '1 shallot', '3 tbsp butter', 'salt and pepper (optional)'],
    instructions: [
      'Keep broth warm',
      'Sauté mushrooms in butter, set aside',
      'Sauté shallot, add rice, toast 2 minutes',
      'Add wine, stir until absorbed',
      'Add broth one ladle at a time, stirring for 20-25 minutes',
      'Stir in mushrooms and parmesan'
    ],
  },
];

export const getBreakfastMeals = () => MEALS.filter(m => m.meal_type === 'breakfast');
export const getLunchMeals = () => MEALS.filter(m => m.meal_type === 'lunch');
export const getDinnerMeals = () => MEALS.filter(m => m.meal_type === 'dinner');
