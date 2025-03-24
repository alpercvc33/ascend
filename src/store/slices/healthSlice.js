// src/store/slices/healthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore';

const initialState = {
  loading: false,
  error: null,
  vitals: {
    heartRate: {
      current: 0,
      average: 0,
      min: 0,
      max: 0,
      history: [],
    },
    bloodPressure: {
      systolic: 0,
      diastolic: 0,
      history: [],
    },
    sleep: {
      duration: 0,
      quality: 0,
      deepSleep: 0,
      remSleep: 0,
      history: [],
    },
    stress: {
      current: 0,
      average: 0,
      history: [],
    },
  },
  measurements: {
    weight: {
      current: 0,
      history: [],
    },
    height: 0,
    bmi: 0,
    bodyFat: 0,
    muscleMass: 0,
  },
  activities: {
    steps: 0,
    distance: 0,
    calories: 0,
    activeMinutes: 0,
    history: [],
  },
  wellness: {
    moodRating: 0,
    energyLevel: 0,
    stressLevel: 0,
    history: [],
  },
  goals: {
    steps: 10000,
    sleep: 8,
    activity: 30,
    weight: null,
  },
  reports: [],
  lastUpdate: null,
};

export const fetchHealthData = createAsyncThunk(
  'health/fetchHealthData',
  async (userId, { rejectWithValue }) => {
    try {
      const healthDoc = await getDoc(doc(db, 'health', userId));
      if (healthDoc.exists()) {
        return healthDoc.data();
      }
      return rejectWithValue('Sağlık verileri bulunamadı');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateHealthData = createAsyncThunk(
  'health/updateHealthData',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const healthRef = doc(db, 'health', userId);
      await updateDoc(healthRef, {
        ...data,
        lastUpdate: new Date().toISOString()
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addHealthReport = createAsyncThunk(
  'health/addHealthReport',
  async ({ userId, report }, { rejectWithValue }) => {
    try {
      const reportsRef = collection(db, 'health', userId, 'reports');
      const docRef = await addDoc(reportsRef, {
        ...report,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...report };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    updateVitals: (state, action) => {
      state.vitals = {
        ...state.vitals,
        ...action.payload,
      };
      state.lastUpdate = new Date().toISOString();
    },
    updateMeasurements: (state, action) => {
      state.measurements = {
        ...state.measurements,
        ...action.payload,
      };
      // BMI hesaplama
      if (state.measurements.weight && state.measurements.height) {
        const heightInMeters = state.measurements.height / 100;
        state.measurements.bmi = (
          state.measurements.weight / (heightInMeters * heightInMeters)
        ).toFixed(1);
      }
      state.lastUpdate = new Date().toISOString();
    },
    updateActivities: (state, action) => {
      state.activities = {
        ...state.activities,
        ...action.payload,
      };
      state.lastUpdate = new Date().toISOString();
    },
    updateWellness: (state, action) => {
      state.wellness = {
        ...state.wellness,
        ...action.payload,
      };
      state.lastUpdate = new Date().toISOString();
    },
    updateGoals: (state, action) => {
      state.goals = {
        ...state.goals,
        ...action.payload,
      };
    },
    addHeartRateRecord: (state, action) => {
      state.vitals.heartRate.history.push({
        value: action.payload,
        timestamp: new Date().toISOString(),
      });
      state.vitals.heartRate.current = action.payload;
      // Son 24 saatlik kayıtların ortalamasını hesapla
      const recent = state.vitals.heartRate.history.slice(-24);
      state.vitals.heartRate.average = (
        recent.reduce((sum, record) => sum + record.value, 0) / recent.length
      ).toFixed(0);
      // Min ve max değerleri güncelle
      state.vitals.heartRate.min = Math.min(
        ...recent.map(record => record.value)
      );
      state.vitals.heartRate.max = Math.max(
        ...recent.map(record => record.value)
      );
    },
    addSleepRecord: (state, action) => {
      state.vitals.sleep.history.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
      state.vitals.sleep.duration = action.payload.duration;
      state.vitals.sleep.quality = action.payload.quality;
      state.vitals.sleep.deepSleep = action.payload.deepSleep;
      state.vitals.sleep.remSleep = action.payload.remSleep;
    },
    addStressRecord: (state, action) => {
      state.vitals.stress.history.push({
        value: action.payload,
        timestamp: new Date().toISOString(),
      });
      state.vitals.stress.current = action.payload;
      // Son 24 saatlik kayıtların ortalamasını hesapla
      const recent = state.vitals.stress.history.slice(-24);
      state.vitals.stress.average = (
        recent.reduce((sum, record) => sum + record.value, 0) / recent.length
      ).toFixed(0);
    },
    resetHealthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Health Data
      .addCase(fetchHealthData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHealthData.fulfilled, (state, action) => {
        state.loading = false;
        return { ...state, ...action.payload };
      })
      .addCase(fetchHealthData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Health Data
      .addCase(updateHealthData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHealthData.fulfilled, (state, action) => {
        state.loading = false;
        return { ...state, ...action.payload };
      })
      .addCase(updateHealthData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Health Report
      .addCase(addHealthReport.fulfilled, (state, action) => {
        state.reports.push(action.payload);
      });
  },
});

export const {
  updateVitals,
  updateMeasurements,
  updateActivities,
  updateWellness,
  updateGoals,
  addHeartRateRecord,
  addSleepRecord,
  addStressRecord,
  resetHealthState,
} = healthSlice.actions;

export default healthSlice.reducer;