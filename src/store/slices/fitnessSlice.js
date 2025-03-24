// src/store/slices/fitnessSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { AIService } from '../../services/AIService';

const initialState = {
  loading: false,
  error: null,
  currentProgram: null,
  workoutHistory: [],
  todaysWorkout: null,
  exercises: [],
  stats: {
    totalWorkouts: 0,
    totalDuration: 0,
    totalCaloriesBurned: 0,
    weeklyProgress: 0,
    monthlyProgress: 0,
    personalBests: {},
  },
  goals: {
    workoutsPerWeek: 4,
    minutesPerWorkout: 45,
    targetMuscleGroups: [],
    focusAreas: [],
  },
  measurements: {
    weight: [],
    bodyFat: [],
    circumferences: {
      chest: [],
      waist: [],
      hips: [],
      biceps: [],
      thighs: [],
    },
  },
  equipment: [],
  preferences: {
    difficulty: 'intermediate',
    workoutDuration: 45,
    restBetweenSets: 60,
    exercisePreferences: {
      excluded: [],
      preferred: [],
    },
  },
  lastUpdate: null,
};

export const fetchFitnessData = createAsyncThunk(
  'fitness/fetchFitnessData',
  async (userId, { rejectWithValue }) => {
    try {
      const fitnessDoc = await getDoc(doc(db, 'fitness', userId));
      if (fitnessDoc.exists()) {
        return fitnessDoc.data();
      }
      return rejectWithValue('Fitness verileri bulunamadı');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFitnessData = createAsyncThunk(
  'fitness/updateFitnessData',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const fitnessRef = doc(db, 'fitness', userId);
      await updateDoc(fitnessRef, {
        ...data,
        lastUpdate: new Date().toISOString()
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateWorkoutPlan = createAsyncThunk(
  'fitness/generateWorkoutPlan',
  async ({ userId, preferences }, { rejectWithValue }) => {
    try {
      // AI servisi ile workout planı oluştur
      const workoutPlan = await AIService.generateWorkoutPlan(preferences);
      
      // Oluşturulan planı Firestore'a kaydet
      const planRef = doc(db, 'fitness', userId, 'workoutPlans', 'current');
      await updateDoc(planRef, {
        ...workoutPlan,
        createdAt: new Date().toISOString(),
        status: 'active'
      });

      return workoutPlan;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logWorkout = createAsyncThunk(
  'fitness/logWorkout',
  async ({ userId, workoutData }, { rejectWithValue }) => {
    try {
      const workoutRef = collection(db, 'fitness', userId, 'workouts');
      const docRef = await addDoc(workoutRef, {
        ...workoutData,
        completedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...workoutData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWorkoutHistory = createAsyncThunk(
  'fitness/fetchWorkoutHistory',
  async ({ userId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const workoutsRef = collection(db, 'fitness', userId, 'workouts');
      const q = query(
        workoutsRef,
        where('completedAt', '>=', startDate),
        where('completedAt', '<=', endDate)
      );
      
      const querySnapshot = await getDocs(q);
      const workouts = [];
      querySnapshot.forEach((doc) => {
        workouts.push({ id: doc.id, ...doc.data() });
      });
      
      return workouts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fitnessSlice = createSlice({
  name: 'fitness',
  initialState,
  reducers: {
    setCurrentProgram: (state, action) => {
      state.currentProgram = action.payload;
    },
    updateTodaysWorkout: (state, action) => {
      state.todaysWorkout = action.payload;
    },
    addExercise: (state, action) => {
      state.exercises.push(action.payload);
    },
    removeExercise: (state, action) => {
      state.exercises = state.exercises.filter(
        exercise => exercise.id !== action.payload
      );
    },
    updateStats: (state, action) => {
      state.stats = {
        ...state.stats,
        ...action.payload,
      };
    },
    updateGoals: (state, action) => {
      state.goals = {
        ...state.goals,
        ...action.payload,
      };
    },
    addMeasurement: (state, action) => {
      const { type, value, date = new Date().toISOString() } = action.payload;
      if (type === 'weight' || type === 'bodyFat') {
        state.measurements[type].push({ value, date });
      } else if (type in state.measurements.circumferences) {
        state.measurements.circumferences[type].push({ value, date });
      }
    },
    updateEquipment: (state, action) => {
      state.equipment = action.payload;
    },
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
    },
    addPersonalBest: (state, action) => {
      const { exercise, value, date = new Date().toISOString() } = action.payload;
      state.stats.personalBests[exercise] = { value, date };
    },
    resetFitnessState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Fitness Data
      .addCase(fetchFitnessData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFitnessData.fulfilled, (state, action) => {
        state.loading = false;
        return { ...state, ...action.payload };
      })
      .addCase(fetchFitnessData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Fitness Data
      .addCase(updateFitnessData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFitnessData.fulfilled, (state, action) => {
        state.loading = false;
        return { ...state, ...action.payload };
      })
      .addCase(updateFitnessData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Generate Workout Plan
      .addCase(generateWorkoutPlan.fulfilled, (state, action) => {
        state.currentProgram = action.payload;
        state.lastUpdate = new Date().toISOString();
      })
      
      // Log Workout
      .addCase(logWorkout.fulfilled, (state, action) => {
        state.workoutHistory.push(action.payload);
        state.stats.totalWorkouts += 1;
        state.stats.totalDuration += action.payload.duration;
        state.stats.totalCaloriesBurned += action.payload.caloriesBurned;
        state.lastUpdate = new Date().toISOString();
      })
      
      // Fetch Workout History
      .addCase(fetchWorkoutHistory.fulfilled, (state, action) => {
        state.workoutHistory = action.payload;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchWorkoutHistory.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentProgram,
  updateTodaysWorkout,
  addExercise,
  removeExercise,
  updateStats,
  updateGoals,
  addMeasurement,
  updateEquipment,
  updatePreferences,
  addPersonalBest,
  resetFitnessState,
} = fitnessSlice.actions;

export default fitnessSlice.reducer;