// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import appReducer from './slices/appSlice';
import healthReducer from './slices/healthSlice';
import fitnessReducer from './slices/fitnessSlice';
import nutritionReducer from './slices/nutritionSlice';
import mentalReducer from './slices/mentalSlice';
import consciousnessReducer from './slices/consciousnessSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    health: healthReducer,
    fitness: fitnessReducer,
    nutrition: nutritionReducer,
    mental: mentalReducer,
    consciousness: consciousnessReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;