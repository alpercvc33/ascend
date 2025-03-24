// src/store/slices/mentalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { AIService } from '../../services/AIService';

const initialState = {
  loading: false,
  error: null,
  currentFocus: {
    area: null, // 'concentration', 'memory', 'creativity', etc.
    level: 'beginner',
    progress: 0,
  },
  exercises: {
    daily: [],
    completed: [],
    favorites: [],
  },
  stats: {
    totalExercises: 0,
    totalMinutes: 0,
    averageScore: 0,
    streakDays: 0,
    improvements: {
      concentration: 0,
      memory: 0,
      problemSolving: 0,
      creativity: 0,
    },
  },
  progress: {
    levels: {
      concentration: 1,
      memory: 1,
      problemSolving: 1,
      creativity: 1,
    },
    xp: 0,
    nextLevelXp: 100,
  },
  assessments: {
    last: null,
    history: [],
    scores: {},
  },
  goals: {
    daily: {
      exercises: 3,
      minutes: 20,
    },
    focus: [], // Priority areas to improve
    targetScores: {},
  },
  preferences: {
    exerciseTypes: [],
    difficulty: 'adaptive',
    reminders: true,
    reminderTimes: [],
  },
  achievements: [],
  lastSession: null,
  lastUpdate: null,
};

export const fetchMentalData = createAsyncThunk(
  'mental/fetchMentalData',
  async (userId, { rejectWithValue }) => {
    try {
      const mentalDoc = await getDoc(doc(db, 'mental', userId));
      if (mentalDoc.exists()) {
        return mentalDoc.data();
      }
      return rejectWithValue('Zihinsel gelişim verileri bulunamadı');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMentalData = createAsyncThunk(
  'mental/updateMentalData',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const mentalRef = doc(db, 'mental', userId);
      await updateDoc(mentalRef, {
        ...data,
        lastUpdate: new Date().toISOString()
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateMentalExercises = createAsyncThunk(
  'mental/generateExercises',
  async ({ userId, preferences }, { rejectWithValue }) => {
    try {
      const exercises = await AIService.generateMentalExercises(preferences);
      
      const exercisesRef = doc(db, 'mental', userId, 'exercises', 'current');
      await updateDoc(exercisesRef, {
        ...exercises,
        generatedAt: new Date().toISOString(),
        status: 'active'
      });

      return exercises;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logExerciseCompletion = createAsyncThunk(
  'mental/logExercise',
  async ({ userId, exerciseData }, { rejectWithValue }) => {
    try {
      const exerciseRef = collection(db, 'mental', userId, 'completedExercises');
      const docRef = await addDoc(exerciseRef, {
        ...exerciseData,
        completedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...exerciseData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchExerciseHistory = createAsyncThunk(
  'mental/fetchExerciseHistory',
  async ({ userId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const exercisesRef = collection(db, 'mental', userId, 'completedExercises');
      const q = query(
        exercisesRef,
        where('completedAt', '>=', startDate),
        where('completedAt', '<=', endDate)
      );
      
      const querySnapshot = await getDocs(q);
      const exercises = [];
      querySnapshot.forEach((doc) => {
        exercises.push({ id: doc.id, ...doc.data() });
      });
      
      return exercises;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const mentalSlice = createSlice({
  name: 'mental',
  initialState,
  reducers: {
    setCurrentFocus: (state, action) => {
      state.currentFocus = {
        ...state.currentFocus,
        ...action.payload,
      };
    },
    addExercise: (state, action) => {
      state.exercises.daily.push(action.payload);
    },
    completeExercise: (state, action) => {
      const { exerciseId, score, duration, improvements } = action.payload;
      
      // Egzersizi tamamlananlar listesine ekle
      state.exercises.completed.push({
        id: exerciseId,
        score,
        duration,
        completedAt: new Date().toISOString(),
      });

      // İstatistikleri güncelle
      state.stats.totalExercises += 1;
      state.stats.totalMinutes += duration;
      state.stats.averageScore = (
        (state.stats.averageScore * (state.stats.totalExercises - 1) + score) /
        state.stats.totalExercises
      ).toFixed(1);

      // İyileştirmeleri güncelle
      Object.keys(improvements).forEach(area => {
        state.stats.improvements[area] += improvements[area];
      });

      // XP ve seviye kontrolü
      state.progress.xp += score;
      if (state.progress.xp >= state.progress.nextLevelXp) {
        const areaToLevel = state.currentFocus.area;
        state.progress.levels[areaToLevel] += 1;
        state.progress.xp -= state.progress.nextLevelXp;
        state.progress.nextLevelXp = Math.floor(state.progress.nextLevelXp * 1.5);
      }

      state.lastSession = {
        exerciseId,
        score,
        duration,
        completedAt: new Date().toISOString(),
      };
    },
    addToFavorites: (state, action) => {
      state.exercises.favorites.push(action.payload);
    },
    removeFromFavorites: (state, action) => {
      state.exercises.favorites = state.exercises.favorites.filter(
        exercise => exercise.id !== action.payload
      );
    },
    updateAssessment: (state, action) => {
      const { type, score, details } = action.payload;
      state.assessments.last = {
        type,
        score,
        details,
        date: new Date().toISOString(),
      };
      state.assessments.history.push(state.assessments.last);
      state.assessments.scores[type] = score;
    },
    updateGoals: (state, action) => {
      state.goals = {
        ...state.goals,
        ...action.payload,
      };
    },
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
    },
    addAchievement: (state, action) => {
      state.achievements.push({
        ...action.payload,
        unlockedAt: new Date().toISOString(),
      });
    },
    incrementStreak: (state) => {
      state.stats.streakDays += 1;
    },
    resetStreak: (state) => {
      state.stats.streakDays = 0;
    },
    resetMentalState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Mental Data
      .addCase(fetchMentalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMentalData.fulfilled, (state, action) => {
        state.loading = false;
        return { ...state, ...action.payload };
      })
      .addCase(fetchMentalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Mental Data
      .addCase(updateMentalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMentalData.fulfilled, (state, action) => {
        state.loading = false;
        return { ...state, ...action.payload };
      })
      .addCase(updateMentalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Generate Exercises
      .addCase(generateMentalExercises.fulfilled, (state, action) => {
        state.exercises.daily = action.payload;
        state.lastUpdate = new Date().toISOString();
      })
      
      // Log Exercise
      .addCase(logExerciseCompletion.fulfilled, (state, action) => {
        state.exercises.completed.push(action.payload);
        state.lastUpdate = new Date().toISOString();
      })
      
      // Fetch Exercise History
      .addCase(fetchExerciseHistory.fulfilled, (state, action) => {
        state.exercises.completed = action.payload;
        state.lastUpdate = new Date().toISOString();
      });
  },
});

export const {
  setCurrentFocus,
  addExercise,
  completeExercise,
  addToFavorites,
  removeFromFavorites,
  updateAssessment,
  updateGoals,
  updatePreferences,
  addAchievement,
  incrementStreak,
  resetStreak,
  resetMentalState,
} = mentalSlice.actions;

export default mentalSlice.reducer;