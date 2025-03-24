// src/store/slices/nutritionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { AIService } from '../../services/AIService';

const initialState = {
  loading: false,
  error: null,
  mealPlan: {
    current: null,
    history: [],
  },
  dailyLog: {
    meals: [],
    water: 0,
    supplements: [],
  },
  nutrition: {
    calories: {
      goal: 2000,
      consumed: 0,
    },
    macros: {
      protein: { goal: 150, consumed: 0 },
      carbs: { goal: 250, consumed: 0 },
      fat: { goal: 65, consumed: 0 },
    },
    micros: {
      vitamins: {},
      minerals: {},
    },
  },
  preferences: {
    dietType: 'balanced', // 'balanced', 'keto', 'vegetarian', etc.
    allergies: [],
    restrictions: [],
    preferredFoods: [],
    excludedFoods: [],
    mealCount: 3,
    snacks: true,
  },
  goals: {
    targetWeight: null,
    weeklyGoal: 0, // in calories
    mealPreferences: {
      breakfast: true,
      lunch: true,
      dinner: true,
      snacks: true,
    },
  },
  stats: {
    averageCalories: 0,
    streakDays: 0,
    completedMeals: 0,
    waterStreak: 0,
  },
  recipes: {
    favorites: [],
    recent: [],
    custom: [],
  },
  groceryList: [],
  lastUpdate: null,
};

export const fetchNutritionData = createAsyncThunk(
  'nutrition/fetchNutritionData',
  async (userId, { rejectWithValue }) => {
    try {
      const nutritionDoc = await getDoc(doc(db, 'nutrition', userId));
      if (nutritionDoc.exists()) {
        return nutritionDoc.data();
      }
      return rejectWithValue('Beslenme verileri bulunamadı');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateNutritionData = createAsyncThunk(
  'nutrition/updateNutritionData',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const nutritionRef = doc(db, 'nutrition', userId);
      await updateDoc(nutritionRef, {
        ...data,
        lastUpdate: new Date().toISOString()
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateMealPlan = createAsyncThunk(
  'nutrition/generateMealPlan',
  async ({ userId, preferences }, { rejectWithValue }) => {
    try {
      const mealPlan = await AIService.generateNutritionPlan(preferences);
      
      const planRef = doc(db, 'nutrition', userId, 'mealPlans', 'current');
      await updateDoc(planRef, {
        ...mealPlan,
        createdAt: new Date().toISOString(),
        status: 'active'
      });

      return mealPlan;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logMeal = createAsyncThunk(
  'nutrition/logMeal',
  async ({ userId, mealData }, { rejectWithValue }) => {
    try {
      const mealRef = collection(db, 'nutrition', userId, 'meals');
      const docRef = await addDoc(mealRef, {
        ...mealData,
        loggedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...mealData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMealHistory = createAsyncThunk(
  'nutrition/fetchMealHistory',
  async ({ userId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const mealsRef = collection(db, 'nutrition', userId, 'meals');
      const q = query(
        mealsRef,
        where('loggedAt', '>=', startDate),
        where('loggedAt', '<=', endDate)
      );
      
      const querySnapshot = await getDocs(q);
      const meals = [];
      querySnapshot.forEach((doc) => {
        meals.push({ id: doc.id, ...doc.data() });
      });
      
      return meals;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    setMealPlan: (state, action) => {
      state.mealPlan.current = action.payload;
      state.mealPlan.history.push({
        plan: action.payload,
        date: new Date().toISOString(),
      });
    },
    updateDailyLog: (state, action) => {
      state.dailyLog = {
        ...state.dailyLog,
        ...action.payload,
      };
    },
    addWater: (state, action) => {
      state.dailyLog.water += action.payload;
    },
    addSupplement: (state, action) => {
      state.dailyLog.supplements.push({
        ...action.payload,
        time: new Date().toISOString(),
      });
    },
    updateNutritionGoals: (state, action) => {
      state.nutrition = {
        ...state.nutrition,
        ...action.payload,
      };
    },
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
    },
    updateGoals: (state, action) => {
      state.goals = {
        ...state.goals,
        ...action.payload,
      };
    },
    addToFavorites: (state, action) => {
      state.recipes.favorites.push(action.payload);
    },
    removeFromFavorites: (state, action) => {
      state.recipes.favorites = state.recipes.favorites.filter(
        recipe => recipe.id !== action.payload
      );
    },
    addToGroceryList: (state, action) => {
      state.groceryList.push({
        ...action.payload,
        added: new Date().toISOString(),
        checked: false,
      });
    },
    removeFromGroceryList: (state, action) => {
      state.groceryList = state.groceryList.filter(
        item => item.id !== action.payload
      );
    },
    toggleGroceryItem: (state, action) => {
      const item = state.groceryList.find(item => item.id === action.payload);
      if (item) {
        item.checked = !item.checked;
      }
    },
    clearGroceryList: (state) => {
      state.groceryList = [];
    },
    updateStats: (state, action) => {
      state.stats = {
        ...state.stats,
        ...action.payload,
      };
    },
    incrementStreak: (state) => {
      state.stats.streakDays += 1;
    },
    resetStreak: (state) => {
      state.stats.streakDays = 0;
    },
    resetNutritionState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Nutrition Data
      .addCase(fetchNutritionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNutritionData.fulfilled, (state, action) => {
        state.loading = false;
        return { ...state, ...action.payload };
      })
      .addCase(fetchNutritionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Nutrition Data
      .addCase(updateNutritionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNutritionData.fulfilled, (state, action) => {
        state.loading = false;
        return { ...state, ...action.payload };
      })
      .addCase(updateNutritionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Generate Meal Plan
      .addCase(generateMealPlan.fulfilled, (state, action) => {
        state.mealPlan.current = action.payload;
        state.lastUpdate = new Date().toISOString();
      })
      
      // Log Meal
      .addCase(logMeal.fulfilled, (state, action) => {
        state.dailyLog.meals.push(action.payload);
        state.stats.completedMeals += 1;
        
        // Update macro tracking
        state.nutrition.calories.consumed += action.payload.calories;
        state.nutrition.macros.protein.consumed += action.payload.protein;
        state.nutrition.macros.carbs.consumed += action.payload.carbs;
        state.nutrition.macros.fat.consumed += action.payload.fat;
        
        state.lastUpdate = new Date().toISOString();
      })
      
      // Fetch Meal History
      .addCase(fetchMealHistory.fulfilled, (state, action) => {
        state.mealPlan.history = action.payload;
        state.lastUpdate = new Date().toISOString();
      });
  },
});

export const {
  setMealPlan,
  updateDailyLog,
  addWater,
  addSupplement,
  updateNutritionGoals,
  updatePreferences,
  updateGoals,
  addToFavorites,
  removeFromFavorites,
  addToGroceryList,
  removeFromGroceryList,
  toggleGroceryItem,
  clearGroceryList,
  updateStats,
  incrementStreak,
  resetStreak,
  resetNutritionState,
} = nutritionSlice.actions;

export default nutritionSlice.reducer;