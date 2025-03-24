// src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const initialState = {
  isAuthenticated: false,
  userData: null,
  loading: false,
  error: null,
  subscription: 'basic', // 'basic' | 'premium'
  preferences: {
    notifications: true,
    darkMode: false,
    language: 'tr',
  },
  goals: {
    fitness: [],
    nutrition: [],
    mental: [],
    consciousness: [],
  },
  stats: {
    streakCount: 0,
    totalWorkouts: 0,
    totalMeditations: 0,
    totalPoints: 0,
  },
};

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (userId, { rejectWithValue }) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return rejectWithValue('Kullanıcı bulunamadı');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserData = createAsyncThunk(
  'user/updateUserData',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserGoals = createAsyncThunk(
  'user/updateUserGoals',
  async ({ userId, goals }, { rejectWithValue }) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { goals });
      return goals;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async ({ userId, preferences }, { rejectWithValue }) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { preferences });
      return preferences;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.userData = action.payload;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.subscription = 'basic';
      state.preferences = initialState.preferences;
      state.goals = initialState.goals;
      state.stats = initialState.stats;
    },
    updateSubscription: (state, action) => {
      state.subscription = action.payload;
    },
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    increaseStreak: (state) => {
      state.stats.streakCount += 1;
    },
    resetStreak: (state) => {
      state.stats.streakCount = 0;
    },
    addPoints: (state, action) => {
      state.stats.totalPoints += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Data
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.subscription = action.payload.subscription || 'basic';
        state.preferences = action.payload.preferences || initialState.preferences;
        state.goals = action.payload.goals || initialState.goals;
        state.stats = action.payload.stats || initialState.stats;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update User Data
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = { ...state.userData, ...action.payload };
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update User Goals
      .addCase(updateUserGoals.fulfilled, (state, action) => {
        state.goals = action.payload;
      })
      
      // Update User Preferences
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.preferences = action.payload;
      });
  },
});

export const {
  setUser,
  clearUser,
  updateSubscription,
  updateStats,
  increaseStreak,
  resetStreak,
  addPoints,
} = userSlice.actions;

export default userSlice.reducer;