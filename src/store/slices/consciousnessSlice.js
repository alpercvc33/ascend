// src/store/slices/consciousnessSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { AIService } from '../../services/AIService';

const initialState = {
  loading: false,
  error: null,
  meditations: {
    daily: [],
    completed: [],
    favorites: [],
    downloads: [],
  },
  currentSession: null,
  stats: {
    totalSessions: 0,
    totalMinutes: 0,
    longestStreak: 0,
    currentStreak: 0,
    averageSessionLength: 0,
    totalMindfulMinutes: 0,
  },
  progress: {
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    skills: {
      focus: 0,
      awareness: 0,
      presence: 0,
      compassion: 0,
    },
  },
  journey: {
    milestones: [],
    achievements: [],
    insights: [],
  },
  goals: {
    dailyMinutes: 20,
    weeklyMinutes: 120,
    focusAreas: [],
  },
  preferences: {
    guidedMeditation: true,
    backgroundSounds: true,
    reminderTimes: [],
    favoriteTeachers: [],
    difficulty: 'beginner',
  },
  insights: {
    daily: [],
    weekly: [],
    monthly: [],
  },
  moodTracking: {
    history: [],
    trends: {},
  },
  lastSession: null,
  lastUpdate: null,
};

export const fetchConsciousnessData = createAsyncThunk(
  'consciousness/fetchData',
  async (userId, { rejectWithValue }) => {
    try {
      const consciousnessDoc = await getDoc(doc(db, 'consciousness', userId));
      if (consciousnessDoc.exists()) {
        return consciousnessDoc.data();
      }
      return rejectWithValue('Bilinç verileri bulunamadı');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateConsciousnessData = createAsyncThunk(
  'consciousness/updateData',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const consciousnessRef = doc(db, 'consciousness', userId);
      await updateDoc(consciousnessRef, {
        ...data,
        lastUpdate: new Date().toISOString()
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateMeditations = createAsyncThunk(
  'consciousness/generateMeditations',
  async ({ userId, preferences }, { rejectWithValue }) => {
    try {
      const meditations = await AIService.generateMeditations(preferences);
      
      const meditationsRef = doc(db, 'consciousness', userId, 'meditations', 'current');
      await updateDoc(meditationsRef, {
        ...meditations,
        generatedAt: new Date().toISOString(),
        status: 'active'
      });

      return meditations;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logMeditationSession = createAsyncThunk(
  'consciousness/logSession',
  async ({ userId, sessionData }, { rejectWithValue }) => {
    try {
      const sessionRef = collection(db, 'consciousness', userId, 'sessions');
      const docRef = await addDoc(sessionRef, {
        ...sessionData,
        completedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...sessionData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMeditationHistory = createAsyncThunk(
  'consciousness/fetchHistory',
  async ({ userId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const sessionsRef = collection(db, 'consciousness', userId, 'sessions');
      const q = query(
        sessionsRef,
        where('completedAt', '>=', startDate),
        where('completedAt', '<=', endDate)
      );
      
      const querySnapshot = await getDocs(q);
      const sessions = [];
      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() });
      });
      
      return sessions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const consciousnessSlice = createSlice({
  name: 'consciousness',
  initialState,
  reducers: {
    startMeditation: (state, action) => {
      state.currentSession = {
        ...action.payload,
        startTime: new Date().toISOString(),
      };
    },
    completeMeditation: (state, action) => {
      const { duration, type, insights } = action.payload;
      
      // Session completed
      state.currentSession = null;
      state.lastSession = {
        ...action.payload,
        completedAt: new Date().toISOString(),
      };

      // Update stats
      state.stats.totalSessions += 1;
      state.stats.totalMinutes += duration;
      state.stats.totalMindfulMinutes += duration;
      state.stats.averageSessionLength = (
        state.stats.totalMinutes / state.stats.totalSessions
      ).toFixed(1);

      // Update streak
      state.stats.currentStreak += 1;
      if (state.stats.currentStreak > state.stats.longestStreak) {
        state.stats.longestStreak = state.stats.currentStreak;
      }

      // Add XP and check level up
      state.progress.xp += Math.floor(duration * 1.5);
      if (state.progress.xp >= state.progress.nextLevelXp) {
        state.progress.level += 1;
        state.progress.xp -= state.progress.nextLevelXp;
        state.progress.nextLevelXp = Math.floor(state.progress.nextLevelXp * 1.5);
      }

      // Update skills based on meditation type
      if (type in state.progress.skills) {
        state.progress.skills[type] += duration * 0.1;
      }

      // Add insights
      if (insights?.length > 0) {
        state.insights.daily.push({
          insights,
          timestamp: new Date().toISOString